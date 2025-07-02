import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ReportesService } from '../../services/reportes.service';
import { CrearExcelService } from '../../services/crear-excel.service';
import { MessageService } from 'primeng/api';
import { reports } from 'src/app/core/constants/labels';

@Component({
  selector: 'app-table-factura-relacionada',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})

export class TableFacturaRelacionadaComponent implements OnInit{

  // variables del componente padre
  @Input() tab: any;

  // variables para mandar al componente Padre 
  @Output() datosEnviados: EventEmitter<string> = new EventEmitter<string>();

  // variables de control
  public componenteVisible: boolean = false;

  // variables propias del componente
  public cols3!: any[];
  public reporte: any[] = [];
  public numeroReporte = JSON.parse(JSON.stringify(reports.labelReporte3));

  constructor(
    private excelService: CrearExcelService,
    private messageService: MessageService,
    private reporteService: ReportesService,
  ) { }

  ngOnInit() {
    this.inicializaColumnas()
      .then(datosInicializados => {
        if (datosInicializados && !this.tab.estado) {
          return this.getFacturasRelacionadas(this.tab.content);
        } else {
          return false;
        }
      })
      .then(consumoServicio => {
        if (consumoServicio) {
          this.numeroReporte = JSON.parse(JSON.stringify(reports.labelReporte3));
          this.componenteVisible = true;
        } else {
          this.componenteVisible = true;
          return false;
        }
      })
  }

  inicializaColumnas() {
    return new Promise((resolve) => {
      this.cols3 = [
        { field: 'codigoDescripcion', header: 'Código Recepción' },
        { field: 'fechaRegistro', header: 'Fecha Emisión' },
        { field: 'cuf', header: 'Cuf' },
        { field: 'paymentTransactionType', header: 'Tipo de Pago' },
        { field: 'invoicesPaymentTrasantionsResponseDtoList.codigoDescripcion', header: 'Facturas de Transacción' }
      ];
      resolve(true);
    })
  }

 // 3er Reporte Facturas Relacionadas
 getFacturasRelacionadas(rangoFechas) {
  this.reporte = [];
  return new Promise((resolve) => {
    this.reporteService.getFacturasRelacionadas(rangoFechas).subscribe(
      (resp: any) => {
        if(resp) {
          this.reporte = JSON.parse(JSON.stringify(resp.data));
          if (resp.data?.length > 0 || resp.data == null) {
          } else {
            this.messageService.add({ severity: 'info', detail: '0 Registros Encontrados' });
          }
          this.enviarDatos()
          return resolve(true);
        }
      },
      error => {
        return resolve(false);
      }
    )
  })
}
  descargaArchivo() {
    this.excelService.excelFacturasRelacionadas(this.reporte, reports.archivoReporte3, reports.hojaReporte3, this.tab.content);
  }

  enviarDatos() {
    this.tab.estado = true;
    this.datosEnviados.emit(this.tab);
  }
}
