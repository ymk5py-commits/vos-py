/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
    Check, ChevronRight, ArrowLeft, ShoppingBag, MapPin, CreditCard,
    Minus, Plus, Trash2, User, Mail, Phone, IdCard, MessageCircle,
    Truck, Store, Lock,
} from 'lucide-react';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useStore } from '../store';
import { formatGs } from '../data/products';
import { DEPARTAMENTOS, PAYMENT_METHODS } from '../data/paraguay';

type StepId = 'cart' | 'details' | 'shipping' | 'payment';
const STEPS: { id: StepId; n: string; label: string; icon: any }[] = [
    { id: 'cart',     n: '01', label: 'Carrito',  icon: ShoppingBag },
    { id: 'details',  n: '02', label: 'Datos',    icon: User },
    { id: 'shipping', n: '03', label: 'Envío',    icon: MapPin },
    { id: 'payment',  n: '04', label: 'Pago',     icon: CreditCard },
];

export default function Checkout() {
    const nav = useNavigate();
    const s = useStore();
    const [step, setStep] = useState<StepId>('cart');
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => { window.scrollTo({ top: 0 }); }, [step]);

    const empty = s.cart.length === 0;

    const validateDetails = () => {
        const e: Record<string, string> = {};
        if (!s.customer.name || s.customer.name.length < 2) e.name = 'Ingresá tu nombre completo';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s.customer.email)) e.email = 'Email inválido';
        if (!s.customer.phone || s.customer.phone.length < 7) e.phone = 'Teléfono inválido';
        if (!s.customer.document || s.customer.document.length < 5) e.document = 'Cédula o RUC requerido';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const validateShipping = () => {
        if (s.shipping.type === 'pickup') {
            setErrors({});
            return true;
        }
        const e: Record<string, string> = {};
        if (!s.shipping.address || s.shipping.address.length < 5) e.address = 'Dirección requerida';
        if (!s.shipping.city) e.city = 'Ciudad requerida';
        if (!s.shipping.department) e.department = 'Seleccioná un departamento';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const goNext = () => {
        if (step === 'cart') return setStep('details');
        if (step === 'details') { if (validateDetails()) setStep('shipping'); return; }
        if (step === 'shipping') { if (validateShipping()) setStep('payment'); return; }
        if (step === 'payment') { finalize(); return; }
    };

    const goBack = () => {
        if (step === 'details') return setStep('cart');
        if (step === 'shipping') return setStep('details');
        if (step === 'payment') return setStep('shipping');
        nav('/catalogo');
    };

    const finalize = () => {
        const order = s.createOrder();
        nav(`/orden/${order.id}`);
    };

    if (empty && step === 'cart') {
        return <EmptyCart />;
    }

    return (
        <section className="max-w-[1400px] mx-auto px-5 md:px-8 lg:px-12 py-10 md:py-14">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-eyebrow text-ink-3 mb-6">
                <Link to="/" className="hover:text-ink">Inicio</Link>
                <ChevronRight className="h-3 w-3" />
                <span className="text-ink">Checkout</span>
            </nav>

            {/* Stepper */}
            <Stepper current={step} onSelect={(id) => {
                // Solo permitir ir hacia atrás (no saltar adelante)
                const order: StepId[] = ['cart', 'details', 'shipping', 'payment'];
                if (order.indexOf(id) <= order.indexOf(step)) setStep(id);
            }} />

            <div className="grid lg:grid-cols-12 gap-x-12 gap-y-10 mt-10 md:mt-14">
                {/* Main column */}
                <div className="lg:col-span-7">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                        >
                            {step === 'cart' && <CartStep />}
                            {step === 'details' && <DetailsStep errors={errors} />}
                            {step === 'shipping' && <ShippingStep errors={errors} />}
                            {step === 'payment' && <PaymentStep />}
                        </motion.div>
                    </AnimatePresence>

                    {/* Footer actions — desktop only (mobile uses sticky bottom bar below) */}
                    <div className="hidden lg:flex items-center justify-between mt-10 pt-8 border-t border-line">
                        <button
                            onClick={goBack}
                            className="inline-flex items-center gap-2 text-[13px] font-semibold text-ink-2 hover:text-ink"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            {step === 'cart' ? 'Seguir comprando' : 'Volver'}
                        </button>
                        <button
                            onClick={goNext}
                            className="group inline-flex items-center gap-3 bg-ink text-paper rounded-none pl-6 pr-2 h-13 font-semibold text-[14px] hover:bg-ink/90 transition-colors disabled:opacity-40"
                            disabled={empty && step === 'cart'}
                            style={{ height: 52 }}
                        >
                            {step === 'payment' ? 'Confirmar pedido' : 'Continuar'}
                            <span className="flex items-center justify-center w-10 h-10 bg-paper text-ink">
                                {step === 'payment' ? <Check className="h-4 w-4" strokeWidth={2.5} /> : <ChevronRight className="h-4 w-4" />}
                            </span>
                        </button>
                    </div>
                </div>

                {/* Summary aside */}
                <aside className="lg:col-span-5 lg:pl-8 lg:border-l border-line">
                    <Summary />
                </aside>
            </div>

            {/* Sticky bottom action bar — mobile only */}
            <div className="lg:hidden fixed inset-x-0 bottom-0 z-40 bg-paper border-t border-line shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.15)]">
                <div className="px-4 pt-3 pb-[calc(env(safe-area-inset-bottom)+12px)] flex items-center gap-3">
                    <button
                        onClick={goBack}
                        className="h-11 w-11 shrink-0 flex items-center justify-center border border-line"
                        aria-label="Volver"
                    >
                        <ArrowLeft className="h-4 w-4" strokeWidth={2} />
                    </button>
                    <div className="flex-1 min-w-0">
                        <p className="text-eyebrow text-ink-3 truncate">Total</p>
                        <p className="text-[15px] font-bold tabular text-ink truncate">{formatGsHelper(s.cartTotal)}</p>
                    </div>
                    <button
                        onClick={goNext}
                        disabled={empty && step === 'cart'}
                        className="group inline-flex items-center gap-2 bg-ink text-paper px-5 h-11 font-semibold text-[13px] hover:bg-ink/90 transition-colors disabled:opacity-40"
                    >
                        {step === 'payment' ? 'Confirmar' : 'Continuar'}
                        {step === 'payment' ? <Check className="h-4 w-4" strokeWidth={2.5} /> : <ChevronRight className="h-4 w-4" />}
                    </button>
                </div>
            </div>
            {/* Spacer for sticky bar on mobile */}
            <div aria-hidden="true" className="lg:hidden h-20" />
        </section>
    );
}

