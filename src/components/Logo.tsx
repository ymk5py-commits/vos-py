/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ShoppingBag } from 'lucide-react';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export const Logo = ({ className = "", invert = false }: { className?: string, invert?: boolean }) => {
  return (
    <div className={`flex items-center select-none transition-transform duration-300 hover:scale-105 ${className}`}>
      <img 
        src="https://i.ibb.co/4gsK4xn5/hf-20260514-202310-243f9d1e-3843-4f15-8c59-9ed4f758c20d-removebg-preview.png" 
        alt="Vos PY Logo" 
        className={`h-16 md:h-20 w-auto object-contain ${invert ? 'brightness-0 invert' : ''}`}
        referrerPolicy="no-referrer"
      />
    </div>
  );
};
