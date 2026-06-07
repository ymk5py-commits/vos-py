/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createContext, useContext, useEffect, useState, useCallback, useRef, ReactNode } from 'react';
import { Product } from './data/products';

export interface CartItem { product: Product; quantity: number; }
export interface MockUser { name: string; email: string; exp: number; }

export interface Customer {
    name: string;
    email: string;
    phone: string;          // celular Paraguay
    document: string;       // cédula o RUC
}
export interface Shipping {
    type: 'delivery' | 'pickup';
    address: string;
    city: string;
    department: string;
    notes: string;
}
export type PaymentId = 'transferencia' | 'billetera' | 'efectivo';

export interface Order {
    id: string;
    createdAt: number;
    items: { id: string; name: string; brand: string; qty: number; priceGs: number; codigo?: string }[];
    totalGs: number;
    customer: Customer;
    shipping: Shipping;
    payment: PaymentId;
}

interface StoreCtx {
    // Cart
    cart: CartItem[];
    cartCount: number;
    cartTotal: number;
    addToCart: (p: Product, q?: number, opts?: { open?: boolean }) => void;
    updateQuantity: (id: string, delta: number) => void;
    setQuantity: (id: string, q: number) => void;
    removeFromCart: (id: string) => void;
    clearCart: () => void;
    isCartOpen: boolean;
    openCart: () => void;
    closeCart: () => void;

    // Toast (add-to-cart feedback)
    toast: { id: number; name: string } | null;
    dismissToast: () => void;

    // Auth (mock)
    user: MockUser | null;
    isLoginOpen: boolean;
    openLogin: () => void;
    closeLogin: () => void;
    login: (u: { name: string; email: string }) => void;
    logout: () => void;

    // Checkout
    customer: Customer;
    shipping: Shipping;
    payment: PaymentId;
    setCustomer: (c: Partial<Customer>) => void;
    setShipping: (s: Partial<Shipping>) => void;
    setPayment: (p: PaymentId) => void;
    resetCheckout: () => void;

    // Orders
    orders: Order[];
    lastOrder: Order | null;
    createOrder: () => Order;
    getOrder: (id: string) => Order | undefined;

    // Recently viewed
    recentIds: string[];
    recordView: (id: string) => void;
}

const Ctx = createContext<StoreCtx | null>(null);

const CART_KEY = 'vospy_cart_v3';
const USER_KEY = 'vospy_user_v2';
const CHECKOUT_KEY = 'vospy_checkout_v1';
const ORDERS_KEY = 'vospy_orders_v1';
const RECENT_KEY = 'vospy_recent_v1';
const USER_TTL_MS = 7 * 24 * 60 * 60 * 1000;

const defaultCustomer = (): Customer => ({ name: '', email: '', phone: '', document: '' });
const defaultShipping = (): Shipping => ({ type: 'delivery', address: '', city: '', department: '', notes: '' });

const safe = (s: string, n: number) => (s || '').replace(/[\r\n<>]/g, '').slice(0, n);

const persist = (k: string, v: unknown) => {
    try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* quota */ }
};
const load = <T,>(k: string): T | null => {
    try { const v = localStorage.getItem(k); return v ? JSON.parse(v) as T : null; } catch { return null; }
};

const newOrderId = () => {
    const d = new Date();
    const ts = `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}${String(d.getHours()).padStart(2, '0')}${String(d.getMinutes()).padStart(2, '0')}`;
    const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
    return `VOS-${ts}-${rand}`;
};