// Local helper to format Gs without bringing the cart data here directly
const formatGsHelper = (v: number) => `₲ ${v.toLocaleString('es-PY')}`;

/* ---------------- Stepper ---------------- */

const Stepper = ({ current, onSelect }: { current: StepId; onSelect: (id: StepId) => void }) => {
    const idx = STEPS.findIndex((s) => s.id === current);
    const currentStep = STEPS[idx];
    return (
        <>
            {/* Mobile: progress bar + current label */}
            <div className="sm:hidden">
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <p className="text-eyebrow text-ink-3">Paso {currentStep.n} de 04</p>
                        <p className="text-title text-ink mt-0.5">{currentStep.label}</p>
                    </div>
                    <span className="text-eyebrow text-ink-3 tabular">{Math.round(((idx + 1) / STEPS.length) * 100)}%</span>
                </div>
                <div className="h-1 bg-paper-2 overflow-hidden">
                    <motion.div
                        className="h-full bg-ink"
                        initial={false}
                        animate={{ width: `${((idx + 1) / STEPS.length) * 100}%` }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    />
                </div>
            </div>

            {/* Desktop: full stepper */}
            <ol className="hidden sm:grid sm:grid-cols-4 gap-px bg-line border border-line">
                {STEPS.map((s, i) => {
                    const done = i < idx;
                    const active = s.id === current;
                    return (
                        <li key={s.id}>
                            <button
                                onClick={() => onSelect(s.id)}
                                className={`w-full text-left p-4 md:p-5 flex items-center gap-3 transition-colors ${
                                    active ? 'bg-ink text-paper'
                                    : done ? 'bg-paper-2 text-ink hover:bg-paper-3'
                                    : 'bg-paper text-ink-3'
                                }`}
                                disabled={i > idx}
                            >
                                <span className={`h-7 w-7 shrink-0 flex items-center justify-center text-[11px] font-bold tabular ${
                                    active ? 'bg-paper text-ink'
                                    : done ? 'bg-ink text-paper' : 'bg-paper-2 text-ink-3'
                                }`}>
                                    {done ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : s.n}
                                </span>
                                <span>
                                    <p className={`text-[12px] uppercase tracking-wider font-semibold ${active ? 'text-paper/60' : 'text-ink-3'}`}>Paso {s.n}</p>
                                    <p className={`text-[14px] font-bold ${active ? 'text-paper' : ''}`}>{s.label}</p>
                                </span>
                            </button>
                        </li>
                    );
                })}
            </ol>
        </>
    );
};

/* ---------------- Steps ---------------- */

const CartStep = () => {
    const s = useStore();
    return (
        <div>
            <p className="text-eyebrow text-ink-3 mb-2">Paso 01</p>
            <h1 className="text-headline text-ink mb-8">Revisá tu carrito</h1>
            <ul className="divide-y divide-line border-y border-line">
                {s.cart.map((it) => (
                    <li key={it.product.id} className="py-5 flex gap-4 md:gap-6 items-center">
                        <Link to={`/producto/${it.product.id}`} className="block w-20 h-20 md:w-24 md:h-24 bg-paper-2 shrink-0">
                            <img src={it.product.image} alt={it.product.name} className="w-full h-full object-contain p-2" loading="lazy" />
                        </Link>
                        <div className="flex-1 min-w-0">
                            <p className="text-eyebrow text-ink-3 truncate">{it.product.brand}</p>
                            <Link to={`/producto/${it.product.id}`} className="block text-[14px] md:text-[15px] font-semibold text-ink line-clamp-2 hover:underline">
                                {it.product.name.toLowerCase().replace(/(^|\s)\S/g, (c) => c.toUpperCase())}
                            </Link>
                            <div className="flex items-center gap-3 mt-2">
                                <div className="inline-flex items-center border border-line">
                                    <button onClick={() => s.updateQuantity(it.product.id, -1)} className="h-8 w-8 flex items-center justify-center hover:bg-paper-2" aria-label="Disminuir">
                                        <Minus className="h-3 w-3" strokeWidth={2} />
                                    </button>
                                    <span className="w-8 text-center text-[13px] font-semibold tabular">{it.quantity}</span>
                                    <button onClick={() => s.updateQuantity(it.product.id, 1)} className="h-8 w-8 flex items-center justify-center hover:bg-paper-2" aria-label="Aumentar">
                                        <Plus className="h-3 w-3" strokeWidth={2} />
                                    </button>
                                </div>
                                <button onClick={() => s.removeFromCart(it.product.id)} className="text-[12px] text-ink-3 hover:text-py-red inline-flex items-center gap-1">
                                    <Trash2 className="h-3.5 w-3.5" strokeWidth={1.6} /> Quitar
                                </button>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-[15px] md:text-[16px] font-bold tabular text-ink">{formatGs(it.product.priceGs * it.quantity)}</p>
                            <p className="text-[11px] text-ink-3 tabular">{formatGs(it.product.priceGs)} c/u</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const DetailsStep = ({ errors }: { errors: Record<string, string> }) => {
    const s = useStore();
    return (
        <div>
            <p className="text-eyebrow text-ink-3 mb-2">Paso 02</p>
            <h1 className="text-headline text-ink mb-8">Tus datos</h1>

            {!s.user && (
                <div className="bg-paper-2 border border-line p-5 mb-6 flex items-center justify-between gap-4">
                    <div>
                        <p className="text-[13px] font-bold text-ink">¿Ya tenés cuenta?</p>
                        <p className="text-[12px] text-ink-3">Iniciá sesión para autocompletar tus datos.</p>
                    </div>
                    <button onClick={s.openLogin} className="text-[13px] font-semibold link-underline">Iniciar sesión</button>
                </div>
            )}

            <div className="grid md:grid-cols-2 gap-5">
                <Field
                    icon={User} label="Nombre y apellido" htmlFor="name" error={errors.name}
                >
                    <Input id="name" value={s.customer.name} onChange={(e) => s.setCustomer({ name: e.target.value })} placeholder="Juan Pérez" maxLength={80} autoComplete="name" />
                </Field>
                <Field icon={IdCard} label="Cédula o RUC" htmlFor="doc" error={errors.document}>
                    <Input id="doc" inputMode="numeric" value={s.customer.document} onChange={(e) => s.setCustomer({ document: e.target.value })} placeholder="0000000-0" maxLength={30} autoComplete="off" />
                </Field>
                <Field icon={Mail} label="Email" htmlFor="email" error={errors.email}>
                    <Input id="email" type="email" value={s.customer.email} onChange={(e) => s.setCustomer({ email: e.target.value })} placeholder="tu@email.com" maxLength={254} autoComplete="email" />
                </Field>
                <Field icon={Phone} label="Teléfono (WhatsApp)" htmlFor="phone" error={errors.phone}>
                    <Input id="phone" type="tel" inputMode="tel" value={s.customer.phone} onChange={(e) => s.setCustomer({ phone: e.target.value })} placeholder="0981 000 000" maxLength={30} autoComplete="tel" />
                </Field>
            </div>

            <p className="text-[11px] text-ink-3 mt-6 leading-relaxed">
                Usamos tus datos solo para procesar este pedido y emitir la factura,
                conforme a la <Link to="/privacidad" className="link-underline">Política de privacidad</Link>.
            </p>
        </div>
    );
};

const ShippingStep = ({ errors }: { errors: Record<string, string> }) => {
    const s = useStore();
    return (
        <div>
            <p className="text-eyebrow text-ink-3 mb-2">Paso 03</p>
            <h1 className="text-headline text-ink mb-8">¿Dónde lo entregamos?</h1>

            {/* Type toggle */}
            <div className="grid grid-cols-2 gap-3 mb-8">
                <OptionTile
                    selected={s.shipping.type === 'delivery'}
                    onClick={() => s.setShipping({ type: 'delivery' })}
                    icon={Truck} title="Envío a domicilio"
                    desc="Asunción, GA e interior por courier."
                />
                <OptionTile
                    selected={s.shipping.type === 'pickup'}
                    onClick={() => s.setShipping({ type: 'pickup' })}
                    icon={Store} title="Retiro en punto"
                    desc="Coordinamos un punto en Asunción."
                />
            </div>

            {s.shipping.type === 'delivery' && (
                <div className="grid md:grid-cols-3 gap-5">
                    <Field icon={MapPin} label="Dirección" htmlFor="addr" error={errors.address} colSpan={3}>
                        <Input id="addr" value={s.shipping.address} onChange={(e) => s.setShipping({ address: e.target.value })} placeholder="Av. Mariscal López 1234, Edificio Vos, Piso 2" maxLength={160} autoComplete="street-address" />
                    </Field>
                    <Field label="Ciudad" htmlFor="city" error={errors.city}>
                        <Input id="city" value={s.shipping.city} onChange={(e) => s.setShipping({ city: e.target.value })} placeholder="Asunción" maxLength={60} autoComplete="address-level2" />
                    </Field>
                    <Field label="Departamento" htmlFor="dept" error={errors.department} colSpan={2}>
                        <select
                            id="dept"
                            value={s.shipping.department}
                            onChange={(e) => s.setShipping({ department: e.target.value })}
                            className="h-11 w-full bg-paper border border-line hover:border-ink-3 focus:outline-none focus:ring-2 focus:ring-ink/15 px-3 text-[14px]"
                        >
                            <option value="">Elegí un departamento</option>
                            {DEPARTAMENTOS.map((d) => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </Field>
                    <Field label="Notas para el repartidor (opcional)" htmlFor="notes" colSpan={3}>
                        <textarea
                            id="notes"
                            value={s.shipping.notes}
                            onChange={(e) => s.setShipping({ notes: e.target.value })}
                            placeholder="Referencias, horario preferido, etc."
                            maxLength={280}
                            rows={3}
                            className="w-full bg-paper border border-line hover:border-ink-3 focus:outline-none focus:ring-2 focus:ring-ink/15 p-3 text-[14px] resize-none"
                        />
                    </Field>
                </div>
            )}

            {s.shipping.type === 'pickup' && (
                <div className="bg-paper-2 border border-line p-5 text-[14px] text-ink-2">
                    Al confirmar el pedido te contactamos por WhatsApp para acordar un
                    punto de retiro conveniente en Asunción.
                </div>
            )}
        </div>
    );
};

const PaymentStep = () => {
    const s = useStore();
    const selected = PAYMENT_METHODS.find((p) => p.id === s.payment) ?? PAYMENT_METHODS[0];
    return (
        <div>
            <p className="text-eyebrow text-ink-3 mb-2">Paso 04</p>
            <h1 className="text-headline text-ink mb-8">¿Cómo querés pagar?</h1>

            <div className="grid gap-3">
                {PAYMENT_METHODS.map((m) => (
                    <button
                        key={m.id}
                        onClick={() => s.setPayment(m.id)}
                        className={`text-left p-5 border-2 transition-colors ${
                            s.payment === m.id
                                ? 'border-ink bg-paper'
                                : 'border-line bg-paper hover:border-ink-3'
                        }`}
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <p className="text-[15px] font-bold text-ink">{m.name}</p>
                                <p className="text-[13px] text-ink-2 mt-1 max-w-md">{m.description}</p>
                            </div>
                            <span className={`mt-1 h-5 w-5 rounded-full border-2 shrink-0 flex items-center justify-center ${
                                s.payment === m.id ? 'border-ink bg-ink' : 'border-line bg-paper'
                            }`}>
                                {s.payment === m.id && <Check className="h-3 w-3 text-paper" strokeWidth={3} />}
                            </span>
                        </div>
                    </button>
                ))}
            </div>

            <div className="mt-8 bg-paper-2 border border-line p-5">
                <p className="text-eyebrow text-ink-3 mb-3">Detalles · {selected.short}</p>
                <ul className="space-y-1.5 text-[13px] text-ink-2">
                    {selected.details.map((d, i) => (
                        <li key={i} className="flex gap-2"><span className="text-ink-3">·</span>{d}</li>
                    ))}
                </ul>
            </div>

            <div className="mt-6 flex items-start gap-3 text-[12px] text-ink-3 leading-relaxed">
                <Lock className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                <p>
                    Al confirmar, generamos tu pedido y abrimos WhatsApp con el resumen
                    para que cerremos juntos los detalles. Tus datos están protegidos
                    según nuestra <Link to="/privacidad" className="link-underline">Política de privacidad</Link>.
                </p>
            </div>
        </div>
    );
};

/* ---------------- Summary aside ---------------- */

const Summary = () => {
    const s = useStore();
    const items = s.cart.length;
    return (
        <div className="lg:sticky lg:top-32">
            <p className="text-eyebrow text-ink-3 mb-3">Tu pedido</p>
            <h2 className="text-title text-ink mb-5">{items === 1 ? '1 producto' : `${items} productos`}</h2>

            <ul className="divide-y divide-line border-y border-line">
                {s.cart.map((it) => (
                    <li key={it.product.id} className="py-3 flex items-center gap-3">
                        <div className="w-12 h-12 bg-paper-2 shrink-0">
                            <img src={it.product.image} alt={it.product.name} className="w-full h-full object-contain p-1" loading="lazy" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[12px] text-ink line-clamp-1">{it.product.name}</p>
                            <p className="text-[11px] text-ink-3 tabular">{it.quantity} × {formatGs(it.product.priceGs)}</p>
                        </div>
                        <p className="text-[13px] font-bold tabular text-ink shrink-0">{formatGs(it.product.priceGs * it.quantity)}</p>
                    </li>
                ))}
            </ul>

            <dl className="mt-5 space-y-2 text-[13px]">
                <div className="flex justify-between"><dt className="text-ink-3">Subtotal</dt><dd className="tabular text-ink">{formatGs(s.cartTotal)}</dd></div>
                <div className="flex justify-between"><dt className="text-ink-3">Envío</dt><dd className="text-emerald-700 font-semibold">a coordinar</dd></div>
            </dl>
            <div className="border-t border-line mt-3 pt-3 flex justify-between items-baseline">
                <dt className="text-eyebrow text-ink-3">Total</dt>
                <dd className="text-2xl font-bold tabular text-ink">{formatGs(s.cartTotal)}</dd>
            </div>

            <p className="text-[11px] text-ink-3 mt-3 leading-relaxed">
                IVA incluido. El costo final del envío se confirma por WhatsApp.
            </p>
        </div>
    );
};

/* ---------------- Empty state ---------------- */

const EmptyCart = () => (
    <section className="max-w-2xl mx-auto px-5 py-24 md:py-32 text-center">
        <ShoppingBag className="h-12 w-12 text-ink-3 mx-auto mb-4" strokeWidth={1.4} />
        <p className="text-eyebrow text-ink-3 mb-3">Carrito vacío</p>
        <h1 className="text-headline text-ink mb-4">No tenés productos en el carrito</h1>
        <p className="text-ink-2 mb-8">Explorá el catálogo y volvé cuando estés listo.</p>
        <Link to="/catalogo" className="inline-flex items-center gap-3 bg-ink text-paper px-7 h-13 font-semibold text-[14px] hover:bg-ink/90 transition-colors" style={{ height: 52 }}>
            Ir al catálogo
        </Link>
    </section>
);

/* ---------------- Field primitives ---------------- */

const Field = ({
    icon: Icon, label, htmlFor, error, colSpan = 1, children,
}: {
    icon?: any; label: string; htmlFor: string; error?: string; colSpan?: 1 | 2 | 3; children: React.ReactNode
}) => (
    <div className={colSpan === 3 ? 'md:col-span-3' : colSpan === 2 ? 'md:col-span-2' : ''}>
        <Label htmlFor={htmlFor} className="text-eyebrow text-ink-3 mb-2 flex items-center gap-1.5">
            {Icon && <Icon className="h-3 w-3" />}
            {label}
        </Label>
        {children}
        {error && <p className="text-[11px] text-py-red mt-1.5 font-semibold">{error}</p>}
    </div>
);

const OptionTile = ({
    selected, onClick, icon: Icon, title, desc,
}: { selected: boolean; onClick: () => void; icon: any; title: string; desc: string }) => (
    <button
        onClick={onClick}
        className={`text-left p-5 border-2 transition-colors ${
            selected ? 'border-ink bg-paper' : 'border-line bg-paper hover:border-ink-3'
        }`}
    >
        <Icon className="h-5 w-5 mb-3 text-ink" strokeWidth={1.6} />
        <p className="text-[15px] font-bold text-ink">{title}</p>
        <p className="text-[12px] text-ink-3 mt-1">{desc}</p>
    </button>
);
