/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowUpRight, Truck, ShieldCheck, MessageCircle } from 'lucide-react';
import { Hero } from '../components/Hero';
import { ProductCard } from '../components/ProductCard';
import { loadProducts, Product } from '../data/products';
import { useStore } from '../store';

const BRANDS = ['Apple', 'Samsung', 'JBL', 'Xiaomi', 'Sony', 'Garmin', 'Motorola', 'Huawei', 'Honor', 'Philips', 'Nintendo', 'Pioneer', 'Spigen', 'Mcdodo', 'Aiwa', 'Funko'];

export default function Home() {
    const [products, setProducts] = useState<Product[]>([]);
    const nav = useNavigate();
    const { addToCart } = useStore();

    useEffect(() => { loadProducts().then(setProducts); }, []);

    const featured = products.slice(0, 6);
    const offers = products.filter((p) => p.discount > 0).slice(0, 4);

    return (
        <>
            <Hero onExplore={() => nav('/catalogo')} />

            {/* Marquee — brand wall, restrained */}
            <div className="border-y border-line py-5 overflow-hidden bg-paper">
                <div className="animate-marquee text-ink-3 text-[13px] font-semibold tracking-[0.25em] uppercase">
                    {[...BRANDS, ...BRANDS].map((b, i) => (
                        <span key={i} className="px-1">{b}</span>
                    ))}
                </div>
            </div>

            {/* Editor's picks — asymmetric editorial composition */}
            {featured.length > 0 && (
                <section className="max-w-[1400px] mx-auto px-5 md:px-8 lg:px-12 py-20 md:py-28">
                    <header className="flex items-end justify-between mb-12 gap-6">
                        <div>
                            <p className="text-eyebrow text-ink-3 mb-3">Selección de la semana</p>
                            <h2 className="text-headline text-ink">Lo nuevo en Vos PY</h2>
                        </div>
                        <Link to="/catalogo" className="hidden md:inline-flex items-center gap-2 text-[13px] font-semibold link-underline">
                            Ver todo <ArrowUpRight className="h-4 w-4" />
                        </Link>
                    </header>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-14 md:gap-y-20">
                        {featured.map((p) => (
                            <ProductCard key={p.id} product={p} onAddToCart={(prod) => addToCart(prod, 1)} />
                        ))}
                    </div>
                </section>
            )}

            {/* Category guide — 3 wide entry tiles, no card-on-card */}
            <section className="border-t border-line bg-paper-2/60">
                <div className="max-w-[1400px] mx-auto px-5 md:px-8 lg:px-12 py-20 md:py-28">
                    <p className="text-eyebrow text-ink-3 mb-3">Por categoría</p>
                    <h2 className="text-headline text-ink mb-12 max-w-2xl">
                        Encontrá rápido lo que estás buscando.
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-line">
                        {[
                            { name: 'Audio', meta: 'Auriculares · parlantes' },
                            { name: 'Celulares', meta: 'iPhone · Samsung · Xiaomi' },
                            { name: 'Smartwatch', meta: 'Garmin · Apple Watch' },
                            { name: 'Gaming', meta: 'Nintendo · accesorios' },
                            { name: 'Accesorios', meta: 'Cables · cargadores' },
                            { name: 'Televisores', meta: 'Smart TV · proyectores' },
                            { name: 'Cámaras', meta: 'Action cams · drones' },
                            { name: 'Computación', meta: 'Notebooks · periféricos' },
                        ].map((c, i) => (
                            <motion.div
                                key={c.name}
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: i * 0.04 }}
                            >
                                <Link
                                    to={`/catalogo?categoria=${encodeURIComponent(c.name)}`}
                                    className="group block bg-paper p-6 h-full hover:bg-paper transition-colors"
                                >
                                    <span className="text-eyebrow text-ink-3">0{i + 1}</span>
                                    <h3 className="text-title text-ink mt-2 group-hover:translate-x-1 transition-transform duration-300 inline-flex items-center gap-2">
                                        {c.name}
                                        <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </h3>
                                    <p className="text-[12px] text-ink-3 mt-1">{c.meta}</p>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Offers — committed dark surface, single block */}
            {offers.length > 0 && (
                <section className="bg-night text-paper">
                    <div className="max-w-[1400px] mx-auto px-5 md:px-8 lg:px-12 py-20 md:py-28">
                        <header className="flex items-end justify-between mb-12 gap-6">
                            <div>
                                <p className="text-eyebrow text-paper/60 mb-3">Edición rebajada</p>
                                <h2 className="text-headline text-paper">Ofertas vigentes</h2>
                            </div>
                            <Link to="/catalogo?ofertas=1" className="hidden md:inline-flex items-center gap-2 text-[13px] font-semibold link-underline">
                                Ver todas <ArrowUpRight className="h-4 w-4" />
                            </Link>
                        </header>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-14">
                            {offers.map((p) => (
                                <ProductCard key={p.id} product={p} onAddToCart={(prod) => addToCart(prod, 1)} dark />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Promise — 3 simple statements, asymmetric */}
            <section className="border-t border-line">
                <div className="max-w-[1400px] mx-auto px-5 md:px-8 lg:px-12 py-20 md:py-24">
                    <div className="grid grid-cols-12 gap-x-6 gap-y-10">
                        <div className="col-span-12 lg:col-span-5">
                            <p className="text-eyebrow text-ink-3 mb-3">El método Vos PY</p>
                            <h2 className="text-headline text-ink max-w-md">
                                Tres certezas antes
                                <br />
                                de cualquier compra.
                            </h2>
                        </div>
                        <div className="col-span-12 lg:col-span-7 grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                { icon: ShieldCheck, t: 'Garantía oficial', d: 'Cobertura directa del fabricante en todos los productos.' },
                                { icon: Truck, t: 'Despacho nacional', d: 'Asunción y Gran Asunción en 24/48 h. Interior por courier.' },
                                { icon: MessageCircle, t: 'Por WhatsApp', d: 'Coordinamos el pago y la entrega de manera directa.' },
                            ].map((f) => (
                                <div key={f.t}>
                                    <f.icon className="h-6 w-6 text-ink mb-4" strokeWidth={1.6} />
                                    <h3 className="text-title text-ink mb-2">{f.t}</h3>
                                    <p className="text-[14px] text-ink-2 leading-relaxed">{f.d}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
