/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Logo } from './Logo';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube, MapPin, Phone, Mail } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface FooterProps {
    categories: { name: string; icon: string }[];
    onSelectCategory: (cat: string) => void;
    onShowAbout: () => void;
}

export const Footer = ({ categories, onSelectCategory, onShowAbout }: FooterProps) => {
    return (
        <footer id="contacto" className="bg-[#151619] text-white pt-16 pb-8 scroll-mt-24">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 mb-12">
                    <div className="space-y-6">
                        <Logo invert />
                        <p className="text-zinc-400 text-sm leading-relaxed">
                            Vos PY es tu tienda de electrónica importada en Paraguay. Más de
                            1.700 productos de marcas originales, con garantía oficial, precios
                            en guaraníes y envíos a todo el país.
                        </p>
                        <div className="flex gap-3">
                            {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                                <Button
                                    key={i}
                                    size="icon"
                                    variant="ghost"
                                    className="h-9 w-9 rounded-full bg-white/5 hover:bg-white/10"
                                    aria-label="Red social"
                                >
                                    <Icon className="h-5 w-5" />
                                </Button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6 uppercase tracking-wider text-xs">Categorías</h4>
                        <ul className="space-y-3.5 text-sm text-zinc-400">
                            <li>
                                <button onClick={() => onSelectCategory('all')} className="hover:text-white transition-colors">
                                    Ver todo
                                </button>
                            </li>
                            {categories.slice(0, 6).map((c) => (
                                <li key={c.name}>
                                    <button
                                        onClick={() => onSelectCategory(c.name)}
                                        className="hover:text-white transition-colors text-left"
                                    >
                                        {c.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6 uppercase tracking-wider text-xs">Información</h4>
                        <ul className="space-y-3.5 text-sm text-zinc-400">
                            <li><Link to="/nosotros" className="hover:text-white transition-colors">Sobre Nosotros</Link></li>
                            <li><Link to="/terminos" className="hover:text-white transition-colors">Términos y Condiciones</Link></li>
                            <li><Link to="/privacidad" className="hover:text-white transition-colors">Política de Privacidad</Link></li>
                            <li><Link to="/cookies" className="hover:text-white transition-colors">Política de Cookies</Link></li>
                            <li><Link to="/devoluciones" className="hover:text-white transition-colors">Devoluciones</Link></li>
                            <li><Link to="/envios" className="hover:text-white transition-colors">Envíos</Link></li>
                            <li><Link to="/garantia" className="hover:text-white transition-colors">Garantía</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6 uppercase tracking-wider text-xs">Contacto</h4>
                        <ul className="space-y-3.5 text-sm text-zinc-400">
                            <li className="flex gap-3">
                                <MapPin className="h-5 w-5 text-[#D52B1E] shrink-0" />
                                <span>Asunción, Paraguay</span>
                            </li>
                            <li className="flex gap-3">
                                <Phone className="h-5 w-5 text-[#D52B1E] shrink-0" />
                                <span>+595 21 000 000</span>
                            </li>
                            <li className="flex gap-3">
                                <Mail className="h-5 w-5 text-[#D52B1E] shrink-0" />
                                <span>contacto@vospy.com.py</span>
                            </li>
                        </ul>
                        <div className="mt-8">
                            <h5 className="text-xs font-bold mb-4 uppercase">Suscríbete al Newsletter</h5>
                            <div className="flex gap-2">
                                <Input
                                    className="bg-white/5 border-white/10 focus:border-white/20 text-white"
                                    placeholder="tu@email.com"
                                />
                                <Button className="bg-[#D52B1E] hover:bg-[#b02318] shrink-0">Unirse</Button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-zinc-500">
                    <p>© 2026 Vos PY Importados. Todos los derechos reservados.</p>
                    <div className="flex gap-6">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4 grayscale opacity-50" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-4 grayscale opacity-50" />
                    </div>
                </div>
            </div>
        </footer>
    );
};
