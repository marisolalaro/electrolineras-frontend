import { Address } from './address';
import { Base } from './base';
import { ChargingConnector } from './charging-connector';
import { ModelElectricStation } from './model-electric-station';
import { TasaCargaModel } from './tasa-carga';

export class ElectricStationModel extends Base {
  id: number;
  nameStation: string;
  descripcion: string;
  direccion: string;
  activo: boolean;
  latitude: string;
  longitude: string;
  codeStationQr: string;
  codeStationQR: string;
  chargeRate: TasaCargaModel;
  errorCode: null;
  lastConnectedAt: null;
  ocppPublicAccessAllowed: boolean;
  ocppUrl: null;
  ocppVersion: null;
  stationConnectivityStatus: null;
  visibility: null;
  address: Address;
  model: ModelElectricStation;

  addressCity: string;
  addressDistrict: string;
  addressCountry: string;
  modelActivo: boolean;
  modelModelCode: string;
  modelVendor: string;
  chargingConnectorActivo: boolean;
  chargingConnectorDescripcion: string;
  chargingConnectorName: string;
  chargingConnectorType: string;
  chargeRateActivo: boolean;
  chargeRateAmount: string;
  chargingConnectorId: any;
  imageQr: string;
  chargingConnectors: ChargingConnector[];
  chargingConnectorStatus: string

}