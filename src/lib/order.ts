/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Helpers para formato de orden y WhatsApp.
 * El número de WhatsApp del negocio se configura acá; vacío = wa.me share
 * (el usuario elige el contacto desde su lista).
 */

import { Order } from '../store';
import { formatGs } from '../data/products';
import { PAYMENT_METHODS } from '../data/paraguay';

/** Cambiá esto por el número real de la tienda (formato internacional sin +). */
export const WHATSAPP_NUMBER = ''; // ej: '595981000000'

const fmtDate = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleString('es-PY', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
    });
};

const paymentLabel = (id: string) =>
    PAYMENT_METHODS.find((p) => p.id === id)?.name ?? id;

const safeLine = (s: string) =>
    (s || '').replace(/[\r\n]+/g, ' ').slice(0, 240);

export function orderToWhatsAppText(order: Order): string {
    const lines: string[] = [];
    lines.push(`Hola Vos PY, quiero confirmar este pedido:`);
    lines.push('');
    lines.push(`*Pedido* ${order.id}`);
    lines.push(`*Fecha* ${fmtDate(order.createdAt)}`);
    lines.push('');
    lines.push(`*Productos*`);
    for (const it of order.items) {
        const codigo = it.codigo ? ` · Cód. ${safeLine(it.codigo)}` : '';
        lines.push(`• ${it.qty}x ${safeLine(it.name)} — ${formatGs(it.priceGs * it.qty)}${codigo}`);
    }
    lines.push('');
    lines.push(`*Total*  ${formatGs(order.totalGs)}`);
    lines.push('');
    lines.push(`*Cliente*`);
    lines.push(`Nombre: ${safeLine(order.customer.name)}`);
    if (order.customer.document) lines.push(`Cédula/RUC: ${safeLine(order.customer.document)}`);
    lines.push(`Teléfono: ${safeLine(order.customer.phone)}`);
    if (order.customer.email) lines.push(`Email: ${safeLine(order.customer.email)}`);
    lines.push('');
    lines.push(`*Entrega*`);
    if (order.shipping.type === 'pickup') {
        lines.push('Retiro en punto convenido (Asunción).');
    } else {
        lines.push(`${safeLine(order.shipping.address)}`);
        lines.push(`${safeLine(order.shipping.city)}, ${safeLine(order.shipping.department)}`);
    }
    if (order.shipping.notes) lines.push(`Notas: ${safeLine(order.shipping.notes)}`);
    lines.push('');
    lines.push(`*Método de pago*`);
    lines.push(paymentLabel(order.payment));
    lines.push('');
    lines.push(`https://vos-py.vercel.app/orden/${order.id}`);
    return lines.join('\n');
}

export function orderWhatsAppHref(order: Order): string {
    const text = encodeURIComponent(orderToWhatsAppText(order));
    return WHATSAPP_NUMBER
        ? `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`
        : `https://wa.me/?text=${text}`;
}
