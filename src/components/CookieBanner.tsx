/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { X } from 'lucide-react';

const KEY = 'vospy_cookie_consent_v1';

export const CookieBanner = () => {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const v = localStorage.getItem(KEY);
        if (!v) setOpen(true);
    }, []);

    const set = (value: 'all' | 'essential') => {
        try {
            localStorage.setItem(KEY, JSON.stringify({ value, ts: Date.now() }));
        } catch { /* ignore */ }
        setOpen(false);
    };

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ y: 80, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 80, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 280, damping: 28 }}
                    role="dialog"
                    aria-label="Aviso de cookies"
                    className="fixed inset-x-3 bottom-3 md:inset-x-auto md:left-6 md:bottom-6 md:max-w-md z-[60] bg-zinc-950 text-white rounded-2xl shadow-2xl border border-white/10 p-5"
                >
                    <button
                        onClick={() => set('essential')}
                        aria-label="Cerrar"
                        className="absolute top-3 right-3 text-zinc-400 hover:text-white"
                    >
                        <X className="h-4 w-4" />
                    </button>
                    <p className="text-sm leading-relaxed pr-6">
                        Usamos cookies propias y de terceros para que el sitio funcione, analizar el uso y
                        mostrarte ofertas relevantes. Más info en{' '}
                        <Link to="/cookies" className="underline font-semibold">
                            Política de Cookies
                        </Link>.
                    </p>
                    <div className="flex gap-2 mt-4">
                        <Button
                            onClick={() => set('all')}
                            className="bg-white text-zinc-950 hover:bg-zinc-200 rounded-full px-5 h-9 text-xs font-bold"
                        >
                            Aceptar todas
                        </Button>
                        <Button
                            onClick={() => set('essential')}
                            variant="outline"
                            className="border-white/20 bg-transparent text-white hover:bg-white/10 rounded-full px-5 h-9 text-xs font-bold"
                        >
                            Rechazar opcionales
                        </Button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
