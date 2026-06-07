/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { About } from '../components/About';
import { useSeo } from '../lib/seo';

export default function AboutPage() {
    useSeo({
        title: 'Nosotros · Vos PY',
        description: 'Vos PY es una tienda online de electrónica importada en Paraguay: catálogo real, precios en guaraníes, marcas originales y atención por WhatsApp.',
    });
    return <About />;
}
