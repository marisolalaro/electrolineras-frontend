import { Base } from './base';
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
  chargeRate: TasaCargaModel;

  // nameStation: string;
  // descripcion: string;
  // direccion: string;
  // activo: boolean;
  // latitude: string;
  // longitude: string;
  // codeStationQr: string;
  errorCode: null;
  lastConnectedAt: null;
  ocppPublicAccessAllowed: boolean;
  ocppUrl: null;
  ocppVersion: null;
  stationConnectivityStatus: null;
  visibility: null;
  // chargeRate: ChargeRate;
  address: Address;
  model: Model;
}

interface Model {
  id: number;
  vendor: string;
  modelCode: string;
  activo: boolean;
}

interface Address {
  id: number;
  city: string;
  country: string;
  district: string;
}

interface ChargeRate {
  id: number;
  amount: string;
  registratioDate: string;
  registrationDate: string;
  activo: boolean;
}