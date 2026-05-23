/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Contenido legal adaptado a la legislación paraguaya vigente.
 * Importante: este texto es una base profesional, no reemplaza
 * el asesoramiento de un abogado matriculado en Paraguay.
 */

import { LegalLayout } from './LegalLayout';

const Updated = () => <p className="text-xs text-muted-foreground mb-6"><strong>Última actualización:</strong> 23/05/2026</p>;

export const Terms = () => (
    <LegalLayout title="Términos y Condiciones">
        <Updated />
        <p>Bienvenido a <strong>Vos PY</strong> (vos-py.vercel.app), tienda online de electrónica importada con operación en Paraguay. Al navegar o comprar en el sitio, aceptás estos Términos.</p>

        <h2>1. Quiénes somos</h2>
        <p>Vos PY es un comercio que ofrece productos de audio, celulares, gaming y smartwatches con garantía oficial del fabricante. Los datos del proveedor figuran en el pie del sitio.</p>

        <h2>2. Precios y moneda</h2>
        <p>Todos los precios se publican en <strong>guaraníes (Gs.)</strong> e <strong>incluyen el IVA</strong> correspondiente. El precio total final, los costos de envío y cualquier cargo adicional se muestran antes de confirmar la compra, conforme a la <strong>Ley 1334/98</strong> de Defensa del Consumidor.</p>

        <h2>3. Proceso de compra</h2>
        <p>El pedido se inicia desde la web y se coordina y confirma vía WhatsApp. La compra se perfecciona cuando Vos PY confirma stock, medio de pago y dirección de envío. Mientras eso no ocurra, no hay contrato de compraventa.</p>

        <h2>4. Facturación</h2>
        <p>Por cada operación emitimos <strong>factura legal</strong> conforme a las normas tributarias paraguayas (IVA incluido). El comprador debe brindar nombre/razón social, RUC o cédula y dirección para la facturación.</p>

        <h2>5. Medios de pago</h2>
        <p>Aceptamos los medios informados al momento de la confirmación (transferencia, billeteras electrónicas, tarjetas u otros habilitados). La operación queda sujeta a la acreditación efectiva del pago.</p>

        <h2>6. Stock y disponibilidad</h2>
        <p>Las publicaciones se ofrecen sujetas a stock. Si un producto no estuviera disponible luego del pedido, se informa al cliente y se ofrece reemplazo, espera o reintegro total del monto abonado.</p>

        <h2>7. Uso del sitio</h2>
        <p>El usuario se compromete a brindar información veraz, no realizar pedidos fraudulentos ni vulnerar la seguridad del sitio. Vos PY puede cancelar pedidos con sospecha de fraude.</p>

        <h2>8. Propiedad intelectual</h2>
        <p>Marcas, imágenes y textos son de sus respectivos titulares o de Vos PY. No está permitida su reproducción comercial sin autorización.</p>

        <h2>9. Responsabilidad</h2>
        <p>Vos PY responde por los productos vendidos conforme a la Ley 1334/98 y a las garantías oficiales de fábrica. No responde por usos indebidos, daños provocados por el usuario o por casos fortuitos o fuerza mayor.</p>

        <h2>10. Modificaciones</h2>
        <p>Estos Términos pueden actualizarse. La versión vigente es siempre la publicada en esta página, con su fecha de actualización.</p>

        <h2>11. Ley aplicable y jurisdicción</h2>
        <p>Estos Términos se rigen por las leyes de la República del Paraguay. Cualquier controversia se someterá a los tribunales ordinarios de la ciudad de Asunción, sin perjuicio del derecho del consumidor a recurrir a la <strong>SEDECO</strong> (Secretaría de Defensa del Consumidor y del Usuario).</p>
    </LegalLayout>
);

