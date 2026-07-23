/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Datos geográficos y de pago de Paraguay.
 */

export const DEPARTAMENTOS = [
    'Asunción', 'Central', 'Alto Paraná', 'Itapúa', 'Caaguazú',
    'Cordillera', 'Paraguarí', 'Concepción', 'Guairá', 'Misiones',
    'Caazapá', 'Canindeyú', 'San Pedro', 'Amambay', 'Ñeembucú',
    'Presidente Hayes', 'Alto Paraguay', 'Boquerón',
] as const;

export type Departamento = (typeof DEPARTAMENTOS)[number];

export interface PaymentMethod {
    id: 'transferencia' | 'billetera' | 'efectivo' | 'bancard';
    name: string;
    short: string;
    description: string;
    details: string[];
}

/** Método online con tarjeta; visible solo cuando /api/config reporta bancard=true. */
export const BANCARD_METHOD: PaymentMethod = {
    id: 'bancard',
    name: 'Tarjeta de crédito o débito',
    short: 'Tarjeta (Bancard)',
    description: 'Pagá online con tu tarjeta a través de Bancard vPOS, la pasarela de los bancos de Paraguay.',
    details: [
        'Visa, Mastercard y tarjetas de la red Bancard.',
        'Pago inmediato y seguro (PCI, procesado por Bancard).',
        'Sin recargo.',
    ],
};

export const PAYMENT_METHODS: PaymentMethod[] = [
    {
        id: 'transferencia',
        name: 'Transferencia bancaria',
        short: 'Transferencia',
        description: 'Te enviamos los datos por WhatsApp al confirmar el pedido. Acreditás y despachamos.',
        details: [
            'Cualquier banco del país.',
            'Confirmación inmediata al enviar el comprobante.',
            'Sin recargo.',
        ],
    },
    {
        id: 'billetera',
        name: 'Billetera digital',
        short: 'Billetera',
        description: 'Tigo Money, Personal Pay, Wally, Zimple. Coordinamos por WhatsApp.',
        details: [
            'Tigo Money / Personal Pay / Wally / Zimple.',
            'Pago inmediato con QR o número.',
            'Sin recargo.',
        ],
    },
    {
        id: 'efectivo',
        name: 'Efectivo contra entrega',
        short: 'Contra entrega',
        description: 'Pagás al recibir el pedido en la dirección informada (disponible en GA).',
        details: [
            'Disponible en Asunción y Gran Asunción.',
            'Tené el monto exacto preparado.',
            'Sujeto a confirmación de zona.',
        ],
    },
];
