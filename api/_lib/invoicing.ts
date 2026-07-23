/**
 * Adaptador de facturación electrónica SIFEN vía Sifende (sifende.com.py).
 *
 * Sifende firma y transmite el Documento Electrónico al DNIT/SIFEN por
 * nosotros; el comercio igual necesita su propio RUC habilitado, certificado
 * digital cualificado y timbrado electrónico configurados en el dashboard
 * de Sifende (app.sifende.com.py) — trámites legales que no dependen de este
 * código. Contrato verificado contra la documentación pública de Sifende
 * (sifende.com.py/docs) en jul-2026:
 *  - Auth: header Authorization: Bearer {apiKey}. El AMBIENTE lo decide el
 *    prefijo de la key (sk_test_... = SIFEN QA, sk_live_... = producción),
 *    no una base URL distinta.
 *  - Emitir: POST /documento-electronico → 202 Accepted, estado PENDIENTE
 *    (emisión asíncrona; Sifende aún no tiene webhooks — solo polling).
 *  - Estado: GET /documento-electronico/status/:cdc.
 *  - KuDE: GET /documento-electronico/:cdc/kude → PDF binario (requiere el
 *    mismo Bearer, por eso se proxea vía /api/invoicing/kude en vez de
 *    exponer la URL directa al cliente).
 *  - Sifende calcula IVA/subtotales/total a partir de los ítems: NO se manda
 *    un objeto de totales. precioUnitario va CON IVA incluido (convención PY).
 */

const SIFENDE_BASE = 'https://api.sifende.com.py/api/v1';

export interface InvoicingEnv {
    apiKey: string;                 // sk_test_... | sk_live_...
    establecimiento: number;
    puntoExpedicion: number;
}

export function invoicingEnv(): InvoicingEnv | null {
    const apiKey = process.env.SIFEN_API_KEY;
    if (!apiKey) return null;
    return {
        apiKey,
        establecimiento: Number(process.env.SIFEN_ESTABLECIMIENTO) || 1,
        puntoExpedicion: Number(process.env.SIFEN_PUNTO_EXPEDICION) || 1,
    };
}

export interface InvoiceItem {
    codigo: string;
    descripcion: string;
    cantidad: number;
    precioUnitarioGs: number;       // con IVA incluido
    tasaIVA?: 5 | 10;               // default 10 (tasa general)
    exento?: boolean;               // true → afectacionTributaria EXENTO
}

export interface InvoiceCustomer {
    name: string;
    document: string;               // RUC "1234567-8" (B2B) o CI (B2C); vacío = consumidor innominado
    email?: string;
}

export interface InvoiceRequest {
    orderId: string;
    customer: InvoiceCustomer;
    items: InvoiceItem[];
    totalGs: number;                // solo para validar contra la suma de items, no se envía
}

export interface IssueResult {
    id: string;
    cdc: string;
    estado: string;
    numeroFormateado: string;
    qrUrl: string | null;
    kudeUrl: string | null;
}

export interface StatusResult {
    cdc: string;
    estado: string;
    fechaEmision: string | null;
    mensajeRechazo: string | null;
}

class SifendeError extends Error {
    constructor(message: string, public status: number) { super(message); }
}

async function sifendeFetch(path: string, env: InvoicingEnv, init?: RequestInit) {
    const r = await fetch(`${SIFENDE_BASE}${path}`, {
        ...init,
        headers: {
            authorization: `Bearer ${env.apiKey}`,
            ...(init?.body ? { 'content-type': 'application/json' } : {}),
            ...init?.headers,
        },
    });
    if (!r.ok) {
        const body = await r.json().catch(() => null);
        const msg = body?.error || body?.title || `Sifende respondió ${r.status}`;
        throw new SifendeError(msg, r.status);
    }
    return r;
}

/** RUC paraguayo "1234567-8" → { numero, dv }. Sin guión → no es RUC. */
function splitRuc(document: string): { numero: string; dv: string } | null {
    const m = /^(\d+)-(\d)$/.exec(document.trim());
    return m ? { numero: m[1], dv: m[2] } : null;
}

function buildReceptor(customer: InvoiceCustomer) {
    const ruc = customer.document ? splitRuc(customer.document) : null;
    if (ruc) {
        return {
            tipoContribuyente: 'CONTRIBUYENTE',
            tipoOperacion: 'B2B',
            numeroDocumento: ruc.numero,
            digitoVerificador: ruc.dv,
            nombreRazonSocial: customer.name || 'Consumidor',
            email: customer.email,
        };
    }
    if (customer.document) {
        return {
            tipoContribuyente: 'NO_CONTRIBUYENTE',
            tipoOperacion: 'B2C',
            tipoDocumento: 'CEDULA_PARAGUAYA',
            numeroDocumento: customer.document,
            nombreRazonSocial: customer.name || 'Consumidor',
            email: customer.email,
        };
    }
    return {
        tipoContribuyente: 'INNOMINADO',
        tipoOperacion: 'B2C',
        nombreRazonSocial: 'Sin Nombre',
    };
}

export async function issueInvoice(req: InvoiceRequest, env: InvoicingEnv): Promise<IssueResult> {
    const now = new Date();
    const fechaEmision = now.toISOString().slice(0, 19); // sin timezone, hora local del server

    const body = {
        tipoDocumento: 'FACTURA_ELECTRONICA',
        fechaEmision,
        tipoEmision: 'NORMAL',
        numeroEstablecimiento: env.establecimiento,
        puntoExpedicion: env.puntoExpedicion,
        tipoTransaccion: 'VENTA_MERCADERIA',
        monedaOperacion: 'PYG',
        condicionOperacion: 'CONTADO',
        receptor: buildReceptor(req.customer),
        condicionPago: {
            tipo: 'CONTADO',
            tipoPago: 'TRANSFERENCIA',
            monedaPago: 'PYG',
            montoPago: req.totalGs,
        },
        items: req.items.map((it) => ({
            codigo: it.codigo,
            descripcion: it.descripcion,
            cantidad: it.cantidad,
            unidadMedida: 'UNI',
            precioUnitario: Math.round(it.precioUnitarioGs),
            afectacionTributaria: it.exento ? 'EXENTO' : 'GRAVADO',
            ...(it.exento ? {} : { tasaIVA: it.tasaIVA ?? 10 }),
        })),
    };

    const r = await sifendeFetch('/documento-electronico', env, { method: 'POST', body: JSON.stringify(body) });
    const data = await r.json();
    return {
        id: data.id,
        cdc: data.cdc,
        estado: data.estado,
        numeroFormateado: data.numeroFormateado,
        qrUrl: data.qrUrl ?? null,
        kudeUrl: data.kudeUrl ?? null,
    };
}

export async function getInvoiceStatus(cdc: string, env: InvoicingEnv): Promise<StatusResult> {
    const r = await sifendeFetch(`/documento-electronico/status/${encodeURIComponent(cdc)}`, env);
    const data = await r.json();
    return {
        cdc: data.cdc,
        estado: data.estado,
        fechaEmision: data.fechaEmision ?? null,
        mensajeRechazo: data.mensajeRechazo ?? null,
    };
}

/** Devuelve el PDF del KuDE como Buffer — Sifende exige el mismo Bearer, por eso se proxea. */
export async function fetchKude(cdc: string, env: InvoicingEnv): Promise<Buffer> {
    const r = await sifendeFetch(`/documento-electronico/${encodeURIComponent(cdc)}/kude`, env);
    const arrayBuffer = await r.arrayBuffer();
    return Buffer.from(arrayBuffer);
}

export { SifendeError };
