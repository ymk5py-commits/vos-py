/**
 * POST /api/bancard/create-payment — inicia un single_buy en vPOS.
 *
 * Body: { items: [{id, qty}], orderId?: string, zimplePhone?: string }
 * El monto se recalcula SIEMPRE server-side desde el catálogo canónico.
 * Devuelve { processId, shopProcessId, amount, environment } para montar el
 * iframe de checkout con bancard-checkout JS.
 *
 * Responde 503 si Bancard no está configurado (BANCARD_PUBLIC_KEY/PRIVATE_KEY).
 */

import crypto from 'node:crypto';
import { bancardEnv, md5, amountString, statusToken } from '../_lib/bancard.js';
import { clean, loadCatalog, requestOrigin, totalOf, validateItems } from '../_lib/catalog.js';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const env = bancardEnv();
  if (!env) return res.status(503).json({ error: 'Bancard no configurado' });

  const body = typeof req.body === 'string' ? safeParse(req.body) : req.body;
  if (!body) return res.status(400).json({ error: 'body inválido' });

  const origin = requestOrigin(req);
  if (!origin) return res.status(500).json({ error: 'host indeterminado' });

  const catalog = await loadCatalog(origin);
  if (catalog.size === 0) return res.status(503).json({ error: 'catálogo no disponible' });

  const v = validateItems(catalog, body.items);
  if ('error' in v) return res.status(400).json({ error: v.error });

  const totalGs = totalOf(v.items);
  if (totalGs <= 0) return res.status(400).json({ error: 'total inválido' });

  const amount = amountString(totalGs);            // "193000.00"
  const currency = 'PYG';
  // Date.now() solo (ms) puede colisionar entre invocaciones concurrentes;
  // se le agregan 3 dígitos random para bajar la chance de colisión y sigue
  // siendo un entero JS seguro (16 dígitos, < Number.MAX_SAFE_INTEGER).
  const shopProcessId = Date.now() * 1000 + crypto.randomInt(0, 1000);
  const orderId = clean(body.orderId, 40) || `VOS-${shopProcessId}`;
  const zimplePhone = clean(body.zimplePhone, 15); // solo para pagos Zimple

  // Token propio (no el de Bancard) que ata /api/bancard/status a quien
  // creó esta sesión — shop_process_id por sí solo es adivinable/enumerable.
  const stoken = statusToken(shopProcessId, env.privateKey);
  const returnParams = `spid=${shopProcessId}&order=${encodeURIComponent(orderId)}&token=${stoken}`;

  const operation: Record<string, unknown> = {
    token: md5(env.privateKey + String(shopProcessId) + amount + currency),
    shop_process_id: shopProcessId,
    currency,
    amount,
    additional_data: zimplePhone || '',
    description: clean(`Pedido ${orderId} - Vos PY`, 100),
    return_url: `${origin}/pago/retorno?${returnParams}`,
    cancel_url: `${origin}/pago/retorno?${returnParams}&cancel=1`,
  };
  // El SDK de referencia (hds-solutions/bancard-sdk) manda `zimple` como
  // booleano JSON, no string — coincide con el mismo endpoint single_buy.
  if (zimplePhone) (operation as any).zimple = true;

  const r = await fetch(`${env.base}/vpos/api/0.3/single_buy`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ public_key: env.publicKey, operation }),
  });

  const data = await r.json().catch(() => null);
  if (!r.ok || !data || data.status !== 'success' || !data.process_id) {
    return res.status(502).json({
      error: 'Bancard rechazó la creación del pago',
      details: data?.messages ?? data ?? null,
    });
  }

  return res.status(201).json({
    processId: data.process_id,
    shopProcessId,
    statusToken: stoken,
    amount,
    totalGs,
    environment: env.environment,
    orderId,
  });
}

function safeParse(s: string) {
  try { return JSON.parse(s); } catch { return null; }
}
