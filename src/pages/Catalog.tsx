/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Loader2, SearchX } from 'lucide-react';
import { motion } from 'motion/react';
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
        <section className="py-12 md:py-16">
            <div className="container mx-auto px-4">
                <header className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#D52B1E]">
                            Catálogo
                        </span>
                        <h1 className="text-3xl md:text-5xl font-black tracking-tight mt-1">{title}</h1>
                        <p className="text-muted-foreground mt-2">
                            {loading ? 'Cargando…' : `${filtered.length.toLocaleString('es-PY')} productos disponibles`}
                        </p>
                    </motion.div>
                    <div className="flex flex-wrap gap-3">
                        <select
                            value={category}
                            onChange={(e) => setParam('categoria', e.target.value)}
                            aria-label="Filtrar por categoría"
                            className="rounded-full border border-[#0038A8]/20 bg-white px-5 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0038A8]"
                        >
                            <option value="all">Todas las categorías</option>
                            {cats.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <select
                            value={brand}
                            onChange={(e) => setParam('marca', e.target.value)}
                            aria-label="Filtrar por marca"
                            className="rounded-full border border-[#0038A8]/20 bg-white px-5 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0038A8]"
                        >
                            <option value="all">Todas las marcas</option>
                            {brands.map((b) => <option key={b} value={b}>{b}</option>)}
                        </select>
                        {onlyOffers && (
                            <button
                                onClick={() => setParam('ofertas', null)}
                                className="rounded-full border border-[#D52B1E]/30 bg-[#D52B1E]/5 text-[#D52B1E] px-4 py-2.5 text-xs font-bold"
                            >
                                Solo ofertas ✕
                            </button>
                        )}
                    </div>
                </header>

                {loading && (
                    <div className="flex flex-col items-center justify-center py-32 gap-4 text-muted-foreground">
                        <Loader2 className="h-10 w-10 animate-spin text-[#0038A8]" />
                        <p className="font-semibold">Cargando catálogo…</p>
                    </div>
                )}
                {err && (
                    <div className="text-center py-24 bg-red-50 rounded-3xl">
                        <p className="text-[#D52B1E] font-bold">{err}</p>
                    </div>
                )}

                {!loading && !err && (
                    <>
                        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                            {filtered.slice(0, visible).map((p) => (
                                <ProductCard key={p.id} product={p} onAddToCart={(prod) => addToCart(prod, 1)} />
                            ))}
                        </div>

                        {filtered.length === 0 && (
                            <div className="text-center py-24 bg-muted/20 rounded-3xl flex flex-col items-center gap-4">
                                <SearchX className="h-12 w-12 text-muted-foreground/40" />
                                <p className="text-muted-foreground text-lg">No encontramos productos con esos filtros.</p>
                                <Button variant="outline" className="rounded-full" onClick={() => setParams({}, { replace: true })}>
                                    Limpiar filtros
                                </Button>
                            </div>
                        )}

                        {visible < filtered.length && (
                            <div className="flex justify-center mt-12">
                                <Button
                                    size="lg"
                                    onClick={() => setVisible((v) => v + PAGE_SIZE)}
                                    className="bg-[#0038A8] hover:bg-[#002b80] text-white rounded-full px-12 h-14 font-bold"
                                >
                                    Ver más ({(filtered.length - visible).toLocaleString('es-PY')} restantes)
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </section>
    );
}
