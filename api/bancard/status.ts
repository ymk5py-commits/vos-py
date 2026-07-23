/**
 * POST /api/bancard/status — consulta el estado real de un pago (get_confirmation).
 *
 * Body: { shopProcessId: number, token: string }
 * `token` es el statusToken devuelto por /api/bancard/create-payment (HMAC
 * con la private key) — sin él, shop_process_id por sí solo es un entero
 * adivinable/enumerable y cualquiera podría consultar el monto/ticket/
 * autorización de un pago ajeno (IDOR). Se exige acá antes de llamar a
 * Bancard.
 *
 * Llama a {base}/vpos/api/0.3/single_buy/confirmations con
 * token = md5(priv + shop_process_id + "get_confirmation") y devuelve un
 * resumen SIN datos sensibles (el manual de vPOS prohíbe mostrar
 * response_code/security_information al usuario final; acá se filtra).
 *
 * Lo usa la página /pago/retorno para confirmar server-side que el pago
 * fue aprobado antes de mostrar el éxito.
 */

import { bancardEnv, md5, statusToken, tokensEqual } from '../_lib/bancard';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const env = bancardEnv();
  if (!env) return res.status(503).json({ error: 'Bancard no configurado' });

  const body = typeof req.body === 'string' ? safeParse(req.body) : req.body;
  const spid = Math.floor(Number(body?.shopProcessId));
  if (!spid || spid <= 0) return res.status(400).json({ error: 'shopProcessId inválido' });

  const expectedToken = statusToken(spid, env.privateKey);
  if (!tokensEqual(String(body?.token ?? ''), expectedToken)) {
    return res.status(403).json({ error: 'token inválido' });
  }

  const r = await fetch(`${env.base}/vpos/api/0.3/single_buy/confirmations`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      public_key: env.publicKey,
      operation: {
        token: md5(env.privateKey + String(spid) + 'get_confirmation'),
        shop_process_id: spid,
      },
    }),
  });

  const data = await r.json().catch(() => null);
  const conf = data?.confirmation;
  if (!r.ok || !data || data.status !== 'success' || !conf) {
    return res.status(200).json({ paid: false, pending: true, details: null });
  }

  const paid = conf.response === 'S' && conf.response_code === '00';
  return res.status(200).json({
    paid,
    pending: false,
    details: {
      amount: conf.amount ?? null,
      currency: conf.currency ?? 'PYG',
      ticket: conf.ticket_number ?? null,
      authorization: conf.authorization_number ?? null,
      description: paid ? 'Transacción aprobada' : 'Pago no aprobado',
    },
  });
}

function safeParse(s: string) {
  try { return JSON.parse(s); } catch { return null; }
}
