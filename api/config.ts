/**
 * GET /api/config — feature flags públicos derivados de env vars.
 * Nunca expone secretos; sólo indica qué capacidades están activas.
 *
 * Env vars (configurar en Vercel → Settings → Environment Variables):
 *  - BANCARD_PUBLIC_KEY / BANCARD_PRIVATE_KEY  → habilita pago con tarjeta
 *  - BANCARD_ENVIRONMENT = staging | production (default: staging)
 *  - SIFEN_API_KEY                              → habilita facturación electrónica (Sifende)
 *  - SIFEN_ESTABLECIMIENTO / SIFEN_PUNTO_EXPEDICION → default 1 / 1
 *  - ORDER_SIGNING_SECRET                       → firma HMAC de órdenes
 */

export default function handler(_req: any, res: any) {
  const bancard = Boolean(process.env.BANCARD_PUBLIC_KEY && process.env.BANCARD_PRIVATE_KEY);
  const sifen = Boolean(process.env.SIFEN_API_KEY);

  res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=300');
  res.status(200).json({
    payments: {
      bancard,
      bancardEnvironment: bancard ? (process.env.BANCARD_ENVIRONMENT || 'staging') : null,
      whatsapp: true,
    },
    invoicing: { sifen },
    orderSigning: Boolean(process.env.ORDER_SIGNING_SECRET),
  });
}
