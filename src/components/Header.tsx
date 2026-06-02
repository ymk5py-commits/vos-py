/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Header estilo retail PY (Nissei-inspired):
 * - Barra utilitaria roja arriba (envíos / contacto / sucursales)
 * - Barra principal con búsqueda dominante + cart + cuenta
 * - Barra de categorías con mega-menú abajo
 */

import { Search, ShoppingBag, User, Menu, ChevronDown, X, LogOut, Package, Phone, MapPin, MessageCircle,
    Headphones, Smartphone, Watch, Gamepad2, Cable, Tv, Camera, Laptop } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../store';
import { useHeaderCollapse } from '../hooks/useScrollDirection';
import { Logo } from './Logo';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
    Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose,
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

const CAT_ICONS: Record<string, any> = {
    Audio: Headphones, Celulares: Smartphone, Smartwatch: Watch, Gaming: Gamepad2,
    Accesorios: Cable, Televisores: Tv, 'Cámaras': Camera, 'Computación': Laptop,
    'Electrónica': Smartphone,
};

export const Header = ({
    cartCount, onLoginClick, onCartClick, user,
    search, onSearchChange, categories,
    onSelectCategory, onShowOffers, onShowAbout, onShowHelp,
}: HeaderProps) => {
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
    const [megaOpen, setMegaOpen] = useState(false);
    const [userOpen, setUserOpen] = useState(false);
    const megaRef = useRef<HTMLDivElement>(null);
    const userRef = useRef<HTMLDivElement>(null);
    const { logout, lastOrder } = useStore();
    const collapsed = useHeaderCollapse();

    useEffect(() => {
        const onDoc = (e: MouseEvent) => {
            if (megaRef.current && !megaRef.current.contains(e.target as Node)) setMegaOpen(false);
            if (userRef.current && !userRef.current.contains(e.target as Node)) setUserOpen(false);
        };
        document.addEventListener('mousedown', onDoc);
        return () => document.removeEventListener('mousedown', onDoc);
    }, []);

    const pickCategory = (c: string) => { setMegaOpen(false); onSelectCategory(c); };

    return (
        <header className="sticky top-0 z-50 bg-paper border-b border-line">
            {/* Top utility strip — red, retail PY style. Collapses on scroll down.
                Height-only collapse (solid, no opacity fade) so content never
                ghosts through the bar. */}
            <div className={`bg-py-red text-paper text-[11px] overflow-hidden transition-[height] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${collapsed ? 'h-0' : 'h-8'}`}>
                <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 h-8 flex items-center justify-between">
                    <span className="font-semibold tracking-wide flex items-center gap-1.5">
                        <MapPin className="h-3 w-3" /> Envíos a todo Paraguay
                    </span>
                    <div className="hidden sm:flex items-center gap-5">
                        <a href="https://wa.me/?text=Hola%20Vos%20PY" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:opacity-80">
                            <MessageCircle className="h-3 w-3" /> WhatsApp
                        </a>
                        <a href="tel:+59521000000" className="inline-flex items-center gap-1.5 hover:opacity-80 tabular">
                            <Phone className="h-3 w-3" /> +595 21 000 000
                        </a>
                        <Link to="/contacto" className="hover:opacity-80">Sucursales</Link>
                    </div>
                </div>
            </div>

            {/* Main bar */}
            <div className="border-b border-line">
                <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8">
                    <div className="flex h-16 md:h-20 items-center gap-3 md:gap-6">
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
                                        <SheetTitle className="text-left"><Logo /></SheetTitle>
                                    </SheetHeader>
                                    <div className="flex-1 overflow-y-auto px-6 py-6">
                                        <p className="text-eyebrow text-ink-3 mb-4">Categorías</p>
                                        <nav className="flex flex-col -mx-2">
                                            <SheetClose asChild>
                                                <button onClick={() => pickCategory('all')} className="text-left px-2 py-3 text-[15px] font-semibold border-b border-line hover:text-ink">
                                                    Ver todo
                                                </button>
                                            </SheetClose>
                                            {categories.map((c) => {
                                                const Icon = CAT_ICONS[c.name] ?? Smartphone;
                                                return (
                                                    <SheetClose asChild key={c.name}>
                                                        <button onClick={() => pickCategory(c.name)} className="text-left px-2 py-3 text-[15px] border-b border-line text-ink hover:text-ink inline-flex items-center gap-3">
                                                            <Icon className="h-4 w-4 text-ink-3" strokeWidth={1.6} />
                                                            {c.name}
                                                        </button>
                                                    </SheetClose>
                                                );
                                            })}
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

                        {/* Search dominant — retail style */}
                        <div className="flex-1 max-w-3xl hidden lg:block relative">
                            <Input
                                placeholder="¿Qué estás buscando? iPhone, JBL, Garmin…"
                                value={search}
                                onChange={(e) => onSearchChange(e.target.value)}
                                className="h-12 pl-12 pr-32 bg-paper-2 border-transparent focus-visible:bg-paper focus-visible:border-py-red focus-visible:ring-0 rounded-md text-[14px]"
                                maxLength={100}
                            />
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-3" />
                            <button
                                aria-label="Buscar"
                                className="press absolute right-1 top-1 bottom-1 px-5 bg-py-red text-paper text-[13px] font-bold hover:bg-py-red-deep transition-colors rounded"
                            >
                                Buscar
                            </button>
                        </div>

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
                                <button
                                    onClick={onLoginClick}
                                    className="hidden sm:inline-flex items-center gap-2 px-3 h-10 hover:bg-paper-2 rounded-md text-[13px] font-semibold"
                                    aria-label="Iniciar sesión"
                                >
                                    <User className="h-4 w-4" strokeWidth={2} />
                                    <span className="hidden xl:inline">Mi cuenta</span>
                                </button>
                            )}

                            <button
                                onClick={onCartClick}
                                className="press relative inline-flex items-center gap-2 px-3 h-10 bg-ink text-paper hover:bg-ink/90 rounded-md text-[13px] font-semibold"
                                aria-label="Carrito"
                            >
                                <ShoppingBag className="h-4 w-4" strokeWidth={2} />
                                <span className="hidden md:inline">Carrito</span>
                                <AnimatePresence mode="popLayout">
                                    {cartCount > 0 && (
                                        <motion.span
                                            key={cartCount}
                                            initial={{ scale: 0.6, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            exit={{ scale: 0.6, opacity: 0 }}
                                            transition={{ type: 'spring', stiffness: 320, damping: 18 }}
                                            className="absolute -top-1.5 -right-1.5 h-5 min-w-[20px] px-1 rounded-full bg-py-red text-paper text-[10px] font-bold tabular flex items-center justify-center pointer-events-none"
                                        >
                                            {cartCount}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </button>
                        </div>
                    </div>

                    {mobileSearchOpen && (
                        <div className="lg:hidden pb-3 relative">
                            <Input
                                autoFocus
                                placeholder="Buscá productos…"
                                value={search}
                                onChange={(e) => onSearchChange(e.target.value)}
                                className="h-11 pl-11 pr-20 bg-paper-2 border-transparent focus-visible:bg-paper focus-visible:border-py-red focus-visible:ring-0 rounded-md text-[14px]"
                                maxLength={100}
                            />
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 -mt-1.5 h-4 w-4 text-ink-3" />
                            <button className="absolute right-1 top-1 bottom-4 px-4 bg-py-red text-paper text-[12px] font-bold rounded">Buscar</button>
                        </div>
                    )}
                </div>
            </div>

            {/* Categories bar — Nissei-style, with mega menu. Collapses on scroll down.
                Height-only (no opacity fade). Overflow is visible when expanded so
                the mega-menu dropdown can escape, hidden+clipped when collapsed. */}
            <div className={`hidden lg:block bg-paper transition-[height] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${collapsed ? 'lg:h-0 lg:overflow-hidden lg:border-b-0 lg:pointer-events-none' : 'lg:h-11 lg:overflow-visible lg:border-b lg:border-line'}`}>
                <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8">
                    <div className="flex items-center gap-1 h-11">
                        <div ref={megaRef} className="relative">
                            <button
                                onClick={() => setMegaOpen((v) => !v)}
                                onMouseEnter={() => setMegaOpen(true)}
                                className="h-11 inline-flex items-center gap-2 px-4 bg-py-red text-paper text-[13px] font-bold hover:bg-py-red-deep transition-colors"
                            >
                                <Menu className="h-4 w-4" strokeWidth={2.4} />
                                Todas las categorías
                                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${megaOpen ? 'rotate-180' : ''}`} />
                            </button>
                            <AnimatePresence>
                                {megaOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 6 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 6 }}
                                        transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                                        onMouseLeave={() => setMegaOpen(false)}
                                        className="absolute left-0 mt-0 w-[520px] bg-paper border border-line shadow-2xl grid grid-cols-2 p-2 gap-0"
                                    >
                                        <button
                                            onClick={() => pickCategory('all')}
                                            className="col-span-2 text-left px-4 py-3 hover:bg-paper-2 border-b border-line font-bold inline-flex items-center justify-between"
                                        >
                                            Ver todo el catálogo <span className="text-py-red">→</span>
                                        </button>
                                        {categories.map((c) => {
                                            const Icon = CAT_ICONS[c.name] ?? Smartphone;
                                            return (
                                                <button
                                                    key={c.name}
                                                    onClick={() => pickCategory(c.name)}
                                                    className="text-left px-4 py-3 text-[13px] font-semibold hover:bg-paper-2 transition-colors inline-flex items-center gap-3"
                                                >
                                                    <Icon className="h-4 w-4 text-py-red" strokeWidth={1.8} />
                                                    {c.name}
                                                </button>
                                            );
                                        })}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <nav className="flex items-center gap-1 ml-2 text-[13px] font-semibold">
                            {categories.slice(0, 6).map((c) => (
                                <button
                                    key={c.name}
                                    onClick={() => onSelectCategory(c.name)}
                                    className="h-11 px-3 inline-flex items-center hover:text-py-red transition-colors"
                                >
                                    {c.name}
                                </button>
                            ))}
                            <button onClick={onShowOffers} className="h-11 px-3 inline-flex items-center text-py-red font-bold">
                                Ofertas
                            </button>
                        </nav>

                        <div className="ml-auto flex items-center gap-4 text-[12px] text-ink-3">
                            <NavLink to="/garantia" className={({ isActive }) => `hover:text-ink ${isActive ? 'text-ink font-bold' : ''}`}>Garantía</NavLink>
                            <NavLink to="/envios" className={({ isActive }) => `hover:text-ink ${isActive ? 'text-ink font-bold' : ''}`}>Envíos</NavLink>
                            <NavLink to="/contacto" className={({ isActive }) => `hover:text-ink ${isActive ? 'text-ink font-bold' : ''}`}>Contacto</NavLink>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};
