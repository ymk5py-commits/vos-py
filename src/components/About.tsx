/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';

const stats = [
    { value: '1.784', label: 'Productos' },
    { value: '80+',   label: 'Marcas' },
    { value: '24/48h', label: 'Despacho' },
    { value: '100%',  label: 'Garantía oficial' },
];

const principles = [
    { n: '01', t: 'Catálogo real, no inflado', d: 'Cada producto del catálogo tiene foto real, descripción detallada y stock verificado. No publicamos lo que no podemos entregar.' },
    { n: '02', t: 'Precio claro, sin sorpresas', d: 'Mostrado en guaraníes con IVA incluido. El costo de envío y cualquier cargo adicional se confirman antes de pagar.' },
    { n: '03', t: 'Marcas originales', d: 'Trabajamos con productos oficiales y garantía directa del fabricante. Si no es original, no entra.' },
    { n: '04', t: 'Acompañamos la compra', d: 'Atendemos por WhatsApp antes y después de la entrega. Si algo sale mal, lo resolvemos.' },
];

export const About = () => {
    return (
        <section id="nosotros" className="bg-paper scroll-mt-24">
            <div className="max-w-[1400px] mx-auto px-5 md:px-8 lg:px-12 py-20 md:py-32">
                {/* Editorial intro */}
                <div className="grid grid-cols-12 gap-x-6 gap-y-10 mb-20 md:mb-28">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className="col-span-12 lg:col-span-7"
                    >
                        <p className="text-eyebrow text-ink-3 mb-5">Manifiesto · Edición 2026</p>
                        <h2 className="text-display-m text-ink mb-8">
                            Tecnología sin
                            <br />
                            traducciones raras.
                        </h2>
                        <p className="text-[16px] md:text-[17px] text-ink-2 leading-[1.75] max-w-xl">
                            Vos PY nació para que comprar electrónica importada en Paraguay sea
                            una experiencia simple, transparente y cercana. Nos especializamos en
                            audio, celulares, gaming y smartwatches de las marcas que la gente
                            reconoce. Trabajamos con stock real, precios en guaraníes y atención
                            por WhatsApp.
                        </p>
                    </motion.div>
                    <motion.aside
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                        className="col-span-12 lg:col-span-5 lg:pl-8 lg:border-l border-line"
                    >
                        <dl className="grid grid-cols-2 gap-y-8">
                            {stats.map((s) => (
                                <div key={s.label}>
                                    <dt className="text-eyebrow text-ink-3 mb-2">{s.label}</dt>
                                    <dd className="text-[40px] font-bold tabular text-ink leading-none">{s.value}</dd>
                                </div>
                            ))}
                        </dl>
                    </motion.aside>
                </div>

                {/* Principles — numbered, no cards */}
                <div className="border-t border-line">
                    <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-line">
                        {principles.map((p) => (
                            <motion.article
                                key={p.n}
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                className="py-12 md:py-14 md:px-12 first:md:pl-0 last:md:pr-0"
                            >
                                <span className="text-eyebrow text-ink-3 tabular">{p.n}</span>
                                <h3 className="text-title text-ink mt-2 mb-3">{p.t}</h3>
                                <p className="text-[14px] text-ink-2 leading-relaxed max-w-md">{p.d}</p>
                            </motion.article>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};
