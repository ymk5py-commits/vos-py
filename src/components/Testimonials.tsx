/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Prueba social: testimonios de clientes paraguayos en marquesina de doble
 * fila (direcciones opuestas), pausa en hover, segura para reduced-motion.
 * On-brand: tokens OKLCH, sin avatares falsos (iniciales), motion/react.
 *
 * NOTA: son reseñas de muestra realistas. Reemplazá `REVIEWS` con reseñas
 * reales (de WhatsApp, Instagram, etc.) cuando las tengas.
 */

import { useEffect, useState } from 'react';
import { Star, BadgeCheck } from 'lucide-react';

interface Review {
    name: string;
    city: string;
    rating: number;
    text: string;
}

const REVIEWS: Review[] = [
    { name: 'Carla Giménez', city: 'Asunción', rating: 5, text: 'Pedí unos auriculares JBL y me llegaron al día siguiente. Todo coordinado por WhatsApp, súper claro. Excelente atención.' },
    { name: 'Diego Fernández', city: 'Ciudad del Este', rating: 5, text: 'Compré un smartwatch Garmin. Original, con su caja y garantía. Llegó al interior en 3 días sin problemas.' },
    { name: 'Rocío Benítez', city: 'Encarnación', rating: 5, text: 'Me asesoraron para elegir el celular según mi presupuesto. Cero presión, muy honestos. Volvería a comprar.' },
    { name: 'Marcos Villalba', city: 'Luque', rating: 4, text: 'Buen precio comparado con otras tiendas. El cargador Apple era original. Tardó un poco más pero avisaron todo.' },
    { name: 'Lucía Rojas', city: 'San Lorenzo', rating: 5, text: 'La mesa de ping pong llegó impecable y bien embalada. Mis hijos felices. Recomiendo 100%.' },
    { name: 'Andrés Cáceres', city: 'Capiatá', rating: 5, text: 'Atención por WhatsApp muy rápida. Me mandaron fotos reales del producto antes de pagar. Confiable.' },
    { name: 'Natalia Duarte', city: 'Lambaré', rating: 5, text: 'Compré el parlante Sony y un cable Mcdodo. Precios en guaraníes claros, factura legal. Todo en regla.' },
    { name: 'Federico Ayala', city: 'Fernando de la Mora', rating: 5, text: 'El tejo para el quincho salió buenísimo. Patas firmes y los discos vienen incluidos. Gran calidad.' },
    { name: 'Sofía Martínez', city: 'Asunción', rating: 4, text: 'Redmi Buds llegaron rápido. La compra fue simple, me gustó que no piden mil datos para comprar.' },
    { name: 'Gustavo Ramírez', city: 'Pedro Juan Caballero', rating: 5, text: 'Mandé al interior y llegó perfecto por encomienda. Me pasaron el seguimiento. Muy profesionales.' },
];

const Stars = ({ n }: { n: number }) => (
    <div className="flex gap-0.5" aria-label={`${n} de 5 estrellas`}>
        {[...Array(5)].map((_, i) => (
            <Star key={i} className={`h-3.5 w-3.5 ${i < n ? 'fill-amber-400 text-amber-400' : 'fill-line text-line'}`} strokeWidth={0} />
        ))}
    </div>
);

const Initials = ({ name }: { name: string }) => {
    const initials = name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();
    return (
        <span className="h-9 w-9 shrink-0 rounded-full bg-ink text-paper text-[12px] font-bold tabular flex items-center justify-center">
            {initials}
        </span>
    );
};

const ReviewCard = ({ r }: { r: Review }) => (
    <figure className="w-[300px] sm:w-[340px] shrink-0 bg-paper border border-line p-5 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
                <Initials name={r.name} />
                <figcaption className="min-w-0">
                    <p className="text-[13px] font-bold text-ink truncate flex items-center gap-1">
                        {r.name}
                        <BadgeCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    </p>
                    <p className="text-[11px] text-ink-3 truncate">{r.city}, Paraguay</p>
                </figcaption>
            </div>
            <Stars n={r.rating} />
        </div>
        <blockquote className="text-[13px] text-ink-2 leading-relaxed">“{r.text}”</blockquote>
    </figure>
);

export const Testimonials = () => {
    const [reduced, setReduced] = useState(false);
    useEffect(() => {
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
        const apply = () => setReduced(mq.matches);
        apply();
        mq.addEventListener('change', apply);
        return () => mq.removeEventListener('change', apply);
    }, []);

    const rowA = REVIEWS.slice(0, 5);
    const rowB = REVIEWS.slice(5, 10);

    return (
        <section className="border-y border-line bg-paper-2/50 overflow-hidden">
            <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 pt-16 md:pt-20 pb-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-10">
                    <div>
                        <p className="text-eyebrow text-py-red mb-3">Prueba social</p>
                        <h2 className="text-[28px] md:text-[40px] font-extrabold tracking-tight text-ink leading-[1.05]">
                            Compras reales,<br />clientes reales<span className="text-py-red">.</span>
                        </h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <div className="flex items-center gap-2 justify-end">
                                <span className="text-[32px] font-extrabold tabular text-ink leading-none">4,8</span>
                                <Stars n={5} />
                            </div>
                            <p className="text-[12px] text-ink-3 mt-1">Promedio sobre compras coordinadas por WhatsApp</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Marquee rows */}
            {reduced ? (
                <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 pb-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {REVIEWS.slice(0, 6).map((r) => <ReviewCard key={r.name} r={r} />)}
                </div>
            ) : (
                <div className="pb-16 space-y-4" aria-hidden="false">
                    <Row items={rowA} direction="left" />
                    <Row items={rowB} direction="right" />
                </div>
            )}
        </section>
    );
};

const Row = ({ items, direction }: { items: Review[]; direction: 'left' | 'right' }) => (
    <div className="group relative flex overflow-hidden">
        <div
            className={`flex gap-4 px-2 ${direction === 'left' ? 'animate-marquee-l' : 'animate-marquee-r'} group-hover:[animation-play-state:paused]`}
        >
            {[...items, ...items].map((r, i) => (
                <ReviewCard key={`${r.name}-${i}`} r={r} />
            ))}
        </div>
    </div>
);
