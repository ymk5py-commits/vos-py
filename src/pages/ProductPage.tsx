/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
    ShoppingCart, Minus, Plus, ChevronRight, ShieldCheck, Truck, RefreshCw, ArrowLeft, MessageCircle, ZoomIn, X,
} from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { RecentlyViewed } from '../components/RecentlyViewed';
import { loadProducts, Product, formatGs } from '../data/products';
import { useStore } from '../store';

const formatUsd2 = (v: number) =>
    `U$ ${v.toLocaleString('es-PY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const safe = (s: string, n = 200) => s.replace(/[\r\n<>]/g, '').slice(0, n);

export default function ProductPage() {
    const { id } = useParams<{ id: string }>();
    const nav = useNavigate();
    const { addToCart, recordView } = useStore();
    const [products, setProducts] = useState<Product[]>([]);
    const [qty, setQty] = useState(1);
    const [imgError, setImgError] = useState(false);
    const [zoomOpen, setZoomOpen] = useState(false);

    useEffect(() => { loadProducts().then(setProducts); }, []);
    useEffect(() => { setQty(1); setImgError(false); setZoomOpen(false); }, [id]);

    const product = products.find((p) => p.id === id);

    // Record this product as recently viewed.
    useEffect(() => { if (product) recordView(product.id); }, [product, recordView]);

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
        return (
            <div className="max-w-[1400px] mx-auto px-5 md:px-8 lg:px-12 py-24 grid md:grid-cols-2 gap-12">
                <div className="aspect-square bg-paper-2 animate-pulse" />
                <div className="space-y-4">
                    <div className="h-3 w-1/4 bg-paper-2 animate-pulse" />
                    <div className="h-10 w-3/4 bg-paper-2 animate-pulse" />
                    <div className="h-10 w-1/2 bg-paper-2 animate-pulse" />
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="max-w-[1400px] mx-auto px-5 md:px-8 lg:px-12 py-24 text-center">
                <p className="text-eyebrow text-py-red mb-3">Error 404</p>
                <h1 className="text-display-m text-ink mb-4">Producto no encontrado</h1>
                <Link to="/catalogo" className="inline-block text-[14px] font-semibold link-underline">Volver al catálogo</Link>
            </div>
        );
    }

    const hasDiscount = product.discount > 0 && product.listGs > product.priceGs;
    const askPrice = product.priceGs === 0;
    const waText = askPrice
        ? `Hola, quería consultar el PRECIO de: ${safe(product.name)}${product.codigo ? ` (Cód. ${safe(product.codigo, 32)})` : ''} — https://vos-py.vercel.app/producto/${product.id}`
        : `Hola, quiero consultar por: ${safe(product.name)}${product.codigo ? ` (Cód. ${safe(product.codigo, 32)})` : ''} — https://vos-py.vercel.app/producto/${product.id}`;
    const whatsappHref = `https://wa.me/?text=${encodeURIComponent(waText)}`;

    const related = products
        .filter((p) => p.category === product.category && p.id !== product.id)
        .slice(0, 8);

    return (
        <article className="bg-paper">
            <div className="max-w-[1400px] mx-auto px-5 md:px-8 lg:px-12 pt-6 pb-20 md:pb-28">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-1.5 text-eyebrow text-ink-3 mb-8">
                    <Link to="/" className="hover:text-ink">Inicio</Link>
                    <ChevronRight className="h-3 w-3" strokeWidth={2} />
                    <Link to="/catalogo" className="hover:text-ink">Catálogo</Link>
                    <ChevronRight className="h-3 w-3" strokeWidth={2} />
                    <Link to={`/catalogo?categoria=${encodeURIComponent(product.category)}`} className="hover:text-ink">
                        {product.category}
                    </Link>
                </nav>

                <div className="grid md:grid-cols-2 gap-x-12 gap-y-12 lg:gap-x-20">
                    {/* Image — bleeds to its plate, sticky on desktop, click to zoom */}
                    <div className="md:sticky md:top-32 md:self-start">
                        <button
                            type="button"
                            onClick={() => !imgError && setZoomOpen(true)}
                            className="group relative aspect-square bg-paper-2 w-full block overflow-hidden cursor-zoom-in"
                            aria-label="Ampliar imagen"
                        >
                            {imgError ? (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-display-m text-ink-3 opacity-30">VP</span>
                                </div>
                            ) : (
                                <motion.img
                                    key={product.id}
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                                    src={product.image}
                                    alt={product.name}
                                    onError={() => setImgError(true)}
                                    className="absolute inset-0 w-full h-full object-contain p-10 md:p-16 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                                />
                            )}
                            {!imgError && (
                                <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 bg-ink/80 text-paper text-[10px] font-bold uppercase tracking-wider px-2.5 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <ZoomIn className="h-3 w-3" /> Ampliar
                                </span>
                            )}
                            {hasDiscount && (
                                <span className="absolute top-0 right-0 bg-sale text-paper text-[12px] font-bold tabular px-3 py-2">
                                    −{product.discount}%
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Info column */}
                    <div className="max-w-xl">
                        <p className="text-eyebrow text-ink-3 mb-3">{product.brand}</p>
                        <h1 className="text-display-m text-ink mb-6">
                            {product.name.toLowerCase().replace(/(^|\s)\S/g, (s) => s.toUpperCase())}
                        </h1>

                        <div className="border-t border-b border-line py-5 mb-6">
                            {askPrice ? (
                                <>
                                    <p className="text-eyebrow text-emerald-700 mb-2">Precio a confirmar</p>
                                    <p className="text-[32px] md:text-[40px] font-bold leading-none tracking-tight text-ink">
                                        Consultar por WhatsApp
                                    </p>
                                    <p className="text-[12px] text-ink-3 mt-2">
                                        Te respondemos en minutos con precio actualizado, stock y opciones de envío.
                                    </p>
                                </>
                            ) : (
                                <>
                                    <div className="flex items-baseline gap-4 flex-wrap">
                                        <span className={`text-[40px] md:text-[56px] font-bold tabular leading-none tracking-tight ${hasDiscount ? 'text-sale' : 'text-ink'}`}>
                                            {formatGs(product.priceGs)}
                                        </span>
                                        {hasDiscount && (
                                            <span className="text-[16px] font-semibold tabular text-ink-3 line-through">{formatGs(product.listGs)}</span>
                                        )}
                                    </div>
                                    <div className="flex gap-5 mt-2 text-[12px] text-ink-3">
                                        {product.price > 0 && (
                                            <span className="tabular">{formatUsd2(product.price)} TAX FREE *</span>
                                        )}
                                        <span>IVA incluido</span>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Quantity — solo si hay precio */}
                        {!askPrice && (
                            <div className="flex items-center gap-4 mb-5">
                                <span className="text-eyebrow text-ink-3">Cantidad</span>
                                <div className="flex items-center border border-line">
                                    <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="h-10 w-10 flex items-center justify-center hover:bg-paper-2 transition-colors" aria-label="Disminuir cantidad">
                                        <Minus className="h-4 w-4" strokeWidth={2} />
                                    </button>
                                    <span className="w-10 text-center font-semibold tabular text-[14px]">{qty}</span>
                                    <button onClick={() => setQty((q) => q + 1)} className="h-10 w-10 flex items-center justify-center hover:bg-paper-2 transition-colors" aria-label="Aumentar cantidad">
                                        <Plus className="h-4 w-4" strokeWidth={2} />
                                    </button>
                                </div>
                                {product.stock !== undefined && (
                                    <span className="text-[12px] text-ink-2 tabular">{product.stock} en stock</span>
                                )}
                            </div>
                        )}

                        <div className="space-y-3">
                            {!askPrice && (
                                <button
                                    onClick={() => addToCart(product, qty)}
                                    className="group w-full inline-flex items-center justify-center gap-3 bg-ink text-paper h-13 font-semibold text-[14px] hover:bg-ink/90 transition-colors"
                                    style={{ height: 52 }}
                                >
                                    <ShoppingCart className="h-4 w-4" strokeWidth={2} />
                                    Agregar al carrito
                                </button>
                            )}
                            <a
                                href={whatsappHref}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`w-full inline-flex items-center justify-center gap-3 h-13 font-semibold text-[14px] transition-colors ${
                                    askPrice
                                        ? 'bg-emerald-600 text-paper hover:bg-emerald-700'
                                        : 'bg-paper border border-ink/15 text-ink hover:bg-paper-2'
                                }`}
                                style={{ height: 52 }}
                            >
                                <MessageCircle className="h-4 w-4" strokeWidth={2} />
                                {askPrice ? 'Pedir precio por WhatsApp' : 'Consultar por WhatsApp'}
                            </a>
                        </div>

                        {product.price > 0 && (
                            <p className="text-[11px] text-ink-3 mt-3 leading-relaxed">
                                * Precio en U$ bajo régimen de turismo, no incluye I.V.A. Obligatorio para residentes en Paraguay.
                            </p>
                        )}

                        <dl className="grid grid-cols-3 gap-6 mt-8 pt-6 border-t border-line">
                            <Facet icon={Truck} title="Envío" sub="Nacional 24/48h" />
                            <Facet icon={ShieldCheck} title="Garantía" sub="Oficial fábrica" />
                            <Facet icon={RefreshCw} title="Devolución" sub="7 días Ley 1334" />
                        </dl>
                    </div>
                </div>

                {/* Description + Bento of services */}
                <div className="mt-20 md:mt-28 grid lg:grid-cols-12 gap-x-12 gap-y-12">
                    <div className="lg:col-span-7">
                        <p className="text-eyebrow text-ink-3 mb-3">Sobre el producto</p>
                        <h2 className="text-headline text-ink mb-6">Descripción</h2>
                        <p className="text-[16px] md:text-[17px] text-ink-2 leading-[1.75] whitespace-pre-line">
                            {product.fullDescription || product.description}
                        </p>
                    </div>

                    {/* Specs / quick facts strip */}
                    <aside className="lg:col-span-5 lg:pl-8 lg:border-l border-line">
                        <p className="text-eyebrow text-ink-3 mb-5">Datos del producto</p>
                        <div className="grid grid-cols-2 gap-px bg-line border border-line">
                            <SpecCell n="01" k="Marca" v={product.brand} />
                            <SpecCell n="02" k="Categoría" v={product.category} />
                            {product.codigo && <SpecCell n="03" k="Código" v={product.codigo} mono />}
                            <SpecCell n={product.codigo ? "04" : "03"} k="Stock" v={`${product.stock ?? 0} u.`} mono />
                        </div>

                        <p className="text-eyebrow text-ink-3 mt-10 mb-5">Servicios incluidos</p>
                        <div className="grid grid-cols-2 gap-px bg-line border border-line">
                            <ServiceCell icon={Truck} title="Envío nacional" desc="24/48 h en GA. Interior por courier." />
                            <ServiceCell icon={ShieldCheck} title="Garantía oficial" desc="Directa del fabricante." />
                            <ServiceCell icon={RefreshCw} title="Arrepentimiento" desc="7 días — Ley 1334/98." />
                            <ServiceCell icon={MessageCircle} title="Soporte" desc="Por WhatsApp, antes y después." dark />
                        </div>
                    </aside>
                </div>

                {/* Related — horizontal rail */}
                {related.length > 0 && (
                    <div className="mt-20 md:mt-28 border-t border-line pt-12">
                        <div className="flex items-end justify-between mb-10">
                            <div>
                                <p className="text-eyebrow text-ink-3 mb-2">Continuá</p>
                                <h2 className="text-headline text-ink">También en {product.category}</h2>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-14">
                            {related.slice(0, 4).map((p) => (
                                <ProductCard key={p.id} product={p} onAddToCart={(prod) => addToCart(prod, 1)} />
                            ))}
                        </div>
                    </div>
                )}

                <div className="mt-16">
                    <button onClick={() => nav(-1)} className="inline-flex items-center gap-2 text-[13px] font-semibold link-underline">
                        <ArrowLeft className="h-4 w-4" strokeWidth={2} /> Volver
                    </button>
                </div>
            </div>

            {/* Recently viewed */}
            <RecentlyViewed excludeId={product.id} />

            {/* Zoom lightbox */}
            <AnimatePresence>
                {zoomOpen && !imgError && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-[80] bg-ink/90 backdrop-blur-sm flex items-center justify-center p-6 cursor-zoom-out"
                        onClick={() => setZoomOpen(false)}
                        role="dialog"
                        aria-label="Imagen ampliada"
                    >
                        <button
                            onClick={() => setZoomOpen(false)}
                            aria-label="Cerrar"
                            className="absolute top-5 right-5 h-11 w-11 flex items-center justify-center text-paper/80 hover:text-paper"
                        >
                            <X className="h-6 w-6" />
                        </button>
                        <motion.img
                            initial={{ scale: 0.92, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.92, opacity: 0 }}
                            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                            src={product.image}
                            alt={product.name}
                            className="max-w-full max-h-full object-contain"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mobile sticky bar */}
            <div className="md:hidden fixed inset-x-0 bottom-0 z-40 bg-paper border-t border-line shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.15)]">
                <div className="px-4 pt-3 pb-[calc(env(safe-area-inset-bottom)+12px)] flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                        {askPrice ? (
                            <>
                                <p className="text-eyebrow text-emerald-700">Precio</p>
                                <p className="text-[15px] font-bold text-ink leading-tight">Consultar</p>
                            </>
                        ) : (
                            <>
                                {hasDiscount && (
                                    <span className="block text-[11px] line-through tabular text-ink-3 leading-none">{formatGs(product.listGs)}</span>
                                )}
                                <p className={`text-[18px] font-bold tabular leading-tight ${hasDiscount ? 'text-sale' : 'text-ink'}`}>
                                    {formatGs(product.priceGs)}
                                </p>
                            </>
                        )}
                    </div>
                    {askPrice ? (
                        <a
                            href={whatsappHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-emerald-600 text-paper px-5 h-11 font-semibold text-[13px] hover:bg-emerald-700 transition-colors"
                        >
                            <MessageCircle className="h-4 w-4" strokeWidth={2} />
                            Pedir precio
                        </a>
                    ) : (
                        <>
                            <a
                                href={whatsappHref}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="h-11 w-11 shrink-0 flex items-center justify-center border-2 border-emerald-500 text-emerald-600"
                                aria-label="Consultar por WhatsApp"
                            >
                                <MessageCircle className="h-4 w-4" strokeWidth={2} />
                            </a>
                            <button
                                onClick={() => addToCart(product, qty)}
                                className="inline-flex items-center gap-2 bg-ink text-paper px-5 h-11 font-semibold text-[13px] hover:bg-ink/90 transition-colors"
                            >
                                <ShoppingCart className="h-4 w-4" strokeWidth={2} />
                                Agregar
                            </button>
                        </>
                    )}
                </div>
            </div>
            <div aria-hidden="true" className="md:hidden h-20" />
        </article>
    );
}

