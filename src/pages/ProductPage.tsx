/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import {
    ShoppingCart, Minus, Plus, ImageOff, ChevronRight, ShieldCheck, Truck, RefreshCw, ArrowLeft,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { ProductCard } from '../components/ProductCard';
import { loadProducts, Product, formatGs } from '../data/products';
import { useStore } from '../store';

const formatUsd2 = (v: number) =>
    `U$ ${v.toLocaleString('es-PY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const safe = (s: string, n = 200) => s.replace(/[\r\n<>]/g, '').slice(0, n);

export default function ProductPage() {
    const { id } = useParams<{ id: string }>();
    const nav = useNavigate();
    const { addToCart } = useStore();
    const [products, setProducts] = useState<Product[]>([]);
    const [qty, setQty] = useState(1);
    const [imgError, setImgError] = useState(false);

    useEffect(() => { loadProducts().then(setProducts); }, []);
    useEffect(() => { setQty(1); setImgError(false); }, [id]);

    const product = products.find((p) => p.id === id);

    // Inject Product JSON-LD for SEO.
    useEffect(() => {
        if (!product) return;
        const ld = {
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: product.name,
            description: product.fullDescription || product.description,
            brand: { '@type': 'Brand', name: product.brand },
            sku: product.codigo || product.id,
            image: product.image,
            offers: {
                '@type': 'Offer',
                priceCurrency: 'PYG',
                price: product.priceGs,
                availability: (product.stock || 0) > 0
                    ? 'https://schema.org/InStock'
                    : 'https://schema.org/OutOfStock',
                url: `https://vos-py.vercel.app/producto/${product.id}`,
            },
        };
        const s = document.createElement('script');
        s.type = 'application/ld+json';
        s.text = JSON.stringify(ld);
        s.id = 'product-jsonld';
        document.head.appendChild(s);
        document.title = `${product.name} · Vos PY`;
        return () => {
            document.getElementById('product-jsonld')?.remove();
            document.title = 'Vos PY · Tienda de electrónica importada en Paraguay';
        };
    }, [product]);

    if (products.length === 0) {
        return <div className="py-32 text-center text-muted-foreground">Cargando…</div>;
    }

    if (!product) {
        return (
            <div className="container mx-auto px-4 py-24 text-center">
                <h1 className="text-2xl font-bold mb-3">Producto no encontrado</h1>
                <Link to="/catalogo" className="text-[#0038A8] font-bold hover:underline">
                    Volver al catálogo
                </Link>
            </div>
        );
    }

    const hasDiscount = product.discount > 0 && product.listGs > product.priceGs;
    const whatsappHref = `https://wa.me/?text=${encodeURIComponent(
        `Hola, quiero consultar por: ${safe(product.name)}${product.codigo ? ` (Cód. ${safe(product.codigo, 32)})` : ''} — https://vos-py.vercel.app/producto/${product.id}`
    )}`;

    const related = products
        .filter((p) => p.category === product.category && p.id !== product.id)
        .slice(0, 4);

    return (
        <article className="bg-white">
            <div className="container mx-auto px-4 py-6 md:py-10">
                <nav className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#0038A8]/70 mb-8">
                    <Link to="/" className="hover:text-[#0038A8]">Inicio</Link>
                    <ChevronRight className="h-3 w-3" />
                    <Link to="/catalogo" className="hover:text-[#0038A8]">Catálogo</Link>
                    <ChevronRight className="h-3 w-3" />
                    <Link to={`/catalogo?categoria=${encodeURIComponent(product.category)}`} className="hover:text-[#0038A8]">{product.category}</Link>
                </nav>

                <div className="grid md:grid-cols-2 gap-10 md:gap-16">
                    <div className="md:sticky md:top-28 md:self-start">
                        <div className="bg-zinc-50/60 rounded-3xl p-6 md:p-10 aspect-square flex items-center justify-center">
                            {imgError ? (
                                <div className="flex flex-col items-center justify-center text-zinc-300 gap-3">
                                    <ImageOff className="h-16 w-16" />
                                    <span className="text-xs font-bold uppercase tracking-wider">Imagen no disponible</span>
                                </div>
                            ) : (
                                <motion.img
                                    key={product.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                                    src={product.image}
                                    alt={product.name}
                                    onError={() => setImgError(true)}
                                    className="w-full h-full object-contain"
                                />
                            )}
                        </div>
                    </div>

                    <div>
                        <div className="flex flex-wrap items-center gap-2 mb-4">
                            <Badge className="bg-[#0038A8]/10 text-[#0038A8] border-none font-bold">{product.brand}</Badge>
                            <Badge className="bg-zinc-100 text-zinc-700 border-none font-bold">{product.category}</Badge>
                            {hasDiscount && (
                                <Badge className="bg-[#D52B1E] text-white border-none font-bold">-{product.discount}%</Badge>
                            )}
                        </div>
                        <h1 className="text-2xl md:text-4xl font-black tracking-tight uppercase leading-[1.1] mb-5">
                            {product.name}
                        </h1>

                        <div className="border-t border-b py-5 my-5">
                            {hasDiscount && (
                                <p className="text-base font-bold text-zinc-400 line-through">{formatGs(product.listGs)}</p>
                            )}
                            <div className="flex items-baseline gap-3 flex-wrap">
                                <span className={`text-4xl md:text-5xl font-black ${hasDiscount ? 'text-[#D52B1E]' : 'text-[#0038A8]'}`}>
                                    {formatGs(product.priceGs)}
                                </span>
                                {product.price > 0 && (
                                    <span className="text-sm font-bold text-muted-foreground">
                                        {formatUsd2(product.price)} TAX FREE *
                                    </span>
                                )}
                            </div>
                            <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 mt-1">IVA Incluido</p>
                        </div>

                        <div className="flex items-center gap-4 mb-6">
                            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Cantidad</span>
                            <div className="flex items-center border-2 border-zinc-200 rounded-full overflow-hidden">
                                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="p-2 md:p-3 hover:bg-zinc-100" aria-label="Disminuir cantidad">
                                    <Minus className="h-4 w-4" />
                                </button>
                                <span className="w-10 text-center font-bold">{qty}</span>
                                <button onClick={() => setQty((q) => q + 1)} className="p-2 md:p-3 hover:bg-zinc-100" aria-label="Aumentar cantidad">
                                    <Plus className="h-4 w-4" />
                                </button>
                            </div>
                            {product.stock !== undefined && (
                                <span className="text-xs font-bold text-emerald-600">{product.stock} disponibles</span>
                            )}
                        </div>

                        <motion.div whileHover={{ scale: 1.005 }} whileTap={{ scale: 0.995 }}>
                            <Button
                                size="lg"
                                onClick={() => addToCart(product, qty)}
                                className="w-full bg-zinc-950 hover:bg-zinc-800 text-white h-14 rounded-xl text-base font-bold"
                            >
                                <ShoppingCart className="mr-2 h-5 w-5" />
                                Agregar al carrito
                            </Button>
                        </motion.div>
                        <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="block mt-3">
                            <Button size="lg" variant="outline" className="w-full border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50 h-12 rounded-xl text-base font-bold">
                                <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.945C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 018.413 3.488 11.82 11.82 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.978-1.042zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" /></svg>
                                Consultar por WhatsApp
                            </Button>
                        </a>
                        {product.price > 0 && (
                            <p className="text-[11px] text-muted-foreground leading-relaxed mt-3">
                                * Precio en U$ bajo régimen de turismo, no incluye I.V.A. (impuesto obligatorio para residentes en Paraguay).
                            </p>
                        )}

                        <div className="grid grid-cols-3 gap-4 mt-6 py-5 border-t text-[10px] font-bold uppercase tracking-wider text-[#0038A8]/70 text-center">
                            <div className="flex flex-col items-center gap-2"><Truck className="h-5 w-5" /><span>Envío Nacional</span></div>
                            <div className="flex flex-col items-center gap-2"><ShieldCheck className="h-5 w-5" /><span>Garantía Oficial</span></div>
                            <div className="flex flex-col items-center gap-2"><RefreshCw className="h-5 w-5" /><span>Arrepentimiento 7d</span></div>
                        </div>

                        <div className="mt-6 space-y-1 text-sm">
                            <p><span className="font-bold">Marca:</span> {product.brand}</p>
                            {product.codigo && <p><span className="font-bold">Código:</span> {product.codigo}</p>}
                        </div>
                    </div>
                </div>

                <div className="mt-14 max-w-3xl">
                    <h2 className="text-lg font-black uppercase tracking-tight mb-3">Descripción</h2>
                    <p className="text-base text-muted-foreground leading-relaxed whitespace-pre-line">
                        {product.fullDescription || product.description}
                    </p>
                </div>

                {related.length > 0 && (
                    <div className="mt-20">
                        <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-8">También te puede interesar</h2>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                            {related.map((p) => (
                                <ProductCard key={p.id} product={p} onAddToCart={(prod) => addToCart(prod, 1)} />
                            ))}
                        </div>
                    </div>
                )}

                <div className="mt-16">
                    <button onClick={() => nav(-1)} className="inline-flex items-center gap-2 text-sm font-bold text-[#0038A8] hover:underline">
                        <ArrowLeft className="h-4 w-4" /> Volver
                    </button>
                </div>
            </div>
        </article>
    );
}
