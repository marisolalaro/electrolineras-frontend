import { Component } from '@angular/core';
import { ReportesModule } from './reportes.module';
import { mainTitles } from 'src/app/core/constants/labels';
import { ReportesService } from './services/reportes.service';
import { MessageService } from 'primeng/api';
import * as moment from 'moment';
import { ExcelService } from './services/excel.service';

@Component({
  standalone: true,
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.scss'],
  imports: [ReportesModule],
  providers: [MessageService]
})

export default class ReportesComponent {

  public factRel = [];
  public blockedPanel: boolean = false;
  public titleProduct: any = mainTitles['reportes'];
  public rangeDates: Date[] | undefined;
  public reportes: any[] = [
    { nombre: '1er Reporte Factura carga de Crédito' },
    { nombre: '2do Reporte Pagos de Crédito' },
    { nombre: '3er Reporte Facturas Relacionadas' },
    { nombre: '4to Reporte Factura Suministro de Energía' },
    { nombre: '5to Reporte Suministro de Energía' },
  ];

  constructor(
    private reporteService: ReportesService,
    private excelService: ExcelService,
    private messageService: MessageService,
  ) { }

  onDownloadReport(item) {
    var rangoFechas = {
      "initialDate": moment(this.rangeDates[0]).utc().format('YYYY-MM-DD'),
      "finalDate": this.rangeDates[1] ? moment(this.rangeDates[1]).utc().format('YYYY-MM-DD') : moment(this.rangeDates[0]).utc().format('YYYY-MM-DD')
    }

    if (item == '1er Reporte Factura carga de Crédito') {
      // solo recibe una fecha
      this.geFacturasDatos(rangoFechas)
    }
    if (item == '2do Reporte Pagos de Crédito') {
      // solo recibe una fecha
      this.getCargasEnergia(rangoFechas)
    }
    if (item == '3er Reporte Facturas Relacionadas') {
      this.getFacturasRelacionadas(rangoFechas)
    }
    if (item == '4to Reporte Factura Suministro de Energía') {
      this.getPagoDatos(rangoFechas)
    }
    if (item == '5to Reporte Suministro de Energía') {
      this.getFacturasSuministro(rangoFechas)
    }
  }

  // 1er Reporte Facturas compra - venta
  geFacturasDatos(rangoFechas) {
    this.blockedPanel = true;
    return new Promise((resolve) => {
      this.reporteService.getFacturasCompraVenta(rangoFechas).subscribe(
        (resp: any) => {
          this.factRel = resp.data;
          if (resp.data.length > 0) {
            this.excelService.excelFacturasCargaCredito(this.factRel, 'reporte-factura-compra-venta', rangoFechas);
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
    this.blockedPanel = true;
    return new Promise((resolve) => {
      this.reporteService.getCargaEnergia(rangoFechas).subscribe(
        (resp: any) => {
          this.factRel = resp.data;
          if (resp.data.length > 0) {
            this.excelService.excelCargasEnergias(this.factRel, 'reporte-pago-crédito', rangoFechas);
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
    this.blockedPanel = true;
    return new Promise((resolve) => {
      this.reporteService.getFacturasRelacionadas(rangoFechas).subscribe(
        (resp: any) => {
          this.factRel = resp.data;
          if (resp.data.length > 0) {
            this.excelService.excelFacturasRelacionadas(this.factRel, 'reporte-facturas-relacionadas', rangoFechas);
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
    this.blockedPanel = true;
    return new Promise((resolve) => {
      this.reporteService.getPagoDatos(rangoFechas).subscribe(
        (resp: any) => {
          this.factRel = resp.data;
          if (resp.data.length > 0) {
            this.excelService.excelPagoDatos(this.factRel, 'reporte-suministro-energía', rangoFechas);
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
    this.blockedPanel = true;
    return new Promise((resolve) => {
      this.reporteService.getSuministroEnergia(rangoFechas).subscribe(
        (resp: any) => {
          this.factRel = resp.data;
          if (resp.data.length > 0) {
            this.excelService.excelSuministroEnergia(this.factRel, 'report-cargas-energía', rangoFechas);
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

  // onDownloadReport(item) {
  //   this.blockedPanel = true;
  //   var rangoFechas = {
  //     "initialDate": moment(this.rangeDates[0]).utc().format('YYYY-MM-DD'),
  //     "finalDate": this.rangeDates[1] ? moment(this.rangeDates[1]).utc().format('YYYY-MM-DD') : moment(this.rangeDates[0]).utc().format('YYYY-MM-DD')
  //   }
  //   this.reporteService.getFacturasRelacionadas(rangoFechas).subscribe(
  //     async (resp: any) => {
  //       this.blockedPanel = false;
  //       // var dataMapeado:any[] = await this.mapeoJson(resp.data);
  //       this.reporteService.exportAsExcelFile(resp.data, 'sample');
  //       this.messageService.add({ severity: 'success', detail: 'Descargado Correctamente' });
  //     },
  //     error => {
  //       this.messageService.add({ severity: 'error', detail: 'Server Error' });
  //       this.blockedPanel = false;
  //     }
  //   )
  // }

  // async mapeoJson(jsonData) {
  //   return await jsonData.map(d => {
  //     if (d.invoicesPaymentTrasantionsResponseDtoList.length > 0) {
  //       d.invoicesPaymentTrasantionsResponseDtoList.map(s => {
  //         return {
  //           tCodigoRecepcion: d.codigoDescripcion,
  //           tFechaEmision: d.fechaRegistro,
  //           tCuf: d.cuf,
  //           tpaymentType: d.paymentTransactionType,
  //           cCodigoRecepcion: s.codigoDescripcion,
  //           cCuf: s.cuf,
  //           cPaymentType: s.paymentTransactionType,
  //           cFechaRegistro: s.fechaRegistro,
  //           cUrlFacturaSiat: s.urlFacturaSiat,
  //         }
  //       })
  //     } else {
  //       return {
  //         tCodigoRecepcion: d.codigoDescripcion,
  //         tFechaEmision: d.fechaRegistro,
  //         tCuf: d.cuf,
  //         tpaymentType: d.paymentTransactionType,
  //         cCodigoRecepcion: '',
  //         cCuf: '',
  //         cPaymentType: '',
  //         cFechaRegistro: '',
  //         cUrlFacturaSiat: '',
  //       }
  //     }
  //   });
  // }
}
