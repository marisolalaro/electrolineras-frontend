import { Base } from './base';
import { Category } from './category';

export class Customer extends Base {

  id: number = null;
  electronicMail: string = '';
  phoneNumber: number = null;
  names: string = '';
  lastName: string = '';
  motherLastName: string = '';
  lastRechargeAmount: number = null;
  remainingCredit: number = null;
  lastChargingStation: string = '';
  paymentTransactionsElectrolineraList: PaymentTransactionsElectrolineraList[];
  chargeClientList: ChargeClientList[];
}

interface ChargeClientList {
  id: number;
  changeFee: string;
  energyComsumed: string;
  duration: string;
  status: string;
  staredChargingAt: string;
  finisheAt: string;
  chargingStation: string;
  amount: number;
  username: string;
  idVoltBras: string;
}

interface PaymentTransactionsElectrolineraList {
  id: number;
  gloss: string;
  amount: number;
  paymentDate: string;
  consumerName: null;
  processPayment: number;
  receiverBank: string;
  nombreRazonSocial: string;
  codigoTipoDocumentoIdentidad: string;
  numeroDocumento: string;
  complemento: string;
}