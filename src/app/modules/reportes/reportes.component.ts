import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import { NgFor, NgIf } from '@angular/common';
import { ReportesModule } from './reportes.module';
import { mainTitles, reports } from 'src/app/core/constants/labels';
import { PrimeNGConfig } from 'primeng/api';
import { ValidaToken } from 'src/app/core/utils/verificarToken';
import { ReportesService } from './services/reportes.service';
import { CrearExcelService } from './services/crear-excel.service';
import { ExcelService } from './services/excel.service'; 

interface Tab {
  title: string;
  content: string;
  estado: boolean;
}

@Component({
  standalone: true,
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.scss'],
  imports: [ReportesModule, NgIf, NgFor],
  providers: [MessageService],
})
export default class ReportesComponent implements OnInit {

  // Variables de control
  public loading: boolean = false;
  public serviceResponse: boolean = true;
  public vistaPrevia: boolean = false;
  public reporteActivoVisual: any = null;

  // Variables del componente
  public tiposReportes: any[] = [];
  public tituloComponente: any = mainTitles['reportes'];
  
  // Variables de estado
  public showReport = '';
  public numeroReport: number = 0;
  public activeIndex: number = 0;

  // Variables de filtro
  public rangoFechas;
  public reporteSeleccionado: any;
  public rangeDates: Date[] | undefined;
  public coincidenciasFiltro: string[] = [];

  // Pestañas
  public tabs: Tab[] = [];

  constructor(
    private router: Router,
    private primengConfig: PrimeNGConfig,
    private reportesService: ReportesService,
    private messageService: MessageService,
    private excelService: CrearExcelService,
    private excelServiceOperacion: ExcelService
  ) {}

  ngOnInit() {
    if (ValidaToken()) {
      this.inicializaDatos();
    } else {
      this.router.navigate(['']);
    }
  }

  inicializaDatos() {
    this.primengConfig.setTranslation({
      firstDayOfWeek: 1,
      dayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
      dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
      dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
      monthNames: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
      monthNamesShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
      today: 'Hoy',
      clear: 'Limpiar',
    });
    
    this.tiposReportes = [
      { nombre: reports.labelReporte1, imagen: 'assets/img/reporte1.jpg' },
      { nombre: reports.labelReporte5, imagen: 'assets/img/reporte5.jpg' },
      { nombre: reports.labelReporte4, imagen: 'assets/img/reporte4.jpg' },
      { nombre: reports.labelReporte8, imagen: 'assets/img/reporte8.jpg' },
      { nombre: reports.labelReporte2, imagen: 'assets/img/reporte2.jpg' },
      { nombre: reports.labelReporte6, imagen: 'assets/img/reporte6.jpg' },
      { nombre: reports.labelReporte7, imagen: 'assets/img/reporte7.jpg' },
      { nombre: reports.labelReporte9, imagen: 'assets/img/reporte9.jpg' },
    ];
  }

  filtraReporte(event: any) {
    const query = event.query.toLowerCase();
    this.coincidenciasFiltro = this.tiposReportes.filter((item) =>
      item.nombre.toLowerCase().includes(query)
    );
  }

