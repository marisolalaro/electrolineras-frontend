import { Component } from '@angular/core';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import { NgFor, NgIf } from '@angular/common';
import { ReportesModule } from './reportes.module';
import { mainTitles, reports } from 'src/app/core/constants/labels';

interface Tab {
  title: string;
  content: string;
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
  public componenteVisible = false;

  // variables propias del componente  
  public tiposReportes: any[] = [];
  public tituloComponente: any = mainTitles['reportes'];
  
  // variables para mostrar el componente seleccionado
  public showReport = ''
  public activeIndex: number = 0;
  
  // variables de filtros
  public rangoFechas;
  public reporteSeleccionado: any;
  public coincidenciasFiltro: string[] = [];
  public rangeDates: Date[] | undefined;
  
  // variables pestañas temporales
  public tabs: Tab[] = [];
  
  constructor(
  ) { }

  ngOnInit() {
    this.inicializaDatos();
  }

  inicializaDatos() {
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
    const newIndex = this.tabs.length + 1;
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
      this.componenteVisible = true;
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
        content: this.rangoFechas
      });
      setTimeout(() => {
        this.activeIndex = this.tabs.length - 1;
      }, 0);
    }

    if (this.reporteSeleccionado.nombre == reports.labelReporte3) {
      this.componenteVisible = true;
      this.showReport = reports.numeroReporte3;
      this.tabs.push({
        title: this.showReport,
        content: this.rangoFechas
      });
      setTimeout(() => {
        this.activeIndex = this.tabs.length - 1;
      }, 0);
    }

    if (this.reporteSeleccionado.nombre == reports.labelReporte6) {
      this.componenteVisible = true;
      this.showReport = reports.numeroReporte6;
      this.tabs.push({
        title: this.showReport,
        content: this.rangoFechas
      });
      setTimeout(() => {
        this.activeIndex = this.tabs.length - 1;
      }, 0);
    }

    if (this.reporteSeleccionado.nombre == reports.labelReporte7) {
      this.componenteVisible = true;
      this.showReport = reports.numeroReporte7;
      this.tabs.push({
        title: this.showReport,
        content: this.rangoFechas
      });
      setTimeout(() => {
        this.activeIndex = this.tabs.length - 1;
      }, 0);
    }
  }

  onTabChange(event: any) {
    this.componenteVisible = false;

    if (this.tabs[event.index].title == reports.numeroReporte1) {
      this.showReport = 'nada';
      this.reporteSeleccionado.nombre = reports.labelReporte1
      this.rangoFechas = this.tabs[event.index].content;
      this.componenteVisible = true;
      setTimeout(() => {
        this.showReport = reports.xReporte;
      }, 0);
    }
    if (this.tabs[event.index].title == reports.numeroReporte2) {
      this.showReport = 'nada';
      this.reporteSeleccionado.nombre = reports.labelReporte2
      this.rangoFechas = this.tabs[event.index].content;
      this.componenteVisible = true;
      setTimeout(() => {
        this.showReport = reports.xReporte;
      }, 0);
    }
    if (this.tabs[event.index].title == reports.numeroReporte4) {
      this.showReport = 'nada';
      this.reporteSeleccionado.nombre = reports.labelReporte4
      this.rangoFechas = this.tabs[event.index].content;
      this.componenteVisible = true;
      setTimeout(() => {
        this.showReport = reports.xReporte;
      }, 0);
    }
    if (this.tabs[event.index].title == reports.numeroReporte5) {
      this.showReport = 'nada';
      this.reporteSeleccionado.nombre = reports.labelReporte5
      this.rangoFechas = this.tabs[event.index].content;
      this.componenteVisible = true;
      setTimeout(() => {
        this.showReport = reports.xReporte;
      }, 0);
    }
    // reportes anidados
    if (this.tabs[event.index].title == reports.numeroReporte3) {
      this.rangoFechas = this.tabs[event.index].content;
      this.componenteVisible = true;
      setTimeout(() => {
        this.showReport = reports.numeroReporte3;
      }, 0);
    }
    if (this.tabs[event.index].title == reports.numeroReporte6) {
      this.rangoFechas = this.tabs[event.index].content;
      this.componenteVisible = true;
      setTimeout(() => {
        this.showReport = reports.numeroReporte6;
      }, 0);
    }
    if (this.tabs[event.index].title == reports.numeroReporte7) {
      this.rangoFechas = this.tabs[event.index].content;
      this.componenteVisible = true;
      setTimeout(() => {
        this.showReport = reports.numeroReporte7;
      }, 0);
    }
  }

}
