/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Loader2, SearchX } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { Button } from '../components/ui/button';
import { loadProducts, Product } from '../data/products';
import { useStore } from '../store';

const PAGE_SIZE = 24;

export default function Catalog() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState<string | null>(null);
    const [params, setParams] = useSearchParams();
    const [visible, setVisible] = useState(PAGE_SIZE);
    const { addToCart } = useStore();

    useEffect(() => {
        loadProducts().then(setProducts).catch((e) => setErr(e.message)).finally(() => setLoading(false));
    }, []);

    const category = params.get('categoria') || 'all';
    const brand = params.get('marca') || 'all';
    const q = (params.get('q') || '').toLowerCase().trim();
    const onlyOffers = params.get('ofertas') === '1';

    const setParam = (k: string, v: string | null) => {
        const next = new URLSearchParams(params);
        if (v === null || v === '' || v === 'all') next.delete(k);
        else next.set(k, v);
        setParams(next, { replace: true });
    };

    const brands = useMemo(() => {
        const m = new Map<string, number>();
        for (const p of products) m.set(p.brand, (m.get(p.brand) || 0) + 1);
        return [...m.entries()].sort((a, b) => b[1] - a[1]).map(([b]) => b);
    }, [products]);

    const cats = useMemo(
        () => [...new Set(products.map((p) => p.category))].sort(),
        [products]
    );

    const filtered = useMemo(() => products.filter((p) => {
        if (onlyOffers && !(p.discount > 0)) return false;
        if (category !== 'all' && p.category !== category) return false;
        if (brand !== 'all' && p.brand !== brand) return false;
        if (q && !`${p.name} ${p.brand} ${p.category}`.toLowerCase().includes(q)) return false;
        return true;
    }), [products, category, brand, q, onlyOffers]);

    useEffect(() => { setVisible(PAGE_SIZE); }, [category, brand, q, onlyOffers]);

    const title = onlyOffers
        ? 'Ofertas'
        : category !== 'all'
            ? category
            : q
                ? `Resultados para "${q}"`
                : 'Catálogo completo';

    return (
        <section className="max-w-[1400px] mx-auto px-5 md:px-8 lg:px-12 py-12 md:py-16">
            <header className="grid grid-cols-12 gap-x-6 gap-y-6 items-end mb-12 md:mb-16">
                <div className="col-span-12 lg:col-span-8">
                    <p className="text-eyebrow text-ink-3 mb-3">Catálogo</p>
                    <h1 className="text-display-m text-ink">{title}</h1>
                    <p className="text-ink-2 mt-3 text-[14px]">
                        {loading
                            ? 'Cargando…'
                            : <><span className="tabular font-semibold">{filtered.length.toLocaleString('es-PY')}</span> productos disponibles</>}
                    </p>
                </div>
                <div className="col-span-12 lg:col-span-4 flex flex-wrap gap-2 lg:justify-end">
                    <select
                        value={category}
                        onChange={(e) => setParam('categoria', e.target.value)}
                        aria-label="Filtrar por categoría"
                        className="h-10 rounded-full border border-line bg-paper px-4 text-[13px] font-semibold hover:border-ink-3 focus:outline-none focus:ring-2 focus:ring-ink/15 transition-colors"
                    >
                        <option value="all">Todas las categorías</option>
                        {cats.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <select
                        value={brand}
                        onChange={(e) => setParam('marca', e.target.value)}
                        aria-label="Filtrar por marca"
                        className="h-10 rounded-full border border-line bg-paper px-4 text-[13px] font-semibold hover:border-ink-3 focus:outline-none focus:ring-2 focus:ring-ink/15 transition-colors"
                    >
                        <option value="all">Todas las marcas</option>
                        {brands.map((b) => <option key={b} value={b}>{b}</option>)}
                    </select>
                    {onlyOffers && (
                        <button
                            onClick={() => setParam('ofertas', null)}
                            className="h-10 rounded-full border border-sale/40 bg-sale/5 text-sale px-4 text-[13px] font-semibold"
                        >
                            Solo ofertas ✕
                        </button>
                    )}
                </div>
            </header>

            {loading && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-14">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="space-y-4">
                            <div className="aspect-square bg-paper-2 animate-pulse" />
                            <div className="h-3 bg-paper-2 animate-pulse w-2/3" />
                            <div className="h-3 bg-paper-2 animate-pulse w-1/3" />
                        </div>
                    ))}
                </div>
            )}
            {err && (
                <div className="text-center py-24 border border-sale/40 bg-sale/5">
                    <p className="text-sale font-bold">{err}</p>
                </div>
            )}

            {!loading && !err && (
                <>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-14 md:gap-y-20">
                        {filtered.slice(0, visible).map((p) => (
                            <ProductCard key={p.id} product={p} onAddToCart={(prod) => addToCart(prod, 1)} />
                        ))}
                    </div>

                    {filtered.length === 0 && (
                        <div className="text-center py-24 border-y border-line flex flex-col items-center gap-4">
                            <SearchX className="h-10 w-10 text-ink-3" strokeWidth={1.4} />
                            <p className="text-ink-2 text-lg">No encontramos productos con esos filtros.</p>
                            <Button
                                variant="outline"
                                className="rounded-full border-ink/15 hover:bg-paper-2"
                                onClick={() => setParams({}, { replace: true })}
                            >
                                Limpiar filtros
                            </Button>
                        </div>
                    )}

                    {visible < filtered.length && (
                        <div className="flex justify-center mt-16">
                            <button
                                onClick={() => setVisible((v) => v + PAGE_SIZE)}
                                className="group inline-flex items-center gap-3 bg-ink text-paper rounded-full pl-7 pr-2 h-13 font-semibold text-[14px] hover:bg-ink/90 transition-colors"
                                style={{ height: 52 }}
                            >
                                <span>Ver más</span>
                                <span className="text-paper/70 tabular">
                                    {(filtered.length - visible).toLocaleString('es-PY')} restantes
                                </span>
                                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-paper text-ink text-[14px] font-bold transition-transform duration-300 group-hover:translate-x-0.5">
                                    +
                                </span>
                            </button>
                        </div>
                    )}
                </>
            )}
        </section>
    );
}
