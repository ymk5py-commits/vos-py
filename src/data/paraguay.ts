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
    id: 'transferencia' | 'billetera' | 'efectivo';
    name: string;
    short: string;
    description: string;
    details: string[];
}

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
