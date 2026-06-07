/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Head manager por ruta para una SPA CSR. Setea title, description,
 * canonical, Open Graph y Twitter por página vía efectos. Ayuda a Google
 * (que ejecuta JS). Para scrapers sociales sin JS, ver nota en README.
 */

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ORIGIN = 'https://vos-py.vercel.app';

const DEFAULTS = {
    title: 'Vos PY · Tienda de electrónica importada en Paraguay',
    description: 'Comprá electrónica importada en Paraguay: audio, celulares, gaming, smartwatches y accesorios. +1.700 productos de marcas originales, precios en guaraníes, garantía oficial y envíos a todo el país.',
    image: `${ORIGIN}/logo.png`,
};

function upsert(attr: 'name' | 'property', key: string, content: string) {
    let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
    if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
    }
    el.setAttribute('content', content);
}

function setCanonical(href: string) {
    let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!el) {
        el = document.createElement('link');
        el.setAttribute('rel', 'canonical');
        document.head.appendChild(el);
    }
    el.setAttribute('href', href);
}

export interface SeoOpts {
    title?: string;
    description?: string;
    /** Path absoluto sin origen (ej. "/catalogo"); por defecto usa la ruta actual. */
    canonicalPath?: string;
    image?: string;
    type?: 'website' | 'product' | 'article';
    noindex?: boolean;
}

export function useSeo(opts: SeoOpts) {
    const loc = useLocation();
    const { title, description, canonicalPath, image, type = 'website', noindex } = opts;

    useEffect(() => {
        const t = title ? `${title}` : DEFAULTS.title;
        const d = description ?? DEFAULTS.description;
        const img = image ?? DEFAULTS.image;
        const url = `${ORIGIN}${canonicalPath ?? loc.pathname}`;

        document.title = t;
        upsert('name', 'description', d);
        upsert('name', 'robots', noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large');
        upsert('property', 'og:title', t);
        upsert('property', 'og:description', d);
        upsert('property', 'og:url', url);
        upsert('property', 'og:image', img);
        upsert('property', 'og:type', type);
        upsert('name', 'twitter:title', t);
        upsert('name', 'twitter:description', d);
        upsert('name', 'twitter:image', img);
        setCanonical(url);

        return () => {
            // Restore site defaults so a stale product title doesn't leak.
            document.title = DEFAULTS.title;
            upsert('name', 'description', DEFAULTS.description);
            upsert('name', 'robots', 'index, follow, max-image-preview:large');
            upsert('property', 'og:title', DEFAULTS.title);
            upsert('property', 'og:description', DEFAULTS.description);
            upsert('property', 'og:url', `${ORIGIN}/`);
            upsert('property', 'og:image', DEFAULTS.image);
            upsert('property', 'og:type', 'website');
            setCanonical(`${ORIGIN}/`);
        };
    }, [title, description, canonicalPath, image, type, noindex, loc.pathname]);
}
