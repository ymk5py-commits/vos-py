/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Floating WhatsApp button. Visible en todas las páginas excepto checkout
 * y confirmación de orden (esas ya tienen su propio CTA WA).
 *
 * Cambiá WHATSAPP_NUMBER en src/lib/order.ts para que el chat se abra
 * directo con el número del negocio en vez de wa.me share.
 */

import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { WHATSAPP_NUMBER } from '../lib/order';

const DEFAULT_MSG = 'Hola, vengo de vos-py.vercel.app y quería hacer una consulta.';

const buildHref = (msg: string) => {
    const text = encodeURIComponent(msg);
    return WHATSAPP_NUMBER
        ? `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`
        : `https://wa.me/?text=${text}`;
};

// Mobile-only paths where the sticky action bar would collide with the FAB.
// Desktop keeps the FAB visible everywhere.
const HIDDEN_PATHS_MOBILE = [/^\/checkout/, /^\/producto\//];
const HIDDEN_PATHS_ALWAYS = [/^\/orden\//];

export const WhatsAppFAB = () => {
    const { pathname } = useLocation();
    const hiddenAlways = HIDDEN_PATHS_ALWAYS.some((re) => re.test(pathname));
    const hiddenMobile = HIDDEN_PATHS_MOBILE.some((re) => re.test(pathname));
    const [labelOpen, setLabelOpen] = useState(false);
    const [reduced, setReduced] = useState(false);

    useEffect(() => {
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
        const apply = () => setReduced(mq.matches);
        apply();
        mq.addEventListener('change', apply);
        return () => mq.removeEventListener('change', apply);
    }, []);

    // Hint label peeks once after the page settles.
    useEffect(() => {
        if (hiddenAlways || reduced) return;
        const t1 = window.setTimeout(() => setLabelOpen(true), 1800);
        const t2 = window.setTimeout(() => setLabelOpen(false), 6800);
        return () => { window.clearTimeout(t1); window.clearTimeout(t2); };
    }, [hiddenAlways, reduced, pathname]);

    if (hiddenAlways) return null;

    return (
        <div
            className={`fixed z-[55] right-4 md:right-6 bottom-[calc(env(safe-area-inset-bottom)+16px)] md:bottom-6 flex items-center gap-3 flex-row-reverse ${hiddenMobile ? 'hidden md:flex' : 'flex'}`}
            onMouseEnter={() => setLabelOpen(true)}
            onMouseLeave={() => setLabelOpen(false)}
        >
            <a
                href={buildHref(DEFAULT_MSG)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Consultar por WhatsApp"
                className="group relative inline-flex h-14 w-14 md:h-14 md:w-14 items-center justify-center rounded-full bg-emerald-600 text-paper shadow-[0_10px_30px_-8px_rgba(16,185,129,0.5)] hover:bg-emerald-700 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2"
            >
                {/* Subtle pulse halo — calm, not annoying */}
                {!reduced && (
                    <span aria-hidden="true" className="absolute inset-0 rounded-full bg-emerald-500/40 motion-safe:animate-ping" style={{ animationDuration: '2.4s' }} />
                )}
                <svg viewBox="0 0 24 24" className="relative h-6 w-6" fill="currentColor" aria-hidden="true">
                    <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.945C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 018.413 3.488 11.82 11.82 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.978-1.042zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
            </a>

            <AnimatePresence>
                {labelOpen && (
                    <motion.span
                        initial={{ opacity: 0, x: 8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 8 }}
                        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                        className="hidden sm:block bg-ink text-paper text-[12px] font-semibold px-3 py-2 rounded-md shadow-lg whitespace-nowrap select-none pointer-events-none"
                    >
                        Consultanos por WhatsApp
                    </motion.span>
                )}
            </AnimatePresence>
        </div>
    );
};
