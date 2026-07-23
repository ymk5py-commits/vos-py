/**
 * Carga del catálogo canónico del deployment y validación de items.
 * Compartido por /api/orders y /api/bancard/create-payment.
 * (La carpeta _lib no genera endpoints en Vercel.)
 */

export interface CatalogProduct {
  id: string; name: string; brand: string; codigo?: string;
  priceGs: number; stock?: number;
}

export interface ValidatedItem {
  id: string; name: string; brand: string; codigo?: string;
  qty: number; priceGs: number;
}

export const clean = (s: unknown, n: number) =>
  String(s ?? '').replace(/[\r\n<>]/g, '').slice(0, n);

/**
 * Origen para bajar el catálogo canónico. Usa las env vars que Vercel setea
 * él mismo (no vienen del cliente) en vez de Host/X-Forwarded-Host, que un
 * atacante puede falsificar para apuntar loadCatalog() a un products.json
 * propio con precios/stock arbitrarios (bypass del price-trust boundary +
 * SSRF). Host header solo como fallback para `vercel dev`/entornos locales.
 */
export function requestOrigin(req: any): string | null {
  const trusted = process.env.VERCEL_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (trusted) return `https://${trusted}`;
  const proto = (req.headers['x-forwarded-proto'] as string) || 'https';
  const host = (req.headers['x-forwarded-host'] as string) || (req.headers.host as string);
  return host ? `${proto}://${host}` : null;
}

export async function loadCatalog(origin: string): Promise<Map<string, CatalogProduct>> {
  const urls = [`${origin}/products.json`, `${origin}/products-extra.json`];
  const map = new Map<string, CatalogProduct>();
  for (const url of urls) {
    try {
      const r = await fetch(url);
      if (!r.ok) continue;
      const arr = (await r.json()) as CatalogProduct[];
      if (Array.isArray(arr)) for (const p of arr) map.set(p.id, p);
    } catch { /* products-extra puede no existir */ }
  }
  return map;
}

/**
 * Valida ids+qty contra el catálogo. Devuelve items con precio del servidor,
 * o un error. Agrega cantidades por id ANTES de capear contra el stock real
 * (evita bypass del límite partiendo el mismo producto en muchas líneas), y
 * trata stock:0 explícito como "sin stock" en vez de "no trackeado" (0 es
 * falsy en JS — un `p.stock && ...` deja pasar hasta 99 unidades de un
 * producto agotado).
 */
export function validateItems(
  catalog: Map<string, CatalogProduct>,
  raw: unknown,
): { items: ValidatedItem[] } | { error: string } {
  if (!Array.isArray(raw) || raw.length === 0 || raw.length > 50) return { error: 'items inválidos' };
  const byId = new Map<string, { p: CatalogProduct; qty: number }>();
  for (const r of raw as { id?: unknown; qty?: unknown }[]) {
    const id = clean(r?.id, 64);
    const p = catalog.get(id);
    if (!p) return { error: `producto desconocido: ${id}` };
    if (!(p.priceGs > 0)) return { error: `producto sin precio (consultar): ${id}` };
    const wanted = Math.max(1, Math.min(99, Math.floor(Number(r?.qty) || 1)));
    const prev = byId.get(id);
    byId.set(id, { p, qty: (prev?.qty ?? 0) + wanted });
  }
  const items: ValidatedItem[] = [];
  for (const { p, qty } of byId.values()) {
    const max = typeof p.stock === 'number' ? Math.max(0, p.stock) : 99;
    if (max <= 0) return { error: `sin stock: ${p.id}` };
    items.push({ id: p.id, name: p.name, brand: p.brand, codigo: p.codigo, qty: Math.min(qty, max), priceGs: p.priceGs });
  }
  return { items };
}

export const totalOf = (items: ValidatedItem[]) =>
  items.reduce((a, it) => a + it.priceGs * it.qty, 0);
