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
  public respuestaService = [];

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
        return this.getDatosMensuales();
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

  // 8voReporte
  getDatosMensuales() {
    this.reporte = [];
    return new Promise((resolve) => {
      this.reporteService.getReporteDatosMensuales().subscribe(
        (resp: any) => {
          if (resp) {
            if (resp.data?.length > 0 || resp.data == null) {
              // var respuesta = JSON.parse(JSON.stringify(resp.data));
              // this.reporte = respuesta.filter(item => item.clientInvoiceList.length > 0);
              // if (this.reporte.length == 0) {
              //   this.messageService.add({ severity: 'info', detail: '0 Registros Encontrados' });
              // }
              this.respuestaService = resp.data;
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

  descargaArchivo() {
    this.excelServiceOpercion.processExcelFromAssets(this.respuestaService);
  }
}
