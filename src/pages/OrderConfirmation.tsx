/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { Check, MessageCircle, Copy, ArrowLeft, ShoppingBag } from 'lucide-react';
import { useStore } from '../store';
import { formatGs } from '../data/products';
import { PAYMENT_METHODS } from '../data/paraguay';
import { orderWhatsAppHref, orderToWhatsAppText } from '../lib/order';

export default function OrderConfirmation() {
    const { id } = useParams<{ id: string }>();
    const nav = useNavigate();
    const { getOrder } = useStore();
    const order = id ? getOrder(id) : null;

    useEffect(() => { window.scrollTo({ top: 0 }); document.title = `Orden ${id} · Vos PY`; }, [id]);

    if (!order) {
        return (
            <section className="max-w-2xl mx-auto px-5 py-24 text-center">
                <p className="text-eyebrow text-py-red mb-3">Orden no encontrada</p>
                <h1 className="text-headline text-ink mb-4">No pudimos encontrar este pedido</h1>
                <p className="text-ink-2 mb-8">
                    La orden puede haber expirado de tu navegador. Si ya nos escribiste por
                    WhatsApp, seguimos con la coordinación normal.
                </p>
                <Link to="/" className="inline-flex items-center gap-2 text-[13px] font-semibold link-underline">
                    <ArrowLeft className="h-4 w-4" /> Volver al inicio
                </Link>
            </section>
        );
    }

    const waHref = orderWhatsAppHref(order);
    const payment = PAYMENT_METHODS.find((p) => p.id === order.payment);

    const copySummary = async () => {
        try { await navigator.clipboard.writeText(orderToWhatsAppText(order)); } catch { /* noop */ }
    };

    return (
        <section className="max-w-[1400px] mx-auto px-5 md:px-8 lg:px-12 py-12 md:py-20">
            <div className="grid lg:grid-cols-12 gap-x-12 gap-y-10">
                <div className="lg:col-span-7">
                    {/* Success header */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <div className="inline-flex items-center justify-center h-14 w-14 bg-ink text-paper mb-6">
                            <Check className="h-7 w-7" strokeWidth={2.5} />
                        </div>
                        <p className="text-eyebrow text-ink-3 mb-2">Pedido generado</p>
                        <h1 className="text-display-m text-ink mb-3 leading-[0.95]">
                            Casi listo<span className="text-py-red">.</span>
                        </h1>
                        <p className="text-[16px] md:text-[17px] text-ink-2 max-w-xl">
                            Tu pedido se generó correctamente. Para confirmarlo, mandanos el
                            resumen por WhatsApp. Te respondemos en minutos para coordinar pago
                            y entrega.
                        </p>
                    </motion.div>

                    {/* Primary CTA */}
                    <div className="mt-10 grid gap-3 max-w-md">
                        <a
                            href={waHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group inline-flex items-center justify-between gap-3 bg-emerald-600 text-paper pl-6 pr-3 h-14 font-bold text-[15px] hover:bg-emerald-700 transition-colors"
                        >
                            <span className="inline-flex items-center gap-3">
                                <MessageCircle className="h-5 w-5" strokeWidth={2} />
                                Enviar resumen por WhatsApp
                            </span>
                            <span className="text-paper/70 text-[11px] tracking-widest uppercase font-semibold">
                                Abrir →
                            </span>
                        </a>
                        <button
                            onClick={copySummary}
                            className="inline-flex items-center justify-center gap-2 bg-paper border border-line text-ink h-12 font-semibold text-[13px] hover:bg-paper-2 transition-colors"
                        >
                            <Copy className="h-3.5 w-3.5" /> Copiar el resumen al portapapeles
                        </button>
                    </div>

                    {/* Next steps */}
                    <div className="mt-12">
                        <p className="text-eyebrow text-ink-3 mb-4">Qué pasa ahora</p>
                        <ol className="grid grid-cols-1 md:grid-cols-3 gap-px bg-line border border-line">
                            <Step n="01" title="Te contactamos" desc="Confirmamos stock y el costo del envío por WhatsApp." />
                            <Step n="02" title="Pagás" desc={`Coordinamos según tu método elegido: ${payment?.short ?? '—'}.`} />
                            <Step n="03" title="Despachamos" desc="24/48 h en GA, 2–7 días al interior." />
                        </ol>
                    </div>

                    <div className="mt-10 flex flex-wrap items-center gap-4">
                        <Link to="/catalogo" className="inline-flex items-center gap-2 text-[13px] font-semibold link-underline">
                            <ShoppingBag className="h-4 w-4" /> Seguir comprando
                        </Link>
                        <button onClick={() => nav('/')} className="inline-flex items-center gap-2 text-[13px] font-semibold text-ink-3 hover:text-ink">
                            Volver al inicio
                        </button>
                    </div>
                </div>

                {/* Order recap aside */}
                <aside className="lg:col-span-5 lg:pl-8 lg:border-l border-line">
                    <p className="text-eyebrow text-ink-3 mb-3">Resumen</p>
                    <h2 className="text-title text-ink mb-1">Orden</h2>
                    <p className="text-2xl font-bold tabular text-ink mb-6">{order.id}</p>

                    <ul className="divide-y divide-line border-y border-line">
                        {order.items.map((it) => (
                            <li key={it.id} className="py-3 flex items-start gap-3">
                                <div className="flex-1 min-w-0">
                                    <p className="text-eyebrow text-ink-3 mb-0.5">{it.brand}</p>
                                    <p className="text-[13px] text-ink line-clamp-2">{it.name}</p>
                                    <p className="text-[11px] text-ink-3 tabular mt-0.5">{it.qty} × {formatGs(it.priceGs)}</p>
                                </div>
                                <p className="text-[13px] font-bold tabular text-ink shrink-0">{formatGs(it.qty * it.priceGs)}</p>
                            </li>
                        ))}
                    </ul>

                    <div className="mt-5 border-t border-line pt-3 flex justify-between items-baseline">
                        <dt className="text-eyebrow text-ink-3">Total</dt>
                        <dd className="text-2xl font-bold tabular text-ink">{formatGs(order.totalGs)}</dd>
                    </div>

                    <dl className="mt-8 space-y-4 text-[13px]">
                        <Recap k="Cliente" v={`${order.customer.name}${order.customer.document ? ` · ${order.customer.document}` : ''}`} />
                        <Recap k="Contacto" v={`${order.customer.phone}${order.customer.email ? ` · ${order.customer.email}` : ''}`} />
                        <Recap k="Entrega" v={
                            order.shipping.type === 'pickup'
                                ? 'Retiro en punto (Asunción)'
                                : `${order.shipping.address} — ${order.shipping.city}, ${order.shipping.department}`
                        } />
                        {order.shipping.notes && <Recap k="Notas" v={order.shipping.notes} />}
                        <Recap k="Pago" v={payment?.name ?? order.payment} />
                    </dl>
                </aside>
            </div>
        </section>
    );
}

const Step = ({ n, title, desc }: { n: string; title: string; desc: string }) => (
    <li className="bg-paper p-5">
        <span className="text-eyebrow text-ink-3 tabular">{n}</span>
        <p className="text-[15px] font-bold text-ink mt-2">{title}</p>
        <p className="text-[12px] text-ink-3 mt-1 leading-relaxed">{desc}</p>
    </li>
);

const Recap = ({ k, v }: { k: string; v: string }) => (
    <div>
        <dt className="text-eyebrow text-ink-3 mb-1">{k}</dt>
        <dd className="text-ink">{v}</dd>
    </div>
);