export const Privacy = () => (
    <LegalLayout title="Privacidad">
        <Updated />
        <p>En Vos PY respetamos tu privacidad y tratamos tus datos personales con responsabilidad, en línea con la <strong>Constitución Nacional</strong> (arts. 33 y 135), la <strong>Ley 1682/01</strong> y su modificatoria <strong>6534/2020</strong>, la <strong>Ley 4868/13 de Comercio Electrónico</strong> y la <strong>Ley 1334/98</strong>.</p>

        <h2>1. Responsable del tratamiento</h2>
        <p>Vos PY, cuyos datos figuran en el footer del sitio. Para consultas sobre tus datos: el canal de contacto indicado en el footer.</p>

        <h2>2. Qué datos recolectamos</h2>
        <ul>
            <li><strong>De contacto y entrega:</strong> nombre, cédula/RUC, dirección, ciudad, teléfono, correo electrónico.</li>
            <li><strong>De la operación:</strong> historial de pedidos, productos consultados, mensajes por WhatsApp.</li>
            <li><strong>De navegación:</strong> IP, dispositivo, navegador, páginas visitadas (vía cookies; ver Política de Cookies).</li>
            <li><strong>No solicitamos</strong> datos sensibles (salud, ideología, religión, etc.).</li>
        </ul>

        <h2>3. Para qué los usamos</h2>
        <ul>
            <li>Procesar y entregar tu pedido y emitir la factura.</li>
            <li>Coordinar la compra por WhatsApp y brindar soporte post-venta.</li>
            <li>Cumplir obligaciones legales, tributarias y de garantía.</li>
            <li>Mejorar el sitio y, si lo autorizás expresamente, enviarte promociones.</li>
        </ul>

        <h2>4. Base legal</h2>
        <p>Tratamos los datos para ejecutar el contrato de compraventa, cumplir obligaciones legales y, en su caso, en base a tu <strong>consentimiento</strong> (ej.: marketing), que podés revocar cuando quieras.</p>

        <h2>5. Con quién los compartimos</h2>
        <p>Sólo con quienes son necesarios para cumplir el pedido: empresas de envío/courier, procesadores de pago, plataforma de hosting (Vercel) y autoridades cuando la ley lo requiera. <strong>No vendemos tus datos a terceros.</strong></p>

        <h2>6. Plazo de conservación</h2>
        <p>Conservamos los datos mientras dure la relación comercial y luego por el plazo necesario para cumplir obligaciones tributarias, contables y de garantía (mínimo 5 años para documentación fiscal).</p>

        <h2>7. Tus derechos</h2>
        <p>Podés solicitarnos en cualquier momento <strong>acceso, rectificación, actualización, supresión</strong> de tus datos y revocar el consentimiento. Escribinos por los canales del footer; respondemos dentro de los 10 días hábiles.</p>

        <h2>8. Seguridad</h2>
        <p>Usamos HTTPS, control de accesos y buenas prácticas de seguridad. Ningún sistema es 100% inviolable; ante un incidente que afecte tus datos, te notificaremos sin demora.</p>

        <h2>9. Menores</h2>
        <p>El sitio está dirigido a mayores de 18 años. Si sos menor, necesitás autorización de tu madre, padre o tutor.</p>

        <h2>10. Cambios</h2>
        <p>Si modificamos esta política, publicamos la nueva versión con su fecha en esta misma página.</p>
    </LegalLayout>
);

export const Cookies = () => (
    <LegalLayout title="Cookies">
        <Updated />
        <h2>1. Qué son</h2>
        <p>Las cookies son pequeños archivos que se guardan en tu dispositivo cuando visitás un sitio web. Sirven para que el sitio funcione y para entender cómo se usa.</p>

        <h2>2. Cuáles usamos en Vos PY</h2>
        <ul>
            <li><strong>Técnicas / esenciales:</strong> indispensables para que el carrito, el inicio de sesión y la navegación funcionen. No se pueden desactivar.</li>
            <li><strong>De preferencias:</strong> recuerdan tus elecciones (ej.: ciudad de envío).</li>
            <li><strong>Analíticas:</strong> nos ayudan a entender qué productos se ven más y a mejorar el sitio (datos agregados, no identificación individual).</li>
            <li><strong>De marketing (opcional):</strong> sólo si las aceptás, para mostrarte avisos relevantes en otras plataformas.</li>
        </ul>

        <h2>3. Cookies de terceros</h2>
        <p>Pueden estar presentes servicios como Vercel (hosting), Google (analítica) y Meta/WhatsApp (contacto y remarketing). Cada uno aplica su propia política.</p>

        <h2>4. Cómo gestionarlas</h2>
        <p>En tu primera visita te mostramos un banner para <strong>aceptar, rechazar o configurar</strong>. También podés borrar o bloquear cookies desde tu navegador. Si las desactivás, algunas funciones pueden no andar bien.</p>

        <h2>5. Cambios</h2>
        <p>Si actualizamos qué cookies usamos, lo verás reflejado en esta página.</p>
    </LegalLayout>
);

export const Returns = () => (
    <LegalLayout title="Devoluciones">
        <Updated />
        <h2>1. Derecho de arrepentimiento</h2>
        <p>Conforme al <strong>artículo 26 de la Ley 1334/98</strong> de Defensa del Consumidor, al tratarse de una venta realizada fuera del establecimiento (web/WhatsApp), tenés derecho a <strong>arrepentirte de la compra dentro de los 7 días corridos</strong> desde la recepción del producto, sin necesidad de justificar el motivo.</p>

        <h2>2. Condiciones</h2>
        <ul>
            <li>El producto debe estar <strong>sin uso</strong>, en su <strong>embalaje original</strong>, con todos sus accesorios, manuales, etiquetas y precintos intactos.</li>
            <li>Debés conservar la <strong>factura</strong> y comprobantes de entrega.</li>
            <li>No aplica a productos personalizados, software o medios digitales desprecintados, ni a artículos de higiene personal (por ejemplo, auriculares in-ear con precinto roto).</li>
        </ul>

        <h2>3. Cómo solicitarlo</h2>
        <p>Escribinos por WhatsApp o por el canal de contacto del footer dentro del plazo de 7 días, indicando número de pedido y motivo. Te enviaremos las instrucciones para la devolución.</p>

        <h2>4. Costos del envío de retorno</h2>
        <p>En caso de arrepentimiento (producto sin defectos), el costo del envío de retorno corre por cuenta del cliente, salvo promoción específica que indique lo contrario.</p>

        <h2>5. Reintegro</h2>
        <p>Una vez recibido y verificado el producto en buen estado, te reintegramos el <strong>100% del importe pagado</strong> por el producto, dentro de los <strong>10 días hábiles</strong>, por el mismo medio de pago utilizado o por transferencia bancaria.</p>

        <h2>6. Productos con defectos o dañados</h2>
        <p>Si recibís un producto con fallas, dañado en el transporte o distinto al que pediste, <strong>no aplica el plazo de 7 días</strong>: avisanos <strong>dentro de las 72 horas</strong> de recibido y nos hacemos cargo (cambio, reparación o reintegro), conforme a la Ley 1334/98.</p>
    </LegalLayout>
);

