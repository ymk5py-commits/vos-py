/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Package, ShieldCheck, Truck, HeartHandshake } from 'lucide-react';

const stats = [
    { value: '+1.700', label: 'Productos en catálogo' },
    { value: '9', label: 'Categorías' },
    { value: '24/48h', label: 'Tiempo de envío' },
    { value: '100%', label: 'Garantía oficial' },
];

const values = [
    {
        icon: Package,
        title: 'Catálogo real y completo',
        text: 'Más de 1.700 productos importados de electrónica: audio, celulares, gaming, smartwatches, accesorios y más, con precios en guaraníes.',
    },
    {
        icon: ShieldCheck,
        title: 'Garantía y originalidad',
        text: 'Trabajamos solo con marcas originales y productos con garantía oficial del fabricante. Comprás con tranquilidad.',
    },
    {
        icon: Truck,
        title: 'Envíos a todo Paraguay',
        text: 'Llegamos a cada rincón del país de forma rápida y segura, con seguimiento de tu pedido de principio a fin.',
    },
    {
        icon: HeartHandshake,
        title: 'Atención cercana',
        text: 'Te asesoramos por WhatsApp antes y después de tu compra. Estamos para ayudarte a elegir lo mejor.',
    },
];

export const About = () => {
    return (
        <section id="nosotros" className="py-20 scroll-mt-24 bg-white">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-3xl mb-14"
                >
                    <span className="inline-block px-4 py-1.5 bg-[#0038A8]/10 text-[#0038A8] text-[11px] font-bold uppercase tracking-widest rounded-full mb-5">
                        Sobre el proyecto
                    </span>
                    <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-6 leading-[1.05]">
                        Vos PY — tu tienda de importados en Paraguay
                    </h2>
                    <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                        Vos PY es una tienda online de electrónica importada pensada para el
                        mercado paraguayo. Reunimos un catálogo de más de 1.700 productos de las
                        mejores marcas —JBL, Samsung, Apple, Xiaomi, Sony, Garmin y muchas más—
                        con descripciones detalladas, fotos reales y precios transparentes en
                        guaraníes. Nuestro objetivo es que comprar tecnología sea simple,
                        confiable y rápido, con garantía oficial y envíos a todo el país.
                    </p>
                </motion.div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-16">
                    {stats.map((s) => (
                        <div key={s.label} className="rounded-2xl border bg-zinc-50/60 p-6 text-center">
                            <p className="text-3xl md:text-4xl font-black text-[#0038A8]">{s.value}</p>
                            <p className="text-xs md:text-sm text-muted-foreground font-semibold mt-1">
                                {s.label}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {values.map((v) => (
                        <motion.div
                            key={v.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="flex gap-5 rounded-2xl border p-6 hover:shadow-lg transition-shadow"
                        >
                            <div className="h-12 w-12 shrink-0 rounded-xl bg-[#0038A8]/10 flex items-center justify-center">
                                <v.icon className="h-6 w-6 text-[#0038A8]" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg mb-1">{v.title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">{v.text}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
