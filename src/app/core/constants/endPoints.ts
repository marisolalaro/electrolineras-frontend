import { environment } from 'src/app/core/environments/environment';

export class EndPoins {

    // api general
    static apiUrl = environment.apiUrl;
    static api = '/api/v1';

    // clientes
    static customer = "/clientUser";
    static charges = "/clientListCharges";

    // estaciones de carga
    static electricStations = "/chargingStation";

    // tasa de carga
    static chargeRate = "/chargeRate";
    
    // administradores
    static administration = "/adminList";

    // Transacciones
    static transaction = "/paymentElectrolinera";
    static transactionCharges = "/PagePaymenTransactions";

    // Invoices transaction
    static invoiceElectrolinera = "/invoiceElectrolinera";
    static invoicesCompraVenta = "/getAllInvoicesCompraVenta";

    // Invoices charging stations
    static invoicePaymentTransaction = "/invoicesPaymentTransactions";
    static invoiceChargingStation = "/getAllInvoicesSuministroEnergia";
};
