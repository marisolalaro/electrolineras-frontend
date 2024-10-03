export class MeterValueModel {
  measurand: string;
  value: number;
  unit: string;
  phases: any;

  constructor() {
    this.measurand = "-";
    this.value = 0;
    this.unit = "-";
    this.phases = null;
  }
}
