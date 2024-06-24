import { FormsModule } from '@angular/forms';
import { Component, ViewChild } from '@angular/core';
import { NgFor, NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
// Primeng
import { Table } from 'primeng/table';
// cores
import { Global } from 'src/app/core/variables/globales';
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
    public global: Global,
    public base64aXML: Base64ToPdfService,
    private invoiceTransaction: InvoiceTransaction,
    public InvoiceService: InvoiveEnergyChargingService,
  ) { }

  ngOnInit() {
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
          this.totalRecords = result.data.totalRecords;
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
}
