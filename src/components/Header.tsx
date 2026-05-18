/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Search, ShoppingCart, User, Menu, ChevronDown, Tag, Info, LifeBuoy } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Logo } from './Logo';
import { useState, useEffect, useRef } from 'react';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetClose,
} from './ui/sheet';
import { Badge } from './ui/badge';
import { motion, AnimatePresence } from 'motion/react';

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
    cartCount,
    onLoginClick,
    onCartClick,
    user,
    search,
    onSearchChange,
    categories,
    onSelectCategory,
    onShowOffers,
    onShowAbout,
    onShowHelp,
}: HeaderProps) => {
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
    const [catOpen, setCatOpen] = useState(false);
    const catRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const onDoc = (e: MouseEvent) => {
            if (catRef.current && !catRef.current.contains(e.target as Node)) setCatOpen(false);
        };
        document.addEventListener('mousedown', onDoc);
        return () => document.removeEventListener('mousedown', onDoc);
    }, []);

    const pickCategory = (c: string) => {
        setCatOpen(false);
        onSelectCategory(c);
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/70">
            {/* Top strip */}
            <div className="bg-[#0038A8] text-white text-[11px] md:text-xs">
                <div className="container mx-auto px-4 h-8 flex items-center justify-between">
                    <span className="font-semibold">🚚 Envío gratis a todo el país en compras seleccionadas</span>
                    <span className="hidden sm:block font-semibold">+1.700 productos · Garantía oficial</span>
                </div>
            </div>

            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between gap-3 md:gap-4">
                    {/* Mobile menu */}
                    <div className="lg:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" aria-label="Abrir menú">
                                    <Menu className="h-6 w-6" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-[300px] p-0 flex flex-col">
                                <SheetHeader className="p-5 border-b">
                                    <SheetTitle className="text-left">
                                        <Logo className="h-9" />
                                    </SheetTitle>
                                </SheetHeader>
                                <div className="flex-1 overflow-y-auto p-5">
                                    <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-3">
                                        Categorías
                                    </p>
                                    <nav className="flex flex-col">
                                        <SheetClose asChild>
                                            <button
                                                onClick={() => pickCategory('all')}
                                                className="text-left py-2.5 font-semibold border-b hover:text-[#0038A8]"
                                            >
                                                Todos los productos
                                            </button>
                                        </SheetClose>
                                        {categories.map((c) => (
                                            <SheetClose asChild key={c.name}>
                                                <button
                                                    onClick={() => pickCategory(c.name)}
                                                    className="text-left py-2.5 border-b hover:text-[#0038A8]"
                                                >
                                                    {c.name}
                                                </button>
                                            </SheetClose>
                                        ))}
                                    </nav>
                                    <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mt-6 mb-3">
                                        Más
                                    </p>
                                    <nav className="flex flex-col">
                                        <SheetClose asChild>
                                            <button onClick={onShowOffers} className="flex items-center gap-2 text-left py-2.5 border-b hover:text-[#D52B1E]">
                                                <Tag className="h-4 w-4" /> Ofertas
                                            </button>
                                        </SheetClose>
                                        <SheetClose asChild>
                                            <button onClick={onShowAbout} className="flex items-center gap-2 text-left py-2.5 border-b hover:text-[#0038A8]">
                                                <Info className="h-4 w-4" /> Nosotros
                                            </button>
                                        </SheetClose>
                                        <SheetClose asChild>
                                            <button onClick={onShowHelp} className="flex items-center gap-2 text-left py-2.5 border-b hover:text-[#0038A8]">
                                                <LifeBuoy className="h-4 w-4" /> Ayuda
                                            </button>
                                        </SheetClose>
                                        <SheetClose asChild>
                                            <button onClick={onLoginClick} className="flex items-center gap-2 text-left py-2.5 border-b hover:text-[#0038A8]">
                                                <User className="h-4 w-4" /> {user ? user.name : 'Mi cuenta'}
                                            </button>
                                        </SheetClose>
                                    </nav>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>

                    <a href="/" className="shrink-0 flex items-center" aria-label="Vos PY inicio">
                        <Logo className="h-9 md:h-12 flex items-center" />
                    </a>

                    {/* Desktop nav */}
                    <nav className="hidden lg:flex items-center gap-1">
                        <div ref={catRef} className="relative">
                            <button
                                onClick={() => setCatOpen((v) => !v)}
                                className="flex items-center gap-1 px-3 py-2 text-sm font-semibold rounded-lg hover:bg-muted transition-colors"
                            >
                                Categorías
                                <ChevronDown className={`h-4 w-4 transition-transform ${catOpen ? 'rotate-180' : ''}`} />
                            </button>
                            <AnimatePresence>
                                {catOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 8 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute left-0 mt-2 w-[480px] bg-white rounded-2xl shadow-2xl border p-4 grid grid-cols-2 gap-1"
                                    >
                                        <button
                                            onClick={() => pickCategory('all')}
                                            className="col-span-2 text-left px-3 py-2.5 rounded-lg font-bold text-[#0038A8] hover:bg-[#0038A8]/5"
                                        >
                                            Ver todo el catálogo
                                        </button>
                                        {categories.map((c) => (
                                            <button
                                                key={c.name}
                                                onClick={() => pickCategory(c.name)}
                                                className="text-left px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-muted transition-colors"
                                            >
                                                {c.name}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        <button onClick={onShowOffers} className="px-3 py-2 text-sm font-semibold rounded-lg hover:bg-muted text-[#D52B1E] transition-colors">
                            Ofertas
                        </button>
                        <button onClick={onShowAbout} className="px-3 py-2 text-sm font-semibold rounded-lg hover:bg-muted transition-colors">
                            Nosotros
                        </button>
                        <button onClick={onShowHelp} className="px-3 py-2 text-sm font-semibold rounded-lg hover:bg-muted transition-colors">
                            Ayuda
                        </button>
                    </nav>

                    {/* Search */}
                    <div className="flex-1 max-w-md hidden lg:flex relative">
                        <Input
                            placeholder="Buscá entre +1.700 productos…"
                            value={search}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="pr-10 rounded-full border-[#0038A8]/20 focus-visible:ring-[#0038A8]"
                        />
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>

                    <div className="flex items-center gap-1 md:gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden"
                            onClick={() => setMobileSearchOpen((v) => !v)}
                            aria-label="Buscar"
                        >
                            <Search className="h-5 w-5" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onLoginClick}
                            className="hidden sm:flex"
                            aria-label="Mi cuenta"
                        >
                            <User className="h-5 w-5" />
                            {user && <span className="ml-2 text-xs hidden xl:inline">{user.name}</span>}
                        </Button>
                        <div className="relative">
                            <Button variant="ghost" size="icon" onClick={onCartClick} aria-label="Carrito">
                                <ShoppingCart className="h-5 w-5" />
                            </Button>
                            <AnimatePresence mode="popLayout">
                                {cartCount > 0 && (
                                    <motion.div
                                        key={cartCount}
                                        initial={{ scale: 1.5, rotate: -10, opacity: 0 }}
                                        animate={{ scale: 1, rotate: 0, opacity: 1 }}
                                        exit={{ scale: 0.5, opacity: 0 }}
                                        transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                                        className="absolute -top-1 -right-1"
                                    >
                                        <Badge
                                            className="h-5 w-5 flex items-center justify-center p-0 bg-[#D52B1E] text-white border-none cursor-pointer"
                                            onClick={onCartClick}
                                        >
                                            {cartCount}
                                        </Badge>
                                    </motion.div>
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
                            className="pr-10 rounded-full border-[#0038A8]/20 focus-visible:ring-[#0038A8]"
                        />
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 -mt-1.5 h-4 w-4 text-muted-foreground" />
                    </div>
                )}
            </div>
        </header>
    );
};
