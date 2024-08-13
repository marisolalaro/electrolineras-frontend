import { Component, Input, Output, EventEmitter  } from '@angular/core';
import { ReportesService } from '../../services/reportes.service';
import { ExcelService } from '../../services/excel.service';
import { MessageService } from 'primeng/api';
import { reports } from 'src/app/core/constants/labels';

@Component({
  selector: 'app-table-suministro-cliente',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})

export class TableSuministroClienteComponent {

  // variables del componente padre
  @Input() tab: any;

  // variables para mandar al componente Padre 
  @Output() datosEnviados: EventEmitter<string> = new EventEmitter<string>();

  // variables de control
  public blockedPanel: boolean = false;
  public componenteVisible: boolean = false;

  // variables propias del componente
  public cols7!: any[];
  public reporte: any[] = [];
  public numeroReporte = JSON.parse(JSON.stringify(reports.labelReporte7));

  constructor(
    private excelService: ExcelService,
    private messageService: MessageService,
    private reporteService: ReportesService,
  ) { }

  ngOnInit() {
    this.inicializaColumnas()
      .then(datosInicializados => {
        if (datosInicializados && !this.tab.estado) {
          return this.getFacturasSuministroEnergia(this.tab.content);
        } else {
          return false;
        }
      })
      .then(consumoServicio => {
        if (consumoServicio) {
          this.numeroReporte = JSON.parse(JSON.stringify(reports.labelReporte7));
          this.componenteVisible = true;
        } else {
          this.componenteVisible = true;
          return false;
        }
      })
  }

  inicializaColumnas() {
    return new Promise((resolve) => {
      this.cols7 = [
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

  // 7moReporte
  getFacturasSuministroEnergia(rangoFechas) {
    return new Promise((resolve) => {
      this.reporte = [];
      this.reporteService.getFacturaSuministroEnergia(rangoFechas).subscribe(
        (resp: any) => {
          if (resp) {
            var respuesta = JSON.parse(JSON.stringify(resp.data));
            if (resp.data.length > 0) {
            this.reporte = respuesta.filter(item => item.clientInvoiceList.length > 0);
            if (this.reporte.length == 0) {
              this.messageService.add({ severity: 'info', detail: '0 Registros Encontrados' });
            }
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
    });
  }

  descargaArchivo() {
    this.excelService.excelFacturasSuministroEnergia(this.reporte, reports.archivoReporte7, reports.hojaReporte7, this.tab);
  }

  enviarDatos() {
    this.tab.estado = true;
    this.datosEnviados.emit(this.tab);
  }
}
