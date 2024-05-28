import { Base } from './base';

export class AdministratorModel extends Base {
  id: number;
  userName: string;
  electronicMail: string;
  phoneNumber: null;
  names: string;
  lastName: string;
  motherLastName: string;
  identificationNumber: string;
  birthdate: string;
  cellPhoneNumber: number;
  extension: string;
  complement: null;
  amount: number;
  paymentTransactionsElectrolineraList: any[];
  chargeClientList: any[];
}