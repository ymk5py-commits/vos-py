/**
 * Bancard vPOS — helpers server-side.
 *
 * Fórmulas y URLs según la documentación oficial de vPOS 0.3 / checkout 2.0
 * (verificadas contra bancard-checkout-js y el manual del portal de comercios):
 *  - single_buy token:       md5(priv + shop_process_id + amount + currency)
 *  - confirm token (webhook): md5(priv + shop_process_id + "confirm" + amount + currency)
 *  - get_confirmation token:  md5(priv + shop_process_id + "get_confirmation")
 *  - rollback token:          md5(priv + shop_process_id + "rollback" + "0.00")
 * Montos SIEMPRE como string con 2 decimales y punto (ej. "193000.00").
 * La clave privada NUNCA viaja: solo entra al hash.
 */

import crypto from 'node:crypto';

export interface BancardEnv {
  publicKey: string;
  privateKey: string;
  base: string;               // https://vpos.infonet.com.py (prod) | :8888 (staging)
  environment: 'production' | 'staging';
}

export function bancardEnv(): BancardEnv | null {
  const publicKey = process.env.BANCARD_PUBLIC_KEY;
  const privateKey = process.env.BANCARD_PRIVATE_KEY;
  if (!publicKey || !privateKey) return null;
  const environment = process.env.BANCARD_ENVIRONMENT === 'production' ? 'production' : 'staging';
  const base = environment === 'production'
    ? 'https://vpos.infonet.com.py'
    : 'https://vpos.infonet.com.py:8888';
  return { publicKey, privateKey, base, environment };
}

export const md5 = (s: string) => crypto.createHash('md5').update(s).digest('hex');

/** Comparación en tiempo constante para validar el token del webhook. */
export function tokensEqual(a: string, b: string): boolean {
  const ba = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  if (ba.length !== bb.length) return false;
  return crypto.timingSafeEqual(ba, bb);
}

/** Formatea guaraníes al Decimal(15,2) que exige vPOS: "193000.00" */
export const amountString = (totalGs: number) => `${Math.round(totalGs)}.00`;

/**
 * Token de acceso a /api/bancard/status, para que consultar el estado de un
 * pago exija algo que solo quien creó esa sesión tiene (no solo adivinar el
 * shop_process_id, que es enumerable). Se firma con la private key — nunca
 * viaja — así que no hace falta una env var nueva ni una base de datos.
 */
export const statusToken = (shopProcessId: number, privateKey: string) =>
  crypto.createHmac('sha256', privateKey).update(`status:${shopProcessId}`).digest('hex').slice(0, 32);
