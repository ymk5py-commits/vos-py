/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { LoginModal } from './components/LoginModal';
import { CookieBanner } from './components/CookieBanner';
import { useStore } from './store';
import { categories } from './data/products';

export default function Layout() {
    const nav = useNavigate();
    const loc = useLocation();
    const [search, setSearch] = useState('');
    const store = useStore();

    // Scroll to top on route change.
    useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior }); }, [loc.pathname]);

    const goCatalog = (params?: Record<string, string>) => {
        const q = params ? '?' + new URLSearchParams(params).toString() : '';
        nav(`/catalogo${q}`);
    };

    return (
        <div className="min-h-screen flex flex-col bg-background font-sans selection:bg-[#0038A8] selection:text-white">
            <Header
                cartCount={store.cartCount}
                onLoginClick={store.openLogin}
                onCartClick={store.openCart}
                user={store.user}
                search={search}
                onSearchChange={(v) => {
                    setSearch(v);
                    if (v.trim()) goCatalog({ q: v });
                }}
                categories={categories}
                onSelectCategory={(c) => c === 'all' ? goCatalog() : goCatalog({ categoria: c })}
                onShowOffers={() => goCatalog({ ofertas: '1' })}
                onShowAbout={() => nav('/nosotros')}
                onShowHelp={() => nav('/contacto')}
            />

            <main className="flex-1">
                <Outlet context={{ search, setSearch }} />
            </main>

            <Footer
                categories={categories}
                onSelectCategory={(c) => c === 'all' ? goCatalog() : goCatalog({ categoria: c })}
                onShowAbout={() => nav('/nosotros')}
            />

            <CartDrawer
                isOpen={store.isCartOpen}
                onClose={store.closeCart}
                items={store.cart}
                onUpdateQuantity={store.updateQuantity}
                onRemoveItem={store.removeFromCart}
            />
            <LoginModal
                isOpen={store.isLoginOpen}
                onClose={store.closeLogin}
                onLogin={store.login}
            />
            <CookieBanner />
        </div>
    );
}
