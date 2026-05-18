/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo, useRef } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CategoryFilter } from './components/CategoryFilter';
import { ProductCard } from './components/ProductCard';
import { Footer } from './components/Footer';
import { LoginModal } from './components/LoginModal';
import { ProductDetail } from './components/ProductDetail';
import { CartDrawer } from './components/CartDrawer';
import { About } from './components/About';
import { loadProducts, Product, categories } from './data/products';
import { Button } from './components/ui/button';
import { motion } from 'motion/react';
import { Loader2, SearchX } from 'lucide-react';

const PAGE_SIZE = 24;

export default function App() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [user, setUser] = useState<any>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [activeCategory, setActiveCategory] = useState('all');
  const [activeBrand, setActiveBrand] = useState('all');
  const [search, setSearch] = useState('');
  const [onlyOffers, setOnlyOffers] = useState(false);
  const [visible, setVisible] = useState(PAGE_SIZE);

  const catalogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadProducts()
      .then(setAllProducts)
      .catch((e) => setLoadError(e.message || 'Error al cargar el catálogo'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const savedUser = localStorage.getItem('vospy_user');
    if (savedUser) setUser(JSON.parse(savedUser));
    const savedCart = localStorage.getItem('vospy_cart_v3');
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  const saveCart = (newCart: { product: Product; quantity: number }[]) => {
    setCart(newCart);
    localStorage.setItem('vospy_cart_v3', JSON.stringify(newCart));
  };

  const handleLogin = (userData: any) => {
    setUser(userData);
    localStorage.setItem('vospy_user', JSON.stringify(userData));
  };

  const addToCart = (product: Product, quantity: number = 1) => {
    const i = cart.findIndex((item) => item.product.id === product.id);
    if (i > -1) {
      const newCart = [...cart];
      newCart[i].quantity += quantity;
      saveCart(newCart);
    } else {
      saveCart([...cart, { product, quantity }]);
    }
    setIsCartOpen(true);
  };

  const updateCartQuantity = (productId: string, delta: number) => {
    saveCart(
      cart.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeFromCart = (productId: string) => {
    saveCart(cart.filter((item) => item.product.id !== productId));
  };

  const handleShowDetail = (product: Product) => {
    setSelectedProduct(product);
    setIsDetailOpen(true);
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const brands = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of allProducts) counts.set(p.brand, (counts.get(p.brand) || 0) + 1);
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([b]) => b);
  }, [allProducts]);

  const categoriesInData = useMemo(
    () => [...new Set(allProducts.map((p) => p.category))].sort(),
    [allProducts]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return allProducts.filter((p) => {
      if (onlyOffers && !(p.discount > 0)) return false;
      if (activeCategory !== 'all' && p.category !== activeCategory) return false;
      if (activeBrand !== 'all' && p.brand !== activeBrand) return false;
      if (q && !`${p.name} ${p.brand} ${p.category}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [allProducts, activeCategory, activeBrand, search, onlyOffers]);

  useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [activeCategory, activeBrand, search, onlyOffers]);

  const featured = useMemo(() => allProducts.slice(0, 8), [allProducts]);

  const scrollToCatalog = () =>
    catalogRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const scrollToId = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const onSelectCategory = (cat: string) => {
    setOnlyOffers(false);
    setActiveCategory(cat);
    scrollToCatalog();
  };

  const onShowOffers = () => {
    setOnlyOffers(true);
    setActiveCategory('all');
    scrollToCatalog();
  };

  const onShowAbout = () => scrollToId('nosotros');
  const onShowHelp = () => scrollToId('contacto');

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-[#0038A8] selection:text-white">
      <Header
        cartCount={cartCount}
        onLoginClick={() => setIsLoginOpen(true)}
        onCartClick={() => setIsCartOpen(true)}
        user={user}
        search={search}
        onSearchChange={(v) => {
          setSearch(v);
          if (v) scrollToCatalog();
        }}
        categories={categories}
        onSelectCategory={onSelectCategory}
        onShowOffers={onShowOffers}
        onShowAbout={onShowAbout}
        onShowHelp={onShowHelp}
      />

      <main>
        <Hero onExplore={scrollToCatalog} />

        <CategoryFilter activeCategory={activeCategory} onSelect={onSelectCategory} />

        {/* Featured */}
        {!loading && !loadError && featured.length > 0 && (
          <section className="py-14 bg-white">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-8">
                Destacados de la semana
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {featured.map((product) => (
                  <ProductCard
                    key={`feat-${product.id}`}
                    product={product}
                    onAddToCart={(p) => addToCart(p, 1)}
                    onShowDetail={handleShowDetail}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Catalog */}
        <section id="catalogo" ref={catalogRef} className="py-16 scroll-mt-24">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-bold tracking-tight mb-2">
                  {onlyOffers
                    ? 'Ofertas'
                    : activeCategory === 'all'
                      ? 'Catálogo completo'
                      : activeCategory}
                </h2>
                <p className="text-muted-foreground">
                  {loading
                    ? 'Cargando productos…'
                    : `${filtered.length.toLocaleString('es-PY')} productos disponibles`}
                </p>
              </motion.div>

              <div className="flex flex-wrap gap-3">
                <select
                  value={activeCategory}
                  onChange={(e) => setActiveCategory(e.target.value)}
                  className="rounded-full border border-[#0038A8]/20 bg-white px-5 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0038A8]"
                >
                  <option value="all">Todas las categorías</option>
                  {categoriesInData.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <select
                  value={activeBrand}
                  onChange={(e) => setActiveBrand(e.target.value)}
                  className="rounded-full border border-[#0038A8]/20 bg-white px-5 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0038A8]"
                >
                  <option value="all">Todas las marcas</option>
                  {brands.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
            </div>

            {loading && (
              <div className="flex flex-col items-center justify-center py-32 gap-4 text-muted-foreground">
                <Loader2 className="h-10 w-10 animate-spin text-[#0038A8]" />
                <p className="font-semibold">Cargando catálogo…</p>
              </div>
            )}

            {loadError && (
              <div className="text-center py-24 bg-red-50 rounded-3xl">
                <p className="text-[#D52B1E] font-bold">{loadError}</p>
              </div>
            )}

            {!loading && !loadError && (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                  {filtered.slice(0, visible).map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={(p) => addToCart(p, 1)}
                      onShowDetail={handleShowDetail}
                    />
                  ))}
                </div>

                {filtered.length === 0 && (
                  <div className="text-center py-24 bg-muted/20 rounded-3xl flex flex-col items-center gap-4">
                    <SearchX className="h-12 w-12 text-muted-foreground/40" />
                    <p className="text-muted-foreground text-lg">
                      No encontramos productos con esos filtros.
                    </p>
                    <Button
                      variant="outline"
                      className="rounded-full"
                      onClick={() => {
                        setSearch('');
                        setActiveCategory('all');
                        setActiveBrand('all');
                      }}
                    >
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
                      Ver más productos ({(filtered.length - visible).toLocaleString('es-PY')} restantes)
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        <About />

        {/* Trust */}
        <section className="py-20 border-y bg-zinc-50/50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
              <div className="flex flex-col items-center space-y-4">
                <div className="h-16 w-16 bg-[#0038A8]/10 rounded-full flex items-center justify-center">
                  <svg className="h-8 w-8 text-[#0038A8]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <h3 className="text-lg font-bold">Garantía Oficial</h3>
                <p className="text-sm text-muted-foreground">Todos nuestros productos cuentan con garantía directa del fabricante.</p>
              </div>
              <div className="flex flex-col items-center space-y-4">
                <div className="h-16 w-16 bg-[#D52B1E]/10 rounded-full flex items-center justify-center">
                  <svg className="h-8 w-8 text-[#D52B1E]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <h3 className="text-lg font-bold">Envíos a todo el País</h3>
                <p className="text-sm text-muted-foreground">Llegamos a cada rincón de Paraguay con la mayor rapidez y seguridad.</p>
              </div>
              <div className="flex flex-col items-center space-y-4">
                <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="h-8 w-8 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                </div>
                <h3 className="text-lg font-bold">Pago Seguro</h3>
                <p className="text-sm text-muted-foreground">Múltiples métodos de pago con la mayor seguridad para tus transacciones.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer
        categories={categories}
        onSelectCategory={onSelectCategory}
        onShowAbout={onShowAbout}
      />

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLogin={handleLogin}
      />

      <ProductDetail
        product={selectedProduct}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onAddToCart={addToCart}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={updateCartQuantity}
        onRemoveItem={removeFromCart}
      />
    </div>
  );
}
