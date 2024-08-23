import { Base } from './base';

export class InvoiceEnergyChargingModel extends Base {
    id: number;
    paymentTransactionType: string;
    amount: number;
    codigoDescripcion: string;
    codigoRecepcion: string;
    cuf: string;
    facturaXmlbase64: string;
    urlFacturaSiat: string;
    idPaymentTransaction: number;
    nombreCliente: string;
    placaVehiculo: string;
    razonSocial: string;
    giftCardNumber: number;
    clientUsername: string;
    fechaHoraEmision: null;
}