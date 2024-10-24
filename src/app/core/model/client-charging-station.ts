import { ConnectorStatusModel } from "./charging-connector-status";

export class ClientChargingStatusModel {
  idChargingStationOcpp: string;
  nameStation: string;
  userName: string;
  idClientUser: number;
  connetorOcpp: string;

  constructor() {
    this.idChargingStationOcpp = "";
    this.nameStation = "";
    this.userName = "-";
    this.idClientUser = 0;
    this.connetorOcpp = "";
  }
}