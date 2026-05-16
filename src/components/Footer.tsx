/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Logo } from './Logo';
import { Facebook, Instagram, Twitter, Youtube, MapPin, Phone, Mail } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

export const Footer = () => {
    return (
        <footer className="bg-[#151619] text-white pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    <div className="space-y-6">
                        <Logo invert />
                        <p className="text-zinc-400 text-sm leading-relaxed">
                            VOS PY es tu destino premium de compras en Paraguay. 
                            Ofrecemos lo mejor en electrónica, moda y hogar con garantía oficial.
                        </p>
                        <div className="flex gap-4">
                            <Button size="icon" variant="ghost" className="h-9 w-9 rounded-full bg-white/5 hover:bg-white/10">
                                <Facebook className="h-5 w-5" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-9 w-9 rounded-full bg-white/5 hover:bg-white/10">
                                <Instagram className="h-5 w-5" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-9 w-9 rounded-full bg-white/5 hover:bg-white/10">
                                <Twitter className="h-5 w-5" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-9 w-9 rounded-full bg-white/5 hover:bg-white/10">
                                <Youtube className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6 uppercase tracking-wider text-xs">Categorías</h4>
                        <ul className="space-y-4 text-sm text-zinc-400">
                            <li><a href="#" className="hover:text-white transition-colors">Electrónica</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Computadoras</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Audio</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Cámaras</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Hogar</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6 uppercase tracking-wider text-xs">Información</h4>
                        <ul className="space-y-4 text-sm text-zinc-400">
                            <li><a href="#" className="hover:text-white transition-colors">Sobre Nosotros</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Términos y Condiciones</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Política de Privacidad</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Ventas Corporativas</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Sucursales</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6 uppercase tracking-wider text-xs">Contacto</h4>
                        <ul className="space-y-4 text-sm text-zinc-400">
                            <li className="flex gap-3">
                                <MapPin className="h-5 w-5 text-[#D52B1E] shrink-0" />
                                <span>Edificio Vos PY, Asunción, Paraguay</span>
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
                                <Button className="bg-[#D52B1E] hover:bg-[#b02318]">Unirse</Button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-zinc-500">
                    <p>© 2024 Vos PY Importados. Todos los derechos reservados.</p>
                    <div className="flex gap-6">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4 grayscale opacity-50" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-4 grayscale opacity-50" />
                    </div>
                </div>
            </div>
        </footer>
    );
};
