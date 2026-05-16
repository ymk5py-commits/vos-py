/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Product, formatGs } from '../data/products';
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Star, ShoppingCart, Minus, Plus, ImageOff, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

interface ProductDetailProps {
    product: Product | null;
    isOpen: boolean;
    onClose: () => void;
    onAddToCart: (product: Product, quantity: number) => void;
}

const formatUsd2 = (v: number) =>
    `U$ ${v.toLocaleString('es-PY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const ProductDetail: React.FC<ProductDetailProps> = ({
    product,
    isOpen,
    onClose,
    onAddToCart
}) => {
    const [quantity, setQuantity] = useState(1);
    const [imgError, setImgError] = useState(false);

    useEffect(() => {
        setQuantity(1);
        setImgError(false);
    }, [product]);

    if (!product) return null;

    const handleAddToCart = () => {
        onAddToCart(product, quantity);
        onClose();
        setQuantity(1);
    };

    const hasDiscount = product.discount > 0 && product.listGs > product.priceGs;
    const whatsappHref = `https://wa.me/?text=${encodeURIComponent(
        `Hola, quiero consultar por: ${product.name}${product.codigo ? ` (Cód. ${product.codigo})` : ''}`
    )}`;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="w-[95vw] sm:max-w-5xl max-h-[92vh] p-0 overflow-hidden rounded-2xl border-none">
                <div className="overflow-y-auto max-h-[92vh]">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-1.5 px-6 md:px-10 pt-6 text-[11px] md:text-xs font-bold uppercase tracking-wider text-[#0038A8]/70">
                        <span>Inicio</span>
                        <ChevronRight className="h-3 w-3" />
                        <span>Electrónicos</span>
                        <ChevronRight className="h-3 w-3" />
                        <span className="text-[#0038A8]">{product.category}</span>
                    </div>

                    <div className="flex flex-col md:grid md:grid-cols-2 gap-2 md:gap-8 p-6 md:p-10 pt-4">
                        {/* Left: Image */}
                        <div className="bg-white flex items-center justify-center">
                            {imgError ? (
                                <div className="aspect-square w-full flex flex-col items-center justify-center text-zinc-300 gap-3 bg-zinc-50 rounded-xl">
                                    <ImageOff className="h-16 w-16" />
                                    <span className="text-xs font-bold uppercase tracking-wider">Imagen no disponible</span>
                                </div>
                            ) : (
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    onError={() => setImgError(true)}
                                    className="w-full aspect-square object-contain"
                                />
                            )}
                        </div>

                        {/* Right: Info */}
                        <div className="flex flex-col gap-4">
                            <DialogTitle className="text-2xl md:text-3xl font-black tracking-tight leading-[1.15] uppercase">
                                {product.name}
                            </DialogTitle>

                            <div className="h-px bg-zinc-200" />

                            {/* Rating */}
                            <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`h-4 w-4 ${i < Math.round(product.rating)
                                            ? 'fill-orange-400 text-orange-400'
                                            : 'text-zinc-300'}`}
                                    />
                                ))}
                                <span className="ml-2 text-xs text-muted-foreground font-semibold">
                                    ({product.reviews} reseñas)
                                </span>
                            </div>

                            {hasDiscount && (
                                <span className="inline-block w-fit bg-[#D52B1E] text-white text-xs font-bold px-3 py-1 rounded">
                                    -{product.discount} %
                                </span>
                            )}

                            {/* Price */}
                            <div>
                                {hasDiscount && (
                                    <p className="text-lg font-bold text-zinc-400 line-through">
                                        {formatGs(product.listGs)}
                                    </p>
                                )}
                                <div className="flex items-baseline gap-3 flex-wrap">
                                    <span className={`text-3xl md:text-4xl font-black ${hasDiscount ? 'text-[#D52B1E]' : 'text-[#0038A8]'}`}>
                                        {formatGs(product.priceGs)}
                                    </span>
                                    {product.price > 0 && (
                                        <span className="text-sm font-bold text-muted-foreground">
                                            {formatUsd2(product.price)} TAX FREE *
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Quantity + actions */}
                            <div className="flex flex-wrap items-center gap-4 mt-2">
                                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                    Cantidad
                                </span>
                                <div className="flex items-center border-2 border-amber-300 rounded-full overflow-hidden">
                                    <button
                                        className="p-2 md:p-3 hover:bg-amber-50 transition-colors"
                                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                        aria-label="Disminuir cantidad"
                                    >
                                        <Minus className="h-4 w-4" />
                                    </button>
                                    <span className="w-10 md:w-12 text-center font-bold">{quantity}</span>
                                    <button
                                        className="p-2 md:p-3 hover:bg-amber-50 transition-colors"
                                        onClick={() => setQuantity(q => q + 1)}
                                        aria-label="Aumentar cantidad"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </button>
                                </div>
                                {product.stock !== undefined && (
                                    <span className="text-xs md:text-sm font-bold text-emerald-600">
                                        {product.stock} disponibles
                                    </span>
                                )}
                            </div>

                            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                                <Button
                                    size="lg"
                                    className="w-full bg-[#0a1f5c] hover:bg-[#08164a] text-white h-12 md:h-13 rounded-xl text-base font-bold"
                                    onClick={handleAddToCart}
                                >
                                    <ShoppingCart className="mr-2 h-5 w-5" />
                                    Agregar al carrito
                                </Button>
                            </motion.div>

                            <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="w-full">
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="w-full border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50 h-12 rounded-xl text-base font-bold"
                                >
                                    <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.945C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 018.413 3.488 11.82 11.82 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.978-1.042zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                                    Consultar por WhatsApp
                                </Button>
                            </a>

                            {product.price > 0 && (
                                <p className="text-[11px] text-muted-foreground leading-relaxed">
                                    * Precio en U$ bajo régimen de turismo, no incluye I.V.A. (impuesto
                                    obligatorio para residentes en Paraguay).
                                </p>
                            )}

                            <div className="mt-2 space-y-1.5 text-sm">
                                <p><span className="font-bold">Marca:</span> {product.brand}</p>
                                {product.codigo && (
                                    <p><span className="font-bold">Código:</span> {product.codigo}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="px-6 md:px-10 pb-8">
                        <div className="h-px bg-zinc-200 mb-5" />
                        <h3 className="text-lg font-black uppercase tracking-tight mb-3">Descripción</h3>
                        <p className="text-sm md:text-base text-muted-foreground leading-relaxed whitespace-pre-line">
                            {product.fullDescription || product.description}
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