  descargarDesdeCard(reporte: any) {
   this.reporteActivoVisual = reporte;
    setTimeout(() => {
      this.reporteActivoVisual = null; 
    }, 300); 
    
    this.reporteSeleccionado = reporte; 
    
    // 1. Validar si es reporte mensual (que no usa rango de fechas)
    const esReporteMensual = reporte.nombre === 'Set42 - Datos mensuales de electrolineras' || reporte.nombre === reports.labelReporte8;

    // 2. Validar fechas para el resto
    if (!esReporteMensual) {
      if (!this.rangeDates || this.rangeDates.length < 2 || !this.rangeDates[0] || !this.rangeDates[1]) {
        this.messageService.add({ 
            severity: 'warn', 
            summary: 'Atención', 
            detail: 'Por favor, seleccione un rango de fechas (Inicio y Fin).' 
        });
        return;
      }
    }

    this.loading = true;
    //this.messageService.add({ severity: 'info', summary: 'Procesando', detail: 'Generando reporte...' });

    let payload: any = {};
    if (!esReporteMensual) {
       payload = {
        initialDate: moment(this.rangeDates[0]).utc().format('YYYY-MM-DD'),
        finalDate: moment(this.rangeDates[1]).utc().format('YYYY-MM-DD'),
      };
    }

    switch (reporte.nombre) {

      // REPORTE 1
      case reports.labelReporte1:
        this.reportesService.getFacturasCompraVenta(payload).subscribe({
          next: (resp: any) => this.procesarRespuestaSimple(resp, (data) => 
              this.excelService.excelFacturasCargaCredito(data, reports.archivoReporte1, reports.hojaReporte1, payload)
          ),
          error: (err) => this.manejarError(err)
        });
        break;

      // REPORTE 2
      case reports.labelReporte2:
        this.reportesService.getCargaEnergia(payload).subscribe({
          next: (resp: any) => this.procesarRespuestaSimple(resp, (data) => 
              this.excelService.excelCargasEnergias(data, reports.archivoReporte2, reports.hojaReporte2, payload)
          ),
          error: (err) => this.manejarError(err)
        });
        break;

      // REPORTE 3
      case reports.labelReporte3:
        this.reportesService.getFacturasRelacionadas(payload).subscribe({
          next: (resp: any) => {
             this.loading = false;
             if (resp && resp.data) {
                const data = JSON.parse(JSON.stringify(resp.data));
                if (data.length > 0) {
                   this.excelService.excelFacturasRelacionadas(data, reports.archivoReporte3, reports.hojaReporte3, payload);
                   this.exitoDescarga();
                } else { this.avisoSinDatos(); }
             } else { this.avisoSinDatos(); }
          },
          error: (err) => this.manejarError(err)
        });
        break;

      // REPORTE 4
      case reports.labelReporte4:
        this.reportesService.getPagoDatos(payload).subscribe({
          next: (resp: any) => this.procesarRespuestaSimple(resp, (data) => 
              this.excelService.excelPagoDatos(data, reports.archivoReporte4, reports.hojaReporte4, payload)
          ),
          error: (err) => this.manejarError(err)
        });
        break;

      // REPORTE 5
      case reports.labelReporte5:
        this.reportesService.getSuministroEnergia(payload).subscribe({
          next: (resp: any) => this.procesarRespuestaSimple(resp, (data) => 
              this.excelService.excelSuministroEnergia(data, reports.archivoReporte5, reports.hojaReporte5, payload)
          ),
          error: (err) => this.manejarError(err)
        });
        break;

      // REPORTE 6 (Filtro especial)
      case reports.labelReporte6:
        this.reportesService.getFacturaCompraVenta(payload).subscribe({
          next: (resp: any) => {
            this.loading = false;
            if (resp && resp.data) {
              const datos = JSON.parse(JSON.stringify(resp.data));
              const dataFiltrada = datos.filter(item => item.clientInvoiceList && item.clientInvoiceList.length > 0);
              if (dataFiltrada.length > 0) {
                this.excelService.excelFacturasCompraVenta(dataFiltrada, reports.archivoReporte6, reports.hojaReporte6, payload);
                this.exitoDescarga();
              } else {
                this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Clientes sin facturas.' });
              }
            } else { this.avisoSinDatos(); }
          },
          error: (err) => this.manejarError(err)
        });
        break;

      // REPORTE 7 (Filtro especial)
      case reports.labelReporte7:
        this.reportesService.getFacturaSuministroEnergia(payload).subscribe({
          next: (resp: any) => {
             this.loading = false;
             if (resp && resp.data) {
                const datos = JSON.parse(JSON.stringify(resp.data));
                const dataFiltrada = datos.filter(item => item.clientInvoiceList && item.clientInvoiceList.length > 0);
                if (dataFiltrada.length > 0) {
                   this.excelService.excelFacturasSuministroEnergia(dataFiltrada, reports.archivoReporte7, reports.hojaReporte7, payload);
                   this.exitoDescarga();
                } else {
                   this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Registros sin facturas.' });
                }
             } else { this.avisoSinDatos(); }
          },
          error: (err) => this.manejarError(err)
        });
        break;

      //REPORTE 8 (Servicio Excel diferente)
        case reports.labelReporte8:
        this.reportesService.getReporteDatosMensuales().subscribe({
          next: (resp: any) => {
            this.loading = false;
            if (resp && resp.size > 0) {
               this.excelService.descargarExcelDesdeBlob(resp, reports.archivoReporte8);
               this.exitoDescarga();
            } else {
               this.messageService.add({ severity: 'warn', summary: 'Atención', detail: 'El archivo generado está vacío.' });
            }
          },
          error: (err) => {
            this.loading = false;
            console.error(err);
            if (err.error instanceof Blob) {
                const reader = new FileReader();
                reader.onload = (e: any) => {
                    console.error('Error del backend:', e.target.result);
                };
                reader.readAsText(err.error);
            }
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo descargar el archivo.' });
          }
        });
        break;

      // REPORTE 9: Cargas de clientes por bloques
      case reports.labelReporte9:
        this.reportesService.getSuministroCliente(payload).subscribe({
          next: (resp: any) => {
            this.loading = false;

            if (resp && resp.data) {
               const datos = JSON.parse(JSON.stringify(resp.data)); 
          
               if (datos.length > 0) {
                  this.excelService.excelConsumoPorCliente(datos, reports.archivoReporte9, reports.hojaReporte9, payload);
                  this.exitoDescarga();
               } else { 
                  this.avisoSinDatos(); 
               }
            } else { 
               this.avisoSinDatos(); 
            }
          },
          error: (err) => this.manejarError(err)
        });
        break;

      default:
        this.loading = false;
        this.messageService.add({ severity: 'warn', summary: 'Aviso', detail: 'Descarga no configurada para este reporte.' });
        break;
    }
  }

