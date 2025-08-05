import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ReportesService } from '../../services/reportes.service';
import { CrearExcelService } from '../../services/crear-excel.service';
import { MessageService } from 'primeng/api';
import { reports } from 'src/app/core/constants/labels';
import { ExcelService } from '../../services/excel.service';

@Component({
  selector: 'app-table-report-operacion',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})

export class TableReportOperacionComponent {

  // variables de control
  public componenteVisible: boolean = false;

  // variables del componente padre
  @Input() tab: any;

  // variables para mandar al componente Padre 
  @Output() datosEnviados: EventEmitter<string> = new EventEmitter<string>();

  // variables propias del componente
  public cols6!: any[];
  public reporte: any[] = [];
  public numeroReporte = JSON.parse(JSON.stringify(reports.labelReporte8));

  constructor(
    private excelService: CrearExcelService,
    private excelServiceOpercion: ExcelService,
    private messageService: MessageService,
    private reporteService: ReportesService,
  ) { }

  ngOnInit() {
    this.inicializaColumnas()
    .then(datosInicializados => {
      if (datosInicializados && !this.tab.estado) {
        return this.getFacturasCompraVenta(this.tab.content);
      } else {
        return false;
      }
    })
    .then(consumoServicio => {
      if (consumoServicio) {
        this.numeroReporte = JSON.parse(JSON.stringify(reports.labelReporte8));
        this.componenteVisible = true;
      } else {
        this.componenteVisible = true;
        return false;
      }
    });
  }

  inicializaColumnas() {
    return new Promise((resolve) => {
    this.cols6 = [
      { field: 'electronicMail', header: 'Correo Electrónico' },
      { field: 'names', header: 'Nombres' },
      { field: 'lastName', header: 'Apellido Paterno' },
      { field: 'motherLastName', header: 'Apellido Materno' },
      { field: 'identificationNumber', header: 'Número de Identificación' },
      { field: '', header: 'Detalle Facturas' }
    ];
    resolve(true);
    })
  }

  // 6toReporte
  getFacturasCompraVenta(rangoFechas) {
    this.reporte = [];
    return new Promise((resolve) => {
      this.reporteService.getFacturaCompraVenta(rangoFechas).subscribe(
        (resp: any) => {
          if (resp) {
            if (resp.data?.length > 0 || resp.data == null) {
              var respuesta = JSON.parse(JSON.stringify(resp.data));
              this.reporte = respuesta.filter(item => item.clientInvoiceList.length > 0);
              if (this.reporte.length == 0) {
                this.messageService.add({ severity: 'info', detail: '0 Registros Encontrados' });
              }
            } else {
              this.messageService.add({ severity: 'info', detail: '0 Registros Encontrados' });
            }
            return resolve(true);
          }
        },
        error => {
          return resolve(false);
        }
      )
    });
  }

  public respuestaService = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27]

  descargaArchivo() {
    this.excelServiceOpercion.processExcelFromAssets(this.respuestaService);
  }
}
