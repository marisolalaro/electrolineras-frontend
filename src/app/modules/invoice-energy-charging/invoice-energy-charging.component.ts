import { FormsModule } from '@angular/forms';
import { Component, ViewChild } from '@angular/core';
import { NgFor, NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import * as moment from 'moment';
// Primeng
import { Table } from 'primeng/table';
// cores
import { decodeLocal } from 'src/app/core/utils/decodeToken';
import { mainTitles, titles } from 'src/app/core/constants/labels';
import { DBAttributeName } from 'src/app/core/constants/dbAttributeName';
// modules
import { PipesModule } from 'src/app/core/pipes/pipes.module';
import { InvoiceEnergyChargingModule } from './invoice-energy-charging.module';
// models
import { BodyFilterModel } from 'src/app/core/model/body-filter';
import { InvoiceEnergyChargingModel } from 'src/app/core/model/invoice-energy-charging';
// services
import { InvoiveEnergyChargingService } from './services/invoive-energy-charging.service';
import { Base64ToPdfService } from '../invoice-electric-stations/services/base-64-to-pdf.service';
import { xmlToJsonUtil } from 'xml-to-json-util';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { InvoiceTransaction } from './services/invoice-transaction';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-invoice-energy-charging',
  standalone: true,
  imports: [InvoiceEnergyChargingModule, NgFor, NgIf, PipesModule, FormsModule, NgSwitch, NgSwitchCase],
  templateUrl: './invoice-energy-charging.component.html',
  styleUrls: ['./invoice-energy-charging.component.scss'],
})
export default class InvoiceEnergyChargingComponent {

  // variables de control
  public orden: boolean = false;

  // variables del paginador
  public page: number = 0;
  public itemsPerPage: number = 5;
  public totalRecords: number = 0;

  // variables propias del componente
  public invoices: InvoiceEnergyChargingModel[] = [];
  public invoice: InvoiceEnergyChargingModel = new InvoiceEnergyChargingModel();
  es: any;
  public campoCuf: string = '';
  public campoAmount: string = '';
  public campoFechaHoraEmision: string = '';
  public campoUrlFacturaSiat: string = '';

  // variables globales
  public titlesGlobales = titles;
  public titleComponent: any = mainTitles['facturasCargaEnergia'];

  // Variables Dialog
  public dialogDetalle: boolean = false;

  // variables de tabla
  @ViewChild('dt1') dt!: Table;
  public cabeceras: any[] = [];

  // variables para el filtro
  public bodyFilter: BodyFilterModel = new BodyFilterModel(
    this.page,
    this.itemsPerPage,
    decodeLocal().user.roles[0].id,
    decodeLocal().user.id
  );

  constructor(
    public base64aXML: Base64ToPdfService,
    private invoiceTransaction: InvoiceTransaction,
    public InvoiceService: InvoiveEnergyChargingService,
  ) { }

  ngOnInit() {
    this.es = {
      firstDayOfWeek: 1,
      dayNames: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"],
      dayNamesShort: ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"],
      dayNamesMin: ["D", "L", "M", "X", "J", "V", "S"],
      monthNames: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"],
      monthNamesShort: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"],
      today: "Hoy",
      clear: "Borrar",
    };
    this.inicializaDatos()
    .then( datosInicializados => {
      if (datosInicializados) {
        return this.getInvoicesCharging();
      } else {
        return false;
      }
    })
    .then( listado => {
      if (listado) {
        return this.getInvoicesCharging();
      } else {
        return false;
      }
    })
  }

  inicializaDatos() {
    return new Promise((resolve) => {
      this.cabeceras = [
        { field: 'names', header: 'Nombres' },
        { field: 'lastName', header: 'Apellido Paterno' },
        { field: 'motherLastName', header: 'Apellido Materno' },
        { field: 'electronicMail', header: 'Email' },
        { field: 'paymentTransactionsElectrolineraList', header: 'Última Transacción' },
        { field: 'chargeClientList', header: 'Última Carga' },
        { field: '', header: 'Opciones' },
      ];
      resolve(true);
    })
  }

  getInvoicesCharging(): void {
    this.InvoiceService.getAllFilter(this.bodyFilter)
      .subscribe(
        (result: any) => {
          this.invoices = result.data.invoceElectrolineraList;
          this.totalRecords = result.data.totalRecords ? result.data.totalRecords : 0; 
        },
        (error: any) => {
        })
  }

  onSelecetedItem(item): void {
    this.invoice = JSON.parse(JSON.stringify(item));
  }

  seleccionaSizeList(event) {
    this.itemsPerPage = event.target.value;
  }

  onOpenFactura(item) {
    const xmlContext = this.base64aXML.decodeBase64(item.facturaXmlbase64);
    const jsonData: any = xmlToJsonUtil(xmlContext);
    var doc = this.invoiceTransaction.getFactura(jsonData);
    pdfMake.createPdf(doc).open();
  }

  applyFilter($event: any, field: string, matchMode: string) {
    this.bodyFilter.page = 0;
    this.bodyFilter.sort.column = '';
    this.bodyFilter.sort.direction = '';
    let value = ($event.target as HTMLInputElement)?.value;
    this.dt.filter(value, field, matchMode);
    if (field == 'amount') {
      this.bodyFilter.search.column = DBAttributeName.tabInvPayTranAmount;
    }
    if (field == 'cuf') {
      this.bodyFilter.search.column = DBAttributeName.tabInvPayCuf;
    }
    if (field == 'urlFacturaSiat') {
      this.bodyFilter.search.column = DBAttributeName.tabInvPayUrlSiat;
    }
    if(field == 'fechaHoraEmision') {
      value = moment($event).utc().format('YYYY-MM-DD')
      this.bodyFilter.search.column = DBAttributeName.tabInvoice_AttribFechaEmision;
    }
    this.bodyFilter.search.value = value;
    this.getInvoicesCharging();
  }

  customSort(field, orden) {
    this.orden = !orden;
    this.bodyFilter.search.column = "";
    this.bodyFilter.search.value = "";
    this.bodyFilter.sort.column = "";
    if (field == 'amount') {
      this.bodyFilter.sort.column = DBAttributeName.tabInvPayTranAmount;
    }
    if (field == 'cuf') {
      this.bodyFilter.sort.column = DBAttributeName.tabInvPayCuf;
    }
    if (field == 'urlFacturaSiat') {
      this.bodyFilter.sort.column = DBAttributeName.tabInvPayUrlSiat;
    }
    if (field == 'fechaHoraEmision') {
      this.bodyFilter.sort.column = DBAttributeName.tabInvoice_AttribFechaEmision;
    }
    if (this.bodyFilter.sort.column == "") {
      this.bodyFilter.sort.direction = ""
    } else {
      if (this.orden) {
        this.bodyFilter.sort.direction = "desc"
      } else {
        this.bodyFilter.sort.direction = "asc"
      }
    }
    this.bodyFilter.page = 0;
    this.getInvoicesCharging();
  }

  onPageChange(event: any) {
    this.bodyFilter.page = event.page;
    this.bodyFilter.size = event.rows;
    this.getInvoicesCharging();
  }

  clear(table: Table) {
    table.clear();
    table.clearFilterValues();
    this.campoCuf = '';
    this.campoAmount = '';
    this.campoFechaHoraEmision = '';
    this.campoUrlFacturaSiat = '';
    this.bodyFilter = new BodyFilterModel(
      this.page,
      this.itemsPerPage,
      decodeLocal().user.roles[0].id,
      decodeLocal().user.id
    );
  }
}
