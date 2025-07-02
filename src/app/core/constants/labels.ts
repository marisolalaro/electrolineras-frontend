import { IMainTitles } from "../interfaces/labels.interface"

export const labels: any = {
  // electric station
  nameStation: 'Nombre de Estación',
  description: 'Descripción',
  address: 'Dirección',
  latitude: 'Latitud',
  longitude: 'Longitud',
  codeStationQr: 'Codigo QR',

  // Administradores
  email: 'Correo Electrónico',
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
  startDate: 'Fecha Inicio',
  endDate: 'Fecha Fin',
  createdAt: 'Fecha Creación',

  // puertos
  nombrePuerto: 'Nombre',
  descripcionPuerto: 'Descripción',
  maximoAmperaje: 'Máximo Amperaje',
  maximoVoltaje: 'Máximo Voltaje',
  maximaPotencia: 'Máximo Potencia',

  // Parametricas
  // modelo
  vendor: 'Marca',
  modelCode: 'Código de Modelo',
  boxSerialNumber: 'Número de Serie Modelo',
  pointModel: 'Tipo',
  pointSerialNumber: 'Número de Serie Tipo',
  firmwareVersion: 'Versión Firmware',

  // Tasa de carga
  tasaCarga: 'Tasa de Carga',
  modelo: 'Modelo',
  horaInicio: 'Hora Inicio',
  horaFin: 'Hora Fin',
  corrienteMinima: 'Corriente Mínima',
  corrienteMaxima: 'Corriente Máxima',
  descripcion: 'Descripción',

}

export const reports: any = {

  // numeroReporte1: '1er reporte',
  // numeroReporte2: '2do reporte',
  // numeroReporte3: '3er reporte',
  // numeroReporte4: '4to reporte',
  // numeroReporte5: '5to reporte',
  // numeroReporte6: '6to reporte',
  // numeroReporte7: '7mo reporte',
  numeroReporte1: 'crédito y suministro energía',
  numeroReporte2: 'compras crédito',
  numeroReporte3: 'crédito relacionado suministro energía',
  numeroReporte4: 'suministro energía',
  numeroReporte5: 'detalle suministro energía',
  numeroReporte6: 'compras crédito por cliente',
  numeroReporte7: 'suministro energía por cliente',
  xReporte: 'x reporte',

  labelReporte1: 'reporte facturas crédito y suministro energía',
  labelReporte2: 'reporte facturas compras crédito  ',
  labelReporte3: 'reporte facturas crédito relacionado suministro energía',
  labelReporte4: 'reporte facturas suministro energía  ',
  labelReporte5: 'reporte detalle suministro energía',
  labelReporte6: 'reporte facturas compras crédito por cliente',
  labelReporte7: 'reporte facturas suministro energía por cliente',

  archivoReporte1: 'reporte_entre_fechas_facturas_credito_y_suministro_energia',
  archivoReporte2: 'reporte_entre_fechas_facturas_compras_credito',
  archivoReporte3: 'reporte_entre_fechas_facturas_credito_relacionado_suministro_energia',
  archivoReporte4: 'reporte_entre_fechas_facturas_suministro_energia',
  archivoReporte5: 'reporte_entre_fechas_detalle_suministro_energia',
  archivoReporte6: 'reporte_entre_fechas_facturas_compras_credito_por_cliente',
  archivoReporte7: 'reporte_entre_fechas_facturas_suministro_energia_por_cliente',

  // labelReporte1: '1er reporte facturas crédito y suministro energía',
  // labelReporte2: '2do reporte facturas compras crédito',
  // labelReporte3: '3er reporte facturas crédito relacionado suministro energía',
  // labelReporte4: '4to reporte facturas suministro energía',
  // labelReporte5: '5to reporte detalle suministro energía',
  // labelReporte6: '6to reporte facturas compras crédito por cliente',
  // labelReporte7: '7mo reporte facturas suministro energía por cliente',

  // archivoReporte1: '1er_reporte_entre_fechas_facturas_credito_y_suministro_energia',
  // archivoReporte2: '2do_reporte_entre_fechas_facturas_compras_credito',
  // archivoReporte3: '3er_reporte_entre_fechas_facturas_credito_relacionado_suministro_energia',
  // archivoReporte4: '4to_reporte_entre_fechas_facturas_suministro_energia',
  // archivoReporte5: '5to_reporte_entre_fechas_detalle_suministro_energia',
  // archivoReporte6: '6to_reporte_entre_fechas_facturas_compras_credito_por_cliente',
  // archivoReporte7: '7mo_reporte_entre_fechas_facturas_suministro_energia_por_cliente',

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
  createConnector: 'Adicionar Conector',
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

export const estadosConectores: any = {
  // estados conectores enviado de la electrolinera
  available: 'Available',
  preparing: 'Preparing',
  charging: 'Charging',
  finishing: 'Finishing',
  unavailable: 'Unavailable',
  suspendedEV: 'SuspendedEV',
  suspendedEVSE: 'SuspendedEVSE',
  // estados conectores en espaniol
  disponible: 'Disponible',
  preparando: 'Preparando',
  cargando: 'Cargando',
  terminando: 'Terminando',
  noDisponible: 'No disponible',
  cargaCompleta: 'Carga completa',
  verificando: 'Verificando',
  // Estado conexion internet
  conectando: 'Conectando',
  enLinea: 'En línea',
  sinConexion: 'Sin Conexion',
  // colores propiedad de boton
  colorConectando: 'color: var(--color-suspendend)',
  colorEnLinea: 'color: var(--color-available)',
  colorSinConexion: 'color: var(--color-unavailable)',

}

export const parametricaAddress: any = {
  // estados conectores enviado de la electrolinera
  ciudad: 'Ciudad',
  distrito: 'Distrito',
  pais: 'País',
}
export const accessCode: any = {
  // estados conectores enviado de la electrolinera
  accessCode: 'Código de acceso'
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
  },

  parametricas: {
    mainTitle: 'Administración Paramétricas',
    secondaryTitle: 'Paramétricas'
  },
  modelos: {
    mainTitle: 'Modelos de Electrolineras',
    secondaryTitle: 'Modelo'
  },
  tasaCarga: {
    mainTitle: 'Tasas de carga',
    secondaryTitle: 'Tasas de carga'
  },
  direcciones: {
    mainTitle: 'Direcciones',
    secondaryTitle: 'Dirección'
  },
  contrasenias: {
    mainTitle: 'Constraseñas',
    secondaryTitle: 'Contraseña'
  },
}