export const Shipping = () => (
    <LegalLayout title="Envíos">
        <Updated />
        <h2>1. Cobertura</h2>
        <p>Realizamos envíos a <strong>todo el Paraguay</strong>: Asunción, Gran Asunción e interior.</p>

        <h2>2. Coordinación</h2>
        <p>El envío se coordina por WhatsApp luego de confirmar el pedido y la acreditación del pago. Te informamos costo, plazo estimado y empresa de logística.</p>

        <h2>3. Plazos estimados</h2>
        <ul>
            <li><strong>Asunción y Gran Asunción:</strong> 24 a 72 horas hábiles.</li>
            <li><strong>Interior del país:</strong> 2 a 7 días hábiles, según la ciudad y el courier disponible.</li>
        </ul>
        <p>Los plazos pueden variar por feriados, clima o fuerza mayor.</p>

        <h2>4. Costos</h2>
        <p>El costo del envío se calcula según destino, peso y volumen, y se informa <strong>antes</strong> de confirmar la compra. No hay cargos ocultos.</p>

        <h2>5. Recepción</h2>
        <p>Revisá el paquete al momento de recibirlo. Si notás daños externos o faltantes, dejalo asentado con el repartidor y avisanos dentro de las <strong>72 horas</strong>.</p>

        <h2>6. Dirección incorrecta o ausente</h2>
        <p>Si por datos mal cargados o ausencia del destinatario el paquete vuelve al origen, el segundo envío tiene un costo adicional a cargo del cliente.</p>

        <h2>7. Retiro en punto</h2>
        <p>Cuando esté habilitado, podés coordinar retiro en punto convenido en Asunción, sin costo de envío.</p>
    </LegalLayout>
);

export const Warranty = () => (
    <LegalLayout title="Garantía">
        <Updated />
        <h2>1. Garantía oficial</h2>
        <p>Todos los productos vendidos por Vos PY cuentan con <strong>garantía oficial del fabricante</strong> y, además, con la garantía legal prevista por la <strong>Ley 1334/98</strong>.</p>

        <h2>2. Plazo</h2>
        <p>La garantía rige por el plazo que indique el fabricante (generalmente entre <strong>6 y 24 meses</strong> según marca y producto), contado desde la fecha de la factura.</p>

        <h2>3. Qué cubre</h2>
        <p>Defectos de fabricación, fallas de componentes y funcionamiento incorrecto del producto en condiciones normales de uso.</p>

        <h2>4. Qué NO cubre</h2>
        <ul>
            <li>Daños por mal uso, golpes, caídas, humedad o líquidos.</li>
            <li>Daños por sobretensión eléctrica o conexión a fuentes no adecuadas.</li>
            <li>Roturas estéticas posteriores a la entrega.</li>
            <li>Productos abiertos o reparados por terceros no autorizados.</li>
            <li>Accesorios consumibles (almohadillas, cables) más allá de los plazos del fabricante.</li>
        </ul>

        <h2>5. Cómo hacerla efectiva</h2>
        <ul>
            <li>Conservá la <strong>factura</strong> original.</li>
            <li>Contactanos por WhatsApp o por el canal del footer con número de pedido y descripción de la falla.</li>
            <li>Te indicamos si el reclamo se gestiona en nuestro post-venta o directamente en el <strong>servicio técnico oficial</strong> de la marca en Paraguay.</li>
        </ul>

        <h2>6. Tiempos</h2>
        <p>Una vez recibido el producto, el diagnóstico se realiza en hasta <strong>15 días hábiles</strong>. Si corresponde, se procede a reparar, cambiar por uno equivalente o reintegrar el importe pagado.</p>

        <h2>7. Garantía legal complementaria</h2>
        <p>Independientemente de la garantía del fabricante, te asisten los derechos previstos en los artículos 32 a 35 de la <strong>Ley 1334/98</strong>.</p>
    </LegalLayout>
);
