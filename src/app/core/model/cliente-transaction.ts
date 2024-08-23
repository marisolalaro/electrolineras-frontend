import { Role } from "./role";

export class Cliente {
    username: string;
    enabled: boolean;
    roles: Role[];
    id: number;
    electronicMail: string;
    phoneNumber: null;
    names: string;
    lastName: string;
    motherLastName: string;
    identificationNumber: null;
    birthdate: null;
    activationCode: null;
    registrationDt: null;
    activationDt: string;
    createAtDt: null;
    createBy: null;
    updateAtDt: null;
    updateBy: null;
    activationValidAt: string;
    idTypePhone: null;
    cellPhoneNumber: number;
    accountStatus: number;
    restoreCode: null;
    restoreValidAt: null;
    activationMethod: string;
    extension: string;
    complement: string;
    idTypeIdentification: null;
    activo: boolean;
}