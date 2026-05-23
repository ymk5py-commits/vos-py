/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '../data/products';
import { ProductCard } from './ProductCard';
import { useStore } from '../store';

interface Props {
    products: Product[];
    eyebrow?: string;
    title: React.ReactNode;
    cta?: React.ReactNode;
}

export const ProductRail: React.FC<Props> = ({ products, eyebrow, title, cta }) => {
    const railRef = useRef<HTMLDivElement>(null);
    const { addToCart } = useStore();

    const scroll = (dir: 1 | -1) => {
        const el = railRef.current;
        if (!el) return;
        const card = el.querySelector('[data-rail-item]') as HTMLElement | null;
        const step = card ? card.offsetWidth + 24 : el.clientWidth * 0.8;
        el.scrollBy({ left: step * dir, behavior: 'smooth' });
    };

    if (!products.length) return null;

    return (
        <section className="max-w-[1400px] mx-auto px-5 md:px-8 lg:px-12 py-16 md:py-20">
            <header className="flex items-end justify-between mb-10 gap-6">
                <div>
                    {eyebrow && <p className="text-eyebrow text-ink-3 mb-3">{eyebrow}</p>}
                    <h2 className="text-headline text-ink">{title}</h2>
                </div>
                <div className="flex items-center gap-3">
                    {cta}
                    <div className="hidden md:flex items-center gap-1">
                        <button
                            onClick={() => scroll(-1)}
                            className="h-10 w-10 border border-line rounded-full flex items-center justify-center hover:bg-paper-2 transition-colors"
                            aria-label="Anterior"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => scroll(1)}
                            className="h-10 w-10 border border-line rounded-full flex items-center justify-center hover:bg-paper-2 transition-colors"
                            aria-label="Siguiente"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </header>

            <div
                ref={railRef}
                className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-px-5 md:scroll-px-8 lg:scroll-px-12 pb-2 -mx-5 md:-mx-8 lg:-mx-12 px-5 md:px-8 lg:px-12 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]"
            >
                {products.map((p) => (
                    <div
                        key={p.id}
                        data-rail-item
                        className="snap-start shrink-0 w-[68%] sm:w-[42%] md:w-[30%] lg:w-[22%]"
                    >
                        <ProductCard product={p} onAddToCart={(prod) => addToCart(prod, 1)} />
                    </div>
                ))}
            </div>
        </section>
    );
};
