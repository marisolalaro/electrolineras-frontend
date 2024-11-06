import { Component } from '@angular/core';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import { NgFor, NgIf } from '@angular/common';
import { ReportesModule } from './reportes.module';
import { mainTitles, reports } from 'src/app/core/constants/labels';
import { PrimeNGConfig } from 'primeng/api';
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
  providers: [MessageService]
})

export default class ReportesComponent {

  // variables de control
  public loading: boolean = true;
  public serviceResponse: boolean = true;

  // variables propias del componente  
  public tiposReportes: any[] = [];
  public tituloComponente: any = mainTitles['reportes'];

  // variables para mostrar el componente seleccionado
  public showReport = ''
  public numeroReport: number = 0;
  public activeIndex: number = 0;

  // variables de filtros
  public rangoFechas;
  public reporteSeleccionado: any;
  public rangeDates: Date[] | undefined;
  public coincidenciasFiltro: string[] = [];

  // variables pestañas temporales
  public tabs: Tab[] = [];

  constructor(
    private primengConfig: PrimeNGConfig
  ) {}

  ngOnInit() {
    this.inicializaDatos();
  }

  inicializaDatos() {
    this.primengConfig.setTranslation({
      firstDayOfWeek: 1,
      dayNames: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"],
      dayNamesShort: ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"],
      dayNamesMin: ["D", "L", "M", "X", "J", "V", "S"],
      monthNames: [
        "enero", "febrero", "marzo", "abril", "mayo", "junio",
        "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
      ],
      monthNamesShort: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"],
      today: 'Hoy',
      clear: 'Limpiar'
      //translations
    });
    this.tiposReportes = [
      { nombre: reports.labelReporte1 },
      { nombre: reports.labelReporte2 },
      { nombre: reports.labelReporte3 },
      { nombre: reports.labelReporte4 },
      { nombre: reports.labelReporte5 },
      { nombre: reports.labelReporte6 },
      { nombre: reports.labelReporte7 },
    ];
  }

  filtraReporte(event: any) {
    const query = event.query.toLowerCase();
    this.coincidenciasFiltro = this.tiposReportes.filter(item => item.nombre.toLowerCase().includes(query));
  }

  onAdicionaTabs() {
    this.showReport = 'nada';
    this.rangoFechas = {
      "initialDate": moment(this.rangeDates[0]).utc().format('YYYY-MM-DD'),
      "finalDate": this.rangeDates[1] ? moment(this.rangeDates[1]).utc().format('YYYY-MM-DD') : moment(this.rangeDates[0]).utc().format('YYYY-MM-DD')
    }
    this.tabs.length + 1;
    if (this.reporteSeleccionado.nombre == reports.labelReporte1 ||
      this.reporteSeleccionado.nombre == reports.labelReporte2 ||
      this.reporteSeleccionado.nombre == reports.labelReporte4 ||
      this.reporteSeleccionado.nombre == reports.labelReporte5
    ) {
      var title = '';
      if (this.reporteSeleccionado.nombre.includes("1")) {
        title = reports.numeroReporte1;
      }
      if (this.reporteSeleccionado.nombre.includes("2")) {
        title = reports.numeroReporte2;
      }
      if (this.reporteSeleccionado.nombre.includes("4")) {
        title = reports.numeroReporte4;
      }
      if (this.reporteSeleccionado.nombre.includes("5")) {
        title = reports.numeroReporte5;
      }
      this.showReport = reports.xReporte;
      this.tabs.push({
        title: title,
        content: this.rangoFechas,
        estado: false
      });
      setTimeout(() => {
        this.activeIndex = this.tabs.length - 1;
        this.numeroReport = 1;
      }, 0);
    }

    if (this.reporteSeleccionado.nombre == reports.labelReporte3) {
      this.showReport = reports.numeroReporte3;
      this.tabs.push({
        title: this.showReport,
        content: this.rangoFechas,
        estado: false
      });
      setTimeout(() => {
        this.activeIndex = this.tabs.length - 1;
        this.numeroReport = 3;
      }, 0);
    }
    if (this.reporteSeleccionado.nombre == reports.labelReporte6) {
      this.showReport = reports.numeroReporte6;
      this.tabs.push({
        title: this.showReport,
        content: this.rangoFechas,
        estado: false
      });
      setTimeout(() => {
        this.activeIndex = this.tabs.length - 1;
        this.numeroReport = 5;
      }, 0);
    }

    if (this.reporteSeleccionado.nombre == reports.labelReporte7) {
      this.showReport = reports.numeroReporte7;
      this.tabs.push({
        title: this.showReport,
        content: this.rangoFechas,
        estado: false
      });
      setTimeout(() => {
        this.activeIndex = this.tabs.length - 1;
        this.numeroReport = 7;
      }, 0);
    }
  }

  onTabChange(event: any) {
    if (this.tabs[event.index].title == reports.numeroReporte1) {
      this.tabs[event.index].estado = false;
      this.showReport = 'nada';
      this.reporteSeleccionado.nombre = reports.labelReporte1
      this.rangoFechas = this.tabs[event.index].content;
      setTimeout(() => {
        this.showReport = reports.xReporte;
      }, 0);
    }
    if (this.tabs[event.index].title == reports.numeroReporte2) {
      this.tabs[event.index].estado = false;
      this.showReport = 'nada';
      this.reporteSeleccionado.nombre = reports.labelReporte2
      this.rangoFechas = this.tabs[event.index].content;
      setTimeout(() => {
        this.showReport = reports.xReporte;
      }, 0);
    }
    if (this.tabs[event.index].title == reports.numeroReporte4) {
      this.tabs[event.index].estado = false;
      this.showReport = 'nada';
      this.reporteSeleccionado.nombre = reports.labelReporte4
      this.rangoFechas = this.tabs[event.index].content;
      setTimeout(() => {
        this.showReport = reports.xReporte;
      }, 0);
    }
    if (this.tabs[event.index].title == reports.numeroReporte5) {
      this.tabs[event.index].estado = false;
      this.showReport = 'nada';
      this.reporteSeleccionado.nombre = reports.labelReporte5
      this.rangoFechas = this.tabs[event.index].content;
      setTimeout(() => {
        this.showReport = reports.xReporte;
      }, 0);
    }
    // reportes anidados
    if (this.tabs[event.index].title == reports.numeroReporte3) {
      this.tabs[event.index].estado = false;
      this.rangoFechas = this.tabs[event.index].content;
      setTimeout(() => {
        this.showReport = reports.numeroReporte3;
      }, 0);
    }
    if (this.tabs[event.index].title == reports.numeroReporte6) {
      this.tabs[event.index].estado = false;
      this.rangoFechas = this.tabs[event.index].content;
      setTimeout(() => {
        this.showReport = reports.numeroReporte6;
      }, 0);
    }
    if (this.tabs[event.index].title == reports.numeroReporte7) {
      this.tabs[event.index].estado = false;
      this.rangoFechas = this.tabs[event.index].content;
      setTimeout(() => {
        this.showReport = reports.numeroReporte7;
      }, 0);
    }
  }

  cambiaEstadoTab(tabActualizado: any, index) {
    this.tabs[index] = tabActualizado
  }

}
