/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

export const Hero = ({ onExplore }: { onExplore?: () => void }) => {
    return (
        <section className="relative bg-paper">
            <div className="max-w-[1400px] mx-auto px-5 md:px-8 lg:px-12 pt-12 pb-20 md:pt-20 md:pb-32">
                <div className="grid grid-cols-12 gap-x-6 gap-y-10 items-end">
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                        className="col-span-12 lg:col-span-8"
                    >
                        <p className="text-eyebrow text-ink-3 mb-6">N.º 1 · Edición Otoño · Asunción</p>
                        <h1 className="text-display-l text-ink">
                            Tecnología
                            <br />
                            que llega
                            <br />
                            <span className="relative inline-block">
                                a tu puerta<span className="text-py-red">.</span>
                            </span>
                        </h1>
                        <p className="text-body text-ink-2 mt-8 max-w-xl">
                            Mil setecientos productos importados, en guaraníes, con
                            garantía oficial. Curado por nosotros. Coordinado por WhatsApp.
                        </p>

                        <div className="flex flex-wrap items-center gap-5 mt-10">
                            <Link
                                to="/catalogo"
                                onClick={onExplore}
                                className="group inline-flex items-center gap-3 bg-ink text-paper rounded-full pl-7 pr-2 h-13 font-semibold text-[15px] hover:bg-ink/90 transition-colors"
                                style={{ height: 52 }}
                            >
                                Entrar al catálogo
                                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-paper text-ink transition-transform duration-300 group-hover:translate-x-0.5">
                                    <ArrowRight className="h-4 w-4" />
                                </span>
                            </Link>
                            <Link
                                to="/catalogo?ofertas=1"
                                className="text-[15px] font-semibold text-ink link-underline"
                            >
                                Ver ofertas de la semana
                            </Link>
                        </div>
                    </motion.div>

                    {/* Side meta — editorial sidebar */}
                    <motion.aside
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                        className="col-span-12 lg:col-span-4 lg:pl-8 lg:border-l border-line lg:self-stretch flex flex-col justify-end gap-8"
                    >
                        <Stat eyebrow="Catálogo" value="1.784" suffix="productos" />
                        <Stat eyebrow="Marcas" value="80+" suffix="originales" />
                        <Stat eyebrow="Despacho" value="24/48h" suffix="Asunción y GA" />
                        <p className="text-caption text-ink-3 text-[13px] leading-relaxed">
                            Pagás por transferencia o billetera digital. Factura legal
                            en cada operación. Garantía oficial del fabricante.
                        </p>
                    </motion.aside>
                </div>
            </div>
        </section>
    );
};

const Stat = ({ eyebrow, value, suffix }: { eyebrow: string; value: string; suffix: string }) => (
    <div className="flex items-baseline justify-between gap-4 border-b border-line pb-3 last:border-b-0">
        <p className="text-eyebrow text-ink-3">{eyebrow}</p>
        <p className="text-ink">
            <span className="tabular text-2xl font-bold">{value}</span>{' '}
            <span className="text-[13px] text-ink-2">{suffix}</span>
        </p>
    </div>
);
