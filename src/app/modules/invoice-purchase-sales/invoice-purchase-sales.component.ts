import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgFor, NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
// Primeng
import { Table } from 'primeng/table';
// cores
import { decodeLocal } from 'src/app/core/utils/decodeToken';
import { mainTitles, titles } from 'src/app/core/constants/labels';
import { DBAttributeName } from 'src/app/core/constants/dbAttributeName';
// modules
import { InvoiceElectricStationsModule } from './invoice-purchase-sales.module';
import { PipesModule } from 'src/app/core/pipes/pipes.module';
// models
import { BodyFilterModel } from 'src/app/core/model/body-filter';
import { InvoiceElectricStationModel } from 'src/app/core/model/invoice-electric-stations';
// services
import { Base64ToPdfService } from '../../core/services/base-64-to-pdf.service';
import { Base64ToImageService } from '../../core/services/base-64-to-image.service';
import { InvoiceElectricStationsService } from './services/invoice-purchase-sales.service';
import { InvoiceTransaction } from './services/pdf-invoice-transaction';
// librerias
import * as moment from 'moment';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { xmlToJsonUtil } from 'xml-to-json-util';
import { messages } from 'src/app/core/constants/messages';
import { ValidaToken } from 'src/app/core/utils/verificarToken';

@Component({
  selector: 'app-invoice-purchase-sales',
  templateUrl: './invoice-purchase-sales.component.html',
  styleUrls: ['./invoice-purchase-sales.component.scss'],
  standalone: true,
  imports: [
    InvoiceElectricStationsModule, 
    NgFor, 
    NgIf, 
    PipesModule, 
    NgSwitch, 
    NgSwitchCase
  ]
})
export default class InvoiceElectricStationsComponent {

  // variables de control
  public orden: boolean = false;
  public loading: boolean = true;
  public serviceResponse: boolean = true;
  
  // variables propias del componente
  public es: any;
  public titulosGlobales = titles;
  public visible: boolean = false;
  public imageUrl: string | null = null;
  public mensaje: string = messages.noConexion;
  public invoices: InvoiceElectricStationModel[] = [];
  public invoice: InvoiceElectricStationModel = new InvoiceElectricStationModel();

  // variables del paginator
  public page: number = 0;
  public itemsPerPage: number = 5;
  public totalRecords: number = 0;

  // variables globales
  public titlesGlobales = titles;
  public titleComponent: any = mainTitles['facturas'];

  // variables para el filtro
  public campoCuf: string = '';
  public campoUrlFacturaSiat: string = '';
  public campoFechaHoraEmision: string = '';
  public campoCodigoDescripcion: string = '';
  public bodyFilter: BodyFilterModel = new BodyFilterModel(this.page, this.itemsPerPage, decodeLocal().user.roles[0].id, decodeLocal().user.id);

  // variables de tabla
  @ViewChild('dt1') dt!: Table;

  constructor(
    private router: Router,
    public base64aXML: Base64ToPdfService,
    private invoiceTransaction: InvoiceTransaction,
    public base64ImageService: Base64ToImageService,
    public invoiceService: InvoiceElectricStationsService,
  ) { }

  ngOnInit(): void {
    if (ValidaToken()) {
      this.getInvoices();
    this.inicializaDatos();
    } else {
      this.router.navigate(['']);
    }
  }

  inicializaDatos() {
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
  }

  getInvoices(): void {
    this.loading = true;
    this.invoiceService.getAllFilter(this.bodyFilter).subscribe(
      (resp: any) => {
        if(resp){
          this.invoices = resp.data.invoceElectrolineraList;
          this.totalRecords = resp.data.totalRecords ? resp.data.totalRecords : 0; 
          this.loading = false;
        } else {
          this.loading = false;
        }
        this.serviceResponse = true;
      }, err => {
        this.loading = false
        this.serviceResponse = false;
      }
    )
  }

  applyFilter($event: any, field: string, matchMode: string) {
    this.bodyFilter.page = 0;
    this.bodyFilter.sort.column = '';
    this.bodyFilter.sort.direction = '';
    let value = ($event.target as HTMLInputElement)?.value;
    this.dt.filter(value, field, matchMode);
    this.bodyFilter.search.column = 'id'
    if(field == 'fechaHoraEmision') {
      value = moment($event).utc().format('YYYY-MM-DD')
      this.bodyFilter.search.column = DBAttributeName.tabInvoice_AttribFechaEmision;
    }
    if(field == 'cuf') {
      this.bodyFilter.search.column = DBAttributeName.tabInvoice_AttribCuf;
    }
    if(field == 'codigoDescripcion') {
      this.bodyFilter.search.column = DBAttributeName.tabInvoice_AttribCodigoDescripcion;
    }
    if(field == 'urlFacturaSiat') {
      this.bodyFilter.search.column = DBAttributeName.tabInvoice_AttribUrlFacturaSiat;
    }
    this.bodyFilter.search.value = value;
    this.getInvoices();
  }

  customSort(field, orden) {
    this.orden = !orden;
    this.bodyFilter.search.column = "";
    this.bodyFilter.search.value = "";
    this.bodyFilter.sort.column = "";
    if (field == 'fechaHoraEmision') {
      this.bodyFilter.sort.column = DBAttributeName.tabInvoice_AttribFechaEmision;
    }
    if (field == 'cuf') {
      this.bodyFilter.sort.column = DBAttributeName.tabInvoice_AttribCuf;
    }
    if (field == 'codigoDescripcion') {
      this.bodyFilter.sort.column = DBAttributeName.tabInvoice_AttribCodigoDescripcion;
    }
    if (field == 'urlFacturaSiat') {
      this.bodyFilter.sort.column = DBAttributeName.tabInvoice_AttribUrlFacturaSiat;
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
    this.getInvoices();
  }

  onOpenFactura(item) {
    const xmlContext = this.base64aXML.decodeBase64(item.xmlBase64);
    const jsonData: any = xmlToJsonUtil(xmlContext);
    var doc = this.invoiceTransaction.getFactura(jsonData);
    pdfMake.createPdf(doc).open();
  }

  onOpenImagenQR(item) {
    this.visible = true;
    this.imageUrl = this.base64ImageService.base64ToImageUrl(item.idPaymentTransactionElectrolinera.qrImage);
  }

  onPageChange(event: any) {
    this.bodyFilter.page = event.page;
    this.bodyFilter.size = event.rows;
    this.getInvoices();
  }

  clearFilters(table: Table) {
    table.clear();
    table.clearFilterValues();
    this.bodyFilter = new BodyFilterModel(
      this.page,
      this.itemsPerPage,
      decodeLocal().user.roles[0].id,
      decodeLocal().user.id
    );
    this.campoCuf = '';
    this.campoFechaHoraEmision = '';
    this.campoCodigoDescripcion = '';
    this.campoUrlFacturaSiat = '';
  }
  
}
