import { Customer } from "./customer";
import { ElectricStationModel } from "./electric-station";

export class ChargingHistoryModel {
  startedAt: string;
  finishedAt: string;
  energyConsumed: number;
  currentOfferedMode: number;
  nameChargingStation: string;
  userName: string;
}