  //  FUNCIONES AUXILIARES

  procesarRespuestaSimple(resp: any, callbackExcel: (data: any[]) => void) {
    this.loading = false;
    let datos = [];
    if (resp && Array.isArray(resp)) {
        datos = resp;
    } else if (resp && resp.data && Array.isArray(resp.data)) {
        datos = resp.data;
    } else if (resp && resp.result && Array.isArray(resp.result)) {
        datos = resp.result;
    }

    if (datos.length > 0) {
        const dataLimpia = JSON.parse(JSON.stringify(datos));
        callbackExcel(dataLimpia);
        this.exitoDescarga();
    } else {
        this.avisoSinDatos();
    }
  }

  manejarError(err: any) {
    this.loading = false;
    console.error(err);
    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Fallo al consultar los datos.' });
  }

  exitoDescarga() {
    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Reporte descargado correctamente.' });
  }

  avisoSinDatos() {
    this.messageService.add({ severity: 'info', summary: 'Sin datos', detail: 'No se encontraron registros.' });
  }


  onAdicionaTabs(datos) {
    this.showReport = 'nada';
    if (datos == 'sin fecha') {
      // logica sin fecha
    } else {
      this.rangoFechas = {
        initialDate: moment(this.rangeDates[0]).utc().format('YYYY-MM-DD'),
        finalDate: this.rangeDates[1]
          ? moment(this.rangeDates[1]).utc().format('YYYY-MM-DD')
          : moment(this.rangeDates[0]).utc().format('YYYY-MM-DD'),
      };
    }
    this.tabs.length + 1;

    // Lógica para asignar títulos y tabs
    if (
      this.reporteSeleccionado.nombre == reports.labelReporte1 ||
      this.reporteSeleccionado.nombre == reports.labelReporte2 ||
      this.reporteSeleccionado.nombre == reports.labelReporte4 ||
      this.reporteSeleccionado.nombre == reports.labelReporte5
    ) {
      var title = '';
      if (this.reporteSeleccionado.nombre === 'Factura de compras y carga de energía') title = reports.numeroReporte1;
      if (this.reporteSeleccionado.nombre === 'Factura de compras') title = reports.numeroReporte2;
      if (this.reporteSeleccionado.nombre === 'Factura cargas de energía') title = reports.numeroReporte4;
      if (this.reporteSeleccionado.nombre === 'Cargas de energía por cliente') title = reports.numeroReporte5;
      
      this.showReport = reports.xReporte;
      this.tabs.push({ title: title, content: this.rangoFechas, estado: false });
      setTimeout(() => { this.activeIndex = this.tabs.length - 1; this.numeroReport = 1; }, 0);
    }

    if (this.reporteSeleccionado.nombre == reports.labelReporte3) {
      this.showReport = reports.numeroReporte3;
      this.tabs.push({ title: this.showReport, content: this.rangoFechas, estado: false });
      setTimeout(() => { this.activeIndex = this.tabs.length - 1; this.numeroReport = 3; }, 0);
    }
    if (this.reporteSeleccionado.nombre === reports.labelReporte6) {
      this.showReport = reports.numeroReporte6;
      this.tabs.push({ title: this.showReport, content: this.rangoFechas, estado: false });
      setTimeout(() => { this.activeIndex = this.tabs.length - 1; this.numeroReport = 6; }, 0);
    }
    if (this.reporteSeleccionado.nombre === reports.labelReporte7) {
      this.showReport = reports.numeroReporte7;
      this.tabs.push({ title: this.showReport, content: this.rangoFechas, estado: false });
      setTimeout(() => { this.activeIndex = this.tabs.length - 1; this.numeroReport = 7; }, 0);
    }
    if (this.reporteSeleccionado.nombre == reports.labelReporte8) {
      this.showReport = reports.numeroReporte8;
      this.tabs.push({ title: this.showReport, content: this.rangoFechas, estado: false });
      setTimeout(() => { this.activeIndex = this.tabs.length - 1; this.numeroReport = 8; }, 0);
    }
    if (this.reporteSeleccionado.nombre == reports.labelReporte9) {
      this.showReport = reports.numeroReporte9;
      this.tabs.push({ title: this.showReport, content: this.rangoFechas, estado: false });
      setTimeout(() => { this.activeIndex = this.tabs.length - 1; this.numeroReport = 9; }, 0);
    }

  }

