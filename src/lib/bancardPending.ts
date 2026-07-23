/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * El checkout embebido de Bancard redirige la página completa a return_url
 * (/pago/retorno), lo que reinicia el estado de React. Guardamos acá un
 * snapshot de la orden pendiente para reconstruirla una vez confirmado el
 * pago. El total ya viene validado por el servidor (createBancardPayment);
 * este snapshot es solo para mostrar el resumen, no para calcular montos.
 *
 * Se guarda UNA entrada por shopProcessId (no una clave fija compartida):
 * dos sesiones de pago superpuestas (dos pestañas, retry) no se pisan entre
 * sí, así que confirmar la sesión vieja sigue mostrando/guardando su propio
 * pedido en vez de perderse silenciosamente.
 */

import { Order, CartItem, Customer, Shipping } from '../store';
import { BancardPayment } from './api';

const KEY_PREFIX = 'vospy_bancard_pending_v1:';
const MAX_ENTRIES = 5; // evita que localStorage crezca sin límite entre sesiones abandonadas

const keyFor = (shopProcessId: number) => `${KEY_PREFIX}${shopProcessId}`;

function prune() {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k?.startsWith(KEY_PREFIX)) keys.push(k);
    }
    // shopProcessId es Date.now()*1000+rand, mismo largo de dígitos → orden lexicográfico = orden temporal.
    keys.sort();
    for (const k of keys.slice(0, Math.max(0, keys.length - MAX_ENTRIES))) {
        localStorage.removeItem(k);
    }
}

export function savePendingBancardOrder(
    payment: BancardPayment,
    cart: CartItem[],
    customer: Customer,
    shipping: Shipping,
) {
    const order: Order = {
        id: payment.orderId,
        createdAt: Date.now(),
        items: cart.map((it) => ({
            id: it.product.id,
            name: it.product.name,
            brand: it.product.brand,
            qty: it.quantity,
            priceGs: it.product.priceGs,
            codigo: it.product.codigo,
        })),
        totalGs: payment.totalGs,
        customer,
        shipping,
        payment: 'bancard',
    };
    try {
        localStorage.setItem(keyFor(payment.shopProcessId), JSON.stringify(order));
        prune();
    } catch { /* quota */ }
}

export function readPendingBancardOrder(shopProcessId: number): Order | null {
    try {
        const raw = localStorage.getItem(keyFor(shopProcessId));
        return raw ? (JSON.parse(raw) as Order) : null;
    } catch {
        return null;
    }
}

export function clearPendingBancardOrder(shopProcessId: number) {
    try { localStorage.removeItem(keyFor(shopProcessId)); } catch { /* noop */ }
}
