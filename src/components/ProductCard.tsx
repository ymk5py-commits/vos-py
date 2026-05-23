/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Tarjeta de producto estilo retail (Nissei-inspired):
 * - Card sólida con borde fino
 * - Discount badge rojo top-right
 * - Brand bajo la imagen
 * - Precio prominente, precio anterior tachado, cuotas info
 * - Botón "AGREGAR" siempre visible (no en hover)
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ShoppingBag, ImageOff, MessageCircle } from 'lucide-react';
import { Product, formatGs } from '../data/products';

interface Props {
    product: Product;
    onAddToCart: (product: Product) => void;
    dark?: boolean;
}

const cuotasText = (priceGs: number) => {
    // Hint de cuotas estilo retail PY (informativo, no oferta real)
    const months = 12;
    const monthly = Math.round(priceGs / months / 1000) * 1000;
    if (monthly < 10000) return null;
    return `o ${months}x de ₲ ${monthly.toLocaleString('es-PY')}`;
};

export const ProductCard: React.FC<Props> = ({ product, onAddToCart, dark = false }) => {
    const [imgError, setImgError] = useState(false);
    const hasDiscount = product.discount > 0 && product.listGs > product.priceGs;
    const askPrice = product.priceGs === 0;
    const cuotas = askPrice ? null : cuotasText(product.priceGs);
    const waHref = askPrice
        ? `https://wa.me/?text=${encodeURIComponent(`Hola, quería consultar el precio de: ${product.name.replace(/[\r\n<>]/g, '').slice(0, 200)}${product.codigo ? ` (Cód. ${product.codigo})` : ''}`)}`
        : '';

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className={`group h-full flex flex-col ${dark ? 'bg-paper text-ink' : 'bg-paper border border-line hover:border-py-red/40 hover:shadow-lg'} transition-all duration-200`}
        >
            <Link to={`/producto/${product.id}`} className="block">
                {/* Image plate */}
                <div className="relative aspect-square overflow-hidden bg-paper p-4">
                    {imgError ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-ink-3 gap-1">
                            <ImageOff className="h-8 w-8" strokeWidth={1.4} />
                            <span className="text-[10px] font-bold uppercase tracking-wider">Sin foto</span>
                        </div>
                    ) : (
                        <img
                            src={product.image}
                            alt={product.name}
                            loading="lazy"
                            onError={() => setImgError(true)}
                            className="absolute inset-0 h-full w-full object-contain p-3 transition-transform duration-300 group-hover:scale-105"
                        />
                    )}
                    {hasDiscount && (
                        <span className="absolute top-2 right-2 bg-py-red text-paper text-[11px] font-extrabold tabular px-2 py-1 rounded shadow-sm">
                            −{product.discount}%
                        </span>
                    )}
                </div>
            </Link>

            {/* Info */}
            <div className="px-3 pb-3 flex flex-col gap-2 flex-1">
                <Link to={`/producto/${product.id}`} className="block">
                    <p className="text-[10px] uppercase tracking-wider text-ink-3 font-bold">{product.brand}</p>
                    <h3 className="text-[13px] font-semibold text-ink line-clamp-2 leading-snug min-h-[34px] mt-0.5 group-hover:text-py-red transition-colors">
                        {product.name.toLowerCase().replace(/(^|\s)\S/g, (c) => c.toUpperCase())}
                    </h3>
                </Link>

                <div className="mt-auto">
                    {askPrice ? (
                        <>
                            <p className="text-[12px] uppercase tracking-wider font-bold text-emerald-700">Consultar precio</p>
                            <p className="text-[15px] md:text-[16px] font-extrabold text-ink leading-tight">por WhatsApp</p>
                        </>
                    ) : (
                        <>
                            {hasDiscount && (
                                <span className="block text-[11px] text-ink-3 line-through tabular leading-none">
                                    {formatGs(product.listGs)}
                                </span>
                            )}
                            <p className="text-[18px] md:text-[20px] font-extrabold tabular text-ink leading-tight">
                                {formatGs(product.priceGs)}
                            </p>
                            {cuotas && (
                                <p className="text-[10px] text-emerald-700 font-semibold tabular mt-0.5">
                                    {cuotas}
                                </p>
                            )}
                        </>
                    )}
                </div>

                {askPrice ? (
                    <a
                        href={waHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="w-full mt-2 h-10 bg-emerald-600 text-paper text-[12px] font-extrabold tracking-wide uppercase hover:bg-emerald-700 transition-colors inline-flex items-center justify-center gap-2"
                    >
                        <MessageCircle className="h-3.5 w-3.5" strokeWidth={2.4} />
                        Consultar
                    </a>
                ) : (
                    <button
                        aria-label={`Agregar ${product.name} al carrito`}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onAddToCart(product);
                        }}
                        className="w-full mt-2 h-10 bg-py-red text-paper text-[12px] font-extrabold tracking-wide uppercase hover:bg-py-red-deep transition-colors inline-flex items-center justify-center gap-2"
                    >
                        <ShoppingBag className="h-3.5 w-3.5" strokeWidth={2.4} />
                        Agregar
                    </button>
                )}
            </div>
        </motion.div>
    );
};
