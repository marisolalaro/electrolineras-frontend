import { Component } from '@angular/core';
import { ReportesModule } from './reportes.module';
import { mainTitles, reports } from 'src/app/core/constants/labels';
import { ReportesService } from './services/reportes.service';
import { MessageService } from 'primeng/api';
import * as moment from 'moment';
import { ExcelService } from './services/excel.service';
import { NgFor, NgIf } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.scss'],
  imports: [ReportesModule, NgIf, NgFor],
  providers: [MessageService]
})

export default class ReportesComponent {

  public factRel = [];
  public blockedPanel: boolean = false;
  public titleProduct: any = mainTitles['reportes'];
  public rangeDates: Date[] | undefined;
  public reportes: any[] = [
    { nombre: reports.labelReporte1},
    { nombre: reports.labelReporte2 },
    { nombre: reports.labelReporte3 },
    { nombre: reports.labelReporte4 },
    { nombre: reports.labelReporte5 },
    { nombre: reports.labelReporte6 },
    { nombre: reports.labelReporte7 },
  ];

  public numeroReporte = '';
  public reporte: any[] = [];

  public col!: any[];
  public cols1!: any[];
  public cols2!: any[];
  public cols3!: any[];
  public cols4!: any[];
  public cols5!: any[];
  public cols6!: any[];
  public cols7!: any[];

  public rangoFechas;

  public vistaPrevia: number = 0;
  public reporteSeleccionado: any;
  public sugerencia: string[] = [];

  public ventanas: any [] = [];

  constructor(
    private reporteService: ReportesService,
    private excelService: ExcelService,
    private messageService: MessageService,
  ) { }

  ngOnInit() {
    this.inicializaColumnas();
  }

  inicializaColumnas() {
    this.cols1 = [
      { field: 'razonSocial', header: 'Nombre/Razón Social', pipe: '' },
      { field: 'nitCi', header: 'Nit/Ci', pipe: '' },
      { field: 'cuf', header: 'Cuf', pipe: '' },
      { field: 'amount', header: 'Monto Bs', pipe: ' | numberDecimal:2'},
      { field: 'fechaEmision', header: 'Fecha de Emisión', pipe: '' },
      { field: 'tipoFactura', header: 'Tipo de Factura', pipe: '' },
      { field: 'urlFacturaSiat', header: 'Url Factura Siat', pipe: '' },
    ];
    this.cols2 = [
      { field: 'razonSocial', header: 'Nombre/Razón Social' },
      { field: 'numeroDocumento', header: 'Número de Documento' },
      { field: 'bank', header: 'Banco' },
      { field: 'monto', header: 'Monto Bs' },
      { field: 'fechaCarga', header: 'Fecha de Carga' },
      { field: 'horaCarga', header: 'Hora de Carga' },
      { field: 'cuf', header: 'Cuf' },
    ];
    this.cols3 = [
      { field: 'codigoDescripcion', header: 'Código Recepción' },
      { field: 'fechaRegistro', header: 'Fecha Emisión' },
      { field: 'cuf', header: 'Cuf' },
      { field: 'paymentTransactionType', header: 'Tipo de Pago' },
      { field: 'invoicesPaymentTrasantionsResponseDtoList.codigoDescripcion', header: 'Facturas de Transacción' }
    ];
    this.cols4 = [
      { field: 'codigoDescripcion', header: 'Código' },
      { field: 'fechaRegistro', header: 'Fecha de Registro' },
      { field: 'codigoRecepcion', header: 'Recepción' },
      { field: 'cuf', header: 'Cuf' },
      { field: 'paymentTransactionType', header: 'Tipo de Transacción' },
      { field: 'urlFacturaSiat', header: 'Url Factura Siat' },
    ];
    this.cols5 = [
      { field: 'username', header: 'Usuario' },
      { field: 'changeFee', header: 'Carga' },
      { field: 'status', header: 'Estado' },
      { field: 'duration', header: 'Duración' },
      { field: 'chargingStation', header: 'Estación de Carga' },
      { field: 'staredChargingAt', header: 'Fecha Inicio' },
      { field: 'finisheAt', header: 'Fecha Finalización' },
      { field: 'energyComsumed', header: 'Energía Consumida kW' },
      { field: 'amount', header: 'Monto Bs' },
    ];
    this.cols6 = [
      { field: 'electronicMail', header: 'Correo Electrónico' },
      { field: 'names', header: 'Nombres' },
      { field: 'lastName', header: 'Apellido Paterno' },
      { field: 'motherLastName', header: 'Apellido Materno' },
      { field: 'identificationNumber', header: 'Número de Identificación' },
      { field: '', header: 'Detalle Facturas' }
    ];
    this.cols7 = [
      { field: 'electronicMail', header: 'Correo Electrónico' },
      { field: 'names', header: 'Nombres' },
      { field: 'lastName', header: 'Apellido Paterno' },
      { field: 'motherLastName', header: 'Apellido Materno' },
      { field: 'identificationNumber', header: 'Número de Identificación' },
      { field: '', header: 'Detalle Facturas' }
    ];
  }

