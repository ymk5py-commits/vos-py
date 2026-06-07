/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Cuenta ascendente al entrar en viewport. Respeta reduced-motion.
 */

import { useEffect, useRef, useState } from 'react';

interface Props {
    to: number;
    duration?: number;
    prefix?: string;
    suffix?: string;
    /** Formatea con separador de miles es-PY (ej. 1.784). */
    thousands?: boolean;
    className?: string;
}

const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

export const CountUp = ({ to, duration = 1400, prefix = '', suffix = '', thousands = false, className }: Props) => {
    const [value, setValue] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const started = useRef(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduced) { setValue(to); return; }

        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && !started.current) {
                    started.current = true;
                    const start = performance.now();
                    const tick = (now: number) => {
                        const p = Math.min(1, (now - start) / duration);
                        setValue(Math.round(to * easeOutQuart(p)));
                        if (p < 1) requestAnimationFrame(tick);
                    };
                    requestAnimationFrame(tick);
                }
            });
        }, { threshold: 0.4 });

        io.observe(el);
        return () => io.disconnect();
    }, [to, duration]);

    const display = thousands ? value.toLocaleString('es-PY') : String(value);
    return <span ref={ref} className={className}>{prefix}{display}{suffix}</span>;
};
