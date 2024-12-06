import { environment } from 'src/app/core/environments/environment.prod';

export class EndPoins {

    // api general
    static apiUrlOcpp = environment.apiUrlOcpp;
    static apiUrl = environment.apiUrl;
    static api = '/api/v1';

    // websocket
    static websocket = "/websocket";
    
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
    static updateVisibility = "/updateVisibility";
    static registerChargingStation = "/registerChargingStation";
    static updateChargingStation = "/updateChargingStation";


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

    // estaciones de carga
    static clientElectricStations = "/clientChargingStation";
    static findByChargingStation = "/findByChargingStation";
    static removeClient = "/removeClient"

    // Puerto connection
    static portConnector = "/chargingConnector"
    static portCreate = "/create"

    // Charging History
    static chargingHistory = "/chargingHistory"
    static findByClientUser = "/findByClientUser"
    // mobile
    static mobile = "/mobile"
    static chargingStations = "/chargingStations"
    static stopTransactionCredit = "/stopTransactionCredit"
    static stopTransaction = "/stopTransaction"
    static stopTransactionCliente = "/stopTransactionReleaseConnectorAndClients"
    
    // Reportes
    static facturasRelacionadas = "/invoicesRelationByDates"
    static clientesCarga = "/chargeClient"
    static cargasDatos = "/chargesByDates"
    static cargasEnergia = "/paymentsByDates"
    static facturaDatos = "/invoicesByDates"
    static facturaClienteCompraVenta = "/invoicesClientCompraVenta"
    static facturaSuministro = "/invoicesPaymentsTransactionSuministro"

    // paremetricas
    // models
    static models = "/models";
    static listar = "/list"
    static todos = "/all"
    static reactivar = "/reactivar"
    
    // address
    static address = "/address";

    // connector status
    static connectorStatus = "/connectorStatusOcpp"
    static byIdChargingStation = "/byIdChargingStation"

    // confirmacion de contraseña
    static accessCode = "/accessCode"
    static validate = "/validate"
    static restoreById = "/restoreById"
};
