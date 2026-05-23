/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Hero } from '../components/Hero';
import { CategoryFilter } from '../components/CategoryFilter';
import { ProductCard } from '../components/ProductCard';
import { About } from '../components/About';
import { loadProducts, Product } from '../data/products';
import { useStore } from '../store';
import { ArrowRight, ShieldCheck, Truck, CreditCard } from 'lucide-react';

export default function Home() {
    const [products, setProducts] = useState<Product[]>([]);
    const nav = useNavigate();
    const { addToCart } = useStore();

    useEffect(() => { loadProducts().then(setProducts); }, []);

    const featured = products.slice(0, 8);
    const offers = products.filter((p) => p.discount > 0).slice(0, 4);

    return (
        <>
            <Hero onExplore={() => nav('/catalogo')} />

            {/* Marquee of brands */}
            <div className="border-y bg-zinc-50 overflow-hidden">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center gap-10 text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500 whitespace-nowrap animate-marquee">
                        {['Apple', 'Samsung', 'JBL', 'Xiaomi', 'Sony', 'Garmin', 'Motorola', 'Huawei', 'Honor', 'Philips', 'Nintendo', 'Pioneer'].concat(['Apple', 'Samsung', 'JBL', 'Xiaomi', 'Sony', 'Garmin', 'Motorola', 'Huawei']).map((b, i) => (
                            <span key={i}>{b}</span>
                        ))}
                    </div>
                </div>
            </div>

            <CategoryFilter activeCategory="all" onSelect={(c) => nav(c === 'all' ? '/catalogo' : `/catalogo?categoria=${encodeURIComponent(c)}`)} />

            {featured.length > 0 && (
                <section className="py-16 md:py-20 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="flex items-end justify-between mb-10">
                            <div>
                                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#D52B1E]">Destacados</span>
                                <h2 className="text-3xl md:text-4xl font-black tracking-tight mt-1">Los más buscados</h2>
                            </div>
                            <Link
                                to="/catalogo"
                                className="hidden md:flex items-center gap-2 text-sm font-bold text-[#0038A8] hover:gap-3 transition-all"
                            >
                                Ver catálogo <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                            {featured.map((p) => (
                                <ProductCard key={p.id} product={p} onAddToCart={(prod) => addToCart(prod, 1)} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {offers.length > 0 && (
                <section className="py-16 md:py-20 bg-zinc-950 text-white">
                    <div className="container mx-auto px-4">
                        <div className="flex items-end justify-between mb-10">
                            <div>
                                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#D52B1E]">Ofertas</span>
                                <h2 className="text-3xl md:text-4xl font-black tracking-tight mt-1">Bajamos precio</h2>
                            </div>
                            <Link
                                to="/catalogo?ofertas=1"
                                className="hidden md:flex items-center gap-2 text-sm font-bold text-white hover:gap-3 transition-all"
                            >
                                Ver todas <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                            {offers.map((p) => (
                                <ProductCard key={p.id} product={p} onAddToCart={(prod) => addToCart(prod, 1)} dark />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <section className="py-20 border-y bg-zinc-50/60">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
                        {[
                            { icon: ShieldCheck, title: 'Garantía oficial', text: 'Productos con garantía directa del fabricante.' },
                            { icon: Truck, title: 'Envíos a todo Paraguay', text: 'Coordinamos por WhatsApp, llegamos a todo el país.' },
                            { icon: CreditCard, title: 'Pagos seguros', text: 'Múltiples medios de pago, factura legal en cada compra.' },
                        ].map((f) => (
                            <motion.div
                                key={f.title}
                                initial={{ opacity: 0, y: 12 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="flex gap-5"
                            >
                                <div className="h-14 w-14 shrink-0 bg-white rounded-2xl border flex items-center justify-center">
                                    <f.icon className="h-7 w-7 text-[#0038A8]" />
                                </div>
                                <div>
                                    <h3 className="font-bold mb-1">{f.title}</h3>
                                    <p className="text-sm text-muted-foreground">{f.text}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <About />
        </>
    );
}
