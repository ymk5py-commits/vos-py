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
    const res = await fetch(`${import.meta.env.BASE_URL}products.json`);
    if (!res.ok) throw new Error(`No se pudo cargar el catálogo (${res.status})`);
    cache = (await res.json()) as Product[];
    return cache;
}

export function formatGs(value: number): string {
    return `₲ ${value.toLocaleString('es-PY')}`;
}

export function formatUsd(value: number): string {
    return `US$ ${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
}
