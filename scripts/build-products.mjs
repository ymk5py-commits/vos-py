/**
 * Parses shoppingchina_electronicos.csv and emits public/products.json
 * plus src/data/categories.ts. Run: npm run build:products
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

function parseCSV(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else field += c;
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ',') {
      row.push(field); field = '';
    } else if (c === '\n') {
      row.push(field); rows.push(row); row = []; field = '';
    } else if (c === '\r') {
      // ignore
    } else field += c;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows;
}

// Category derivation. Order matters: first match wins.
const RULES = [
  { cat: 'Audio', icon: 'Headphones', kw: ['auricular', 'audifono', 'audífono', 'parlante', 'speaker', 'soundbar', 'sound bar', 'earbud', 'headset', 'microfono', 'micrófono', 'bocina', 'home theater', 'subwoofer', 'amplificador', 'audio'] },
  { cat: 'Gaming', icon: 'Gamepad2', kw: ['funko', 'nintendo', 'playstation', 'play station', ' ps4', ' ps5', 'xbox', 'joystick', 'gamepad', 'control inalambrico', 'control inalámbrico', 'volante racing', 'consola'] },
  { cat: 'Cámaras', icon: 'Camera', kw: ['camara', 'cámara', 'gopro', 'go pro', 'drone', 'dron ', 'webcam', 'lente', 'estabilizador', 'gimbal', 'osmo'] },
  { cat: 'Televisores', icon: 'Tv', kw: ['televisor', 'smart tv', ' tv ', 'tv led', 'tv qled', 'proyector', 'tv box', 'tv stick', 'chromecast'] },
  { cat: 'Computación', icon: 'Laptop', kw: ['notebook', 'laptop', 'mouse', 'teclado', 'monitor', 'ssd', 'disco', 'pendrive', 'pen drive', 'memoria micro', 'memoria sd', 'impresora', 'router', 'hub usb', 'tablet', 'gabinete', 'placa', 'procesador'] },
  { cat: 'Celulares', icon: 'Smartphone', kw: ['celular', 'smartphone', 'iphone', 'redmi note', 'galaxy a', 'galaxy s', 'galaxy m', 'moto e', 'moto g', 'telefono', 'teléfono'] },
  { cat: 'Smartwatch', icon: 'Briefcase', kw: ['smartwatch', 'smart watch', 'reloj inteligente', 'banda inteligente', 'smart band', 'garmin', 'amazfit', 'apple watch', 'galaxy watch'] },
  { cat: 'Hogar', icon: 'Home', kw: ['licuadora', 'ventilador', 'plancha', 'cafetera', 'afeitadora', 'balanza', 'aspiradora', 'freidora', 'batidora', 'microondas', 'pava', 'olla', 'secador', 'termo', 'heladera'] },
  { cat: 'Accesorios', icon: 'Briefcase', kw: ['cargador', 'cable', 'adaptador', 'funda', 'protector', 'vidrio templado', 'soporte', 'holder', 'power bank', 'powerbank', 'bateria', 'batería', 'cable usb', 'pop socket', 'film', 'estuche'] },
];

function categorize(name, brand) {
  const hay = ` ${name} ${brand} `.toLowerCase();
  for (const r of RULES) {
    if (r.kw.some((k) => hay.includes(k))) return r;
  }
  return { cat: 'Electrónica', icon: 'Smartphone' };
}

// Deterministic pseudo-random based on numeric id so values are stable across builds.
function seeded(id, salt) {
  let n = 0;
  const s = `${id}-${salt}`;
  for (let i = 0; i < s.length; i++) n = (n * 31 + s.charCodeAt(i)) >>> 0;
  return n / 0xffffffff;
}

const csv = readFileSync(join(ROOT, 'shoppingchina_electronicos.csv'), 'utf8').replace(/^﻿/, '');
const rows = parseCSV(csv);
const header = rows.shift().map((h) => h.replace(/^﻿/, '').trim());
const idx = (n) => header.indexOf(n);

const products = [];
const seen = new Set();
const catCount = {};

for (const r of rows) {
  if (r.length < 9) continue;
  const id = (r[idx('ID_Producto')] || '').trim();
  const name = (r[idx('Nombre')] || '').trim();
  if (!id || !name || seen.has(id)) continue;
  seen.add(id);

  const brand = (r[idx('Marca')] || '').trim();
  const codigo = (r[idx('Codigo')] || '').replace(/["']/g, '').trim();
  const usdRaw = (r[idx('Precio_USD')] || '').trim();
  const gsRaw = (r[idx('Precio_Guaranies')] || '').trim();
  const desc = (r[idx('Descripcion')] || '').trim();
  const url = (r[idx('URL_Producto')] || '').trim();
  const img = (r[idx('URL_Imagen_Principal')] || '').trim();

  const priceUsd = parseFloat(usdRaw.replace(/\./g, '').replace(',', '.')) || 0;
  const priceGs = parseInt(gsRaw.replace(/[.,]/g, ''), 10) || 0;
  if (!priceGs || !img) continue;

  const { cat, icon } = categorize(name, brand);
  catCount[cat] = (catCount[cat] || 0) + 1;

  const rating = +(4 + seeded(id, 'r') * 1).toFixed(1); // 4.0 - 5.0
  const reviews = Math.floor(20 + seeded(id, 'v') * 900);
  const stock = Math.floor(3 + seeded(id, 's') * 60);

  // Deterministic discount tier: most products none, some 5/10/15%.
  const dSeed = seeded(id, 'd');
  const discount = dSeed < 0.55 ? 0 : dSeed < 0.8 ? 5 : dSeed < 0.93 ? 10 : 15;
  const listGs = discount > 0
    ? Math.round(priceGs / (1 - discount / 100) / 1000) * 1000
    : priceGs;

  const short = desc.length > 140 ? desc.slice(0, 137).trimEnd() + '…' : desc;

  products.push({
    id,
    name: name.replace(/\s+/g, ' '),
    brand: brand || 'Genérico',
    codigo,
    price: priceUsd,
    priceGs,
    listGs,
    discount,
    description: short || `${name} disponible en Vos PY.`,
    fullDescription: desc || `${name} — producto importado disponible en Vos PY, Paraguay.`,
    image: img,
    images: [img],
    category: cat,
    icon,
    rating,
    reviews,
    stock,
  });
}

writeFileSync(join(ROOT, 'public', 'products.json'), JSON.stringify(products));

const ICONS = { Headphones: 1, Gamepad2: 1, Camera: 1, Tv: 1, Laptop: 1, Smartphone: 1, Home: 1, Briefcase: 1 };
const catList = Object.entries(catCount)
  .sort((a, b) => b[1] - a[1])
  .map(([name]) => {
    const rule = RULES.find((r) => r.cat === name);
    return { name, icon: rule ? rule.icon : 'Smartphone' };
  });

const ts = `// AUTO-GENERATED by scripts/build-products.mjs — do not edit.
export const categories: { name: string; icon: string }[] = ${JSON.stringify(catList, null, 2)};
`;
writeFileSync(join(ROOT, 'src', 'data', 'categories.ts'), ts);

console.log(`Wrote ${products.length} products.`);
console.log('Categories:', catCount);