  onTabChange(event: any) {
    if (this.tabs[event.index].title == reports.numeroReporte1) {
      this.tabs[event.index].estado = false;
      this.showReport = 'nada';
      this.reporteSeleccionado.nombre = reports.labelReporte1;
      this.rangoFechas = this.tabs[event.index].content;
      setTimeout(() => { this.showReport = reports.xReporte; }, 0);
    }
    if (this.tabs[event.index].title == reports.numeroReporte2) {
      this.tabs[event.index].estado = false;
      this.showReport = 'nada';
      this.reporteSeleccionado.nombre = reports.labelReporte2;
      this.rangoFechas = this.tabs[event.index].content;
      setTimeout(() => { this.showReport = reports.xReporte; }, 0);
    }
    if (this.tabs[event.index].title == reports.numeroReporte4) {
      this.tabs[event.index].estado = false;
      this.showReport = 'nada';
      this.reporteSeleccionado.nombre = reports.labelReporte4;
      this.rangoFechas = this.tabs[event.index].content;
      setTimeout(() => { this.showReport = reports.xReporte; }, 0);
    }
    if (this.tabs[event.index].title == reports.numeroReporte5) {
      this.tabs[event.index].estado = false;
      this.showReport = 'nada';
      this.reporteSeleccionado.nombre = reports.labelReporte5;
      this.rangoFechas = this.tabs[event.index].content;
      setTimeout(() => { this.showReport = reports.xReporte; }, 0);
    }
    // Anidados
    if (this.tabs[event.index].title == reports.numeroReporte3) {
      this.tabs[event.index].estado = false;
      this.rangoFechas = this.tabs[event.index].content;
      setTimeout(() => { this.showReport = reports.numeroReporte3; }, 0);
    }
    if (this.tabs[event.index].title == reports.numeroReporte6) {
      this.tabs[event.index].estado = false;
      this.rangoFechas = this.tabs[event.index].content;
      setTimeout(() => { this.showReport = reports.numeroReporte6; }, 0);
    }
    if (this.tabs[event.index].title == reports.numeroReporte7) {
      this.tabs[event.index].estado = false;
      this.rangoFechas = this.tabs[event.index].content;
      setTimeout(() => { this.showReport = reports.numeroReporte7; }, 0);
    }
    if (this.tabs[event.index].title == reports.numeroReporte8) {
      this.tabs[event.index].estado = false;
      this.rangoFechas = this.tabs[event.index].content;
      setTimeout(() => { this.showReport = reports.numeroReporte8; }, 0);
    }
    if (this.tabs[event.index].title == reports.numeroReporte9) {
      this.tabs[event.index].estado = false;
      this.rangoFechas = this.tabs[event.index].content;
      setTimeout(() => { this.showReport = reports.numeroReporte9; }, 0);
    }
  }

  cambiaEstadoTab(tabActualizado: any, index) {
    this.tabs[index] = tabActualizado;
  }

  verVistaPrevia() {
    this.vistaPrevia = true;
  }
}