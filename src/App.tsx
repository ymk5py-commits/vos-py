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
import { Terms, Privacy, Cookies, Returns, Shipping, Warranty } from './pages/LegalPages';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="container mx-auto px-4 py-24 text-center">
    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#D52B1E] mb-3">Error 404</p>
    <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4">No encontramos esa página</h1>
    <p className="text-muted-foreground mb-8">La URL no existe o el contenido fue removido.</p>
    <Link to="/" className="inline-block bg-[#0038A8] hover:bg-[#002b80] text-white rounded-full px-8 h-12 leading-[3rem] font-bold">
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
