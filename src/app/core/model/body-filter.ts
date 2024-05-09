import { SortFilterModel } from "./sort-filter";

export class BodyFilterModel {
  page: number;
  size: number;
  idRol: number;
  idUsuario: number;
  sort: SortFilterModel;

  constructor(idRol, idUsuario) {
    this.page = 1;
    this.size = 10;
    this.idRol = idRol;
    this.idUsuario = idUsuario;
    this.sort = new SortFilterModel();
  }
}