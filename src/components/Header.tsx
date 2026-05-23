/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Search, ShoppingBag, User, Menu, ChevronDown, X, LogOut, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useStore } from '../store';
import { motion, AnimatePresence } from 'motion/react';
import { Logo } from './Logo';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetClose,
} from './ui/sheet';

interface HeaderProps {
    cartCount: number;
    onLoginClick: () => void;
    onCartClick: () => void;
    user: any;
    search: string;
    onSearchChange: (value: string) => void;
    categories: { name: string; icon: string }[];
    onSelectCategory: (cat: string) => void;
    onShowOffers: () => void;
    onShowAbout: () => void;
    onShowHelp: () => void;
}

export const Header = ({
    cartCount, onLoginClick, onCartClick, user,
    search, onSearchChange, categories,
    onSelectCategory, onShowOffers, onShowAbout, onShowHelp,
}: HeaderProps) => {
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
    const [catOpen, setCatOpen] = useState(false);
    const [userOpen, setUserOpen] = useState(false);
    const catRef = useRef<HTMLDivElement>(null);
    const userRef = useRef<HTMLDivElement>(null);
    const { logout, lastOrder } = useStore();

    useEffect(() => {
        const onDoc = (e: MouseEvent) => {
            if (catRef.current && !catRef.current.contains(e.target as Node)) setCatOpen(false);
            if (userRef.current && !userRef.current.contains(e.target as Node)) setUserOpen(false);
        };
        document.addEventListener('mousedown', onDoc);
        return () => document.removeEventListener('mousedown', onDoc);
    }, []);

    const pickCategory = (c: string) => { setCatOpen(false); onSelectCategory(c); };

    return (
        <header className="sticky top-0 z-50 bg-paper/85 backdrop-blur supports-[backdrop-filter]:bg-paper/70 border-b border-line">
            {/* Top strip — informational, slim, no emoji */}
            <div className="bg-ink text-paper text-[11px]">
                <div className="max-w-[1400px] mx-auto px-5 md:px-8 lg:px-12 h-7 flex items-center justify-between">
                    <span className="font-medium tracking-wide">Envíos a todo Paraguay · Coordinamos por WhatsApp</span>
                    <span className="hidden sm:block tabular tracking-wider">+595 21 000 000</span>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto px-5 md:px-8 lg:px-12">
                <div className="flex h-16 md:h-20 items-center gap-4 md:gap-8">
                    {/* Mobile menu */}
                    <div className="lg:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" aria-label="Menú" className="hover:bg-paper-2">
                                    <Menu className="h-5 w-5" strokeWidth={2.2} />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-[320px] p-0 bg-paper flex flex-col">
                                <SheetHeader className="px-6 py-5 border-b border-line">
                                    <SheetTitle className="text-left">
                                        <Logo />
                                    </SheetTitle>
                                </SheetHeader>
                                <div className="flex-1 overflow-y-auto px-6 py-6">
                                    <p className="text-eyebrow text-ink-3 mb-4">Catálogo</p>
                                    <nav className="flex flex-col -mx-2">
                                        <SheetClose asChild>
                                            <button onClick={() => pickCategory('all')} className="text-left px-2 py-3 text-[15px] font-semibold border-b border-line hover:text-ink">
                                                Ver todo
                                            </button>
                                        </SheetClose>
                                        {categories.map((c) => (
                                            <SheetClose asChild key={c.name}>
                                                <button onClick={() => pickCategory(c.name)} className="text-left px-2 py-3 text-[15px] border-b border-line text-ink hover:text-ink">
                                                    {c.name}
                                                </button>
                                            </SheetClose>
                                        ))}
                                    </nav>
                                    <p className="text-eyebrow text-ink-3 mt-8 mb-4">Más</p>
                                    <nav className="flex flex-col -mx-2 text-[15px]">
                                        <SheetClose asChild>
                                            <button onClick={onShowOffers} className="text-left px-2 py-3 border-b border-line text-py-red font-semibold">Ofertas</button>
                                        </SheetClose>
                                        <SheetClose asChild>
                                            <button onClick={onShowAbout} className="text-left px-2 py-3 border-b border-line">Nosotros</button>
                                        </SheetClose>
                                        <SheetClose asChild>
                                            <button onClick={onShowHelp} className="text-left px-2 py-3 border-b border-line">Ayuda</button>
                                        </SheetClose>
                                        <SheetClose asChild>
                                            <button onClick={onLoginClick} className="text-left px-2 py-3 border-b border-line">{user ? user.name : 'Mi cuenta'}</button>
                                        </SheetClose>
                                    </nav>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>

                    {/* Logo */}
                    <Link to="/" aria-label="Vos PY" className="shrink-0">
                        <Logo />
                    </Link>

                    {/* Search dominant */}
                    <div className="flex-1 max-w-2xl hidden lg:block relative">
                        <Input
                            placeholder="Buscá iPhone, JBL, Garmin, Nintendo…"
                            value={search}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="h-11 pl-11 pr-4 bg-paper-2 border-transparent focus-visible:bg-paper focus-visible:border-line focus-visible:ring-0 rounded-full text-[14px]"
                            maxLength={100}
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-3" />
                    </div>

                    {/* Desktop nav */}
                    <nav className="hidden lg:flex items-center gap-1 text-[13px] font-semibold">
                        <div ref={catRef} className="relative">
                            <button
                                onClick={() => setCatOpen((v) => !v)}
                                className="flex items-center gap-1 px-3 h-9 rounded-md hover:bg-paper-2 transition-colors"
                            >
                                Catálogo
                                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${catOpen ? 'rotate-180' : ''}`} />
                            </button>
                            <AnimatePresence>
                                {catOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 6 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 6 }}
                                        transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                                        className="absolute left-0 mt-2 w-[440px] bg-paper border border-line shadow-2xl p-2 grid grid-cols-2 gap-0"
                                    >
                                        <button onClick={() => pickCategory('all')} className="col-span-2 text-left px-4 py-3 hover:bg-paper-2 border-b border-line font-semibold">
                                            Ver todo el catálogo →
                                        </button>
                                        {categories.map((c) => (
                                            <button
                                                key={c.name}
                                                onClick={() => pickCategory(c.name)}
                                                className="text-left px-4 py-2.5 text-[13px] hover:bg-paper-2 transition-colors"
                                            >
                                                {c.name}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        <button onClick={onShowOffers} className="px-3 h-9 rounded-md hover:bg-paper-2 text-py-red transition-colors">
                            Ofertas
                        </button>
                        <button onClick={onShowAbout} className="px-3 h-9 rounded-md hover:bg-paper-2">
                            Nosotros
                        </button>
                        <button onClick={onShowHelp} className="px-3 h-9 rounded-md hover:bg-paper-2">
                            Ayuda
                        </button>
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-1 md:gap-2 ml-auto">
                        <Button variant="ghost" size="icon" className="lg:hidden hover:bg-paper-2" onClick={() => setMobileSearchOpen((v) => !v)} aria-label="Buscar">
                            {mobileSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
                        </Button>
                        {user ? (
                            <div ref={userRef} className="relative hidden sm:block">
                                <button
                                    onClick={() => setUserOpen((v) => !v)}
                                    className="h-10 inline-flex items-center gap-2 px-3 hover:bg-paper-2 rounded-md"
                                    aria-label="Mi cuenta"
                                >
                                    <span className="h-7 w-7 bg-ink text-paper flex items-center justify-center text-[12px] font-bold tabular">
                                        {user.name?.[0]?.toUpperCase() || 'U'}
                                    </span>
                                    <span className="hidden xl:inline text-[13px] font-semibold max-w-[120px] truncate">{user.name}</span>
                                    <ChevronDown className={`h-3.5 w-3.5 transition-transform ${userOpen ? 'rotate-180' : ''}`} />
                                </button>
                                <AnimatePresence>
                                    {userOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 6 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 6 }}
                                            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                                            className="absolute right-0 mt-2 w-64 bg-paper border border-line shadow-2xl"
                                        >
                                            <div className="p-4 border-b border-line">
                                                <p className="text-eyebrow text-ink-3 mb-1">Conectado como</p>
                                                <p className="text-[13px] font-bold text-ink truncate">{user.name}</p>
                                                <p className="text-[12px] text-ink-3 truncate">{user.email}</p>
                                            </div>
                                            {lastOrder && (
                                                <Link
                                                    to={`/orden/${lastOrder.id}`}
                                                    onClick={() => setUserOpen(false)}
                                                    className="flex items-center gap-2 px-4 py-3 text-[13px] hover:bg-paper-2"
                                                >
                                                    <Package className="h-4 w-4" /> Último pedido
                                                    <span className="ml-auto tabular text-[11px] text-ink-3">{lastOrder.id.split('-')[2]}</span>
                                                </Link>
                                            )}
                                            <button
                                                onClick={() => { setUserOpen(false); logout(); }}
                                                className="w-full text-left flex items-center gap-2 px-4 py-3 text-[13px] hover:bg-paper-2 text-py-red border-t border-line"
                                            >
                                                <LogOut className="h-4 w-4" /> Cerrar sesión
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <Button variant="ghost" size="icon" onClick={onLoginClick} className="hidden sm:flex hover:bg-paper-2" aria-label="Iniciar sesión">
                                <User className="h-5 w-5" strokeWidth={2.2} />
                            </Button>
                        )}
                        <div className="relative">
                            <Button variant="ghost" size="icon" onClick={onCartClick} className="hover:bg-paper-2" aria-label="Carrito">
                                <ShoppingBag className="h-5 w-5" strokeWidth={2.2} />
                            </Button>
                            <AnimatePresence mode="popLayout">
                                {cartCount > 0 && (
                                    <motion.span
                                        key={cartCount}
                                        initial={{ scale: 0.6, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0.6, opacity: 0 }}
                                        transition={{ type: 'spring', stiffness: 320, damping: 18 }}
                                        className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-py-red text-paper text-[10px] font-bold tabular flex items-center justify-center pointer-events-none"
                                    >
                                        {cartCount}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {mobileSearchOpen && (
                    <div className="lg:hidden pb-3 relative">
                        <Input
                            autoFocus
                            placeholder="Buscá productos…"
                            value={search}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="h-11 pl-11 bg-paper-2 border-transparent focus-visible:bg-paper focus-visible:border-line focus-visible:ring-0 rounded-full text-[14px]"
                            maxLength={100}
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-3" />
                    </div>
                )}
            </div>
        </header>
    );
};
