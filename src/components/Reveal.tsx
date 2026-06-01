/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Unified scroll-reveal. Rises + fades a block into view once.
 * Respects prefers-reduced-motion (Motion handles this when the user
 * has it set, by snapping to the animate state).
 */

import { ReactNode } from 'react';
import { motion } from 'motion/react';

const EASE = [0.22, 1, 0.36, 1] as const;

export const Reveal = ({
    children,
    delay = 0,
    y = 18,
    className = '',
    as = 'div',
}: {
    children: ReactNode;
    delay?: number;
    y?: number;
    className?: string;
    as?: 'div' | 'section' | 'li';
}) => {
    const MotionTag = motion[as];
    return (
        <MotionTag
            initial={{ opacity: 0, y }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px 0px -12% 0px' }}
            transition={{ duration: 0.55, ease: EASE, delay }}
            className={className}
        >
            {children}
        </MotionTag>
    );
};
