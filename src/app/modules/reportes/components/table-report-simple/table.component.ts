import { Component, Input } from '@angular/core';
import { ReportesService } from '../../services/reportes.service';
import { ExcelService } from '../../services/excel.service';
import { MessageService } from 'primeng/api';
import { reports } from 'src/app/core/constants/labels';

@Component({
  selector: 'app-table-report-simple',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})

export class TableReportSimpleComponent {

  // variables del componente padre
  @Input() rangoFechas: any;
  @Input() tipoReporte: any;

  // variables de control
  public blockedPanel: boolean = false;
  public componenteVisible: boolean = false;

  // variables propias del componente
  public cols!: any[];
  public reporte: any[] = [];
  public numeroReporte = '';
  public reporteX = 0;

  constructor(
    private excelService: ExcelService,
    private messageService: MessageService,
    private reporteService: ReportesService,
  ) { }

  ngOnInit() {    
    this.identificaTipoReporte()
      .then(tipoIdentificado => {
        if (tipoIdentificado) {
          return this.inicializaColumna();
        } else {
          return false;
        }
      })
      .then(inicializado => {
        if (inicializado) {
          return this.getReporte();
        } else {
          return false;
        }
      })
      .then(reporteGenerado => {
        if (reporteGenerado) {
          return this.getNumeroReporte();
        } else {
          return false;
        }
      })
      .then(numeroIdentificado => {
        if (numeroIdentificado) {
          this.componenteVisible = true;
          return true;
        } else {
          this.componenteVisible = false;
          return false;
        }
      })
  }

  identificaTipoReporte() {
    return new Promise((resolve) => {
      if (this.tipoReporte.nombre.includes("1")) {
        this.reporteX = 1;
      }
      if (this.tipoReporte.nombre.includes("2")) {
        this.reporteX = 2;
      }
      if (this.tipoReporte.nombre.includes("4")) {
        this.reporteX = 4;
      }
      if (this.tipoReporte.nombre.includes("5")) {
        this.reporteX = 5;
      }

      resolve(true);
    })
  }

  inicializaColumna() {
    return new Promise((resolve) => {
      if (this.reporteX == 1) {
        this.cols = [
          { field: 'razonSocial', header: 'Nombre/Razón Social', pipe: '' },
          { field: 'nitCi', header: 'Nit/Ci', pipe: '' },
          { field: 'cuf', header: 'Cuf', pipe: '' },
          { field: 'amount', header: 'Monto Bs', pipe: ' | numberDecimal:2' },
          { field: 'fechaEmision', header: 'Fecha de Emisión', pipe: '' },
          { field: 'tipoFactura', header: 'Tipo de Factura', pipe: '' },
          { field: 'urlFacturaSiat', header: 'Url Factura Siat', pipe: '' },
        ];
        resolve(true);
      }
      if (this.reporteX == 2) {
        this.cols = [
          { field: 'razonSocial', header: 'Nombre/Razón Social' },
          { field: 'numeroDocumento', header: 'Número de Documento' },
          { field: 'bank', header: 'Banco' },
          { field: 'monto', header: 'Monto Bs' },
          { field: 'fechaCarga', header: 'Fecha de Carga' },
          { field: 'horaCarga', header: 'Hora de Carga' },
          { field: 'cuf', header: 'Cuf' },
        ];
        resolve(true);
      }
      if (this.reporteX == 4) {
        this.cols = [
          { field: 'codigoDescripcion', header: 'Código' },
          { field: 'fechaRegistro', header: 'Fecha de Registro' },
          { field: 'codigoRecepcion', header: 'Recepción' },
          { field: 'cuf', header: 'Cuf' },
          { field: 'paymentTransactionType', header: 'Tipo de Transacción' },
          { field: 'urlFacturaSiat', header: 'Url Factura Siat' },
        ];
        resolve(true);
      }
      if (this.reporteX == 5) {
        this.cols = [
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
        resolve(true);
      }
    })
  }

  getReporte() {
    return new Promise((resolve) => {
      if (this.reporteX == 1) {
        this.geFacturasDatos(this.rangoFechas)
        resolve(true);
      }
      if (this.reporteX == 2) {
        this.getCargasEnergia(this.rangoFechas)
        resolve(true);
      }
      if (this.reporteX == 4) {
        this.getPagoDatos(this.rangoFechas)
        resolve(true);
      }
      if (this.reporteX == 5) {
        this.getFacturasSuministro(this.rangoFechas)
        resolve(true);
      }
    })
  }

  // el resolve hay que ponerlo dentro de los servicios
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

  getNumeroReporte() {
    return new Promise((resolve) => {
      if (this.reporteX == 1) {
        this.numeroReporte = JSON.parse(JSON.stringify(reports.labelReporte1));
      }
      if (this.reporteX == 2) {
        this.numeroReporte = JSON.parse(JSON.stringify(reports.labelReporte2));
      }
      if (this.reporteX == 4) {
        this.numeroReporte = JSON.parse(JSON.stringify(reports.labelReporte4));
      }
      if (this.reporteX == 5) {
        this.numeroReporte = JSON.parse(JSON.stringify(reports.labelReporte5));
      }
      resolve(true);
    })
  }

  descargaArchivo() {
    if (this.reporteX == 1) {
      this.excelService.excelFacturasCargaCredito(this.reporte, reports.archivoReporte1, reports.hojaReporte1, this.rangoFechas);
    }
    if (this.reporteX == 2) {
      this.excelService.excelCargasEnergias(this.reporte, reports.archivoReporte2, reports.hojaReporte2, this.rangoFechas);
    }
    if (this.reporteX == 4) {
      this.excelService.excelPagoDatos(this.reporte, reports.archivoReporte4, reports.hojaReporte4, this.rangoFechas);
    }
    if (this.reporteX == 5) {
      this.excelService.excelSuministroEnergia(this.reporte, reports.archivoReporte5, reports.hojaReporte5, this.rangoFechas);
    }
  }

}
