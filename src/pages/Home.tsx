/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
    ArrowUpRight, Truck, ShieldCheck, MessageCircle, CreditCard,
    Headphones, Smartphone, Watch, Gamepad2, Cable, Tv, Camera, Laptop,
} from 'lucide-react';
import { HeroCarousel } from '../components/HeroCarousel';
import { BentoFeatured } from '../components/BentoFeatured';
import { ProductRail } from '../components/ProductRail';
import { ProductCard } from '../components/ProductCard';
import { BrandsGrid } from '../components/BrandsGrid';
import { loadProducts, Product } from '../data/products';
import { useStore } from '../store';

const CATS = [
    { name: 'Audio', icon: Headphones },
    { name: 'Celulares', icon: Smartphone },
    { name: 'Smartwatch', icon: Watch },
    { name: 'Gaming', icon: Gamepad2 },
    { name: 'Accesorios', icon: Cable },
    { name: 'Televisores', icon: Tv },
    { name: 'Cámaras', icon: Camera },
    { name: 'Computación', icon: Laptop },
];

export default function Home() {
    const [products, setProducts] = useState<Product[]>([]);
    const { addToCart } = useStore();

    useEffect(() => { loadProducts().then(setProducts); }, []);

    const offers = products.filter((p) => p.discount > 0).slice(0, 10);
    const byCategory = (name: string, n = 10) =>
        products.filter((p) => p.category === name).slice(0, n);

    return (
        <>
            <HeroCarousel />

            {/* Service strip — retail style */}
            <div className="border-b border-line bg-paper-2/60">
                <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 py-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-[12px]">
                        {[
                            { icon: Truck, t: 'Envíos a todo el país', s: 'Asunción y GA en 24/48 h' },
                            { icon: ShieldCheck, t: 'Garantía oficial', s: 'Directa del fabricante' },
                            { icon: CreditCard, t: 'Hasta 12 cuotas', s: 'Sin recargo en métodos aceptados' },
                            { icon: MessageCircle, t: 'Atención por WhatsApp', s: 'Antes y después de la compra' },
                        ].map((f) => (
                            <div key={f.t} className="flex items-center gap-3 py-1">
                                <f.icon className="h-5 w-5 text-py-red shrink-0" strokeWidth={1.8} />
                                <div className="min-w-0">
                                    <p className="font-bold text-ink truncate">{f.t}</p>
                                    <p className="text-ink-3 truncate">{f.s}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Category quick-pick — round icons row (Nissei DNA) */}
            <section className="bg-paper border-b border-line">
                <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
                    <ul className="flex gap-3 md:gap-6 overflow-x-auto pb-2 -mx-4 md:mx-0 px-4 md:px-0 snap-x [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
                        {CATS.map((c) => (
                            <li key={c.name} className="snap-start shrink-0">
                                <Link
                                    to={`/catalogo?categoria=${encodeURIComponent(c.name)}`}
                                    className="flex flex-col items-center gap-2 group w-20 md:w-24"
                                >
                                    <span className="h-14 w-14 md:h-16 md:w-16 rounded-full bg-paper-2 flex items-center justify-center group-hover:bg-py-red group-hover:text-paper transition-colors">
                                        <c.icon className="h-6 w-6 md:h-7 md:w-7" strokeWidth={1.6} />
                                    </span>
                                    <span className="text-[11px] md:text-[12px] font-semibold text-ink text-center leading-tight group-hover:text-py-red transition-colors">
                                        {c.name}
                                    </span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* Bento featured */}
            <BentoFeatured products={products} />

            {/* Ofertas rail — dark with red accents */}
            {offers.length > 0 && (
                <section className="bg-night text-paper border-y border-line">
                    <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 py-10 md:py-14">
                        <header className="flex items-end justify-between mb-6 gap-4">
                            <div>
                                <span className="inline-block bg-py-red text-paper text-[11px] font-extrabold uppercase tracking-wider px-2 py-1 mb-3">Hot Sale</span>
                                <h2 className="text-[24px] md:text-[32px] font-extrabold tracking-tight">Ofertas vigentes</h2>
                            </div>
                            <Link to="/catalogo?ofertas=1" className="hidden md:inline-flex items-center gap-2 text-[13px] font-semibold hover:text-py-red">
                                Ver todas <ArrowUpRight className="h-4 w-4" />
                            </Link>
                        </header>
                    </div>
                    <div className="-mt-4">
                        <ProductRailRaw products={offers} dark addToCart={addToCart} />
                    </div>
                </section>
            )}

            {/* Brands grid */}
            <BrandsGrid />

            {/* Category rails — one per main category */}
            {['Audio', 'Celulares', 'Smartwatch', 'Gaming'].map((cat) => {
                const items = byCategory(cat, 10);
                if (items.length === 0) return null;
                return (
                    <div key={cat} className="border-b border-line">
                        <ProductRail
                            products={items}
                            eyebrow={`Categoría · ${cat}`}
                            title={cat}
                            cta={
                                <Link to={`/catalogo?categoria=${encodeURIComponent(cat)}`} className="hidden md:inline-flex items-center gap-2 text-[13px] font-semibold link-underline">
                                    Ver todo en {cat} <ArrowUpRight className="h-4 w-4" />
                                </Link>
                            }
                        />
                    </div>
                );
            })}

            {/* Promise / trust */}
            <section className="bg-paper-2/60">
                <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 py-14 md:py-20">
                    <div className="grid grid-cols-12 gap-x-6 gap-y-10">
                        <div className="col-span-12 lg:col-span-5">
                            <p className="text-eyebrow text-py-red mb-3">El método Vos PY</p>
                            <h2 className="text-[28px] md:text-[36px] font-extrabold tracking-tight text-ink max-w-md leading-[1.1]">
                                Tres certezas antes de cualquier compra.
                            </h2>
                        </div>
                        <div className="col-span-12 lg:col-span-7 grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                { icon: ShieldCheck, t: 'Garantía oficial', d: 'Cobertura directa del fabricante en todos los productos.' },
                                { icon: Truck, t: 'Despacho nacional', d: 'Asunción y Gran Asunción en 24/48 h. Interior por courier.' },
                                { icon: MessageCircle, t: 'Por WhatsApp', d: 'Coordinamos el pago y la entrega de manera directa.' },
                            ].map((f) => (
                                <div key={f.t} className="bg-paper border border-line p-5">
                                    <f.icon className="h-6 w-6 text-py-red mb-3" strokeWidth={1.6} />
                                    <h3 className="text-[15px] font-bold text-ink mb-1">{f.t}</h3>
                                    <p className="text-[13px] text-ink-2 leading-relaxed">{f.d}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

/* Raw rail without the section wrapper, for use inside an already-sectioned dark block */
const ProductRailRaw: React.FC<{ products: Product[]; dark?: boolean; addToCart: (p: Product, q?: number, o?: any) => void }> = ({ products, dark, addToCart }) => {
    return (
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 pb-10 md:pb-14">
            <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 -mx-4 md:-mx-6 lg:-mx-8 px-4 md:px-6 lg:px-8 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
                {products.map((p) => (
                    <div key={p.id} className="snap-start shrink-0 w-[68%] sm:w-[42%] md:w-[28%] lg:w-[20%]">
                        <ProductCard product={p} onAddToCart={(prod) => addToCart(prod, 1)} dark={dark} />
                    </div>
                ))}
            </div>
        </div>
    );
};
