import { Address } from './address';
import { Base } from './base';
import { ChargingConnector } from './charging-connector';
import { ClientChargingStatusModel } from './client-charging-station';
import { ModelElectricStation } from './model-electric-station';
import { TasaCargaModel } from './tasa-carga';

export class ElectricStationModel {
  id: number;
  nameStation: string;
  descripcion: string;
  direccion: string;
  activo: boolean;
  enabled: boolean;
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
  sessionIndex: any;
  idChargingStationOcpp: any;
  clients: ClientChargingStatusModel[];

  constructor() {
    this.id = 0;
    this.nameStation = '';
    this.descripcion = '';
    this.direccion = '';
    this.activo = false;
    this.enabled = false;
    this.latitude = '';
    this.longitude = '';
    this.codeStationQr = '';
    this.codeStationQR = '';
    // this.chargeRate = TasaCargaModel;
    this.errorCode = null;
    this.lastConnectedAt = null;
    this.ocppPublicAccessAllowed = false;
    this.ocppUrl = null;
    this.ocppVersion = null;
    this.stationConnectivityStatus = null;
    this.visibility = null;
    // this.address = Address;
    this.model = new ModelElectricStation();
    this.addressCity = '';
    this.addressDistrict = '';
    this.addressCountry = '';
    this.modelActivo = false;
    this.modelModelCode = '';
    this.modelVendor = '';
    this.chargingConnectorActivo = false;
    this.chargingConnectorDescripcion = '';
    this.chargingConnectorName = '';
    this.chargingConnectorType = '';
    this.chargeRateActivo = false;
    this.chargeRateAmount = '';
    this.chargingConnectorId = '';
    this.imageQr = '';
    this.chargingConnectorStatus = ''
    this.sessionIndex = '';
    this.idChargingStationOcpp = '';
    this.clients = [];
  }

}