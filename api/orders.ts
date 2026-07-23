/**
 * POST /api/orders — creación de orden VALIDADA EN SERVIDOR.
 *
 * El cliente envía SOLO ids y cantidades; el servidor busca los precios en el
 * catálogo canónico del deployment, recalcula el total, capea cantidades al
 * stock y devuelve la orden con una firma HMAC opcional (ORDER_SIGNING_SECRET)
 * para que el comercio pueda verificar el resumen de WhatsApp.
 *
 * Sin base de datos todavía: la orden no se persiste server-side (llega con
 * la fase Supabase). Pero los PRECIOS ya no son confiados al cliente.
 */

import crypto from 'node:crypto';
import { clean, loadCatalog, requestOrigin, totalOf, validateItems } from './_lib/catalog';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = typeof req.body === 'string' ? safeParse(req.body) : req.body;
  if (!body) return res.status(400).json({ error: 'body inválido' });

  const origin = requestOrigin(req);
  if (!origin) return res.status(500).json({ error: 'host indeterminado' });

  const catalog = await loadCatalog(origin);
  if (catalog.size === 0) return res.status(503).json({ error: 'catálogo no disponible' });

  const v = validateItems(catalog, body.items);
  if ('error' in v) return res.status(400).json({ error: v.error });
  const items = v.items;

  // Total calculado EXCLUSIVAMENTE con precios del catálogo del servidor.
  const totalGs = totalOf(items);

  const customer = {
    name: clean(body.customer?.name, 80),
    email: clean(body.customer?.email, 254),
    phone: clean(body.customer?.phone, 30),
    document: clean(body.customer?.document, 30),
  };
  const shipping = {
    type: body.shipping?.type === 'pickup' ? 'pickup' : 'delivery',
    address: clean(body.shipping?.address, 160),
    city: clean(body.shipping?.city, 60),
    department: clean(body.shipping?.department, 40),
    notes: clean(body.shipping?.notes, 280),
  };
  const payment = ['transferencia', 'billetera', 'efectivo', 'bancard'].includes(body.payment)
    ? body.payment : 'transferencia';

  const now = new Date();
  const ts = now.toISOString().replace(/[-:TZ.]/g, '').slice(2, 12); // YYMMDDHHmm
  const rand = crypto.randomBytes(3).toString('hex').toUpperCase().slice(0, 4);
  const id = `VOS-${ts}-${rand}`;

  const order = { id, createdAt: now.getTime(), items, totalGs, customer, shipping, payment, validated: true as const };

  let signature: string | null = null;
  const secret = process.env.ORDER_SIGNING_SECRET;
  if (secret) {
    const payload = JSON.stringify({ id, items: items.map((i) => [i.id, i.qty, i.priceGs]), totalGs });
    signature = crypto.createHmac('sha256', secret).update(payload).digest('hex').slice(0, 16);
  }

  return res.status(201).json({ order, signature });
}

function safeParse(s: string) {
  try { return JSON.parse(s); } catch { return null; }
}
