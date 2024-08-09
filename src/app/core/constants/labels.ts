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

export const reports: any = {

  numeroReporte1: '1er reporte',
  numeroReporte2: '2do reporte',
  numeroReporte3: '3er reporte',
  numeroReporte4: '4to reporte',
  numeroReporte5: '5to reporte',
  numeroReporte6: '6to reporte',
  numeroReporte7: '7mo reporte',
  xReporte: 'x reporte',

  labelReporte1: '1er reporte facturas crédito y suministro energía',
  labelReporte2: '2do reporte facturas compras crédito',
  labelReporte3: '3er reporte facturas crédito relacionado suministro energía',
  labelReporte4: '4to reporte facturas suministro energía',
  labelReporte5: '5to reporte detalle suministro energía',
  labelReporte6: '6to reporte facturas compras crédito por cliente',
  labelReporte7: '7mo reporte facturas suministro energía por cliente',

  archivoReporte1: '1er_reporte_entre_fechas_facturas_credito_y_suministro_energia',
  archivoReporte2: '2do_reporte_entre_fechas_facturas_compras_credito',
  archivoReporte3: '3er_reporte_entre_fechas_facturas_credito_relacionado_suministro_energia',
  archivoReporte4: '4to_reporte_entre_fechas_facturas_suministro_energia',
  archivoReporte5: '5to_reporte_entre_fechas_detalle_suministro_energia',
  archivoReporte6: '6to_reporte_entre_fechas_facturas_compras_credito_por_cliente',
  archivoReporte7: '7mo_reporte_entre_fechas_facturas_suministro_energia_por_cliente',

  hojaReporte1: 'facturas_credito_y_suministro_energia',
  hojaReporte2: 'facturas_compras_credito',
  hojaReporte3: 'facturas_credito_relacionado_suministro_energia',
  hojaReporte4: 'facturas_suministro_energia',
  hojaReporte5: 'detalle_suministro_energia',
  hojaReporte6: 'facturas_compras_credito_por_cliente',
  hojaReporte7: 'facturas_suministro_energia_por_cliente',

  tituloReporte1: 'REPORTE FACTURAS CRÉDITO Y SUMINISTRO ENERGÍA',
  tituloReporte2: 'REPORTE FACTURAS COMPRAS CRÉDITO',
  tituloReporte3: 'REPORTE FACTURAS CRÉDITO RELACIONADO SUMINISTRO ENERGÍA',
  tituloReporte4: 'REPORTE FACTURAS SUMINISTRO ENERGÍA',
  tituloReporte5: 'REPORTE DETALLE SUMINISTRO ENERGÍA',
  tituloReporte6: 'REPORTE FACTURAS COMPRAS CRÉDITO POR CLIENTE',
  tituloReporte7: 'REPORTE FACTURAS SUMINISTRO ENERGÍA POR CLIENTE',

  tituloAgrupador1Reporte3: 'Facturas Compra Venta Crédito',
  tituloAgrupador2Reporte3: 'Facturas Suministro de Energía',
  tituloAgrupador1Reporte6: 'Datos Cliente',
  tituloAgrupador2Reporte6: 'Facturas Compra Venta Crédito',
  tituloAgrupador1Reporte7: 'Datos Cliente',
  tituloAgrupador2Reporte7: 'Facturas Suministro de Energía',
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
  dashboard: {
    mainTitle: 'Dashboard',
    secondaryTitle: 'Dashboard'
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

  electrolinerasOnline: {
    mainTitle: 'Electrolineras en Linea',
    secondaryTitle: 'Listado de Electrolineras en Linea'
  },
  reportes: {
    mainTitle: 'Reportes',
    secondaryTitle: 'Reportes'
  }
}