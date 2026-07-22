/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Buscador instantáneo con dropdown de resultados (miniatura + nombre +
 * precio). Debounced, navegación por teclado, cierra al click afuera.
 * On-brand (tokens), accesible (combobox roles).
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight, ImageOff, CornerDownLeft } from 'lucide-react';
import { loadProducts, Product, formatGs } from '../data/products';

interface Props {
    value: string;
    onChange: (v: string) => void;
    onSubmit: (q: string) => void;
    placeholder?: string;
    autoFocus?: boolean;
    /** Visual variant: 'bar' (desktop, with red Buscar button) | 'plain' (mobile). */
    variant?: 'bar' | 'plain';
}

const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

export const SearchAutocomplete = ({ value, onChange, onSubmit, placeholder, autoFocus, variant = 'bar' }: Props) => {
    const nav = useNavigate();
    const [products, setProducts] = useState<Product[]>([]);
    const [open, setOpen] = useState(false);
    const [active, setActive] = useState(-1);
    const [debounced, setDebounced] = useState(value);
    const rootRef = useRef<HTMLDivElement>(null);

    useEffect(() => { loadProducts().then(setProducts).catch(() => {}); }, []);

    // Debounce the query.
    useEffect(() => {
        const t = setTimeout(() => setDebounced(value), 140);
        return () => clearTimeout(t);
    }, [value]);

    // Close on outside click.
    useEffect(() => {
        const onDoc = (e: MouseEvent) => {
            if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', onDoc);
        return () => document.removeEventListener('mousedown', onDoc);
    }, []);

    const results = useMemo(() => {
        const q = norm(debounced.trim());
        if (q.length < 2) return [];
        const terms = q.split(/\s+/);
        const scored: { p: Product; score: number }[] = [];
        for (const p of products) {
            const hay = norm(`${p.name} ${p.brand} ${p.category}`);
            if (terms.every((t) => hay.includes(t))) {
                // Light ranking: brand/name start matches rank higher.
                const nameN = norm(p.name);
                const score = (nameN.startsWith(q) ? 0 : 1) + (norm(p.brand).startsWith(q) ? 0 : 0.5);
                scored.push({ p, score });
            }
            if (scored.length > 60) break;
        }
        return scored.sort((a, b) => a.score - b.score).slice(0, 6).map((s) => s.p);
    }, [debounced, products]);

    const showDrop = open && debounced.trim().length >= 2;

    const go = (p: Product) => {
        setOpen(false);
        onChange('');
        nav(`/producto/${p.id}`);
    };

    const submit = () => {
        const q = value.trim();
        if (!q) return;
        setOpen(false);
        onSubmit(q);
    };

    const onKey = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)); setOpen(true); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, -1)); }
        else if (e.key === 'Enter') { if (active >= 0 && results[active]) go(results[active]); else submit(); }
        else if (e.key === 'Escape') { setOpen(false); setActive(-1); }
    };

    useEffect(() => { setActive(-1); }, [debounced]);

    return (
        <div ref={rootRef} className="relative w-full" role="combobox" aria-expanded={showDrop} aria-haspopup="listbox">
            <input
                type="text"
                inputMode="search"
                value={value}
                autoFocus={autoFocus}
                onChange={(e) => { onChange(e.target.value); setOpen(true); }}
                onFocus={() => setOpen(true)}
                onKeyDown={onKey}
                placeholder={placeholder ?? 'Buscá productos…'}
                maxLength={80}
                aria-label="Buscar productos"
                aria-autocomplete="list"
                aria-controls="search-listbox"
                aria-activedescendant={active >= 0 ? `search-opt-${active}` : undefined}
                className={`w-full bg-paper-2 border border-transparent focus:bg-paper focus:border-py-red focus:outline-none text-[14px] rounded-md text-ink placeholder:text-ink-3 ${
                    variant === 'bar' ? 'h-12 pl-12 pr-28' : 'h-11 pl-11 pr-10'
                }`}
            />
            <span className="sr-only" aria-live="polite">
                {showDrop ? (results.length === 0 ? 'Sin resultados' : `${results.length} resultados`) : ''}
            </span>
            <Search className={`absolute top-1/2 -translate-y-1/2 h-4 w-4 text-ink-3 pointer-events-none ${variant === 'bar' ? 'left-4' : 'left-4'}`} />

            {value && (
                <button
                    type="button"
                    onClick={() => { onChange(''); setOpen(false); }}
                    aria-label="Limpiar búsqueda"
                    className={`absolute top-1/2 -translate-y-1/2 h-7 w-7 flex items-center justify-center text-ink-3 hover:text-ink ${variant === 'bar' ? 'right-24' : 'right-2'}`}
                >
                    <X className="h-4 w-4" />
                </button>
            )}

            {variant === 'bar' && (
                <button
                    type="button"
                    onClick={submit}
                    aria-label="Buscar"
                    className="press absolute right-1 top-1 bottom-1 px-5 bg-py-red text-paper text-[13px] font-bold hover:bg-py-red-deep transition-colors rounded"
                >
                    Buscar
                </button>
            )}

            {/* Dropdown */}
            {showDrop && (
                <div
                    role="listbox"
                    id="search-listbox"
                    aria-label="Resultados de búsqueda"
                    className="absolute left-0 right-0 top-[calc(100%+8px)] bg-paper border border-line shadow-2xl z-50 overflow-hidden"
                >
                    {results.length === 0 ? (
                        <div className="px-4 py-6 text-center">
                            <p className="text-[13px] text-ink-2">Sin coincidencias para <span className="font-bold text-ink">“{debounced.trim()}”</span></p>
                            <button onClick={submit} className="mt-2 text-[12px] font-semibold link-underline">Ver todo el catálogo</button>
                        </div>
                    ) : (
                        <>
                            <ul className="max-h-[60vh] overflow-y-auto">
                                {results.map((p, i) => (
                                    <li key={p.id} role="option" aria-selected={i === active}>
                                        <button
                                            onMouseEnter={() => setActive(i)}
                                            onClick={() => go(p)}
                                            className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors ${i === active ? 'bg-paper-2' : 'hover:bg-paper-2'}`}
                                        >
                                            <span className="h-11 w-11 shrink-0 bg-paper-2 border border-line flex items-center justify-center overflow-hidden">
                                                <Thumb src={p.image} alt={p.name} />
                                            </span>
                                            <span className="flex-1 min-w-0">
                                                <span className="block text-[10px] font-bold uppercase tracking-wider text-ink-3 truncate">{p.brand} · {p.category}</span>
                                                <span className="block text-[13px] font-semibold text-ink truncate leading-tight">
                                                    {p.name.toLowerCase().replace(/(^|\s)\S/g, (c) => c.toUpperCase())}
                                                </span>
                                            </span>
                                            <span className="shrink-0 text-right">
                                                {p.priceGs > 0
                                                    ? <span className="block text-[13px] font-extrabold tabular text-ink">{formatGs(p.priceGs)}</span>
                                                    : <span className="block text-[11px] font-bold uppercase text-emerald-700">Consultar</span>}
                                            </span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                            <button
                                onClick={submit}
                                className="w-full flex items-center justify-between gap-2 px-4 h-11 bg-paper-2 hover:bg-paper-3 border-t border-line text-[12px] font-bold uppercase tracking-wider transition-colors"
                            >
                                <span className="inline-flex items-center gap-2">
                                    Ver todos los resultados <span className="text-ink-3 normal-case font-semibold">“{debounced.trim()}”</span>
                                </span>
                                <span className="inline-flex items-center gap-1.5 text-ink-3">
                                    <CornerDownLeft className="h-3.5 w-3.5" /> <ArrowRight className="h-3.5 w-3.5" />
                                </span>
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

const Thumb = ({ src, alt }: { src: string; alt: string }) => {
    const [err, setErr] = useState(false);
    if (err) return <ImageOff className="h-4 w-4 text-ink-3" />;
    return <img src={src} alt={alt} loading="lazy" onError={() => setErr(true)} className="h-full w-full object-contain p-1" />;
};
