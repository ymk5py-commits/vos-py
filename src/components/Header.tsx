/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Search, ShoppingCart, User, Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Logo } from './Logo';
import { useState } from 'react';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
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
}

export const Header = ({ cartCount, onLoginClick, onCartClick, user, search, onSearchChange }: HeaderProps) => {
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between gap-4">
                    {/* ... Mobile Menu ... */}
                    <div className="md:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <Menu className="h-6 w-6" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left">
                                <SheetHeader>
                                    <SheetTitle>Menú</SheetTitle>
                                </SheetHeader>
                                <nav className="mt-8 flex flex-col gap-4">
                                    <a href="#" className="text-lg font-medium">Categorías</a>
                                    <a href="#" className="text-lg font-medium">Ofertas</a>
                                    <a href="#" className="text-lg font-medium">Novedades</a>
                                    <a href="#" className="text-lg font-medium">Ayuda</a>
                                </nav>
                            </SheetContent>
                        </Sheet>
                    </div>

                    <a href="/" className="shrink-0 flex items-center">
                        <Logo className="h-10 md:h-12 flex items-center" />
                    </a>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex gap-6 mx-8">
                        <a href="#" className="text-sm font-medium hover:text-[#D52B1E] transition-colors">Categorías</a>
                        <a href="#" className="text-sm font-medium hover:text-[#D52B1E] transition-colors">Ofertas</a>
                        <a href="#" className="text-sm font-medium hover:text-[#D52B1E] transition-colors">Novedades</a>
                        <a href="#" className="text-sm font-medium hover:text-[#D52B1E] transition-colors">Ayuda</a>
                    </nav>

                    {/* Search Bar */}
                    <div className="flex-1 max-w-md hidden lg:flex relative">
                        <Input
                            placeholder="Buscá entre +1.700 productos…"
                            value={search}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="pr-10 rounded-full border-[#0038A8]/20 focus-visible:ring-[#0038A8]"
                        />
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden"
                            onClick={() => setMobileSearchOpen((v) => !v)}
                        >
                            <Search className="h-5 w-5" />
                        </Button>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={onLoginClick}
                            className="hidden sm:flex"
                        >
                            <User className="h-5 w-5" />
                            {user && <span className="ml-2 text-xs hidden xl:inline">{user.name}</span>}
                        </Button>
                        <div className="relative">
                            <Button variant="ghost" size="icon" onClick={onCartClick}>
                                <ShoppingCart className="h-5 w-5" />
                            </Button>
                            <AnimatePresence mode="popLayout">
                                {cartCount > 0 && (
                                    <motion.div
                                        key={cartCount}
                                        initial={{ scale: 1.5, rotate: -10, opacity: 0 }}
                                        animate={{ scale: 1, rotate: 0, opacity: 1 }}
                                        exit={{ scale: 0.5, opacity: 0 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 15 }}
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
