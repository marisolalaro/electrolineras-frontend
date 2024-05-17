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
};
