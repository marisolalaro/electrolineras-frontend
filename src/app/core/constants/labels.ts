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
  administradores: {
    mainTitle: 'Administradores',
    secondaryTitle: 'Listado de Administradores'
  },
}