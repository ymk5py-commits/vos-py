/**
 * GET /api/invoicing/kude?cdc=... — proxea el PDF del KuDE (representación
 * gráfica de la factura) desde Sifende. Necesario porque el endpoint real
 * exige el mismo Bearer API key que el resto (no se puede linkear directo
 * desde el navegador del cliente sin exponer la key).
 */

import { invoicingEnv, fetchKude, SifendeError } from '../_lib/invoicing.js';

export default async function handler(req: any, res: any) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', 'GET');
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const env = invoicingEnv();
    if (!env) return res.status(503).json({ error: 'Facturación electrónica no configurada' });

    const cdc = String(req.query?.cdc ?? '').trim();
    if (!cdc || cdc.length !== 44) return res.status(400).json({ error: 'cdc inválido' });

    try {
        const pdf = await fetchKude(cdc, env);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Cache-Control', 'private, max-age=3600');
        return res.status(200).send(pdf);
    } catch (e) {
        if (e instanceof SifendeError) return res.status(502).json({ error: e.message });
        return res.status(502).json({ error: e instanceof Error ? e.message : 'Error obteniendo KuDE' });
    }
}
