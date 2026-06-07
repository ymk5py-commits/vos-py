/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * "Visto recientemente" — rail de productos vistos, persistido en localStorage.
 */

import { useEffect, useState } from 'react';
import { ProductRail } from './ProductRail';
import { loadProducts, Product } from '../data/products';
import { useStore } from '../store';

export const RecentlyViewed = ({ excludeId, title = 'Visto recientemente' }: { excludeId?: string; title?: string }) => {
    const { recentIds } = useStore();
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => { loadProducts().then(setProducts); }, []);

    if (recentIds.length === 0 || products.length === 0) return null;

    const byId = new Map(products.map((p) => [p.id, p]));
    const items = recentIds
        .filter((id) => id !== excludeId)
        .map((id) => byId.get(id))
        .filter((p): p is Product => Boolean(p))
        .slice(0, 10);

    if (items.length < 2) return null;

    return (
        <div className="border-t border-line">
            <ProductRail products={items} eyebrow="Tu navegación" title={title} />
        </div>
    );
};
