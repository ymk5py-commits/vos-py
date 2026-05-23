/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Hero carousel — fade transition, auto-advance with hover pause,
 * keyboard + touch nav, respects prefers-reduced-motion.
 *
 * Photography: Unsplash (free, HD).
 */

import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

type Slide = {
    eyebrow: string;
    title: string;
    accent: string;
    desc: string;
    cta: { label: string; to: string };
    image: { src: string; alt: string };
    /** 'left' (text left, image right) | 'right' (text right) */
    side: 'left' | 'right';
    bg: 'paper' | 'paper-2' | 'night';
};

const SLIDES: Slide[] = [
    {
        eyebrow: 'Audio · Hasta −15%',
        title: 'Sonido sin',
        accent: 'cables.',
        desc: 'Auriculares y parlantes JBL, Sony y Xiaomi en stock real, con garantía oficial.',
        cta: { label: 'Ver audio', to: '/catalogo?categoria=Audio' },
        image: {
            src: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1800&h=1100&fit=crop&q=80&auto=format',
            alt: 'Auriculares premium sobre fondo oscuro',
        },
        side: 'left',
        bg: 'night',
    },
    {
        eyebrow: 'Celulares · iPhone, Samsung, Xiaomi',
        title: 'Tu próximo',
        accent: 'celular.',
        desc: 'Los modelos del año, en guaraníes, con factura legal y entrega en 24/48 h.',
        cta: { label: 'Ver celulares', to: '/catalogo?categoria=Celulares' },
        image: {
            src: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1800&h=1100&fit=crop&q=80&auto=format',
            alt: 'Smartphones modernos en composición editorial',
        },
        side: 'right',
        bg: 'paper-2',
    },
    {
        eyebrow: 'Smartwatch · Garmin, Apple Watch',
        title: 'Entrená sin',
        accent: 'pretextos.',
        desc: 'Relojes inteligentes para correr, andar en bici, nadar o medir tu día.',
        cta: { label: 'Ver smartwatches', to: '/catalogo?categoria=Smartwatch' },
        image: {
            src: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=1800&h=1100&fit=crop&q=80&auto=format',
            alt: 'Smartwatch deportivo en muñeca',
        },
        side: 'left',
        bg: 'paper',
    },
    {
        eyebrow: 'Gaming · Nintendo, accesorios',
        title: 'Jugá en',
        accent: 'cualquier lado.',
        desc: 'Consolas, joysticks y accesorios para vos y para regalar.',
        cta: { label: 'Ver gaming', to: '/catalogo?categoria=Gaming' },
        image: {
            src: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=1800&h=1100&fit=crop&q=80&auto=format',
            alt: 'Setup gaming con consola y joystick',
        },
        side: 'right',
        bg: 'night',
    },
    {
        eyebrow: 'Accesorios · Hasta −15%',
        title: 'Cables, cargadores',
        accent: 'rebajados.',
        desc: 'Apple, Mcdodo, Luxor y más. Lo que necesitás siempre, con precio justo.',
        cta: { label: 'Ver ofertas', to: '/catalogo?ofertas=1' },
        image: {
            src: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=1800&h=1100&fit=crop&q=80&auto=format',
            alt: 'Cables y cargadores en composición plana',
        },
        side: 'left',
        bg: 'paper-2',
    },
];

const AUTO_MS = 6500;

