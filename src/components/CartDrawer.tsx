/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Product, formatGs } from '../data/products';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';
import { ScrollArea } from './ui/scroll-area';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    items: { product: Product; quantity: number }[];
    onUpdateQuantity: (productId: string, delta: number) => void;
    onRemoveItem: (productId: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
    isOpen, onClose, items, onUpdateQuantity, onRemoveItem,
}) => {
    const subtotal = items.reduce((a, b) => a + b.product.priceGs * b.quantity, 0);
    const count = items.reduce((a, b) => a + b.quantity, 0);

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="w-full sm:max-w-md flex flex-col p-0 border-l border-line bg-paper">
                <SheetHeader className="px-5 sm:px-6 pt-6 pb-5 border-b border-line">
                    <SheetTitle className="flex items-baseline gap-3">
                        <ShoppingBag className="h-5 w-5 text-ink" strokeWidth={1.6} />
                        <span className="text-title text-ink">Tu carrito</span>
                        {count > 0 && (
                            <span className="text-eyebrow text-ink-3 tabular">
                                {count === 1 ? '1 producto' : `${count} productos`}
                            </span>
                        )}
                    </SheetTitle>
                </SheetHeader>

                <ScrollArea className="flex-1">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6 space-y-4">
                            <div className="h-14 w-14 bg-paper-2 flex items-center justify-center">
                                <ShoppingBag className="h-6 w-6 text-ink-3" strokeWidth={1.4} />
                            </div>
                            <p className="text-eyebrow text-ink-3">Carrito vacío</p>
                            <h3 className="text-title text-ink">Sin productos por ahora</h3>
                            <p className="text-sm text-ink-2 max-w-xs">
                                Explorá el catálogo y agregá lo que quieras llevar.
                            </p>
                            <button
                                onClick={onClose}
                                className="mt-4 inline-flex items-center gap-2 bg-ink text-paper h-11 px-6 font-semibold text-[13px] hover:bg-ink/90 transition-colors"
                            >
                                Explorar catálogo
                            </button>
                        </div>
                    ) : (
                        <ul className="divide-y divide-line">
                            <AnimatePresence mode="popLayout" initial={false}>
                                {items.map((item) => (
                                    <motion.li
                                        key={item.product.id}
                                        layout
                                        initial={{ opacity: 0, x: 12 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -12 }}
                                        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                                        className="px-5 sm:px-6 py-5 flex gap-4"
                                    >
                                        <Link
                                            to={`/producto/${item.product.id}`}
                                            onClick={onClose}
                                            className="block w-20 h-20 bg-paper-2 shrink-0"
                                        >
                                            <img
                                                src={item.product.image}
                                                alt={item.product.name}
                                                loading="lazy"
                                                className="w-full h-full object-contain p-2"
                                            />
                                        </Link>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <Link
                                                    to={`/producto/${item.product.id}`}
                                                    onClick={onClose}
                                                    className="block min-w-0 flex-1"
                                                >
                                                    <p className="text-eyebrow text-ink-3 mb-0.5 truncate">{item.product.brand}</p>
                                                    <h4 className="text-[13px] font-semibold text-ink line-clamp-2 leading-tight">
                                                        {item.product.name.toLowerCase().replace(/(^|\s)\S/g, (c) => c.toUpperCase())}
                                                    </h4>
                                                </Link>
                                                <button
                                                    onClick={() => onRemoveItem(item.product.id)}
                                                    aria-label="Quitar del carrito"
                                                    className="h-8 w-8 shrink-0 flex items-center justify-center text-ink-3 hover:text-py-red"
                                                >
                                                    <Trash2 className="h-4 w-4" strokeWidth={1.6} />
                                                </button>
                                            </div>
                                            <div className="flex items-end justify-between mt-3 gap-2">
                                                <div className="flex items-center border border-line">
                                                    <button
                                                        onClick={() => onUpdateQuantity(item.product.id, -1)}
                                                        aria-label="Disminuir"
                                                        className="h-9 w-9 flex items-center justify-center hover:bg-paper-2"
                                                    >
                                                        <Minus className="h-3.5 w-3.5" strokeWidth={2} />
                                                    </button>
                                                    <span className="w-9 text-center text-[13px] font-semibold tabular">{item.quantity}</span>
                                                    <button
                                                        onClick={() => onUpdateQuantity(item.product.id, 1)}
                                                        aria-label="Aumentar"
                                                        className="h-9 w-9 flex items-center justify-center hover:bg-paper-2"
                                                    >
                                                        <Plus className="h-3.5 w-3.5" strokeWidth={2} />
                                                    </button>
                                                </div>
                                                <p className="text-[14px] font-bold tabular text-ink whitespace-nowrap">
                                                    {formatGs(item.product.priceGs * item.quantity)}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.li>
                                ))}
                            </AnimatePresence>
                        </ul>
                    )}
                </ScrollArea>

                {items.length > 0 && (
                    <div className="px-5 sm:px-6 py-5 bg-paper border-t border-line space-y-4">
                        <dl className="space-y-1.5 text-[13px]">
                            <div className="flex justify-between"><dt className="text-ink-3">Subtotal</dt><dd className="tabular text-ink">{formatGs(subtotal)}</dd></div>
                            <div className="flex justify-between"><dt className="text-ink-3">Envío</dt><dd className="text-emerald-700 font-semibold">a coordinar</dd></div>
                        </dl>
                        <div className="border-t border-line pt-3 flex justify-between items-baseline">
                            <dt className="text-eyebrow text-ink-3">Total</dt>
                            <dd className="text-2xl font-bold tabular text-ink">{formatGs(subtotal)}</dd>
                        </div>
                        <Link
                            to="/checkout"
                            onClick={onClose}
                            className="group inline-flex items-center justify-between gap-3 bg-ink text-paper w-full pl-6 pr-2 h-13 font-bold text-[14px] hover:bg-ink/90 transition-colors"
                            style={{ height: 52 }}
                        >
                            <span>Finalizar compra</span>
                            <span className="flex items-center justify-center w-10 h-10 bg-paper text-ink">
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2} />
                            </span>
                        </Link>
                        <p className="text-[10px] text-center text-ink-3 font-bold uppercase tracking-widest">
                            Pago seguro · 24/48 h · Garantía oficial
                        </p>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
};
