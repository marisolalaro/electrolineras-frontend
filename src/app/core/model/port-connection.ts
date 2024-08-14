import { Base } from './base';

export class PortConnectionModel extends Base {
  id: number;
  name: string;
  description: string;
  type: string;
  maxAmperage: string;
  maxPower: string;
  maxVoltage: string;
  status: number;
  chargingStation: number;
}