export const HeroCarousel = () => {
    const [idx, setIdx] = useState(0);
    const [paused, setPaused] = useState(false);
    const [reduced, setReduced] = useState(false);
    const touchStartX = useRef<number | null>(null);

    useEffect(() => {
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
        const apply = () => setReduced(mq.matches);
        apply();
        mq.addEventListener('change', apply);
        return () => mq.removeEventListener('change', apply);
    }, []);

    useEffect(() => {
        if (paused || reduced) return;
        const id = window.setInterval(() => setIdx((i) => (i + 1) % SLIDES.length), AUTO_MS);
        return () => window.clearInterval(id);
    }, [paused, reduced]);

    // Preload neighbors
    useEffect(() => {
        const next = SLIDES[(idx + 1) % SLIDES.length].image.src;
        const img = new Image();
        img.src = next;
    }, [idx]);

    const go = (delta: number) => setIdx((i) => (i + delta + SLIDES.length) % SLIDES.length);

    return (
        <section
            className="relative w-full"
            aria-roledescription="carousel"
            aria-label="Categorías destacadas"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
            onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
            onTouchEnd={(e) => {
                if (touchStartX.current === null) return;
                const dx = e.changedTouches[0].clientX - touchStartX.current;
                if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
                touchStartX.current = null;
            }}
        >
            <div className="relative h-[78dvh] min-h-[520px] max-h-[760px] sm:h-[70vh] overflow-hidden bg-paper">
                <AnimatePresence mode="sync">
                    {SLIDES.map((s, i) => i === idx && (
                        <SlideView key={i} slide={s} />
                    ))}
                </AnimatePresence>

                {/* Controls — restrained, only contextual blur on photo */}
                <div className="absolute inset-x-0 bottom-0 z-30 px-5 md:px-8 lg:px-12 py-5 flex items-center justify-between gap-4">
                    {/* Dots */}
                    <div className="flex items-center gap-2" role="tablist" aria-label="Slide">
                        {SLIDES.map((_, i) => {
                            const active = i === idx;
                            return (
                                <button
                                    key={i}
                                    role="tab"
                                    aria-selected={active}
                                    aria-label={`Ir al slide ${i + 1}`}
                                    onClick={() => setIdx(i)}
                                    className="group h-1 transition-all duration-300"
                                    style={{ width: active ? 40 : 18 }}
                                >
                                    <span
                                        className={`block h-1 ${active ? 'bg-paper' : 'bg-paper/50 group-hover:bg-paper/80'} transition-colors`}
                                        aria-hidden="true"
                                    />
                                </button>
                            );
                        })}
                        <span className="ml-3 text-eyebrow text-paper/70 tabular hidden sm:inline">
                            {String(idx + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}
                        </span>
                    </div>

                    {/* Prev/next arrows */}
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => go(-1)}
                            aria-label="Slide anterior"
                            className="h-9 w-9 md:h-10 md:w-10 flex items-center justify-center text-paper bg-paper/10 hover:bg-paper/20 backdrop-blur-sm transition-colors"
                        >
                            <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" strokeWidth={2} />
                        </button>
                        <button
                            onClick={() => go(1)}
                            aria-label="Slide siguiente"
                            className="h-9 w-9 md:h-10 md:w-10 flex items-center justify-center text-paper bg-paper/10 hover:bg-paper/20 backdrop-blur-sm transition-colors"
                        >
                            <ChevronRight className="h-4 w-4 md:h-5 md:w-5" strokeWidth={2} />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

const SlideView = ({ slide }: { slide: Slide }) => {
    const isDark = slide.bg === 'night';
    // Mobile: text is always over the image with dark gradient → paper.
    // Desktop: text panel matches bg (paper on light, paper on dark).
    const txt        = isDark ? 'text-paper' : 'text-paper lg:text-ink';
    const txtMuted   = isDark ? 'text-paper/85' : 'text-paper/90 lg:text-ink-2';
    const txtEyebrow = isDark ? 'text-paper/70' : 'text-paper/80 lg:text-ink-3';
    const reverse = slide.side === 'right';

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className={`absolute inset-0 grid grid-cols-1 lg:grid-cols-12 ${isDark ? 'bg-night' : 'bg-paper-2'}`}
        >
            {/* Image */}
            <div className={`absolute inset-0 lg:relative lg:col-span-7 ${reverse ? 'lg:col-start-6' : ''} overflow-hidden`}>
                <motion.img
                    src={slide.image.src}
                    alt={slide.image.alt}
                    initial={{ scale: 1.08 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 7, ease: 'linear' }}
                    className="absolute inset-0 w-full h-full object-cover"
                    draggable={false}
                />
                {/* Tint overlay so text is always legible — gradient from text-side */}
                <div
                    className={`absolute inset-0 lg:hidden`}
                    style={{
                        background: 'linear-gradient(180deg, rgba(0,0,0,0.10) 0%, rgba(0,0,0,0.55) 100%)',
                    }}
                />
                <div
                    className={`absolute inset-0 hidden lg:block`}
                    style={{
                        background: reverse
                            ? 'linear-gradient(270deg, rgba(0,0,0,0.0) 30%, rgba(0,0,0,0.45) 100%)'
                            : 'linear-gradient(90deg, rgba(0,0,0,0.0) 30%, rgba(0,0,0,0.45) 100%)',
                    }}
                />
            </div>

            {/* Text panel */}
            <div className={`relative z-10 col-span-12 lg:col-span-5 ${reverse ? 'lg:col-start-1 lg:row-start-1' : ''} flex items-end lg:items-center`}>
                <div className="w-full px-5 md:px-8 lg:px-12 pb-20 sm:pb-24 pt-10 sm:pt-16 lg:py-12">
                    <motion.div
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                        className="max-w-xl"
                    >
                        <p className={`text-eyebrow mb-3 ${txtEyebrow}`}>{slide.eyebrow}</p>
                        <h1 className={`text-[clamp(34px,7vw,72px)] lg:text-display-m font-extrabold tracking-[-0.035em] ${txt} mb-3 sm:mb-4 leading-[0.95]`}>
                            {slide.title}
                            <br />
                            <span className="text-py-red">{slide.accent}</span>
                        </h1>
                        <p className={`text-[14px] sm:text-[15px] md:text-[16px] ${txtMuted} mb-6 sm:mb-7 max-w-md`}>
                            {slide.desc}
                        </p>
                        <Link
                            to={slide.cta.to}
                            className="group inline-flex items-center gap-3 bg-paper text-ink hover:bg-paper/90 pl-6 pr-1.5 h-12 font-bold text-[14px] transition-colors"
                        >
                            {slide.cta.label}
                            <span className="flex items-center justify-center h-9 w-9 bg-ink text-paper transition-transform duration-300 group-hover:translate-x-0.5">
                                <ArrowRight className="h-4 w-4" strokeWidth={2} />
                            </span>
                        </Link>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};
