import { Base } from './base';
import { IdPaymentTransactionElectrolinera } from './payment-transaction-electrolinera';

export class InvoiceElectricStationModel extends Base {
    id: number;
    codigoDescripcion: string;
    codigoEstado: string;
    codigoRecepcion: string;
    transaccion: boolean;
    cuf: string;
    leyenda: string;
    fechaHoraEmision: string;
    urlFacturaSiat: string;
    xmlBase64: string;
    idPaymentTransactionElectrolinera: IdPaymentTransactionElectrolinera;
}