export class ChargingConnector {
  id: number;
  name: string;
  description: string;
  type: string;
  chargingStationName: string;
  statusName: string;
  maxAmperage: string;
  maxPower: string;
  maxVoltage: string;
  lastState?: string
}
