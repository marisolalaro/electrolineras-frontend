import { Base } from './base';
import { ChargeClientList } from './charge-client-list';
import { PaymentTransactionsElectrolineraList } from './payment-transactions-electrolinera-list';

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
  enabled: boolean;
  paymentTransactionsElectrolineraList: PaymentTransactionsElectrolineraList[];
  chargeClientList: ChargeClientList[];
  username: string = '';
  registrationDt: string = '';
  ultimoConsumo: number = null;
  ultimaCompra: number = null;
  saldo: number = null;
  fechaRegistro: string = '';

}
