/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Button } from './ui/button';
import { motion } from 'motion/react';
import { Truck, ShieldCheck, Sparkles } from 'lucide-react';

export const Hero = ({ onExplore }: { onExplore?: () => void }) => {
    return (
        <section className="relative overflow-hidden bg-zinc-950 text-white">
            {/* Decorative gradient blobs */}
            <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-[#0038A8] opacity-40 blur-3xl" />
            <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-[#D52B1E] opacity-30 blur-3xl" />
            <div className="absolute top-1/2 left-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white opacity-[0.04] blur-3xl" />

            <div className="container relative mx-auto px-6 py-20 md:py-28 lg:py-36">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="max-w-3xl"
                >
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#D52B1E] text-[11px] font-bold uppercase tracking-widest rounded-full mb-6">
                        <Sparkles className="h-3.5 w-3.5" />
                        +1.700 productos importados
                    </span>
                    <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter leading-[0.95] mb-6">
                        Lo último en tecnología,
                        <span className="block bg-gradient-to-r from-[#5b8cff] via-white to-[#ff6b5e] bg-clip-text text-transparent">
                            directo a tu casa en Paraguay
                        </span>
                    </h1>
                    <p className="text-base md:text-xl text-zinc-300 max-w-xl mb-10">
                        Audio, celulares, gaming, smartwatches y mucho más. Precios en guaraníes,
                        garantía oficial y envíos a todo el país.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <Button
                            size="lg"
                            onClick={onExplore}
                            className="bg-[#D52B1E] hover:bg-[#b02318] text-white rounded-full px-10 h-14 text-base font-bold shadow-xl shadow-[#D52B1E]/30"
                        >
                            Explorar catálogo
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="bg-white/10 hover:bg-white/20 text-white border-white/20 rounded-full px-10 h-14 backdrop-blur-md"
                        >
                            Nuestras sucursales
                        </Button>
                    </div>

                    <div className="mt-14 flex flex-wrap gap-8 text-sm">
                        <div className="flex items-center gap-3">
                            <Truck className="h-6 w-6 text-[#5b8cff]" />
                            <span className="font-semibold">Envíos a todo el país</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <ShieldCheck className="h-6 w-6 text-emerald-400" />
                            <span className="font-semibold">Garantía oficial</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Sparkles className="h-6 w-6 text-amber-300" />
                            <span className="font-semibold">Marcas originales</span>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Paraguay flag stripe */}
            <div className="flex h-1.5 w-full">
                <div className="flex-1 bg-[#D52B1E]" />
                <div className="flex-1 bg-white" />
                <div className="flex-1 bg-[#0038A8]" />
            </div>
        </section>
    );
};
