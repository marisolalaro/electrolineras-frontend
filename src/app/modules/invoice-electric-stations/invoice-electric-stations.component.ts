import { Component, OnInit, ViewChild } from '@angular/core';
import { NgFor, NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
// Primeng
import { Table } from 'primeng/table';
// cores
import { Global } from 'src/app/core/variables/globales';
import { decodeLocal } from 'src/app/core/utils/decodeToken';
import { mainTitles, titles } from 'src/app/core/constants/labels';
import { DBAttributeName } from 'src/app/core/constants/dbAttributeName';
// modules
import { InvoiceElectricStationsModule } from './invoice-electric-stations.module';
import { PipesModule } from 'src/app/core/pipes/pipes.module';
// models
import { BodyFilterModel } from 'src/app/core/model/body-filter';
import { InvoiceElectricStationModel } from 'src/app/core/model/invoice-electric-stations';
// services
import { Base64ToPdfService } from './services/base-64-to-pdf.service';
import { Base64ToImageService } from './services/base-64-to-image.service';
import { InvoiceElectricStationsService } from './services/invoice-electric-stations.service';

import { xmlToJsonUtil } from 'xml-to-json-util';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { InvoiceTransaction } from './services/invoice-transaction';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-invoice-electric-stations',
  templateUrl: './invoice-electric-stations.component.html',
  styleUrls: ['./invoice-electric-stations.component.scss'],
  standalone: true,
  imports: [InvoiceElectricStationsModule, NgFor, NgIf, PipesModule, NgSwitch, NgSwitchCase]
})
export default class InvoiceElectricStationsComponent {

  // variables de control
  public orden: boolean = false;
  
  // variables propias del componente
  public titulosGlobales = titles;
  public visible: boolean = false;
  public imageUrl: string | null = null;
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
  public bodyFilter: BodyFilterModel = new BodyFilterModel(this.page, this.itemsPerPage, decodeLocal().user.roles[0].id, decodeLocal().user.id);

  // variables de tabla
  @ViewChild('dt1') dt!: Table;
  public cols: any[] = [];

  constructor(
    public invoiceService: InvoiceElectricStationsService,
    public base64ImageService: Base64ToImageService,
    public base64aXML: Base64ToPdfService,
    private invoiceTransaction: InvoiceTransaction
  ) { }

  ngOnInit(): void {
    this.getInvoices();
    this.inicializaDatos();
  }

  inicializaDatos() {
    this.cols = [
      { field: 'nombreRazonSocial', header: 'Razón social' },
      { field: 'fechaHoraEmision', header: 'Fecha Emisión' },
      { field: 'cuf', header: 'CUF' },
      { field: 'numeroDocumento', header: 'Número de documento' },
      { field: 'amount', header: 'Monto' },
      { field: 'emailCliente', header: 'Correo Electrónico' },
      { field: 'nombreCliente', header: 'Nombre Cliente' },
      { field: 'codigoDescripcion', header: 'Código' },
      { field: 'urlFacturaSiat', header: 'URL Factura' },
      { field: '', header: 'Opciones' },
    ];
  }

  getInvoices(): void {
    this.invoiceService.getAllFilter(this.bodyFilter).subscribe(
      (resp: any) => {
        this.invoices = resp.data.invoceElectrolineraList;
        this.totalRecords = resp.data.totalRecords ? resp.data.totalRecords : 0; 
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
    // this.bodyFilter.page = event.page + 1;
    this.bodyFilter.page = event.page;
    this.bodyFilter.size = event.rows;
    this.getInvoices();
  }

}
