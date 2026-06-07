/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Bento grid featured section. Mixes cell sizes for editorial rhythm.
 * One hero cell, two promo cells (dark + light), 4 standard cells.
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Plus, ArrowUpRight, Sparkles, MessageCircle } from 'lucide-react';
import { Product, formatGs } from '../data/products';
import { useStore } from '../store';

interface Props { products: Product[] }

const safeTitle = (s: string) =>
    s.toLowerCase().replace(/(^|\s)\S/g, (c) => c.toUpperCase());

export const BentoFeatured: React.FC<Props> = ({ products }) => {
    const { addToCart } = useStore();
    if (products.length < 7) return null;

    const [hero, a, b, c, d, e, f] = products.slice(0, 7);

    return (
        <section className="max-w-[1400px] mx-auto px-5 md:px-8 lg:px-12 py-20 md:py-28">
            <header className="flex items-end justify-between mb-12 gap-6">
                <div>
                    <p className="text-eyebrow text-ink-3 mb-3">Editorial · Edición Otoño</p>
                    <h2 className="text-display-m text-ink max-w-xl leading-[0.95]">
                        Lo que estamos<br />
                        <span className="italic font-bold tracking-tighter">recomendando</span> hoy<span className="text-py-red">.</span>
                    </h2>
                </div>
                <Link to="/catalogo" className="hidden md:inline-flex items-center gap-2 text-[13px] font-semibold link-underline">
                    Ver catálogo completo <ArrowUpRight className="h-4 w-4" />
                </Link>
            </header>

            {/* Bento grid: 4 cols × 3 rows on desktop, 2 cols on mobile */}
            <div className="grid grid-cols-2 lg:grid-cols-4 auto-rows-[minmax(170px,1fr)] sm:auto-rows-[minmax(220px,1fr)] gap-2 sm:gap-3 md:gap-4">
                {/* HERO cell — large product, takes 2x2 */}
                <BentoHero product={hero} onAdd={() => addToCart(hero, 1)} />

                {/* Editorial promo cell — dark, takes 2x1 */}
                <BentoPromoDark />

                {/* Two standard products */}
                <BentoProduct product={a} onAdd={() => addToCart(a, 1)} />
                <BentoProduct product={b} onAdd={() => addToCart(b, 1)} />

                {/* WhatsApp wide cell — takes 2x1, green */}
                <BentoWhatsApp />

                {/* Two more products */}
                <BentoProduct product={c} onAdd={() => addToCart(c, 1)} />
                <BentoProduct product={d} onAdd={() => addToCart(d, 1)} />
                <BentoProduct product={e} onAdd={() => addToCart(e, 1)} />
                <BentoProduct product={f} onAdd={() => addToCart(f, 1)} />
            </div>
        </section>
    );
};

const BentoHero: React.FC<{ product: Product; onAdd: () => void }> = ({ product, onAdd }) => {
    const [err, setErr] = useState(false);
    const hasDiscount = product.discount > 0 && product.listGs > product.priceGs;

    // Cursor-follow spotlight (sets CSS vars on the plate).
    const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
        e.currentTarget.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative col-span-2 row-span-2 bg-paper border border-line overflow-hidden group flex flex-col"
        >
            <Link to={`/producto/${product.id}`} className="flex flex-col h-full">
                {/* Image area — clean, no text overlap, cursor spotlight */}
                <div
                    onMouseMove={onMove}
                    className="relative flex-1 min-h-0 flex items-center justify-center p-6 sm:p-10 md:p-12 bg-paper [--mx:50%] [--my:40%]"
                >
                    {/* Spotlight overlay — only visible on hover */}
                    <div
                        aria-hidden="true"
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                        style={{ background: 'radial-gradient(380px circle at var(--mx) var(--my), color-mix(in oklch, var(--color-py-red) 9%, transparent), transparent 70%)' }}
                    />
                    {err ? (
                        <span className="text-display-m text-ink-3 opacity-25">VP</span>
                    ) : (
                        <img
                            src={product.image}
                            alt={product.name}
                            onError={() => setErr(true)}
                            className="max-w-full max-h-full object-contain transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                        />
                    )}
                    {/* Solid editor badge — high contrast */}
                    <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 bg-ink text-paper text-[10px] font-bold uppercase tracking-[0.18em] px-2.5 py-1.5">
                        <Sparkles className="h-3 w-3" /> Destacado
                    </span>
                    {hasDiscount && (
                        <span className="absolute top-4 right-4 bg-sale text-paper text-[11px] font-extrabold tabular px-2 py-1">
                            −{product.discount}%
                        </span>
                    )}
                </div>

                {/* Solid info panel — full contrast, separated from photo */}
                <div className="shrink-0 border-t border-line bg-paper-2 p-4 sm:p-6 md:p-7">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-py-red mb-1">{product.brand}</p>
                    <h3 className="text-[15px] sm:text-title md:text-[26px] font-extrabold tracking-tight text-ink line-clamp-2 max-w-md leading-tight">
                        {safeTitle(product.name)}
                    </h3>
                    <div className="flex items-end justify-between mt-3 sm:mt-4">
                        <div>
                            {hasDiscount && (
                                <span className="block text-[12px] line-through tabular text-ink-3 leading-none mb-0.5">{formatGs(product.listGs)}</span>
                            )}
                            <span className={`block text-xl sm:text-2xl md:text-[32px] font-extrabold tabular leading-none ${hasDiscount ? 'text-sale' : 'text-ink'}`}>
                                {formatGs(product.priceGs)}
                            </span>
                        </div>
                        <button
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onAdd(); }}
                            className="press h-11 w-11 sm:h-12 sm:w-12 bg-py-red text-paper flex items-center justify-center hover:bg-py-red-deep transition-colors shrink-0"
                            aria-label={`Agregar ${product.name}`}
                        >
                            <Plus className="h-5 w-5" strokeWidth={2.4} />
                        </button>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

