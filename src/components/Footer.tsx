/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Link } from 'react-router-dom';
import { Logo } from './Logo';
import { Instagram, MessageCircle, Mail, ArrowUpRight } from 'lucide-react';
import { Input } from './ui/input';

interface FooterProps {
    categories: { name: string; icon: string }[];
    onSelectCategory: (cat: string) => void;
    onShowAbout: () => void;
}

export const Footer = ({ categories, onSelectCategory }: FooterProps) => {
    return (
        <footer id="contacto" className="border-t border-line bg-paper text-ink scroll-mt-24">
            <div className="max-w-[1400px] mx-auto px-5 md:px-8 lg:px-12 pt-20 pb-10">
                {/* Brand statement */}
                <div className="grid grid-cols-12 gap-x-6 gap-y-10 mb-16">
                    <div className="col-span-12 lg:col-span-7">
                        <h2 className="text-display-m text-ink max-w-xl">
                            Vos PY<span className="text-py-red">.</span><br />
                            <span className="text-ink-2 font-bold">Importados, en guaraníes, sin vueltas.</span>
                        </h2>
                    </div>
                    <div className="col-span-12 lg:col-span-5 lg:pl-8 lg:border-l border-line">
                        <p className="text-eyebrow text-ink-3 mb-3">Newsletter</p>
                        <p className="text-[14px] text-ink-2 mb-4 max-w-sm">
                            Una vez por mes: nuevos productos, bajadas de precio y rarezas.
                            Sin spam.
                        </p>
                        <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
                            <Input
                                type="email"
                                placeholder="tu@email.com"
                                maxLength={254}
                                className="h-11 bg-paper-2 border-transparent rounded-full focus-visible:bg-paper focus-visible:border-line focus-visible:ring-0"
                                aria-label="Tu email"
                            />
                            <button
                                type="submit"
                                className="h-11 px-5 bg-ink text-paper rounded-full text-[13px] font-semibold hover:bg-ink/90 transition-colors"
                            >
                                Suscribirme
                            </button>
                        </form>
                    </div>
                </div>

                {/* Link columns */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16 border-y border-line py-12">
                    <Col title="Tienda">
                        <FootLink onClick={() => onSelectCategory('all')}>Catálogo</FootLink>
                        {categories.slice(0, 5).map((c) => (
                            <FootLink key={c.name} onClick={() => onSelectCategory(c.name)}>{c.name}</FootLink>
                        ))}
                    </Col>
                    <Col title="Información">
                        <FootLink to="/nosotros">Nosotros</FootLink>
                        <FootLink to="/contacto">Contacto</FootLink>
                        <FootLink to="/envios">Envíos</FootLink>
                        <FootLink to="/garantia">Garantía</FootLink>
                        <FootLink to="/devoluciones">Devoluciones</FootLink>
                    </Col>
                    <Col title="Legal">
                        <FootLink to="/terminos">Términos</FootLink>
                        <FootLink to="/privacidad">Privacidad</FootLink>
                        <FootLink to="/cookies">Cookies</FootLink>
                    </Col>
                    <Col title="Contacto">
                        <a
                            href="https://wa.me/?text=Hola%2C%20quiero%20hacer%20una%20consulta"
                            target="_blank" rel="noopener noreferrer"
                            className="block text-[13px] text-ink-2 hover:text-ink py-1 inline-flex items-center gap-1.5"
                        >
                            <MessageCircle className="h-3.5 w-3.5" strokeWidth={2} /> WhatsApp
                        </a>
                        <a
                            href="mailto:contacto@vospy.com.py"
                            className="block text-[13px] text-ink-2 hover:text-ink py-1 inline-flex items-center gap-1.5"
                        >
                            <Mail className="h-3.5 w-3.5" strokeWidth={2} /> contacto@vospy.com.py
                        </a>
                        <a
                            href="#"
                            className="block text-[13px] text-ink-2 hover:text-ink py-1 inline-flex items-center gap-1.5"
                        >
                            <Instagram className="h-3.5 w-3.5" strokeWidth={2} /> @vos.py
                        </a>
                        <Link to="/.well-known/security.txt" className="block text-[12px] text-ink-3 hover:text-ink py-1 mt-3 inline-flex items-center gap-1">
                            Reportar vulnerabilidad <ArrowUpRight className="h-3 w-3" />
                        </Link>
                    </Col>
                </div>

                {/* Logo + meta */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <Logo />
                    <div className="text-[12px] text-ink-3 space-y-1 md:text-right">
                        <p>© 2026 Vos PY · Asunción, Paraguay</p>
                        <p className="tabular">Operaciones con factura legal, IVA incluido.</p>
                        <p>Compromiso con la Ley 1334/98 de Defensa del Consumidor.</p>
                    </div>
                </div>
            </div>

            {/* Paraguay stripe — only place the flag lives */}
            <div className="flex h-1.5 w-full" aria-hidden="true">
                <div className="flex-1 bg-py-red" />
                <div className="flex-1 bg-paper" />
                <div className="flex-1 bg-py-blue" />
            </div>
        </footer>
    );
};

const Col = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div>
        <p className="text-eyebrow text-ink-3 mb-4">{title}</p>
        <div className="flex flex-col">{children}</div>
    </div>
);

const FootLink = ({
    to, onClick, children,
}: { to?: string; onClick?: () => void; children: React.ReactNode }) => {
    const cls = 'block text-[13px] text-ink-2 hover:text-ink py-1 text-left';
    return to
        ? <Link to={to} className={cls}>{children}</Link>
        : <button onClick={onClick} className={cls}>{children}</button>;
};
