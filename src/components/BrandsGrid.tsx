/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Grid de marcas estilo retail PY (Nissei). Logos en tipografía, sin assets
 * externos, para mantener performance y CSP estrictas.
 */

import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

const BRANDS = [
    { name: 'Apple',    family: 'serif' as const },
    { name: 'Samsung',  family: 'sans' as const },
    { name: 'JBL',      family: 'sans' as const, weight: 900 },
    { name: 'Xiaomi',   family: 'sans' as const, weight: 700 },
    { name: 'Sony',     family: 'sans' as const, weight: 800 },
    { name: 'Garmin',   family: 'sans' as const, weight: 700 },
    { name: 'Nintendo', family: 'sans' as const, weight: 700 },
    { name: 'Motorola', family: 'sans' as const, weight: 600 },
    { name: 'Huawei',   family: 'sans' as const, weight: 600 },
    { name: 'Honor',    family: 'sans' as const, weight: 700 },
    { name: 'Philips',  family: 'sans' as const, weight: 600 },
    { name: 'Pioneer',  family: 'sans' as const, weight: 700 },
];

export const BrandsGrid = () => {
    return (
        <section className="border-y border-line bg-paper">
            <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 py-10 md:py-12">
                <header className="flex items-end justify-between mb-6">
                    <div>
                        <p className="text-eyebrow text-ink-3 mb-1">Marcas oficiales</p>
                        <h2 className="text-[20px] md:text-[22px] font-extrabold tracking-tight text-ink">
                            Las marcas que importamos
                        </h2>
                    </div>
                </header>
                <ul className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-px bg-line border border-line">
                    {BRANDS.map((b, i) => (
                        <motion.li
                            key={b.name}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.3, delay: i * 0.02 }}
                        >
                            <Link
                                to={`/catalogo?marca=${encodeURIComponent(b.name)}`}
                                className="block bg-paper h-20 md:h-24 flex items-center justify-center text-ink-2 hover:text-py-red hover:bg-paper-2 transition-colors group"
                                aria-label={`Ver productos ${b.name}`}
                            >
                                <span
                                    className="text-[15px] md:text-[18px] tracking-tight"
                                    style={{
                                        fontWeight: b.weight ?? 700,
                                        fontFamily: b.family === 'serif' ? 'Georgia, serif' : 'inherit',
                                    }}
                                >
                                    {b.name}
                                </span>
                            </Link>
                        </motion.li>
                    ))}
                </ul>
            </div>
        </section>
    );
};