const BentoProduct: React.FC<{ product: Product; onAdd: () => void }> = ({ product, onAdd }) => {
    const [err, setErr] = useState(false);
    const hasDiscount = product.discount > 0 && product.listGs > product.priceGs;
    return (
        <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative bg-paper border border-line overflow-hidden group flex flex-col"
        >
            <Link to={`/producto/${product.id}`} className="flex flex-col h-full">
                <div className="relative flex-1 min-h-0 flex items-center justify-center p-5 bg-paper">
                    {err ? (
                        <span className="text-headline text-ink-3 opacity-30">VP</span>
                    ) : (
                        <img
                            src={product.image}
                            alt={product.name}
                            loading="lazy"
                            onError={() => setErr(true)}
                            className="max-w-full max-h-full object-contain transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                        />
                    )}
                    {hasDiscount && (
                        <span className="absolute top-0 right-0 bg-sale text-paper text-[10px] font-bold tabular px-2 py-1">−{product.discount}%</span>
                    )}
                </div>
                <div className="shrink-0 border-t border-line bg-paper-2 p-3">
                    <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-ink-3 mb-0.5">{product.brand}</p>
                    <h4 className="text-[12px] font-semibold text-ink line-clamp-1 leading-tight">{safeTitle(product.name)}</h4>
                    <div className="flex items-center justify-between mt-1.5">
                        <span className={`text-[13px] font-extrabold tabular ${hasDiscount ? 'text-sale' : 'text-ink'}`}>
                            {formatGs(product.priceGs)}
                        </span>
                        <button
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onAdd(); }}
                            className="press h-7 w-7 bg-py-red text-paper flex items-center justify-center hover:bg-py-red-deep transition-colors"
                            aria-label={`Agregar ${product.name}`}
                        >
                            <Plus className="h-3.5 w-3.5" strokeWidth={2.4} />
                        </button>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

const BentoPromoDark: React.FC = () => (
    <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="col-span-2 bg-night text-paper relative overflow-hidden group"
    >
        <Link to="/catalogo?ofertas=1" className="block h-full p-5 sm:p-7 md:p-9 flex flex-col justify-between">
            <span className="text-eyebrow text-paper/60">Hasta −15%</span>
            <div>
                <h3 className="text-[22px] sm:text-headline font-extrabold tracking-tight text-paper leading-[0.95] mb-2">
                    Cargadores y cables
                    <br />
                    <span className="text-py-red">rebajados.</span>
                </h3>
                <div className="flex items-center gap-2 text-[12px] sm:text-[13px] font-semibold mt-3 sm:mt-4 group-hover:gap-3 transition-all">
                    Ver todas las ofertas <ArrowUpRight className="h-4 w-4" />
                </div>
            </div>
            {/* Decorative dot grid, low-key */}
            <div
                aria-hidden="true"
                className="absolute -right-10 -top-10 w-48 h-48 opacity-[0.07] [background-image:radial-gradient(circle,_white_1px,_transparent_1px)] [background-size:14px_14px]"
            />
        </Link>
    </motion.div>
);

const BentoWhatsApp: React.FC = () => (
    <motion.a
        href="https://wa.me/?text=Hola%2C%20quiero%20hacer%20una%20consulta"
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="col-span-2 bg-emerald-600 text-paper relative overflow-hidden group p-5 sm:p-7 md:p-9 flex flex-col justify-between hover:bg-emerald-700 transition-colors"
    >
        <span className="text-eyebrow text-paper/70">Consulta directa</span>
        <div>
            <h3 className="text-[22px] sm:text-headline font-extrabold tracking-tight text-paper leading-[0.95] mb-2">
                Coordiná tu compra<br />
                por WhatsApp.
            </h3>
            <div className="flex items-center gap-2 text-[12px] sm:text-[13px] font-semibold mt-3 sm:mt-4 group-hover:gap-3 transition-all">
                <MessageCircle className="h-4 w-4" /> Iniciar conversación
            </div>
        </div>
        <div
            aria-hidden="true"
            className="absolute -right-12 -bottom-12 w-56 h-56 rounded-full bg-white/10 blur-2xl"
        />
    </motion.a>
);
