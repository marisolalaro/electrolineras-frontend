import { Component, Input} from '@angular/core';
import { ReportesService } from '../../services/reportes.service';
import { ExcelService } from '../../services/excel.service';
import { MessageService } from 'primeng/api';
import { reports } from 'src/app/core/constants/labels';

@Component({
  selector: 'app-table-transacciones-cliente',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})

export class TableTransaccionesClienteComponent {
  @Input() rangoFechas: any;
  public cols6!: any[];
  public reporte: any[] = [];
  public blockedPanel: boolean = false;
  public numeroReporte = JSON.parse(JSON.stringify(reports.labelReporte6));

  constructor(
    private excelService: ExcelService,
    private messageService: MessageService,
    private reporteService: ReportesService,
  ) { }

  ngOnInit() {
    this.inicializaColumnas();
    this.getFacturasCompraVenta(this.rangoFechas);
    this.numeroReporte = JSON.parse(JSON.stringify(reports.labelReporte6));
  }

  inicializaColumnas() {
    this.cols6 = [
      { field: 'electronicMail', header: 'Correo Electrónico' },
      { field: 'names', header: 'Nombres' },
      { field: 'lastName', header: 'Apellido Paterno' },
      { field: 'motherLastName', header: 'Apellido Materno' },
      { field: 'identificationNumber', header: 'Número de Identificación' },
      { field: '', header: 'Detalle Facturas' }
    ];
  }

  // 6toReporte
  getFacturasCompraVenta(rangoFechas) {
    this.reporte = [];
    this.blockedPanel = true;
    return new Promise((resolve) => {
      this.reporteService.getFacturaCompraVenta(rangoFechas).subscribe(
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
        }
      )
    });
  }

  descargaArchivo() {
    this.excelService.excelFacturasSuministroEnergia(this.reporte, reports.archivoReporte6, reports.hojaReporte6, this.rangoFechas);
  }
}
