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
  // nombre de tabs
  numeroReporte1: 'Factura de compras y carga de energía',
  numeroReporte2: 'Factura de compras',
  numeroReporte3: 'crédito relacionado suministro energía',
  numeroReporte4: 'Factura cargas de energía',
  numeroReporte5: 'Cargas de energía por cliente',
  numeroReporte6: 'Facturas de compras por cliente',
  numeroReporte7: 'Facturas de cargas por cliente',
  numeroReporte8: 'Set42 - Datos mensuales de electrolineras',
  numeroReporte9: 'Cargas de clientes por bloques',
  xReporte: 'x reporte',
  // nombre de options
  labelReporte1: 'Factura de compras y carga de energía',
  labelReporte2: 'Factura de compras',
  labelReporte3: 'reporte facturas crédito relacionado suministro energía',
  labelReporte4: 'Factura cargas de energía',
  labelReporte5: 'Cargas de energía por cliente',
  labelReporte6: 'Facturas de compras por cliente',
  labelReporte7: 'Facturas de cargas por cliente',
  labelReporte8: 'Set42 - Datos mensuales de electrolineras',
  labelReporte9: 'Cargas de clientes por bloques',
  // nombre archivo de descarga
  archivoReporte1: 'factura_de_compras_y_carga_de_energía',
  archivoReporte2: 'factura_de_compras',
  archivoReporte3: 'reporte_entre_fechas_facturas_credito_relacionado_suministro_energia',
  archivoReporte4: 'factura_cargas_de_energía',
  archivoReporte5: 'cargas_de_energia_por_cliente',
  archivoReporte6: 'facturas_de_compras_por_cliente',
  archivoReporte7: 'facturas_de_cargas_por_cliente',
  archivoReporte8: 'set42_datos_mensuales_de_electrolineras',
  archivoReporte9: 'cargas_de_clientes_por_bloques',
  // nombre de la hoja
  hojaReporte1: 'factura_de_compras_y_carga_de_energía',
  hojaReporte2: 'factura_de_compras',
  hojaReporte3: 'facturas_credito_relacionado_suministro_energia',
  hojaReporte4: 'factura_cargas_de_energía',
  hojaReporte5: 'cargas_de_energia_por_cliente',
  hojaReporte6: 'facturas_de_compras_por_cliente',
  hojaReporte7: 'facturas_de_cargas_por_cliente',
  hojaReporte8: 'set42_datos_mensuales_de_electrolineras',
  hojaReporte9: 'cargas_de_clientes_por_bloques',
  // titulo dentro del excel
  tituloReporte1: 'FACTURA DE COMPRAS Y CARGA DE ENERGÍA',
  tituloReporte2: 'FACTURA DE COMPRAS',
  tituloReporte3: 'REPORTE FACTURAS CRÉDITO RELACIONADO SUMINISTRO ENERGÍA',
  tituloReporte4: 'FACTURA CARGAS DE ENERGÍA',
  tituloReporte5: 'CARGAS DE ENERGÍA POR CLIENTE',
  tituloReporte6: 'FACTURAS DE COMPRAS POR CLIENTE',
  tituloReporte7: 'FACTURAS DE CARGAS POR CLIENTE',
  tituloReporte8: 'DATOS DE OPERACIÓN EN ELECTROLINERA',
  tituloReporte9: 'CARGAS DE CLIENTES POR BLOQUES',

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
  desvincularCliente: {
    mainTitle: 'Desvincular Cliente',
    secondaryTitle: 'Desvincular Cliente'
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