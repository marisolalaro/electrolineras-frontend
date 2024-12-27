import { SearchFilterModel } from "./search-filter";
import { SortFilterModel } from "./sort-filter";

export class BodyFilterModel {
  page: number;
  size: number;
  idRol: number;
  idUsuario: number;
  sort: SortFilterModel;
  search: SearchFilterModel;
  filtro?: SortFilterModel;
  paid?: boolean;

  constructor(page, size, idRol?, idUsuario?) {
    this.page = page;
    this.size = size;
    this.idRol = idRol;
    this.idUsuario = idUsuario;
    this.sort = new SortFilterModel();
    this.search = new SearchFilterModel();
  }
  
} 