import { IMainTitles } from "../interfaces/labels.interface"

export const labels: any = {
  name: 'Nombre',
  code: 'Código',
  description: 'Descripción',
  price: 'Precio',
  stock: 'Stock',
  category: 'Categoría',
  startDate: 'Fecha Inicio',
  endDate: 'Fecha Fin',
  createdAt: 'Fecha Creación'
}

export const titles: any = {
  edit: 'Editar registro',
  create: 'Nuevo registro',
  filter: 'Filtrar por:',
}

export const buttons: any = {
  create: 'Crear',
  edit: 'Editar',
  delete: 'Eliminar',
  info: 'Info',
  save: 'Guardar',
  cancel: 'Cancelar',
  clear: 'Limpiar',
  export: 'Exportar',
  reload: 'Actualizar',
  search: 'Buscar',
  expand: 'Mas información'
}

export const tooltip: any = {
  create: 'Crear',
  edit: 'Editar',
  delete: 'Eliminar',
  info: 'Info',
  clear: 'Limpiar',
  export: 'Exportar',
  reload: 'Actualizar',
}

export const mainTitles: IMainTitles = {
  categories: {
    mainTitle: 'Categorías',
    secondaryTitle: 'Listado de Categorías'
  },
  products: {
    mainTitle: 'Productos',
    secondaryTitle: 'Listado de Productos'
  },
  usuarios: {
    mainTitle: 'Usuarios',
    secondaryTitle: 'Listado de Usuarios'
  },
  clientes: {
    mainTitle: 'Clientes',
    secondaryTitle: 'Listado de Clientes'
  },
  electrolineras: {
    mainTitle: 'Electrolineras',
    secondaryTitle: 'Listado de Electrolineras'
  },
}