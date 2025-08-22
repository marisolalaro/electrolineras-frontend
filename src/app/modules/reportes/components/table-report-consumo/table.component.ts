import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ReportesService } from '../../services/reportes.service';
import { CrearExcelService } from '../../services/crear-excel.service';
import { MessageService } from 'primeng/api';
import { reports } from 'src/app/core/constants/labels';

@Component({
  selector: 'app-table-report-consumo',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})

export class TableReportConsumoComponent {

  // variables del componente padre
  @Input() tab: any;
  @Input() tipoReporte: any;

  // variables para mandar al componente Padre 
  @Output() datosEnviados: EventEmitter<string> = new EventEmitter<string>();

  // variables de control
  public componenteVisible: boolean = false;

  // variables propias del componente
  public cols!: any[];
  public reporte: any[] = [];
  public numeroReporte = '';
  public reporteX = 0;

  constructor(
    private excelService: CrearExcelService,
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
      this.reporteX = 9;
      resolve(true);
    })
  }

  inicializaColumna() {
    return new Promise((resolve) => {
        this.cols = [
          { field: 'clientes', header: 'Clientes' },
          { field: 'fechaCargaEnergia', header: 'Fecha de la Carga de Energia' },
          { field: 'electrolinera', header: 'Electrolinera' },
          { field: 'bloqueBajoKwh', header: 'Bloque Bajo Kwh' },
          { field: 'bloqueBajoBs', header: 'Bloque Bajo Bs' },
          { field: 'tarifaBloqueBajo', header: 'Tarifa Bloque Bajo' },
          { field: 'bloqueMedioKwh', header: 'Bloque Medio Kwh' },
          { field: 'bloqueMedioBs', header: 'Bloque Medio Bs' },
          { field: 'tarifaBloqueMedio', header: 'Tarifa Bloque Medio' },
          { field: 'bloqueAltoKwh', header: 'Bloque Alto Kwh' },
          { field: 'bloqueAltoBs', header: 'Bloque Alto Bs' },
          { field: 'tarifaBloqueAlto', header: 'Tarifa Bloque Alto' },
          { field: 'totalEnergiaKwh', header: 'Total Energia  kwh' },
          { field: 'totalBs', header: 'Total bs' },
        ];
        return resolve(true);
    })
  }

  getReporte() {
    return new Promise((resolve) => {
      this.getFacturasSuministro(this.tab.content)
      resolve(true);
    })
  }

  // 9no Reporte - consumo por clientes
  getFacturasSuministro(rangoFechas) {
    this.reporte = [];
    return new Promise((resolve) => {
      this.reporteService.getSuministroCliente(rangoFechas).subscribe(
        (resp: any) => {
          if (resp) {
            this.reporte = JSON.parse(JSON.stringify(resp));
            console.log(JSON.stringify(this.reporte))
            // if (resp.data?.length > 0 || resp.data == null) {
            // } else {
            //   this.messageService.add({ severity: 'info', detail: '0 Registros Encontrados' });
            // }
            this.enviarDatos()
            return resolve(true);
          }
        },
        error => {
          return resolve(false);
        }
      )
      // this.reporte = [
      //   {
      //     "clientes": "juan",
      //     "fecha_carga_energia": "08/01/2025",
      //     "electrolinera": "Miraflores",
      //     "bloque_bajo_kwh": 1.1,
      //     "bloque_medio_kwh": 1,
      //     "bloque_alto_kwh": 1,
      //     "total_energia_kwh": 1.1,
      //     "bloque_bajo_Bs": 1.2,
      //     "bloque_medio_bs": 1,
      //     "bloque_alto_bs": 1,
      //     "total_bs": 1.2,
      //     "tarifa_bloque_bajo": 1.944,
      //     "tarifa_bloque_medio": 1.26,
      //     "tarifa_bloque_alto": 1.089
      //   },
      //   {
      //     "clientes": "Santiago",
      //     "fecha_carga_energia": "08/02/2025",
      //     "electrolinera": "Miraflores",
      //     "bloque_bajo_kwh": 1.1,
      //     "bloque_medio_kwh": 2,
      //     "bloque_alto_kwh": 2,
      //     "total_energia_kwh": 1.1,
      //     "bloque_bajo_Bs": 1.2,
      //     "bloque_medio_bs": 2,
      //     "bloque_alto_bs": 2,
      //     "total_bs": 1.2,
      //     "tarifa_bloque_bajo": 1.944,
      //     "tarifa_bloque_medio": 1.26,
      //     "tarifa_bloque_alto": 1.089
      //   },
      // ]
    })
  }

  getNumeroReporte() {
    return new Promise((resolve) => {
      this.numeroReporte = JSON.parse(JSON.stringify(reports.labelReporte9));
      return resolve(true);
    })
  }

  descargaArchivo() {
    this.excelService.excelConsumoPorCliente(this.reporte, reports.archivoReporte9, reports.hojaReporte9, this.tab.content);
  }

  enviarDatos() {
    this.tab.estado = true;
    this.datosEnviados.emit(this.tab);
  }

}
