import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ReportesService } from '../../services/reportes.service';
import { CrearExcelService } from '../../services/crear-excel.service';
import { MessageService } from 'primeng/api';
import { reports } from 'src/app/core/constants/labels';

@Component({
  selector: 'app-table-transacciones-cliente',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})

export class TableTransaccionesClienteComponent {

  // variables de control
  public componenteVisible: boolean = false;

  // variables del componente padre
  @Input() tab: any;

  // variables para mandar al componente Padre 
  @Output() datosEnviados: EventEmitter<string> = new EventEmitter<string>();

  // variables propias del componente
  public cols6!: any[];
  public reporte: any[] = [];
  public blockedPanel: boolean = false;
  public numeroReporte = JSON.parse(JSON.stringify(reports.labelReporte6));

  constructor(
    private excelService: CrearExcelService,
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
        this.numeroReporte = JSON.parse(JSON.stringify(reports.labelReporte6));
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
    this.blockedPanel = true;
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

  descargaArchivo() {
    this.excelService.excelFacturasCompraVenta(this.reporte, reports.archivoReporte6, reports.hojaReporte6, this.tab.content);
  }

  onOpenUrl(url) {
    window.open(url, '_blank');
  }
}
