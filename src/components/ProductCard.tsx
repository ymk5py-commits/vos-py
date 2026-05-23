/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Plus } from 'lucide-react';
import { Product, formatGs } from '../data/products';

interface Props {
    product: Product;
    onAddToCart: (product: Product) => void;
    dark?: boolean;
}

export const ProductCard: React.FC<Props> = ({ product, onAddToCart, dark = false }) => {
    const [imgError, setImgError] = useState(false);
    const hasDiscount = product.discount > 0 && product.listGs > product.priceGs;

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="group"
        >
            <Link to={`/producto/${product.id}`} className="block">
                {/* Image plate — bare, no card */}
                <div className={`relative aspect-square overflow-hidden ${dark ? 'bg-paper' : 'bg-paper-2'} mb-4`}>
                    {imgError ? (
                        <div className="absolute inset-0 flex items-center justify-center text-ink-3">
                            <span className="text-3xl font-bold tracking-tight tabular opacity-30">VP</span>
                        </div>
                    ) : (
                        <img
                            src={product.image}
                            alt={product.name}
                            loading="lazy"
                            onError={() => setImgError(true)}
                            className="absolute inset-0 h-full w-full object-contain p-6 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                        />
                    )}

                    {/* Brand mark, top-left, never bigger than the product needs */}
                    <span className={`absolute top-3 left-3 text-eyebrow ${dark ? 'text-ink' : 'text-ink-3'}`}>
                        {product.brand}
                    </span>

                    {/* Sale signal: solid block, not a rounded badge */}
                    {hasDiscount && (
                        <span className="absolute top-0 right-0 bg-sale text-paper text-[11px] font-bold tabular px-2 py-1.5">
                            −{product.discount}%
                        </span>
                    )}

                    {/* Floating quick-add: appears on hover only, square */}
                    <button
                        aria-label={`Agregar ${product.name} al carrito`}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onAddToCart(product);
                        }}
                        className="absolute bottom-3 right-3 h-10 w-10 bg-ink text-paper flex items-center justify-center opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-ink/90"
                    >
                        <Plus className="h-4 w-4" strokeWidth={2.4} />
                    </button>
                </div>

                {/* Meta row */}
                <div className="flex items-start justify-between gap-4">
                    <h3 className={`text-[14px] md:text-[15px] leading-snug font-semibold ${dark ? 'text-paper' : 'text-ink'} line-clamp-2 flex-1`}>
                        {product.name.toLowerCase().replace(/(^|\s)\S/g, (s) => s.toUpperCase())}
                    </h3>
                    <div className="text-right shrink-0">
                        {hasDiscount && (
                            <span className={`block text-[11px] line-through leading-none tabular ${dark ? 'text-ink-3' : 'text-ink-3'}`}>
                                {formatGs(product.listGs)}
                            </span>
                        )}
                        <span className={`block text-[15px] md:text-[17px] font-bold tabular leading-tight ${dark ? 'text-paper' : 'text-ink'} ${hasDiscount ? '!text-sale' : ''}`}>
                            {formatGs(product.priceGs)}
                        </span>
                    </div>
                </div>
                <p className={`text-eyebrow mt-1 ${dark ? 'text-ink-3' : 'text-ink-3'}`}>
                    {product.category}
                </p>
            </Link>
        </motion.div>
    );
};