const Facet = ({ icon: Icon, title, sub }: { icon: any; title: string; sub: string }) => (
    <div>
        <Icon className="h-5 w-5 text-ink mb-2" strokeWidth={1.6} />
        <p className="text-[12px] font-semibold text-ink">{title}</p>
        <p className="text-[11px] text-ink-3">{sub}</p>
    </div>
);

const Row = ({ k, v, mono = false }: { k: string; v: string; mono?: boolean }) => (
    <div className="flex justify-between gap-4">
        <dt className="text-ink-3">{k}</dt>
        <dd className={`text-ink ${mono ? 'tabular' : ''}`}>{v}</dd>
    </div>
);

const SpecCell = ({ n, k, v, mono = false }: { n: string; k: string; v: string; mono?: boolean }) => (
    <div className="bg-paper p-5">
        <span className="text-eyebrow text-ink-3 tabular">{n}</span>
        <p className="text-[11px] uppercase tracking-wider text-ink-3 mt-2">{k}</p>
        <p className={`text-[15px] font-semibold text-ink mt-0.5 ${mono ? 'tabular' : ''}`}>{v}</p>
    </div>
);

const ServiceCell = ({
    icon: Icon, title, desc, dark = false,
}: { icon: any; title: string; desc: string; dark?: boolean }) => (
    <div className={`p-5 ${dark ? 'bg-ink text-paper' : 'bg-paper text-ink'}`}>
        <Icon className={`h-5 w-5 mb-3 ${dark ? 'text-paper' : 'text-ink'}`} strokeWidth={1.6} />
        <p className={`text-[13px] font-bold ${dark ? 'text-paper' : 'text-ink'}`}>{title}</p>
        <p className={`text-[11px] mt-1 ${dark ? 'text-paper/70' : 'text-ink-3'} leading-snug`}>{desc}</p>
    </div>
);
