import { IMainTitles } from "../interfaces/labels.interface"

export const labels: any = {
  // electric station
  nameStation: 'Nombre de Estación',
  description: 'Descripción',
  address: 'Dirección',
  latitude: 'Latitud',
  longitude: 'Longitud',
  codeStationQr: 'Codigo QR',

  // Tasa de carga
  tasaCarga: 'Tasa de Carga',

  // Administradores
  email: 'Email',
  username: 'Nombre de Usuario',
  name: 'Nombres',
  apellidoPaterno: 'Apellido Paterno',
  apellidoMaterno: 'Apellido Materno',
  ci: 'Cedula de Identidad',
  celular: 'Celular',
  telefono: 'Telefono',
  fechaNacimiento: 'Fecha de Nacimiento',
  usuario: 'Usuario',
  contrasenia: 'Contraseña',

  code: 'Código',
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
  detail: 'Detalle registro',
  info: 'Detalle Información',
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
  // menu Horizontal
  clientes: {
    mainTitle: 'Clientes',
    secondaryTitle: 'Listado de Clientes'
  },
  administradores: {
    mainTitle: 'Administradores',
    secondaryTitle: 'Listado de Administradores'
  },
  // menu Lateral
  electrolineras: {
    mainTitle: 'Electrolineras',
    secondaryTitle: 'Listado de Electrolineras'
  },
  transacciones: {
    mainTitle: 'Transacciones',
    secondaryTitle: 'Listado de Transacciones'
  },
  facturas: {
    mainTitle: 'Facturas-compra-venta',
    secondaryTitle: 'Listado de Facturas Compras de crédito'
  },
  facturasCargaEnergia: {
    mainTitle: 'Facturas suministro de energía ',
    secondaryTitle: 'Listado de Facturas Carga de Energía'
  },
}