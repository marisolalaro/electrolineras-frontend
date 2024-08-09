import { Component, Input } from '@angular/core';
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
  @Input() rangoFechas: any;

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
        if (datosInicializados) {
          return this.getFacturasSuministroEnergia(this.rangoFechas);
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
      this.blockedPanel = true;
      this.reporteService.getFacturaSuministroEnergia(rangoFechas).subscribe(
        (resp: any) => {
          if (resp.data.length > 0) {
            var respuesta = JSON.parse(JSON.stringify(resp.data));
            this.reporte = respuesta.filter(item => item.clientInvoiceList.length > 0);
            if (this.reporte.length == 0) {
              this.messageService.add({ severity: 'info', detail: '0 Registros Encontrados' });
            }
            resolve(true);
          } else {
            this.messageService.add({ severity: 'info', detail: '0 Registros Encontrados' });
            resolve(true);
          }
          this.blockedPanel = false;
        },
        error => {
          this.blockedPanel = false;
          resolve(true);
        }
      )
    });
  }

  descargaArchivo() {
    this.excelService.excelFacturasSuministroEnergia(this.reporte, reports.archivoReporte7, reports.hojaReporte7, this.rangoFechas);
  }
}
