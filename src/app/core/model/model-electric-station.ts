export class ModelElectricStation {
  id: number;
  vendor: string;
  modelCode: string;
  activo: boolean;
  boxSerialNumber: string;
  pointModel: string;
  pointSerialNumber: string;
  firmwareVersion: string;

  constructor() {
    this.id = 0;
    this.vendor = "";
    this.modelCode = "";
    this.activo = true;
    this.boxSerialNumber = "";
    this.pointModel = "";
    this.pointSerialNumber = "";
    this.firmwareVersion = "";
  }
}