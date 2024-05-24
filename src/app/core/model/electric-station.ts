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
}