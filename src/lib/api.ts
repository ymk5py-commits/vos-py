/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Cliente del backend serverless (/api). Degrada con gracia: si las
 * funciones no están disponibles (preview local con `vite preview`),
 * los llamadores caen al flujo client-side anterior.
 */

import { Order, Customer, Shipping, PaymentId, CartItem } from '../store';

export interface AppConfig {
    payments: { bancard: boolean; bancardEnvironment: 'staging' | 'production' | null; whatsapp: boolean };
    invoicing: { sifen: boolean };
    orderSigning: boolean;
}

let configCache: AppConfig | null = null;

export async function fetchConfig(): Promise<AppConfig | null> {
    if (configCache) return configCache;
    try {
        const r = await fetch('/api/config', { headers: { accept: 'application/json' } });
        if (!r.ok) return null;
        const ct = r.headers.get('content-type') || '';
        if (!ct.includes('application/json')) return null; // SPA fallback devolvió index.html
        configCache = (await r.json()) as AppConfig;
        return configCache;
    } catch {
        return null;
    }
}

export interface ServerOrderResult {
    order: Order;
    signature: string | null;
}

/**
 * Crea la orden validada en el servidor (precios/stock del catálogo canónico).
 * Devuelve null si el backend no está disponible; el llamador decide el fallback.
 */
export async function createServerOrder(input: {
    cart: CartItem[];
    customer: Customer;
    shipping: Shipping;
    payment: PaymentId;
}): Promise<ServerOrderResult | null> {
    try {
        const r = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'content-type': 'application/json', accept: 'application/json' },
            body: JSON.stringify({
                items: input.cart.map((it) => ({ id: it.product.id, qty: it.quantity })),
                customer: input.customer,
                shipping: input.shipping,
                payment: input.payment,
            }),
        });
        const ct = r.headers.get('content-type') || '';
        if (!ct.includes('application/json')) return null;
        if (!r.ok) {
            // Error real del servidor (producto sin precio, etc.) — propagar.
            const body = await r.json().catch(() => null);
            throw new Error(body?.error || `Error ${r.status}`);
        }
        return (await r.json()) as ServerOrderResult;
    } catch (e) {
        if (e instanceof Error && e.message && !/fetch|network/i.test(e.message)) throw e;
        return null;
    }
}
