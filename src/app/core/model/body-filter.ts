import { SortFilterModel } from "./sort-filter";

export class BodyFilterModel {
  page: number;
  size: number;
  idRol: number;
  idUsuario: number;
  sort: SortFilterModel;

  constructor(page, size, idRol, idUsuario) {
    this.page = page;
    this.size = size;
    this.idRol = idRol;
    this.idUsuario = idUsuario;
    this.sort = new SortFilterModel();
  }
  
} 