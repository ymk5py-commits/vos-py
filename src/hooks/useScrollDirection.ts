/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';

/**
 * Whether the header's secondary bars should collapse.
 *
 * Uses hysteresis (separate collapse / expand thresholds) plus a movement
 * deadzone so the state can never oscillate ("vibrate") near a boundary:
 *  - Expanded whenever near the top (< EXPAND_AT).
 *  - Collapses only after scrolling DOWN past COLLAPSE_AT.
 *  - Expands again on any meaningful UP scroll.
 *
 * The collapse removes ~76px of header height; the EXPAND_AT..COLLAPSE_AT gap
 * is far larger than that, so collapsing can never push scrollY back across a
 * threshold and re-trigger. rAF-throttled, passive listener.
 */
export function useHeaderCollapse(): boolean {
    const [collapsed, setCollapsed] = useState(false);

    useEffect(() => {
        const COLLAPSE_AT = 240; // must pass this (scrolling down) to collapse
        const EXPAND_AT = 90;    // always expanded above this
        const DEADZONE = 8;      // ignore sub-pixel / micro scroll jitter

        let lastY = window.scrollY;
        let ticking = false;

        const update = () => {
            const y = window.scrollY;
            const dy = y - lastY;
            if (y <= EXPAND_AT) {
                setCollapsed(false);
            } else if (Math.abs(dy) > DEADZONE) {
                if (dy > 0 && y > COLLAPSE_AT) setCollapsed(true);
                else if (dy < 0) setCollapsed(false);
                lastY = y;
            }
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
    }, []);

    return collapsed;
}