export function StoreProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [user, setUser] = useState<MockUser | null>(null);
    const [isCartOpen, setCartOpen] = useState(false);
    const [isLoginOpen, setLoginOpen] = useState(false);

    const [customer, setCustomerState] = useState<Customer>(defaultCustomer);
    const [shipping, setShippingState] = useState<Shipping>(defaultShipping);
    const [payment, setPaymentState] = useState<PaymentId>('transferencia');
    const [orders, setOrders] = useState<Order[]>([]);
    const [toast, setToast] = useState<{ id: number; name: string } | null>(null);
    const toastId = useRef(0);
    const [recentIds, setRecentIds] = useState<string[]>([]);

    // Hydrate from localStorage
    useEffect(() => {
        const c = load<CartItem[]>(CART_KEY);
        if (Array.isArray(c)) setCart(c);
        const u = load<MockUser>(USER_KEY);
        if (u?.exp && Date.now() < u.exp) setUser(u);
        else if (u) localStorage.removeItem(USER_KEY);
        const ck = load<{ customer: Customer; shipping: Shipping; payment: PaymentId }>(CHECKOUT_KEY);
        if (ck) {
            if (ck.customer) setCustomerState({ ...defaultCustomer(), ...ck.customer });
            if (ck.shipping) setShippingState({ ...defaultShipping(), ...ck.shipping });
            if (ck.payment) setPaymentState(ck.payment);
        }
        const o = load<Order[]>(ORDERS_KEY);
        if (Array.isArray(o)) setOrders(o);
        const r = load<string[]>(RECENT_KEY);
        if (Array.isArray(r)) setRecentIds(r);
    }, []);

    // Prefill customer when user logs in
    useEffect(() => {
        if (user) {
            setCustomerState((prev) => ({
                ...prev,
                name: prev.name || user.name,
                email: prev.email || user.email,
            }));
        }
    }, [user]);

    // Persist cart
    const writeCart = useCallback((next: CartItem[]) => {
        setCart(next);
        persist(CART_KEY, next);
    }, []);

    const addToCart = useCallback((p: Product, q = 1, opts?: { open?: boolean }) => {
        setCart((prev) => {
            const i = prev.findIndex((it) => it.product.id === p.id);
            const next = i > -1
                ? prev.map((it, idx) => idx === i ? { ...it, quantity: it.quantity + q } : it)
                : [...prev, { product: p, quantity: q }];
            persist(CART_KEY, next);
            return next;
        });
        // Open the drawer only if explicitly requested; otherwise show a toast.
        if (opts?.open === true) {
            setCartOpen(true);
        } else {
            toastId.current += 1;
            setToast({ id: toastId.current, name: p.name });
        }
    }, []);

    const dismissToast = useCallback(() => setToast(null), []);

    const recordView = useCallback((id: string) => {
        setRecentIds((prev) => {
            const next = [id, ...prev.filter((x) => x !== id)].slice(0, 12);
            persist(RECENT_KEY, next);
            return next;
        });
    }, []);

    const updateQuantity = useCallback((id: string, delta: number) => {
        setCart((prev) => {
            const next = prev.map((it) => it.product.id === id
                ? { ...it, quantity: Math.max(1, it.quantity + delta) }
                : it
            );
            persist(CART_KEY, next);
            return next;
        });
    }, []);

    const setQuantity = useCallback((id: string, q: number) => {
        setCart((prev) => {
            const next = prev.map((it) => it.product.id === id
                ? { ...it, quantity: Math.max(1, Math.min(99, q)) }
                : it
            );
            persist(CART_KEY, next);
            return next;
        });
    }, []);

    const removeFromCart = useCallback((id: string) => {
        setCart((prev) => {
            const next = prev.filter((it) => it.product.id !== id);
            persist(CART_KEY, next);
            return next;
        });
    }, []);

    const clearCart = useCallback(() => writeCart([]), [writeCart]);

    const login = useCallback((u: { name: string; email: string }) => {
        const next = {
            name: safe(u.name, 80),
            email: safe(u.email, 254),
            exp: Date.now() + USER_TTL_MS,
        };
        setUser(next);
        persist(USER_KEY, next);
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        localStorage.removeItem(USER_KEY);
    }, []);

    // Checkout setters with persistence
    const setCustomer = useCallback((c: Partial<Customer>) => {
        setCustomerState((prev) => {
            const next: Customer = {
                name: safe(c.name ?? prev.name, 80),
                email: safe(c.email ?? prev.email, 254),
                phone: safe(c.phone ?? prev.phone, 30),
                document: safe(c.document ?? prev.document, 30),
            };
            return next;
        });
    }, []);
    const setShipping = useCallback((s: Partial<Shipping>) => {
        setShippingState((prev) => {
            const next: Shipping = {
                type: s.type ?? prev.type,
                address: safe(s.address ?? prev.address, 160),
                city: safe(s.city ?? prev.city, 60),
                department: safe(s.department ?? prev.department, 40),
                notes: safe(s.notes ?? prev.notes, 280),
            };
            return next;
        });
    }, []);
    const setPayment = useCallback((p: PaymentId) => setPaymentState(p), []);

    // Persist checkout snapshot when relevant fields change
    useEffect(() => {
        persist(CHECKOUT_KEY, { customer, shipping, payment });
    }, [customer, shipping, payment]);

    const resetCheckout = useCallback(() => {
        setCustomerState(defaultCustomer());
        setShippingState(defaultShipping());
        setPaymentState('transferencia');
        localStorage.removeItem(CHECKOUT_KEY);
    }, []);

    const createOrder = useCallback((): Order => {
        const totalGs = cart.reduce((a, b) => a + b.product.priceGs * b.quantity, 0);
        const o: Order = {
            id: newOrderId(),
            createdAt: Date.now(),
            items: cart.map((it) => ({
                id: it.product.id,
                name: it.product.name,
                brand: it.product.brand,
                qty: it.quantity,
                priceGs: it.product.priceGs,
                codigo: it.product.codigo,
            })),
            totalGs,
            customer,
            shipping,
            payment,
        };
        setOrders((prev) => {
            const next = [o, ...prev].slice(0, 20);
            persist(ORDERS_KEY, next);
            return next;
        });
        writeCart([]);
        return o;
    }, [cart, customer, shipping, payment, writeCart]);

    const getOrder = useCallback((id: string) => orders.find((o) => o.id === id), [orders]);

    const cartCount = cart.reduce((a, b) => a + b.quantity, 0);
    const cartTotal = cart.reduce((a, b) => a + b.product.priceGs * b.quantity, 0);
    const lastOrder = orders[0] ?? null;

    return (
        <Ctx.Provider value={{
            cart, cartCount, cartTotal, addToCart, updateQuantity, setQuantity, removeFromCart, clearCart,
            isCartOpen, openCart: () => setCartOpen(true), closeCart: () => setCartOpen(false),
            toast, dismissToast,
            user, isLoginOpen, openLogin: () => setLoginOpen(true), closeLogin: () => setLoginOpen(false),
            login, logout,
            customer, shipping, payment, setCustomer, setShipping, setPayment, resetCheckout,
            orders, lastOrder, createOrder, getOrder,
            recentIds, recordView,
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
