/**
 * POST /api/invoicing/issue — emite una factura electrónica (SIFEN, vía
 * Sifende) para un pedido ya confirmado. La emisión es asíncrona: esta
 * respuesta trae el CDC con estado PENDIENTE; el frontend debe consultar
 * /api/invoicing/status para conocer el resultado final (Sifende no tiene
 * webhooks todavía). Responde 503 si SIFEN_API_KEY no está configurado.
 *
 * El total NO se recalcula acá: se factura el pedido tal como fue
 * confirmado (ya validado server-side por /api/orders o /api/bancard).
 * Sifende calcula IVA/subtotales desde los ítems — no se envía un total.
 */

import { clean } from '../_lib/catalog';
import { invoicingEnv, issueInvoice, SifendeError } from '../_lib/invoicing';

export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const env = invoicingEnv();
    if (!env) return res.status(503).json({ error: 'Facturación electrónica no configurada' });

    const body = typeof req.body === 'string' ? safeParse(req.body) : req.body;
    if (!body?.orderId || !Array.isArray(body?.items) || body.items.length === 0) {
        return res.status(400).json({ error: 'body inválido' });
    }

    const items = (body.items as unknown[]).slice(0, 50).map((raw) => {
        const i = raw as { codigo?: unknown; descripcion?: unknown; cantidad?: unknown; precioUnitarioGs?: unknown; tasaIVA?: unknown; exento?: unknown };
        return {
            codigo: clean(i.codigo, 40),
            descripcion: clean(i.descripcion, 200),
            cantidad: Math.max(0.000001, Number(i.cantidad) || 1),
            precioUnitarioGs: Math.max(0, Number(i.precioUnitarioGs) || 0),
            tasaIVA: (i.tasaIVA === 5 ? 5 : 10) as 5 | 10,
            exento: Boolean(i.exento),
        };
    });

    try {
        const result = await issueInvoice({
            orderId: clean(body.orderId, 40),
            customer: {
                name: clean(body.customer?.name, 80),
                document: clean(body.customer?.document, 30),
                email: clean(body.customer?.email, 254) || undefined,
            },
            items,
            totalGs: Math.max(0, Number(body.totalGs) || 0),
        }, env);
        return res.status(202).json(result);
    } catch (e) {
        if (e instanceof SifendeError) return res.status(502).json({ error: e.message });
        return res.status(502).json({ error: e instanceof Error ? e.message : 'Error emitiendo factura' });
    }
}

function safeParse(s: string) {
    try { return JSON.parse(s); } catch { return null; }
}
