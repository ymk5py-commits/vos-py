/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import {
    Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Mail, Lock, User as UserIcon, Eye, EyeOff, Check, Loader2 } from 'lucide-react';
import { GOOGLE_CLIENT_ID, loadGoogle, decodeGoogleJwt } from '../lib/googleAuth';

export const LoginModal = ({
    isOpen, onClose, onLogin,
}: {
    isOpen: boolean;
    onClose: () => void;
    onLogin: (user: { name: string; email: string }) => void;
}) => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [showPwd, setShowPwd] = useState(false);
    const [accept, setAccept] = useState(false);
    const [err, setErr] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [googleReady, setGoogleReady] = useState(false);
    const [googleErr, setGoogleErr] = useState<string | null>(null);

    const googleSlot = useRef<HTMLDivElement>(null);

    // Init Google Sign-In once when the modal opens, if Client ID configured.
    useEffect(() => {
        if (!isOpen || !GOOGLE_CLIENT_ID || !googleSlot.current) return;
        let cancelled = false;
        loadGoogle()
            .then(() => {
                if (cancelled || !window.google?.accounts?.id || !googleSlot.current) return;
                window.google.accounts.id.initialize({
                    client_id: GOOGLE_CLIENT_ID,
                    callback: (resp: any) => {
                        const profile = decodeGoogleJwt(resp?.credential ?? '');
                        if (!profile?.email) {
                            setGoogleErr('No pudimos leer tu cuenta de Google. Probá de nuevo.');
                            return;
                        }
                        onLogin({ email: profile.email, name: profile.name || profile.email.split('@')[0] });
                        onClose();
                    },
                    auto_select: false,
                    ux_mode: 'popup',
                    context: isSignUp ? 'signup' : 'signin',
                });
                googleSlot.current.innerHTML = '';
                window.google.accounts.id.renderButton(googleSlot.current, {
                    type: 'standard',
                    theme: 'outline',
                    size: 'large',
                    text: isSignUp ? 'signup_with' : 'continue_with',
                    shape: 'rectangular',
                    logo_alignment: 'left',
                    width: googleSlot.current.offsetWidth || 360,
                    locale: 'es',
                });
                setGoogleReady(true);
            })
            .catch(() => setGoogleErr('No se pudo cargar Google. Probá con tu email.'));
        return () => { cancelled = true; };
    }, [isOpen, isSignUp, onLogin, onClose]);

    // Reset form when toggling sign-in / sign-up
    useEffect(() => { setErr(null); }, [isSignUp]);

    // Reset when closing
    useEffect(() => { if (!isOpen) { setSubmitting(false); setErr(null); } }, [isOpen]);

    const isValidEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const cleanEmail = email.trim().slice(0, 254);
        const cleanName = (name || cleanEmail.split('@')[0]).trim().slice(0, 80);
        if (isSignUp && cleanName.length < 2) {
            setErr('Ingresá tu nombre completo.');
            return;
        }
        if (!isValidEmail(cleanEmail)) {
            setErr('Ingresá un correo electrónico válido.');
            return;
        }
        if (password.length < 6) {
            setErr('La contraseña debe tener al menos 6 caracteres.');
            return;
        }
        if (isSignUp && !accept) {
            setErr('Tenés que aceptar los términos y la política de privacidad.');
            return;
        }
        setErr(null);
        setSubmitting(true);
        // Mock — sin backend. Simulamos una pequeña espera de "API".
        setTimeout(() => {
            onLogin({ email: cleanEmail, name: cleanName });
            setSubmitting(false);
            onClose();
        }, 320);
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[440px] p-0 overflow-hidden">
                {/* Top accent strip in PY red */}
                <div className="h-1 bg-py-red" />

                <DialogHeader className="px-6 pt-6 pb-2">
                    <DialogTitle className="text-[22px] font-extrabold tracking-tight">
                        {isSignUp ? 'Creá tu cuenta' : 'Entrá a tu cuenta'}
                    </DialogTitle>
                    <DialogDescription className="text-[13px] text-ink-3 leading-relaxed">
                        {isSignUp
                            ? 'Guardá tus datos, hacé seguimiento de pedidos y comprá más rápido.'
                            : 'Bienvenido de nuevo. Coordinamos tu pedido por WhatsApp.'}
                    </DialogDescription>
                </DialogHeader>

                <div className="px-6 pb-6 space-y-5">
                    {/* Google sign-in */}
                    {GOOGLE_CLIENT_ID ? (
                        <div className="space-y-2">
                            <div ref={googleSlot} className="min-h-[44px] flex justify-center" />
                            {!googleReady && !googleErr && (
                                <p className="text-[11px] text-ink-3 text-center flex items-center justify-center gap-1.5">
                                    <Loader2 className="h-3 w-3 animate-spin" /> Preparando Google…
                                </p>
                            )}
                            {googleErr && (
                                <p className="text-[11px] text-py-red font-semibold text-center">{googleErr}</p>
                            )}
                        </div>
                    ) : (
                        <button
                            type="button"
                            disabled
                            className="w-full inline-flex items-center justify-center gap-3 h-11 border border-line bg-paper-2 text-ink-3 text-[13px] font-semibold cursor-not-allowed"
                            title="Google Sign-In aún no configurado (definí VITE_GOOGLE_CLIENT_ID)"
                        >
                            <GoogleG className="h-4 w-4 opacity-50" />
                            Continuar con Google
                            <span className="text-[10px] uppercase tracking-wider opacity-70">próximamente</span>
                        </button>
                    )}

                    {/* Divider */}
                    <div className="relative flex items-center">
                        <div className="flex-1 h-px bg-line" />
                        <span className="px-3 text-[10px] uppercase tracking-widest text-ink-3 font-bold">
                            o con tu email
                        </span>
                        <div className="flex-1 h-px bg-line" />
                    </div>

                    {/* Email/password form */}
                    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                        {isSignUp && (
                            <Field
                                id="name" label="Nombre completo" icon={UserIcon}
                                value={name} onChange={setName} type="text"
                                placeholder="Juan Pérez" autoComplete="name" maxLength={80}
                            />
                        )}
                        <Field
                            id="email" label="Correo electrónico" icon={Mail}
                            value={email} onChange={setEmail} type="email"
                            placeholder="tu@email.com" autoComplete="email" maxLength={254}
                            inputMode="email"
                        />
                        <Field
                            id="password" label="Contraseña" icon={Lock}
                            value={password} onChange={setPassword} type={showPwd ? 'text' : 'password'}
                            placeholder="Mínimo 6 caracteres" autoComplete={isSignUp ? 'new-password' : 'current-password'}
                            maxLength={100}
                            right={
                                <button
                                    type="button"
                                    onClick={() => setShowPwd((v) => !v)}
                                    aria-label={showPwd ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                                    className="h-9 w-9 inline-flex items-center justify-center text-ink-3 hover:text-ink"
                                >
                                    {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            }
                        />

                        {isSignUp && (
                            <label className="flex items-start gap-2 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={accept}
                                    onChange={(e) => setAccept(e.target.checked)}
                                    className="mt-0.5 h-4 w-4 accent-py-red shrink-0"
                                />
                                <span className="text-[11px] text-ink-2 leading-relaxed">
                                    Acepto los{' '}
                                    <a href="/terminos" target="_blank" className="link-underline font-semibold">Términos</a>
                                    {' y la '}
                                    <a href="/privacidad" target="_blank" className="link-underline font-semibold">Política de Privacidad</a>.
                                </span>
                            </label>
                        )}

                        {err && (
                            <p className="text-[12px] text-py-red font-semibold bg-py-red/5 border border-py-red/20 px-3 py-2">
                                {err}
                            </p>
                        )}

                        <Button
                            type="submit"
                            disabled={submitting}
                            className="w-full h-12 bg-ink hover:bg-ink/90 text-paper text-[14px] font-bold uppercase tracking-wide disabled:opacity-60"
                        >
                            {submitting ? (
                                <span className="inline-flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Procesando…</span>
                            ) : isSignUp ? (
                                <span className="inline-flex items-center gap-2"><Check className="h-4 w-4" strokeWidth={2.5} /> Crear cuenta</span>
                            ) : (
                                'Entrar'
                            )}
                        </Button>
                    </form>

                    <p className="text-center text-[13px] text-ink-3">
                        {isSignUp ? '¿Ya tenés cuenta? ' : '¿Sos nuevo? '}
                        <button
                            onClick={() => setIsSignUp((v) => !v)}
                            className="link-underline font-bold text-ink"
                        >
                            {isSignUp ? 'Iniciar sesión' : 'Crear cuenta'}
                        </button>
                    </p>

                    <p className="text-[10px] uppercase tracking-widest text-amber-700 text-center font-bold bg-amber-50 border border-amber-200 px-3 py-2">
                        Beta · sin cuenta real aún
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
};

/* ---------------- Field primitive ---------------- */

interface FieldProps {
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    value: string;
    onChange: (v: string) => void;
    type?: string;
    placeholder?: string;
    autoComplete?: string;
    inputMode?: 'text' | 'email' | 'tel' | 'numeric' | 'search' | 'url' | 'decimal' | 'none';
    maxLength?: number;
    right?: React.ReactNode;
}

const Field: React.FC<FieldProps> = ({
    id, label, icon: Icon, value, onChange, type = 'text',
    placeholder, autoComplete, inputMode, maxLength, right,
}) => (
    <div className="space-y-1.5">
        <Label htmlFor={id} className="text-[11px] uppercase tracking-wider font-bold text-ink-3">
            {label}
        </Label>
        <div className="relative">
            <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-3" />
            <Input
                id={id}
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                autoComplete={autoComplete}
                inputMode={inputMode}
                maxLength={maxLength}
                className={`pl-10 ${right ? 'pr-12' : ''}`}
                required
            />
            {right && <span className="absolute right-1 top-1/2 -translate-y-1/2">{right}</span>}
        </div>
    </div>
);

/* ---------------- Google G logo (for the "próximamente" fallback) ---------------- */

const GoogleG: React.FC<{ className?: string }> = ({ className }) => (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
        <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
        <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
        <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571.001-.001.002-.001.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
    </svg>
);
