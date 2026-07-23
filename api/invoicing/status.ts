/**
 * POST /api/invoicing/status — consulta el estado real de una factura
 * emitida (Sifende no tiene webhooks: el frontend debe hacer polling acá
 * con backoff, ver /docs/guias/polling-resultados de Sifende: 2s→3s→5s→8s→
 * 13s→30s, timeout total recomendado 10 min).
 *
 * Body: { cdc: string }
 */

import { invoicingEnv, getInvoiceStatus, SifendeError } from '../_lib/invoicing';

export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const env = invoicingEnv();
    if (!env) return res.status(503).json({ error: 'Facturación electrónica no configurada' });

    const body = typeof req.body === 'string' ? safeParse(req.body) : req.body;
    const cdc = String(body?.cdc ?? '').trim();
    if (!cdc || cdc.length !== 44) return res.status(400).json({ error: 'cdc inválido' });

    try {
        const status = await getInvoiceStatus(cdc, env);
        return res.status(200).json(status);
    } catch (e) {
        if (e instanceof SifendeError) return res.status(502).json({ error: e.message });
        return res.status(502).json({ error: e instanceof Error ? e.message : 'Error consultando estado' });
    }
}

function safeParse(s: string) {
    try { return JSON.parse(s); } catch { return null; }
}
