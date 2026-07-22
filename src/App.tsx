/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import ProductPage from './pages/ProductPage';
import Contact from './pages/Contact';
import AboutPage from './pages/AboutPage';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import { Terms, Privacy, Cookies, Returns, Shipping, Warranty } from './pages/LegalPages';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 py-24 md:py-32 text-center">
    <p className="text-eyebrow text-py-red mb-3">Error 404</p>
    <h1 className="text-display-m text-ink mb-4">No encontramos esa página</h1>
    <p className="text-ink-2 mb-8">La URL no existe o el contenido fue removido.</p>
    <Link to="/" className="press inline-flex items-center bg-ink hover:bg-ink/90 text-paper px-8 h-12 font-semibold text-[14px] transition-colors">
      Volver al inicio
    </Link>
  </div>
);

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/catalogo" element={<Catalog />} />
        <Route path="/producto/:id" element={<ProductPage />} />
        <Route path="/nosotros" element={<AboutPage />} />
        <Route path="/contacto" element={<Contact />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orden/:id" element={<OrderConfirmation />} />
        <Route path="/terminos" element={<Terms />} />
        <Route path="/privacidad" element={<Privacy />} />
        <Route path="/cookies" element={<Cookies />} />
        <Route path="/devoluciones" element={<Returns />} />
        <Route path="/envios" element={<Shipping />} />
        <Route path="/garantia" element={<Warranty />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
