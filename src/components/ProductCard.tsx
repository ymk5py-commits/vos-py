/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Product, formatGs, formatUsd } from '../data/products';
import { Card, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ShoppingCart, ImageOff } from 'lucide-react';
import { motion } from 'motion/react';

interface ProductCardProps {
    product: Product;
    onAddToCart: (product: Product) => void;
    onShowDetail: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onShowDetail }) => {
    const [imgError, setImgError] = useState(false);

    return (
        <motion.div
            whileHover={{ y: -5 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="h-full cursor-pointer group"
            onClick={() => onShowDetail(product)}
        >
            <Card className="h-full flex flex-col overflow-hidden border border-zinc-100 shadow-sm hover:shadow-xl hover:border-[#0038A8]/20 transition-all duration-300 rounded-2xl">
                <div className="relative aspect-square overflow-hidden bg-white p-4">
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
                    <Badge className="absolute top-2 left-2 bg-[#0038A8]/90 text-white border-none font-bold text-[10px]">
                        {product.brand}
                    </Badge>
                    {product.discount > 0 && (
                        <Badge className="absolute top-2 right-2 bg-[#D52B1E] text-white border-none font-bold text-[10px]">
                            -{product.discount}%
                        </Badge>
                    )}
                </div>
                <CardContent className="p-3 md:p-4 flex-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#D52B1E]">
                        {product.category}
                    </span>
                    <h3 className="font-bold text-sm md:text-base line-clamp-2 mb-1 mt-0.5 group-hover:text-[#0038A8] transition-colors min-h-[40px]">
                        {product.name}
                    </h3>
                    <p className="text-[10px] md:text-xs text-muted-foreground line-clamp-2 hidden sm:block">
                        {product.description}
                    </p>
                </CardContent>
                <CardFooter className="p-3 md:p-4 pt-0 flex flex-col gap-2 md:gap-3">
                    <div className="w-full">
                        {product.discount > 0 && product.listGs > product.priceGs && (
                            <span className="block text-xs text-zinc-400 line-through leading-none">
                                {formatGs(product.listGs)}
                            </span>
                        )}
                        <span className={`block text-lg md:text-2xl font-black leading-tight ${product.discount > 0 ? 'text-[#D52B1E]' : 'text-[#0038A8]'}`}>
                            {formatGs(product.priceGs)}
                        </span>
                        {product.price > 0 && (
                            <span className="text-[11px] text-muted-foreground font-semibold">
                                {formatUsd(product.price)}
                            </span>
                        )}
                    </div>
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full"
                    >
                        <Button
                            className="w-full bg-[#0038A8] hover:bg-[#002b80] text-white transition-all duration-300 h-9 md:h-10 rounded-full font-bold text-xs md:text-sm"
                            onClick={(e) => {
                                e.stopPropagation();
                                onAddToCart(product);
                            }}
                        >
                            <ShoppingCart className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
                            Añadir
                        </Button>
                    </motion.div>
                </CardFooter>
            </Card>
        </motion.div>
    );
};
