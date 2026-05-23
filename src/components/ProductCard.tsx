/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Product, formatGs, formatUsd } from '../data/products';
import { Card, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Plus, ImageOff } from 'lucide-react';
import { motion } from 'motion/react';

interface ProductCardProps {
    product: Product;
    onAddToCart: (product: Product) => void;
    dark?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, dark = false }) => {
    const [imgError, setImgError] = useState(false);

    return (
        <motion.div
            whileHover={{ y: -4 }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="h-full group"
        >
            <Link to={`/producto/${product.id}`} className="block h-full">
                <Card className={`h-full flex flex-col overflow-hidden border ${dark ? 'border-white/10 bg-white/5 hover:bg-white/[0.07]' : 'border-zinc-100 bg-white hover:border-[#0038A8]/20'} shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl`}>
                    <div className={`relative aspect-square overflow-hidden ${dark ? 'bg-white' : 'bg-white'} p-4`}>
                        {imgError ? (
                            <div className="h-full w-full flex flex-col items-center justify-center text-zinc-300 gap-2 bg-zinc-50 rounded-xl">
                                <ImageOff className="h-10 w-10" />
                                <span className="text-[10px] font-bold uppercase tracking-wider">Sin imagen</span>
                            </div>
                        ) : (
                            <img
                                src={product.image}
                                alt={product.name}
                                loading="lazy"
                                onError={() => setImgError(true)}
                                className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                            />
                        )}
                        <Badge className={`absolute top-3 left-3 ${dark ? 'bg-white/90 text-zinc-950' : 'bg-zinc-950/85 text-white'} border-none font-bold text-[10px] tracking-wider uppercase`}>
                            {product.brand}
                        </Badge>
                        {product.discount > 0 && (
                            <Badge className="absolute top-3 right-3 bg-[#D52B1E] text-white border-none font-bold text-[10px]">
                                -{product.discount}%
                            </Badge>
                        )}
                    </div>
                    <CardContent className="p-4 flex-1">
                        <span className={`text-[10px] font-bold uppercase tracking-[0.18em] ${dark ? 'text-[#ff6b5e]' : 'text-[#D52B1E]'}`}>
                            {product.category}
                        </span>
                        <h3 className={`font-bold text-sm md:text-[15px] line-clamp-2 mt-1 ${dark ? 'text-white group-hover:text-white/90' : 'text-zinc-900 group-hover:text-[#0038A8]'} transition-colors min-h-[42px] leading-snug`}>
                            {product.name}
                        </h3>
                    </CardContent>
                    <CardFooter className="p-4 pt-0 flex items-end justify-between gap-3">
                        <div>
                            {product.discount > 0 && product.listGs > product.priceGs && (
                                <span className={`block text-[11px] line-through leading-none ${dark ? 'text-zinc-500' : 'text-zinc-400'}`}>
                                    {formatGs(product.listGs)}
                                </span>
                            )}
                            <span className={`block text-lg md:text-2xl font-black leading-tight ${product.discount > 0 ? (dark ? 'text-[#ff6b5e]' : 'text-[#D52B1E]') : (dark ? 'text-white' : 'text-[#0038A8]')}`}>
                                {formatGs(product.priceGs)}
                            </span>
                            {product.price > 0 && (
                                <span className={`text-[10px] font-semibold ${dark ? 'text-zinc-400' : 'text-muted-foreground'}`}>
                                    {formatUsd(product.price)}
                                </span>
                            )}
                        </div>
                        <Button
                            size="icon"
                            aria-label={`Agregar ${product.name} al carrito`}
                            className={`h-10 w-10 rounded-full shrink-0 ${dark ? 'bg-white text-zinc-950 hover:bg-zinc-200' : 'bg-zinc-950 hover:bg-zinc-800 text-white'} transition-all`}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onAddToCart(product);
                            }}
                        >
                            <Plus className="h-5 w-5" />
                        </Button>
                    </CardFooter>
                </Card>
            </Link>
        </motion.div>
    );
};
