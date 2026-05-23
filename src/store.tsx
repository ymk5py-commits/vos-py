/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { Product } from './data/products';

interface CartItem { product: Product; quantity: number; }
interface MockUser { name: string; email: string; exp: number; }

interface StoreCtx {
    cart: CartItem[];
    cartCount: number;
    cartTotal: number;
    addToCart: (p: Product, q?: number, opts?: { open?: boolean }) => void;
    updateQuantity: (id: string, delta: number) => void;
    removeFromCart: (id: string) => void;
    clearCart: () => void;
    isCartOpen: boolean;
    openCart: () => void;
    closeCart: () => void;

    user: MockUser | null;
    isLoginOpen: boolean;
    openLogin: () => void;
    closeLogin: () => void;
    login: (u: { name: string; email: string }) => void;
    logout: () => void;
}

const Ctx = createContext<StoreCtx | null>(null);

const CART_KEY = 'vospy_cart_v3';
const USER_KEY = 'vospy_user_v2';
const USER_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export function StoreProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [user, setUser] = useState<MockUser | null>(null);
    const [isCartOpen, setCartOpen] = useState(false);
    const [isLoginOpen, setLoginOpen] = useState(false);

    useEffect(() => {
        try {
            const c = localStorage.getItem(CART_KEY);
            if (c) setCart(JSON.parse(c));
            const u = localStorage.getItem(USER_KEY);
            if (u) {
                const parsed: MockUser = JSON.parse(u);
                if (parsed?.exp && Date.now() < parsed.exp) setUser(parsed);
                else localStorage.removeItem(USER_KEY);
            }
        } catch { /* ignore corrupted */ }
    }, []);

    const persist = useCallback((next: CartItem[]) => {
        setCart(next);
        try { localStorage.setItem(CART_KEY, JSON.stringify(next)); } catch { /* quota */ }
    }, []);

    const addToCart = useCallback((p: Product, q = 1, opts?: { open?: boolean }) => {
        setCart((prev) => {
            const i = prev.findIndex((it) => it.product.id === p.id);
            const next = i > -1
                ? prev.map((it, idx) => idx === i ? { ...it, quantity: it.quantity + q } : it)
                : [...prev, { product: p, quantity: q }];
            try { localStorage.setItem(CART_KEY, JSON.stringify(next)); } catch { /* quota */ }
            return next;
        });
        if (opts?.open !== false) setCartOpen(true);
    }, []);

    const updateQuantity = useCallback((id: string, delta: number) => {
        setCart((prev) => {
            const next = prev.map((it) => it.product.id === id
                ? { ...it, quantity: Math.max(1, it.quantity + delta) }
                : it
            );
            try { localStorage.setItem(CART_KEY, JSON.stringify(next)); } catch { /* quota */ }
            return next;
        });
    }, []);

    const removeFromCart = useCallback((id: string) => {
        setCart((prev) => {
            const next = prev.filter((it) => it.product.id !== id);
            try { localStorage.setItem(CART_KEY, JSON.stringify(next)); } catch { /* quota */ }
            return next;
        });
    }, []);

    const clearCart = useCallback(() => persist([]), [persist]);

    const login = useCallback((u: { name: string; email: string }) => {
        const safe = {
            name: u.name.replace(/[<>\r\n]/g, '').slice(0, 80),
            email: u.email.replace(/[<>\r\n]/g, '').slice(0, 254),
            exp: Date.now() + USER_TTL_MS,
        };
        setUser(safe);
        try { localStorage.setItem(USER_KEY, JSON.stringify(safe)); } catch { /* quota */ }
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        localStorage.removeItem(USER_KEY);
    }, []);

    const cartCount = cart.reduce((a, b) => a + b.quantity, 0);
    const cartTotal = cart.reduce((a, b) => a + b.product.priceGs * b.quantity, 0);

    return (
        <Ctx.Provider value={{
            cart, cartCount, cartTotal, addToCart, updateQuantity, removeFromCart, clearCart,
            isCartOpen, openCart: () => setCartOpen(true), closeCart: () => setCartOpen(false),
            user, isLoginOpen, openLogin: () => setLoginOpen(true), closeLogin: () => setLoginOpen(false),
            login, logout,
        }}>
            {children}
        </Ctx.Provider>
    );
}

export function useStore() {
    const v = useContext(Ctx);
    if (!v) throw new Error('useStore fuera de StoreProvider');
    return v;
}
