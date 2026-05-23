# Design system — Vos PY

Editorial-meets-store. Negro hueso, papel cálido, dos rojos: uno hace señal
(de marca/PY), el otro es del producto en oferta. Sin gradientes decorativos.

## Color strategy

**Restrained**: neutrales tintados a un cálido casi imperceptible + un solo
acento de marca (rojo PY) en momentos clave (≤8% de la superficie). El azul
de la bandera sólo aparece en la franja del footer y en el favicon.

```css
@theme inline {
  /* Neutrales — todos tintados a chroma 0.005-0.012 hacia hue 30 (cálido) */
  --color-paper:        oklch(98.5% 0.005 60);    /* off-white cálido */
  --color-paper-2:      oklch(96.5% 0.008 60);    /* superficie 2 */
  --color-paper-3:      oklch(93%   0.010 60);    /* superficie 3 / borde claro */
  --color-ink:          oklch(15%   0.012 60);    /* texto principal */
  --color-ink-2:        oklch(35%   0.010 60);    /* texto secundario */
  --color-ink-3:        oklch(55%   0.008 60);    /* texto terciario / muted */
  --color-line:         oklch(89%   0.010 60);    /* borde estándar */

  /* Acentos — usar con cuidado */
  --color-py-red:       oklch(55%   0.225 27);    /* rojo bandera, señal */
  --color-py-red-deep:  oklch(40%   0.180 27);    /* hover de la señal */
  --color-py-blue:      oklch(35%   0.165 257);   /* azul bandera, sólo footer/iconos institucionales */
  --color-sale:         oklch(60%   0.245 25);    /* rojo de oferta, distinto al de marca */

  /* Dark mode (sólo secciones oscuras intencionales) */
  --color-night:        oklch(15%   0.012 60);
  --color-night-2:      oklch(22%   0.010 60);
}
```

**Reglas duras**:
- Nunca `#000` ni `#fff`.
- El azul `--color-py-blue` casi no se usa en la UI cotidiana; aparece en el
  footer y en pequeños sellos institucionales.
- El rojo de oferta y el rojo de marca son distintos a propósito (oferta más
  saturado, marca más profundo): no compiten.

## Typography

Usamos **Geist Variable** (ya cargada). Editorial vía contraste de peso y
escala, no por cambiar de fuente.

```css
/* Display: -0.04em letter-spacing, 0.92 line-height */
.text-display { font-weight: 800; letter-spacing: -0.04em; line-height: 0.92; }

/* Headline */
.text-headline { font-weight: 700; letter-spacing: -0.02em; line-height: 1.05; }

/* Eyebrow / labels: caps, tracking ancho */
.text-eyebrow { font-size: 11px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; }

/* Body */
.text-body { font-size: 16px; line-height: 1.6; max-width: 65ch; }

/* Numerals tabulares para precios */
.tabular { font-variant-numeric: tabular-nums; }
```

Escala fluida (clamp). Ratio ≥1.30 entre niveles.

| Nivel | Tamaño |
|---|---|
| Display L | `clamp(56px, 8vw, 128px)` |
| Display M | `clamp(40px, 5vw, 80px)` |
| Headline | `clamp(28px, 3vw, 44px)` |
| Title | `clamp(20px, 2vw, 24px)` |
| Body | `16px` |
| Caption | `13px` |
| Eyebrow | `11px` |

## Layout & rhythm

- **Container**: `max-w-[1320px] mx-auto px-5 md:px-8 lg:px-12`. NO todo
  necesita container — el hero, las galerías, las marquesinas rompen ancho.
- **Espaciado vertical de secciones**: variar, no `py-20` siempre. Patrón:
  `py-16` para soportes, `py-24 md:py-32` para hero/sección clave, `py-12`
  para puntos densos.
- **Grid de catálogo**: 2 / 3 / 4 columnas con `gap-x-6 gap-y-12` (gap
  vertical mayor que horizontal — produce ritmo editorial).

## Cards — y cuándo NO usarlas

Defaults:
- **Producto en grid**: sin card. Imagen sobre `--color-paper-2` con padding,
  texto y precio debajo en aire. La tarjeta es la disciplina, no un contenedor
  con borde.
- **Producto destacado en hero/sección**: bloque a sangre, sin borde.
- **Cards reales** sólo donde aportan: navegación de categoría (clickeables,
  separadas), call-out de envío/garantía en el footer.

Nunca: card dentro de card.

## Motion

- Curvas: usar `cubic-bezier(0.22, 1, 0.36, 1)` (ease-out-quart) para todo
  excepto hover, que usa `cubic-bezier(0.32, 0.72, 0, 1)`.
- Duraciones: 180-280ms para feedback, 400-600ms para entradas de sección.
- Sin bounce, sin elástico.
- Stagger de 60-90ms cuando aparecen listas de productos.
- Imagen de producto: hover = `scale(1.04)` en 500ms, NO en la tarjeta.
- Respetar `prefers-reduced-motion`.

## Componentes específicos

### Header
- Top strip alto (24px) con dato útil, no decorativo. Negro hueso o blanco.
- Nav inferior 64-72px de alto, logo a la izquierda, búsqueda al centro
  (no nav-de-4-items genérica).
- Buscador con `kbd` hint a la derecha (estilo Linear/Apple).

### Producto en grid
- Imagen cuadrada `aspect-square` sobre paper-2.
- Sobre la imagen: marca top-left en `text-eyebrow`, descuento top-right
  como bloque rojo sólido (no badge redondeado), nada más.
- Bajo la imagen: brand minimal, nombre 2 líneas máximo, precio grande tabular.
- Hover: imagen sube `-2px`, otra foto/ángulo si existe.
- "+" para añadir como pill flotante que aparece en hover sobre la imagen,
  NO como botón permanente.

### Ficha de producto
- Imagen a sangre del lado izquierdo en desktop, ocupando casi `60vh`.
- Texto del lado derecho con jerarquía clásica de magazine:
  brand (eyebrow) → nombre (display M) → precio (gigante, tabular) → detalle.
- Sticky en el panel izquierdo.

### Botones
- Primario: `bg-ink text-paper`, radio `rounded-full` 9999px, altura 52px en
  CTA principal, 44px en grid.
- Secundario: `bg-transparent border border-line text-ink`.
- WhatsApp: única excepción, verde marca.

## Polish details

1. **Numerals tabulares** en TODO precio. Es la diferencia entre tienda y
   "tienda".
2. **Underline animado** en links inline (left → right, 200ms).
3. **Easter egg paraguayo**: la franja PY (rojo / blanco / azul) sólo aparece
   en el footer, 6px de alto. En ningún otro lado.
4. **Imagen-vacío con estilo**: cuando una imagen falla, no un placeholder
   gris, sino un fondo paper-2 con el monograma "VP" en `text-headline` muted.
5. **Skeleton de catálogo** que repite el aspect-square del grid, no líneas
   genéricas.
6. **Cursor de hover** en tarjetas de producto: cursor estándar, no pointer
   custom (el pointer ya es señal suficiente).

## AI slop test — qué pasaría

- ¿Alguien podría decir "esto es de un ecommerce paraguayo" con sólo ver
  el header? Sí, por la franja sutil del footer y los precios en Gs.
- ¿Alguien podría decir "esto lo hizo una IA"? No: ni gradientes, ni hero
  metric, ni cards iguales, ni tipografía Inter, ni botones con emoji.
