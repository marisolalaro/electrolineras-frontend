export class ConnectorStatusModel {
  connector: string;
  id: number;
  lastState: string;
  idChargingStation: number;
  userName?: string;

  constructor() {
    this.connector = '';
    this.id = 0;
    this.lastState = '';
    this.idChargingStation = 0;
  }
}