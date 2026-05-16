/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Product, formatGs } from '../data/products';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetFooter,
} from './ui/sheet';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    items: { product: Product, quantity: number }[];
    onUpdateQuantity: (productId: string, delta: number) => void;
    onRemoveItem: (productId: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
    isOpen,
    onClose,
    items,
    onUpdateQuantity,
    onRemoveItem
}) => {
    const total = items.reduce((acc, item) => acc + item.product.priceGs * item.quantity, 0);

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="w-full sm:max-w-md flex flex-col p-0 border-none">
                <SheetHeader className="p-6 border-b">
                    <SheetTitle className="flex items-center gap-2 text-2xl font-black italic text-[#0038A8]">
                        <ShoppingBag className="h-6 w-6" />
                        TU CARRITO
                    </SheetTitle>
                </SheetHeader>

                <ScrollArea className="flex-1 p-6">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
                            <div className="bg-muted p-6 rounded-full">
                                <ShoppingBag className="h-12 w-12 text-[#0038A8]/40" />
                            </div>
                            <h3 className="text-xl font-bold">Tu carrito está vacío</h3>
                            <p className="text-muted-foreground">¡Agrega algo increíble para empezar!</p>
                            <Button variant="outline" onClick={onClose} className="rounded-full px-8">
                                Explorar Tienda
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <AnimatePresence mode="popLayout">
                                {items.map((item) => (
                                    <motion.div
                                        key={item.product.id}
                                        layout
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="flex gap-4"
                                    >
                                        <div className="h-24 w-24 rounded-xl overflow-hidden bg-muted shrink-0 shadow-inner">
                                            <img
                                                src={item.product.image}
                                                alt={item.product.name}
                                                className="h-full w-full object-contain p-1 bg-white"
                                            />
                                        </div>
                                        <div className="flex flex-col flex-1 gap-1">
                                            <div className="flex justify-between items-start">
                                                <h4 className="font-bold text-sm leading-tight line-clamp-2 pr-2">
                                                    {item.product.name}
                                                </h4>
                                                <button 
                                                    onClick={() => onRemoveItem(item.product.id)}
                                                    className="text-muted-foreground hover:text-[#D52B1E] transition-colors"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                            <p className="text-xs text-muted-foreground italic mb-2">
                                                Unidad: {formatGs(item.product.priceGs)}
                                            </p>
                                            <div className="flex justify-between items-center mt-auto">
                                                <div className="flex items-center border rounded-full bg-muted/50 p-1">
                                                    <button 
                                                        className="p-1 hover:bg-white rounded-full transition-colors"
                                                        onClick={() => onUpdateQuantity(item.product.id, -1)}
                                                    >
                                                        <Minus className="h-3 w-3" />
                                                    </button>
                                                    <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                                                    <button 
                                                        className="p-1 hover:bg-white rounded-full transition-colors"
                                                        onClick={() => onUpdateQuantity(item.product.id, 1)}
                                                    >
                                                        <Plus className="h-3 w-3" />
                                                    </button>
                                                </div>
                                                <span className="font-black text-[#0038A8]">
                                                    {formatGs(item.product.priceGs * item.quantity)}
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </ScrollArea>

                {items.length > 0 && (
                    <div className="p-6 bg-zinc-50 border-t space-y-4">
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span className="font-bold">{formatGs(total)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Envío</span>
                                <span className="text-emerald-600 font-bold">¡GRATIS!</span>
                            </div>
                            <Separator className="my-2" />
                            <div className="flex justify-between text-xl font-black">
                                <span>TOTAL</span>
                                <span className="text-[#0038A8]">{formatGs(total)}</span>
                            </div>
                        </div>
                        <Button 
                            className="w-full h-14 bg-[#0038A8] hover:bg-[#002b80] text-white rounded-full text-lg font-black italic shadow-xl shadow-[#0038A8]/20 group"
                        >
                            PROCEDER AL PAGO
                            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                        </Button>
                        <p className="text-[10px] text-center text-muted-foreground font-bold uppercase tracking-widest">
                            Pagos Seguros • Envíos en 24/48hs • Garantía Vos PY
                        </p>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
};
