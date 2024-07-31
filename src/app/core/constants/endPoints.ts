import { environment } from 'src/app/core/environments/environment';

export class EndPoins {

    // api general
    static apiUrl = environment.apiUrl;
    static api = '/api/v1';

    // clientes
    static customer = "/clientUser";
    static charges = "/clientListCharges";
    static enabled = "/enableClient";
    static disabled = "/disableClient";
    static enabledAdmin = "/enableAdmin";
    static disabledAdmin = "/disableAdmin";

    // estaciones de carga
    static electricStations = "/chargingStation";
    static cardElectricStations = "/cardChargingStation";
    static cardElectricStationsId = "/cardChargingStationById";
    static enabledStation = "/enableStation";
    static disableStation = "/disableStation";

    // tasa de carga
    static chargeRate = "/chargeRate";
    
    // administradores
    static administration = "/adminList";

    // Transacciones
    static transaction = "/paymentElectrolinera";
    static transactionCharges = "/getAllPaymentTransactionElectrolinera";

    // Invoices transaction
    static invoiceElectrolinera = "/invoiceElectrolinera";
    static invoicesCompraVenta = "/getAllInvoicesCompraVenta";

    // Invoices charging stations
    static invoicePaymentTransaction = "/invoicesPaymentTransactions";
    static invoiceChargingStation = "/getAllInvoicesSuministroEnergia";

    // Reportes
    static facturasRelacionadas = "/invoicesRelationByDates"
    static clientesCarga = "/chargeClient"
    static cargasDatos = "/chargesByDates"
    static cargasEnergia = "/paymentsByDates"
    static facturaDatos = "/invoicesByDates"
};
