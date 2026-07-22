/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useSeo } from '../lib/seo';

const links = [
    { to: '/terminos', label: 'Términos y Condiciones' },
    { to: '/privacidad', label: 'Privacidad' },
    { to: '/cookies', label: 'Cookies' },
    { to: '/devoluciones', label: 'Devoluciones' },
    { to: '/envios', label: 'Envíos' },
    { to: '/garantia', label: 'Garantía' },
];

export const LegalLayout = ({ title, children }: { title: string; children: ReactNode }) => {
    useSeo({ title: `${title} · Vos PY`, description: `${title} de Vos PY, tienda de electrónica importada en Paraguay.` });
    return (
        <article className="container mx-auto px-4 py-10 md:py-16">
            <nav className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-ink-3 mb-6">
                <Link to="/" className="hover:text-ink">Inicio</Link>
                <ChevronRight className="h-3 w-3" />
                <span className="text-ink">{title}</span>
            </nav>
            <div className="grid md:grid-cols-[220px_1fr] gap-10 md:gap-16">
                <aside className="md:sticky md:top-28 md:self-start">
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-ink-2 mb-4">Información legal</p>
                    <ul className="space-y-2 text-sm">
                        {links.map((l) => (
                            <li key={l.to}>
                                <Link
                                    to={l.to}
                                    className={`block py-1.5 ${title === l.label ? 'text-ink font-bold' : 'text-ink-3 hover:text-ink'}`}
                                >
                                    {l.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </aside>
                <div>
                    <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-6">{title}</h1>
                    <div className="legal-content text-ink-2 [&_h2]:text-xl [&_h2]:font-black [&_h2]:tracking-tight [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:text-ink [&_p]:leading-relaxed [&_p]:mb-4 [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-4 [&_ul_li]:mb-1.5 [&_a]:text-ink [&_a]:font-semibold [&_a:hover]:underline [&_strong]:text-ink">
                        {children}
                    </div>
                </div>
            </div>
        </article>
    );
};
