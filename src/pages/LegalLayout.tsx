/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const links = [
    { to: '/terminos', label: 'Términos y Condiciones' },
    { to: '/privacidad', label: 'Privacidad' },
    { to: '/cookies', label: 'Cookies' },
    { to: '/devoluciones', label: 'Devoluciones' },
    { to: '/envios', label: 'Envíos' },
    { to: '/garantia', label: 'Garantía' },
];

export const LegalLayout = ({ title, children }: { title: string; children: ReactNode }) => {
    return (
        <article className="container mx-auto px-4 py-10 md:py-16">
            <nav className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#0038A8]/70 mb-6">
                <Link to="/" className="hover:text-[#0038A8]">Inicio</Link>
                <ChevronRight className="h-3 w-3" />
                <span className="text-[#0038A8]">{title}</span>
            </nav>
            <div className="grid md:grid-cols-[220px_1fr] gap-10 md:gap-16">
                <aside className="md:sticky md:top-28 md:self-start">
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4">Información legal</p>
                    <ul className="space-y-2 text-sm">
                        {links.map((l) => (
                            <li key={l.to}>
                                <Link
                                    to={l.to}
                                    className={`block py-1.5 ${title === l.label ? 'text-[#0038A8] font-bold' : 'text-zinc-600 hover:text-[#0038A8]'}`}
                                >
                                    {l.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </aside>
                <div>
                    <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-6">{title}</h1>
                    <div className="legal-content text-zinc-700 [&_h2]:text-xl [&_h2]:font-black [&_h2]:tracking-tight [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:text-zinc-900 [&_p]:leading-relaxed [&_p]:mb-4 [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-4 [&_ul_li]:mb-1.5 [&_a]:text-[#0038A8] [&_a]:font-semibold [&_a:hover]:underline [&_strong]:text-zinc-900">
                        {children}
                    </div>
                </div>
            </div>
        </article>
    );
};
