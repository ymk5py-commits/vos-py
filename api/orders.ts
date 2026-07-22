/**
 * POST /api/orders — creación de orden VALIDADA EN SERVIDOR.
 *
 * Corrige el hallazgo del audit "client_trusted_prices": el cliente envía
 * SOLO ids y cantidades; el servidor busca los precios en el catálogo
 * canónico del deployment, recalcula el total, capea cantidades al stock
 * y devuelve la orden con una firma HMAC (si ORDER_SIGNING_SECRET está
 * configurado) para que el comercio pueda verificar que el resumen de
 * WhatsApp no fue adulterado.
 *
 * Sin base de datos todavía: la orden no se persiste server-side (eso llega
 * con Supabase, fase 3 del roadmap). Pero los PRECIOS ya no son confiados
 * al cliente.
 */

import crypto from 'node:crypto';

interface InItem { id: string; qty: number }
interface CatalogProduct {
  id: string; name: string; brand: string; codigo?: string;
  priceGs: number; stock?: number;
}

const clean = (s: unknown, n: number) =>
  String(s ?? '').replace(/[\r\n<>]/g, '').slice(0, n);

async function loadCatalog(origin: string): Promise<Map<string, CatalogProduct>> {
  const urls = [`${origin}/products.json`, `${origin}/products-extra.json`];
  const map = new Map<string, CatalogProduct>();
  for (const url of urls) {
    try {
      const r = await fetch(url);
      if (!r.ok) continue;
      const arr = (await r.json()) as CatalogProduct[];
      if (Array.isArray(arr)) for (const p of arr) map.set(p.id, p);
    } catch { /* extra file may not exist */ }
  }
  return map;
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = typeof req.body === 'string' ? safeParse(req.body) : req.body;
  if (!body || !Array.isArray(body.items) || body.items.length === 0 || body.items.length > 50) {
    return res.status(400).json({ error: 'items inválidos' });
  }

  const proto = (req.headers['x-forwarded-proto'] as string) || 'https';
  const host = (req.headers['x-forwarded-host'] as string) || (req.headers.host as string);
  if (!host) return res.status(500).json({ error: 'host indeterminado' });

  const catalog = await loadCatalog(`${proto}://${host}`);
  if (catalog.size === 0) return res.status(503).json({ error: 'catálogo no disponible' });

  const items: { id: string; name: string; brand: string; codigo?: string; qty: number; priceGs: number }[] = [];
  for (const raw of body.items as InItem[]) {
    const id = clean(raw?.id, 64);
    const p = catalog.get(id);
    if (!p) return res.status(400).json({ error: `producto desconocido: ${id}` });
    if (!(p.priceGs > 0)) return res.status(400).json({ error: `producto sin precio (consultar): ${id}` });
    const wanted = Math.max(1, Math.min(99, Math.floor(Number(raw?.qty) || 1)));
    const max = p.stock && p.stock > 0 ? p.stock : 99;
    const qty = Math.min(wanted, max);
    items.push({ id: p.id, name: p.name, brand: p.brand, codigo: p.codigo, qty, priceGs: p.priceGs });
  }

  // Total calculado EXCLUSIVAMENTE con precios del catálogo del servidor.
  const totalGs = items.reduce((a, it) => a + it.priceGs * it.qty, 0);

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

  // Firma HMAC opcional: el comercio puede recomputarla para verificar
  // que el pedido recibido por WhatsApp coincide con lo validado acá.
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
