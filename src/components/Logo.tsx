/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const Logo = ({ className = '', invert = false }: { className?: string; invert?: boolean }) => {
  return (
    <div className={`flex items-center select-none ${className}`}>
      <img
        src="/logo.png"
        alt="Vos PY"
        width={500}
        height={500}
        className={`h-9 md:h-10 w-auto object-contain ${invert ? 'brightness-0 invert' : ''}`}
      />
    </div>
  );
};
