/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';

/**
 * Returns whether secondary header bars should collapse.
 * Collapses when the user has scrolled past `threshold` AND is moving down.
 * Restores when scrolling up or near the top. Throttled via rAF.
 */
export function useHeaderCollapse(threshold = 160): boolean {
    const [collapsed, setCollapsed] = useState(false);

    useEffect(() => {
        let lastY = window.scrollY;
        let ticking = false;

        const update = () => {
            const y = window.scrollY;
            const goingDown = y > lastY;
            if (y < threshold) setCollapsed(false);
            else if (goingDown && y - lastY > 4) setCollapsed(true);
            else if (!goingDown && lastY - y > 4) setCollapsed(false);
            lastY = y;
            ticking = false;
        };

        const onScroll = () => {
            if (!ticking) {
                ticking = true;
                window.requestAnimationFrame(update);
            }
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, [threshold]);

    return collapsed;
}