  filterItems(event: any) {
    const query = event.query.toLowerCase();
    this.sugerencia = this.reportes.filter(item => item.nombre.toLowerCase().includes(query));
  }

  onDownloadReport() {

    this.rangoFechas = {
      "initialDate": moment(this.rangeDates[0]).utc().format('YYYY-MM-DD'),
      "finalDate": this.rangeDates[1] ? moment(this.rangeDates[1]).utc().format('YYYY-MM-DD') : moment(this.rangeDates[0]).utc().format('YYYY-MM-DD')
    }
    if (this.reporteSeleccionado.nombre == reports.labelReporte1) {
      this.vistaPrevia = 1;
      this.col = this.cols1
      this. numeroReporte = reports.labelReporte1;
      this.geFacturasDatos(this.rangoFechas)
    }
    if (this.reporteSeleccionado.nombre == reports.labelReporte2) {
      this.vistaPrevia = 1;
      this.col = this.cols2
      this. numeroReporte = reports.labelReporte2;
      this.getCargasEnergia(this.rangoFechas)
    }
    if (this.reporteSeleccionado.nombre == reports.labelReporte3) {
      this.vistaPrevia = 2;
      this.col = this.cols3
      this. numeroReporte = reports.labelReporte3;
      this.getFacturasRelacionadas(this.rangoFechas)
    }
    if (this.reporteSeleccionado.nombre == reports.labelReporte4) {
      this.vistaPrevia = 1;
      this.col = this.cols4
      this. numeroReporte = reports.labelReporte4;
      this.getPagoDatos(this.rangoFechas)
    }
    if (this.reporteSeleccionado.nombre == reports.labelReporte5) {
      this.vistaPrevia = 1;
      this.col = this.cols5
      this. numeroReporte = reports.labelReporte5;
      this.getFacturasSuministro(this.rangoFechas)
    }
    if (this.reporteSeleccionado.nombre == reports.labelReporte6) {
      this.vistaPrevia = 3;
      this.col = this.cols6
      this. numeroReporte = reports.labelReporte6;
      this.getFacturasCompraVenta(this.rangoFechas)
    }
    if (this.reporteSeleccionado.nombre == reports.labelReporte7) {
      this.vistaPrevia = 4;
      this.col = this.cols7
      this. numeroReporte = reports.labelReporte7;
      this.getFacturasSuministroEnergia(this.rangoFechas)
    }
  }

  // 1er Reporte Facturas compra - venta
  geFacturasDatos(rangoFechas) {
    this.reporte = [];
    this.blockedPanel = true;
    return new Promise((resolve) => {
      this.reporteService.getFacturasCompraVenta(rangoFechas).subscribe(
        (resp: any) => {
          this.reporte = JSON.parse(JSON.stringify(resp.data));
          if (resp.data.length > 0) {
          } else {
            this.messageService.add({ severity: 'info', detail: '0 Registros Encontrados' });
          }
          this.blockedPanel = false;
        },
        error => {
          this.blockedPanel = false;
        }
      )
      resolve(true);
    })
  }

  // 2do Reporte Pagos de Crédito
  getCargasEnergia(rangoFechas) {
    this.reporte = [];
    this.blockedPanel = true;
    return new Promise((resolve) => {
      this.reporteService.getCargaEnergia(rangoFechas).subscribe(
        (resp: any) => {
          this.reporte = JSON.parse(JSON.stringify(resp.data));
          if (resp.data.length > 0) {
          } else {
            this.messageService.add({ severity: 'info', detail: '0 Registros Encontrados' });
          }
          this.blockedPanel = false;
        },
        error => {
          this.blockedPanel = false;
        }
      )
      resolve(true);
    })
  }

