/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Product, formatGs, formatUsd } from '../data/products';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ShoppingCart, Truck, ShieldCheck, RefreshCw, Minus, Plus, ImageOff, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';

interface ProductDetailProps {
    product: Product | null;
    isOpen: boolean;
    onClose: () => void;
    onAddToCart: (product: Product, quantity: number) => void;
}

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

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="w-[95vw] sm:max-w-4xl max-h-[95vh] p-0 overflow-hidden rounded-2xl border-none">
                <div className="flex flex-col md:grid md:grid-cols-2 h-full overflow-y-auto md:overflow-hidden">
                    {/* Left: Image */}
                    <div className="bg-white p-6 md:p-10 flex items-center justify-center border-r shrink-0">
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
                    <div className="p-5 md:p-10 flex flex-col gap-5 md:gap-6 overflow-y-auto bg-white">
                        <div>
                            <div className="flex flex-wrap items-center gap-2 mb-3">
                                <Badge className="bg-[#0038A8]/10 text-[#0038A8] border-none font-bold">
                                    {product.brand}
                                </Badge>
                                <Badge className="bg-[#D52B1E]/10 text-[#D52B1E] border-none font-bold">
                                    {product.category}
                                </Badge>
                                {product.stock !== undefined && product.stock < 10 && (
                                    <Badge variant="destructive" className="bg-amber-100 text-amber-700 border-none font-bold">
                                        ¡Pocas unidades!
                                    </Badge>
                                )}
                            </div>
                            <DialogTitle className="text-xl md:text-3xl font-black tracking-tight leading-[1.15] mb-2">
                                {product.name}
                            </DialogTitle>
                        </div>

                        <div className="flex items-baseline gap-3 flex-wrap">
                            <span className="text-3xl md:text-4xl font-black text-[#0038A8]">
                                {formatGs(product.priceGs)}
                            </span>
                            {product.price > 0 && (
                                <span className="text-base font-bold text-muted-foreground">
                                    {formatUsd(product.price)}
                                </span>
                            )}
                            <span className="text-[10px] md:text-xs text-muted-foreground uppercase font-bold tracking-widest w-full">
                                IVA Incluido
                            </span>
                        </div>

                        <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                            {product.fullDescription || product.description}
                        </p>

                        <div className="flex flex-col gap-4 mt-2 md:mt-auto">
                            <div className="flex flex-wrap items-center gap-4">
                                <div className="flex items-center border-2 border-muted rounded-full overflow-hidden bg-muted/30">
                                    <button
                                        className="p-2 md:p-3 hover:bg-muted transition-colors"
                                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                    >
                                        <Minus className="h-4 w-4" />
                                    </button>
                                    <span className="w-10 md:w-12 text-center font-bold">{quantity}</span>
                                    <button
                                        className="p-2 md:p-3 hover:bg-muted transition-colors"
                                        onClick={() => setQuantity(q => q + 1)}
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
                                    className="w-full bg-[#0038A8] hover:bg-[#002b80] text-white h-12 md:h-14 rounded-full text-base md:text-lg font-black italic shadow-xl shadow-[#0038A8]/20"
                                    onClick={handleAddToCart}
                                >
                                    <ShoppingCart className="mr-2 h-5 w-5" />
                                    Añadir al Carrito
                                </Button>
                            </motion.div>

                            {product.url && (
                                <a
                                    href={product.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 text-xs font-bold text-[#0038A8] hover:underline"
                                >
                                    <ExternalLink className="h-3.5 w-3.5" />
                                    Ver en ShoppingChina
                                </a>
                            )}
                        </div>

                        <div className="grid grid-cols-3 gap-2 md:gap-4 py-5 border-t mt-2 text-[8px] md:text-[10px] font-bold uppercase tracking-wider text-[#0038A8]/60">
                            <div className="flex flex-col items-center gap-2 text-center">
                                <Truck className="h-5 w-5 md:h-6 md:w-6" />
                                <span>Envío a todo el País</span>
                            </div>
                            <div className="flex flex-col items-center gap-2 text-center">
                                <ShieldCheck className="h-5 w-5 md:h-6 md:w-6" />
                                <span>Garantía Oficial</span>
                            </div>
                            <div className="flex flex-col items-center gap-2 text-center">
                                <RefreshCw className="h-5 w-5 md:h-6 md:w-6" />
                                <span>Devolución Fácil</span>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
