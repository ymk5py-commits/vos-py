/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Add-to-cart toast. Replaces the disruptive auto-opening drawer with a
 * calm confirmation that auto-dismisses, with a shortcut to the cart.
 */

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, ShoppingBag, X } from 'lucide-react';
import { useStore } from '../store';

const EASE = [0.22, 1, 0.36, 1] as const;
const DURATION_MS = 3200;

const titleCase = (s: string) =>
    s.toLowerCase().replace(/(^|\s)\S/g, (c) => c.toUpperCase());

export const Toaster = () => {
    const { toast, dismissToast, openCart, cartCount } = useStore();
    const timer = useRef<number | null>(null);

    useEffect(() => {
        if (!toast) return;
        if (timer.current) window.clearTimeout(timer.current);
        timer.current = window.setTimeout(dismissToast, DURATION_MS);
        return () => { if (timer.current) window.clearTimeout(timer.current); };
    }, [toast, dismissToast]);

    return (
        <div className="fixed z-[70] top-[calc(env(safe-area-inset-top)+16px)] right-4 md:right-6 left-4 md:left-auto md:w-[360px] pointer-events-none">
            <AnimatePresence>
                {toast && (
                    <motion.div
                        key={toast.id}
                        initial={{ opacity: 0, y: -16, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -12, scale: 0.98 }}
                        transition={{ duration: 0.32, ease: EASE }}
                        className="pointer-events-auto bg-ink text-paper shadow-2xl shadow-ink/20 overflow-hidden"
                        role="status"
                        aria-live="polite"
                    >
                        <div className="flex items-start gap-3 p-4">
                            <span className="mt-0.5 h-7 w-7 shrink-0 rounded-full bg-emerald-500 text-ink flex items-center justify-center">
                                <Check className="h-4 w-4" strokeWidth={3} />
                            </span>
                            <div className="flex-1 min-w-0">
                                <p className="text-eyebrow text-paper/60 mb-0.5">Agregado al carrito</p>
                                <p className="text-[13px] font-semibold leading-snug line-clamp-2">
                                    {titleCase(toast.name)}
                                </p>
                            </div>
                            <button
                                onClick={dismissToast}
                                aria-label="Cerrar"
                                className="shrink-0 h-7 w-7 -mt-1 -mr-1 flex items-center justify-center text-paper/50 hover:text-paper transition-colors"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                        <button
                            onClick={() => { dismissToast(); openCart(); }}
                            className="w-full flex items-center justify-center gap-2 h-11 bg-paper/10 hover:bg-paper/15 text-[12px] font-bold uppercase tracking-wider transition-colors"
                        >
                            <ShoppingBag className="h-3.5 w-3.5" strokeWidth={2.2} />
                            Ver carrito
                            <span className="tabular text-paper/60">({cartCount})</span>
                        </button>
                        {/* Progress bar */}
                        <motion.div
                            key={`p-${toast.id}`}
                            initial={{ scaleX: 1 }}
                            animate={{ scaleX: 0 }}
                            transition={{ duration: DURATION_MS / 1000, ease: 'linear' }}
                            style={{ transformOrigin: 'left' }}
                            className="h-0.5 bg-emerald-500"
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