  // 3er Reporte Facturas Relacionadas
  getFacturasRelacionadas(rangoFechas) {
    this.reporte = [];
    this.blockedPanel = true;
    return new Promise((resolve) => {
      this.reporteService.getFacturasRelacionadas(rangoFechas).subscribe(
        (resp: any) => {
          this.reporte = JSON.parse(JSON.stringify(resp.data));
          if (resp.data.length > 0) {
          } else {
            this.messageService.add({ severity: 'info', detail: '0 Registros Encontrados' });
          }
          this.blockedPanel = false;
        },
        error => {
          this.blockedPanel = false;
        }
      )
      resolve(true);
    })
  }

  // 4to Reporte Factura Suministro de Energía
  getPagoDatos(rangoFechas) {
    this.reporte = [];
    this.blockedPanel = true;
    return new Promise((resolve) => {
      this.reporteService.getPagoDatos(rangoFechas).subscribe(
        (resp: any) => {
          this.reporte = JSON.parse(JSON.stringify(resp.data));
          if (resp.data.length > 0) {
          } else {
            this.messageService.add({ severity: 'info', detail: '0 Registros Encontrados' });
          }
          this.blockedPanel = false;
        },
        error => {
          this.blockedPanel = false;
        }
      )
      resolve(true);
    })
  }

  // 5to Reporte - cargas de energia entre fechas
  getFacturasSuministro(rangoFechas) {
    this.reporte = [];
    this.blockedPanel = true;
    return new Promise((resolve) => {
      this.reporteService.getSuministroEnergia(rangoFechas).subscribe(
        (resp: any) => {
          this.reporte = JSON.parse(JSON.stringify(resp.data));
          if (resp.data.length > 0) {
          } else {
            this.messageService.add({ severity: 'info', detail: '0 Registros Encontrados' });
          }
          this.blockedPanel = false;
        },
        error => {
          this.blockedPanel = false;
        }
      )
      resolve(true);
    })
  }

  // 6toReporte
  getFacturasCompraVenta(rangoFechas) {
    this.reporte = [];
    this.blockedPanel = true;
    return new Promise((resolve) => {
      this.reporteService.getFacturaCompraVenta(rangoFechas).subscribe(
        (resp: any) => {
          this.reporte = JSON.parse(JSON.stringify(resp.data));
          if (resp.data.length > 0) {
          } else {
            this.messageService.add({ severity: 'info', detail: '0 Registros Encontrados' });
          }
          this.blockedPanel = false;
        },
        error => {
          this.blockedPanel = false;
        }
      )
      resolve(true);
    })
  }

  // 7moReporte
  getFacturasSuministroEnergia(rangoFechas) {
    this.reporte = [];
    this.blockedPanel = true;
    return new Promise((resolve) => {
      this.reporteService.getFacturaSuministroEnergia(rangoFechas).subscribe(
        (resp: any) => {
          this.reporte = JSON.parse(JSON.stringify(resp.data));
          if (resp.data.length > 0) {
          } else {
            this.messageService.add({ severity: 'info', detail: '0 Registros Encontrados' });
          }
          this.blockedPanel = false;
        },
        error => {
          this.blockedPanel = false;
        }
      )
      resolve(true);
    })
  }

  descargaArchivo() {
    if (this.reporteSeleccionado.nombre == reports.labelReporte1) {
      this.excelService.excelFacturasCargaCredito(this.reporte, reports.archivoReporte1, reports.hojaReporte1, this.rangoFechas);
    }
    if (this.reporteSeleccionado.nombre == reports.labelReporte2) {
      this.excelService.excelCargasEnergias(this.reporte, reports.archivoReporte2, reports.hojaReporte2, this.rangoFechas);
    }
    if (this.reporteSeleccionado.nombre == reports.labelReporte3) {
      this.excelService.excelFacturasRelacionadas(this.reporte, reports.archivoReporte3, reports.hojaReporte3, this.rangoFechas);
    }
    if (this.reporteSeleccionado.nombre == reports.labelReporte4) {
      this.excelService.excelPagoDatos(this.reporte, reports.archivoReporte4, reports.hojaReporte4, this.rangoFechas);
    }
    if (this.reporteSeleccionado.nombre == reports.labelReporte5) {
      this.excelService.excelSuministroEnergia(this.reporte, reports.archivoReporte5, reports.hojaReporte5, this.rangoFechas);
    }
    if (this.reporteSeleccionado.nombre == reports.labelReporte6) {
      this.excelService.excelFacturasCompraVenta(this.reporte, reports.archivoReporte6, reports.hojaReporte6, this.rangoFechas);
    }
    if (this.reporteSeleccionado.nombre == reports.labelReporte7) {
      this.excelService.excelFacturasSuministroEnergia(this.reporte, reports.archivoReporte7, reports.hojaReporte7, this.rangoFechas);
    }
  }
}
