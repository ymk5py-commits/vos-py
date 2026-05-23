/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Google Sign-In via Google Identity Services (GIS), sin backend.
 * Configurá VITE_GOOGLE_CLIENT_ID en tu archivo .env.local con el Client ID
 * de tu proyecto en Google Cloud Console. Si está vacío, el botón se oculta
 * y el formulario por email sigue funcionando.
 *
 * Cómo obtener el Client ID:
 *  1. console.cloud.google.com → APIs y servicios → Credenciales → Crear
 *     credenciales → ID de cliente de OAuth → Aplicación web.
 *  2. Orígenes autorizados: https://vos-py.vercel.app  y  http://localhost:4173
 *  3. Copiá el "ID de cliente" (termina en .apps.googleusercontent.com).
 *  4. En Vercel: Settings → Environment Variables → agregá
 *     VITE_GOOGLE_CLIENT_ID con el valor copiado, marcado para Production.
 */

export const GOOGLE_CLIENT_ID = (import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined) || '';

declare global {
    interface Window {
        google?: {
            accounts?: {
                id?: {
                    initialize: (opts: any) => void;
                    renderButton: (el: HTMLElement, opts: any) => void;
                    prompt: (cb?: (n: any) => void) => void;
                    cancel: () => void;
                    disableAutoSelect: () => void;
                };
            };
        };
    }
}

let loadingPromise: Promise<void> | null = null;

/** Inserta el script de GIS una sola vez. Resuelve cuando window.google está listo. */
export function loadGoogle(): Promise<void> {
    if (typeof window === 'undefined') return Promise.reject(new Error('SSR'));
    if (window.google?.accounts?.id) return Promise.resolve();
    if (loadingPromise) return loadingPromise;
    loadingPromise = new Promise((resolve, reject) => {
        const existing = document.querySelector<HTMLScriptElement>('script[data-gsi]');
        if (existing) {
            existing.addEventListener('load', () => resolve(), { once: true });
            existing.addEventListener('error', () => reject(new Error('No se pudo cargar Google Sign-In')), { once: true });
            return;
        }
        const s = document.createElement('script');
        s.src = 'https://accounts.google.com/gsi/client';
        s.async = true;
        s.defer = true;
        s.dataset.gsi = 'true';
        s.onload = () => resolve();
        s.onerror = () => reject(new Error('No se pudo cargar Google Sign-In'));
        document.head.appendChild(s);
    });
    return loadingPromise;
}

export interface GoogleProfile {
    name: string;
    email: string;
    picture?: string;
    emailVerified: boolean;
}

/** Decodifica el JWT credential de Google (sólo el payload). NO valida firma —
 *  como esto es 100% client-side y la firma se valida server-side cuando exista
 *  backend, acá sólo lo usamos para mostrar nombre/email del usuario. */
export function decodeGoogleJwt(token: string): GoogleProfile | null {
    try {
        const part = token.split('.')[1];
        if (!part) return null;
        const padded = part.padEnd(part.length + (4 - (part.length % 4)) % 4, '=');
        const json = atob(padded.replace(/-/g, '+').replace(/_/g, '/'));
        const payload = JSON.parse(decodeURIComponent(escape(json)));
        return {
            name: (payload.name || payload.given_name || '').slice(0, 80),
            email: (payload.email || '').slice(0, 254),
            picture: payload.picture,
            emailVerified: !!payload.email_verified,
        };
    } catch {
        return null;
    }
}
