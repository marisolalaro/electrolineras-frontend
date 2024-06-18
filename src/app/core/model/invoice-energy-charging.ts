import { Base } from './base';

export class InvoiceEnergyChargingModel extends Base {

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

interface RootObject {
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

interface IdPaymentTransactionElectrolinera {
    id: number;
    requestData: null;
    gloss: string;
    amount: number;
    qrImage: string;
    expirationDt: string;
    responseStatus: null;
    responseMessage: null;
    responseData: null;
    responseDescription: null;
    idResponse: number;
    authorizationNumber: null;
    paymentDate: string;
    registrationAt: string;
    processIcon: number;
    correlationId: string;
    consumerName: string;
    processPayment: number;
    receiverAccount: string;
    receiverName: string;
    receiverDocument: string;
    receiverBank: string;
    cliente: Cliente;
    nombreCliente: string;
    emailCliente: string;
    nombreRazonSocial: string;
    codigoTipoDocumentoIdentidad: string;
    numeroDocumento: string;
    complemento: null;
    codigoPais: number;
    placaVehiculo: string;
    giftCardNumber: number;
    idCollectionCompany: IdCollectionCompany;
    idPaymentType: IdPaymentType;
    remainingAmount: number;
}

interface IdPaymentType {
    id: number;
    statements: string;
    code: string;
}

interface IdCollectionCompany {
    id: number;
    nit: number;
    businessName: string;
    publicToken: string;
    businessCode: string;
    serviceCode: string;
    appUserId: string;
    bankAccount: string;
    urlEndpointDev: string;
    urlEndpointProd: string;
    production: boolean;
    cashierCode: string;
    typeofCollectionService: string;
    userNameService: string;
    passwordService: string;
    urlCertif: string;
    pwdCertif: string;
    userIcono: string;
    userHash: string;
    limitTransaction: number;
}

interface Cliente {
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

interface Role {
    id: number;
    nameRole: string;
    nameRoleDisplay: string;
    description: string;
    permissions: any[];
}