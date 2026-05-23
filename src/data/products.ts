/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
    id: string;
    name: string;
    brand: string;
    codigo?: string;
    price: number;        // USD
    priceGs: number;      // Guaraníes (precio de venta)
    listGs: number;       // Guaraníes (precio de lista, antes del descuento)
    discount: number;     // % de descuento (0 si no tiene)
    description: string;
    fullDescription?: string;
    image: string;
    images: string[];
    category: string;
    icon?: string;
    rating: number;
    reviews?: number;
    stock?: number;
}

export { categories } from './categories';

let cache: Product[] | null = null;

export async function loadProducts(): Promise<Product[]> {
    if (cache) return cache;
    const base = import.meta.env.BASE_URL;
    // Fetch the auto-generated CSV catalog and the manually-curated extras in parallel.
    // Extras (curated products like Juegos/Hogar) come FIRST so they appear at the top
    // of "destacados" rails and the bento. Missing extras file is non-fatal.
    const [mainRes, extraRes] = await Promise.all([
        fetch(`${base}products.json`),
        fetch(`${base}products-extra.json`).catch(() => null),
    ]);
    if (!mainRes.ok) throw new Error(`No se pudo cargar el catálogo (${mainRes.status})`);
    const main = (await mainRes.json()) as Product[];
    let extra: Product[] = [];
    if (extraRes && extraRes.ok) {
        try {
            const raw = await extraRes.json();
            if (Array.isArray(raw)) extra = raw as Product[];
        } catch { /* malformed JSON — ignore */ }
    }
    // De-dupe by id (extras win if same id).
    const map = new Map<string, Product>();
    for (const p of main) map.set(p.id, p);
    for (const p of extra) map.set(p.id, p);
    cache = [...extra, ...main.filter((p) => !extra.some((e) => e.id === p.id))];
    return cache;
}

export function formatGs(value: number): string {
    return `₲ ${value.toLocaleString('es-PY')}`;
}

export function formatUsd(value: number): string {
    return `US$ ${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
}
