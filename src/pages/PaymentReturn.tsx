/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * /pago/retorno — return_url/cancel_url del pago con Bancard vPOS.
 * El formulario embebido redirige acá al terminar; esta página NO confía en
 * los query params para decidir el resultado, siempre verifica el estado
 * real vía /api/bancard/status (get_confirmation) antes de mostrar éxito.
 */

import { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Check, X, Loader2, MessageCircle, ArrowLeft } from 'lucide-react';
import { useStore } from '../store';
import { getBancardStatus } from '../lib/api';
import { readPendingBancardOrder, clearPendingBancardOrder } from '../lib/bancardPending';

type Verdict = 'checking' | 'paid' | 'cancelled' | 'declined' | 'unknown' | 'timeout';

// Backoff entre reintentos mientras Bancard responde "pending" (ms). Con
// esto se agotan ~35s antes de mostrar el estado "timeout" (distinto de un
// rechazo real: el pago puede seguir procesándose del lado de Bancard).
const POLL_DELAYS_MS = [2000, 3000, 5000, 8000, 13000];

export default function PaymentReturn() {
    const [params] = useSearchParams();
    const nav = useNavigate();
    const { saveExternalOrder } = useStore();
    const [verdict, setVerdict] = useState<Verdict>('checking');
    const [detail, setDetail] = useState<{ ticket: string | null; authorization: string | null } | null>(null);

    useEffect(() => {
        document.title = 'Confirmando pago · Vos PY';
        window.scrollTo({ top: 0 });

        const spidRaw = params.get('spid');
        const token = params.get('token') || '';
        const cancel = params.get('cancel') === '1';
        const spid = spidRaw ? Number(spidRaw) : NaN;

        if (cancel) { setVerdict('cancelled'); return; }
        if (!spidRaw || Number.isNaN(spid) || spid <= 0 || !token) { setVerdict('unknown'); return; }

        let alive = true;
        let timer: ReturnType<typeof setTimeout> | null = null;

        const finishPaid = (status: NonNullable<Awaited<ReturnType<typeof getBancardStatus>>>) => {
            const pending = readPendingBancardOrder(spid);
            if (pending) {
                saveExternalOrder(pending);
                clearPendingBancardOrder(spid);
                nav(`/orden/${pending.id}`, { replace: true });
                return;
            }
            setDetail(status.details ? { ticket: status.details.ticket, authorization: status.details.authorization } : null);
            setVerdict('paid');
        };

        const poll = async (attempt: number) => {
            const status = await getBancardStatus(spid, token);
            if (!alive) return;
            if (!status) { setVerdict('unknown'); return; }
            if (status.paid) return finishPaid(status);
            if (!status.pending) { setVerdict('declined'); return; }
            if (attempt >= POLL_DELAYS_MS.length) { setVerdict('timeout'); return; }
            timer = setTimeout(() => poll(attempt + 1), POLL_DELAYS_MS[attempt]);
        };

        poll(0);
        return () => { alive = false; if (timer) clearTimeout(timer); };
    }, [params, nav, saveExternalOrder]);

    if (verdict === 'checking') {
        return (
            <section className="max-w-xl mx-auto px-5 py-24 md:py-32 text-center">
                <Loader2 className="h-8 w-8 animate-spin text-ink-3 mx-auto mb-6" strokeWidth={1.6} />
                <p className="text-eyebrow text-ink-3 mb-2">Confirmando</p>
                <h1 className="text-headline text-ink">Estamos verificando tu pago…</h1>
            </section>
        );
    }

    if (verdict === 'paid') {
        return (
            <section className="max-w-xl mx-auto px-5 py-24 md:py-32 text-center">
                <div className="inline-flex items-center justify-center h-14 w-14 bg-ink text-paper mb-6">
                    <Check className="h-7 w-7" strokeWidth={2.5} />
                </div>
                <p className="text-eyebrow text-ink-3 mb-2">Pago aprobado</p>
                <h1 className="text-headline text-ink mb-4">Tu pago se procesó correctamente<span className="text-py-red">.</span></h1>
                {detail?.authorization && (
                    <p className="text-[13px] text-ink-3 mb-8 tabular">
                        Autorización {detail.authorization}{detail.ticket ? ` · Ticket ${detail.ticket}` : ''}
                    </p>
                )}
                <Link to="/" className="inline-flex items-center gap-2 text-[13px] font-semibold link-underline">
                    <ArrowLeft className="h-4 w-4" /> Volver al inicio
                </Link>
            </section>
        );
    }

    if (verdict === 'cancelled') {
        return (
            <section className="max-w-xl mx-auto px-5 py-24 md:py-32 text-center">
                <p className="text-eyebrow text-ink-3 mb-2">Pago cancelado</p>
                <h1 className="text-headline text-ink mb-4">Cancelaste el pago con tarjeta</h1>
                <p className="text-ink-2 mb-8">Tu carrito sigue intacto. Podés volver a intentar o elegir otro método de pago.</p>
                <Link to="/checkout" className="inline-flex items-center gap-2 bg-ink text-paper px-6 h-12 font-semibold text-[14px] hover:bg-ink/90 transition-colors">
                    Volver al checkout
                </Link>
            </section>
        );
    }

    if (verdict === 'timeout') {
        return (
            <section className="max-w-xl mx-auto px-5 py-24 md:py-32 text-center">
                <p className="text-eyebrow text-ink-3 mb-2">Seguimos confirmando</p>
                <h1 className="text-headline text-ink mb-4">Tu pago está tardando más de lo normal</h1>
                <p className="text-ink-2 mb-8">
                    Bancard todavía no nos confirmó el resultado. No hace falta que vuelvas a pagar:
                    te escribimos por WhatsApp en cuanto tengamos la confirmación, o podés escribirnos vos para consultar.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link to="/" className="inline-flex items-center justify-center gap-2 bg-ink text-paper px-6 h-12 font-semibold text-[14px] hover:bg-ink/90 transition-colors">
                        Volver al inicio
                    </Link>
                    <a
                        href="https://wa.me/?text=Hola%2C%20quer%C3%ADa%20consultar%20por%20un%20pago%20con%20tarjeta%20que%20qued%C3%B3%20procesando"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 border border-line px-6 h-12 font-semibold text-[13px] hover:bg-paper-2 transition-colors"
                    >
                        <MessageCircle className="h-4 w-4" /> Escribinos
                    </a>
                </div>
            </section>
        );
    }

    // declined | unknown
    return (
        <section className="max-w-xl mx-auto px-5 py-24 md:py-32 text-center">
            <div className="inline-flex items-center justify-center h-14 w-14 bg-py-red/10 text-py-red mb-6">
                <X className="h-7 w-7" strokeWidth={2.5} />
            </div>
            <p className="text-eyebrow text-py-red mb-2">Pago no aprobado</p>
            <h1 className="text-headline text-ink mb-4">No pudimos confirmar tu pago</h1>
            <p className="text-ink-2 mb-8">
                {verdict === 'unknown'
                    ? 'No pudimos verificar el estado con Bancard. Si tu tarjeta fue debitada, escribinos y lo resolvemos.'
                    : 'Tu tarjeta fue rechazada. Podés reintentar con otra tarjeta u otro método de pago.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/checkout" className="inline-flex items-center justify-center gap-2 bg-ink text-paper px-6 h-12 font-semibold text-[14px] hover:bg-ink/90 transition-colors">
                    Volver al checkout
                </Link>
                <a
                    href="https://wa.me/?text=Hola%2C%20tuve%20un%20problema%20con%20un%20pago%20con%20tarjeta"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 border border-line px-6 h-12 font-semibold text-[13px] hover:bg-paper-2 transition-colors"
                >
                    <MessageCircle className="h-4 w-4" /> Escribinos
                </a>
            </div>
        </section>
    );
}
