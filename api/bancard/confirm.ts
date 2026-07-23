/**
 * POST /api/bancard/confirm — webhook de confirmación de vPOS.
 *
 * Esta URL se configura en el Portal de Comercios de Bancard
 * (comercios.bancard.com.py → perfil → URL de confirmación, por ambiente).
 *
 * Contrato exigido por Bancard:
 *  - Validar el token: md5(priv + shop_process_id + "confirm" + amount + currency)
 *  - Responder HTTP 200 {"status":"success"} en menos de 60 segundos.
 *  - Tolerar el ping de monitoreo: un JSON vacío cada ~5 minutos → 200 igual.
 *
 * Pago aprobado ⇔ response === "S" && response_code === "00".
 * Sin base de datos aún, el estado no se persiste acá; la página de retorno
 * verifica el estado real vía get_confirmation (/api/bancard/status).
 */

import { bancardEnv, md5, tokensEqual } from '../_lib/bancard';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const env = bancardEnv();
  if (!env) return res.status(503).json({ error: 'Bancard no configurado' });

  const body = typeof req.body === 'string' ? safeParse(req.body) : req.body;

  // Ping de monitoreo de Bancard (JSON vacío) → 200.
  if (!body || !body.operation) {
    return res.status(200).json({ status: 'success' });
  }

  const op = body.operation;
  const spid = String(op.shop_process_id ?? '');
  const amount = String(op.amount ?? '');
  const currency = String(op.currency ?? 'PYG');

  const expected = md5(env.privateKey + spid + 'confirm' + amount + currency);
  if (!tokensEqual(String(op.token ?? ''), expected)) {
    // Token inválido: NO viene de Bancard. No confirmar.
    return res.status(401).json({ error: 'token inválido' });
  }

  const approved = op.response === 'S' && op.response_code === '00';
  // Log estructurado (visible en Vercel → Logs). Persistencia real: fase Supabase.
  console.log(JSON.stringify({
    evt: 'bancard_confirm',
    shop_process_id: spid,
    approved,
    response_code: op.response_code,
    ticket: op.ticket_number ?? null,
    auth: op.authorization_number ?? null,
    amount,
  }));

  return res.status(200).json({ status: 'success' });
}

function safeParse(s: string) {
  try { return JSON.parse(s); } catch { return null; }
}
