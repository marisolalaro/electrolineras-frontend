import { Base } from './base';

export class ElectricStationModel extends Base {
  id: number;
  nameStation: string;
  descripcion: string;
  direccion: string;
  activo: boolean;
  latitude: string;
  longitude: string;
}