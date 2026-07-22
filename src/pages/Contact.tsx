/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Link } from 'react-router-dom';
import { MessageCircle, Mail, MapPin, Phone, ChevronRight, Clock } from 'lucide-react';
import { useSeo } from '../lib/seo';

export default function Contact() {
    useSeo({
        title: 'Contacto y sucursales · Vos PY',
        description: 'Contactanos por WhatsApp, email o pasá por nuestra sucursal en Asunción. Atención de lunes a sábado.',
    });
    return (
        <section className="container mx-auto px-4 py-10 md:py-16">
            <nav className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-ink-3 mb-6">
                <Link to="/" className="hover:text-ink">Inicio</Link>
                <ChevronRight className="h-3 w-3" />
                <span className="text-ink">Contacto</span>
            </nav>
            <div className="max-w-3xl">
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-py-red">Ayuda</span>
                <h1 className="text-3xl md:text-5xl font-black tracking-tight mt-1 mb-4">Hablemos</h1>
                <p className="text-lg text-ink-2 mb-10">
                    El canal más rápido es WhatsApp. También podés escribirnos por correo o pasar
                    por nuestras oficinas en Asunción.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <a
                    href="https://wa.me/?text=Hola%2C%20quiero%20hacer%20una%20consulta"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-3xl bg-emerald-600 text-white p-8 hover:bg-emerald-700 transition-colors group"
                >
                    <MessageCircle className="h-9 w-9 mb-4" />
                    <h2 className="text-2xl font-black mb-2">WhatsApp</h2>
                    <p className="text-sm opacity-90 mb-4">El medio más rápido para consultas, pedidos y post-venta.</p>
                    <span className="text-sm font-bold inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                        Iniciar conversación <ChevronRight className="h-4 w-4" />
                    </span>
                </a>
                <a
                    href="mailto:contacto@vospy.com.py"
                    className="rounded-3xl bg-ink text-paper p-8 hover:bg-ink/90 transition-colors group"
                >
                    <Mail className="h-9 w-9 mb-4" />
                    <h2 className="text-2xl font-black mb-2">Email</h2>
                    <p className="text-sm opacity-80 mb-4">contacto@vospy.com.py — respondemos en 1 día hábil.</p>
                    <span className="text-sm font-bold inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                        Enviar mensaje <ChevronRight className="h-4 w-4" />
                    </span>
                </a>
            </div>

            <div className="mt-10 grid md:grid-cols-3 gap-6">
                <div className="border border-line p-6 flex flex-col">
                    <MapPin className="h-6 w-6 text-py-red mb-3" strokeWidth={1.8} />
                    <h3 className="font-bold mb-1 text-ink">Sucursal</h3>
                    <p className="text-sm text-ink-2">Asunción, Paraguay</p>
                    <a
                        href="https://www.google.com/maps/search/?api=1&query=Asunci%C3%B3n%2C+Paraguay"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-semibold link-underline w-fit"
                    >
                        Cómo llegar <ChevronRight className="h-3.5 w-3.5" />
                    </a>
                </div>
                <div className="border border-line p-6">
                    <Phone className="h-6 w-6 text-py-red mb-3" strokeWidth={1.8} />
                    <h3 className="font-bold mb-1 text-ink">Teléfono</h3>
                    <a href="tel:+59521000000" className="text-sm text-ink-2 hover:text-ink tabular">+595 21 000 000</a>
                </div>
                <div className="border border-line p-6">
                    <Clock className="h-6 w-6 text-py-red mb-3" strokeWidth={1.8} />
                    <h3 className="font-bold mb-1 text-ink">Horario</h3>
                    <p className="text-sm text-ink-2">Lun. a Sáb. 9:00 a 18:00 hs.</p>
                </div>
            </div>

            <div className="mt-10 text-sm text-ink-2">
                ¿Buscás información legal? Consultá nuestras políticas de
                {' '}<Link to="/devoluciones" className="text-ink font-semibold">Devoluciones</Link>,
                {' '}<Link to="/envios" className="text-ink font-semibold">Envíos</Link> y
                {' '}<Link to="/garantia" className="text-ink font-semibold">Garantía</Link>.
            </div>
        </section>
    );
}
