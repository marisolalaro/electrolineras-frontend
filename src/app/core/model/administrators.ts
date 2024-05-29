import { Base } from './base';

export class AdministratorModel extends Base {
  id?: number;
  names: string;
  username: string;
  password: string;
  electronicMail: string;
  phoneNumber: number;
  lastName: string;
  motherLastName: string;
  identificationNumber: string;
  birthdate: string;
  activationCode: string;
  idTypePhone: number;
  cellPhoneNumber: number;
  accountStatus: number;
  restoreCode: string;
  activationMethod: string;
  extension: string;
  complement: string;
  idTypeIdentification: number;
  roles: number[];
}
