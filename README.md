# Vos PY — Tienda de importados

E-commerce de electrónica importada para Paraguay. Catálogo de +1.700 productos
reales (audio, celulares, gaming, smartwatches, accesorios y más) con precios en
guaraníes, búsqueda, filtros por categoría/marca y carrito.

Stack: React 19 + Vite 6 + TypeScript + Tailwind CSS 4.

## Desarrollo local

```bash
npm install
npm run dev          # http://localhost:3000
```

`npm run dev` y `npm run build` regeneran automáticamente `public/products.json`
desde `shoppingchina_electronicos.csv` (script `scripts/build-products.mjs`).

## Build de producción

```bash
npm run build        # genera dist/
npm run preview
```

## Deploy

Conectado a Vercel. Cada push a `main` despliega automáticamente.
