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
import { InvoiceElectricStationsService } from './services/invoice-electric-stations.service';

@Component({
  selector: 'app-invoice-electric-stations',
  templateUrl: './invoice-electric-stations.component.html',
  styleUrls: ['./invoice-electric-stations.component.scss'],
  standalone: true,
  imports: [InvoiceElectricStationsModule, NgFor, NgIf, PipesModule, NgSwitch, NgSwitchCase],
})
export default class InvoiceElectricStationsComponent {

  // variables propias del componente
  public invoices: InvoiceElectricStationModel[] = [];
  public invoice: InvoiceElectricStationModel = new InvoiceElectricStationModel();

  // variables del paginator
  public page: number = 1;
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
  ) { }

  ngOnInit(): void {
    this.getInvoices();
    this.inicializaDatos();
  }

  inicializaDatos() {
    this.cols = [
      { field: 'idPaymentTransactionElectrolinera', header: 'Nombre o Razón social' },
      { field: 'fechaHoraEmision', header: 'Fecha Emisión' },
      { field: 'cuf', header: 'CUF' },
      { field: 'idPaymentTransactionElectrolinera', header: 'Número de documento' },
      { field: 'idPaymentTransactionElectrolinera', header: 'Monto' },
      { field: 'idPaymentTransactionElectrolinera', header: 'Email' },
      { field: 'idPaymentTransactionElectrolinera', header: 'Nombre Cliente' },
      { field: 'codigoDescripcion', header: 'Código' },
      { field: 'urlFacturaSiat', header: 'URL Factura' },
      { field: '', header: 'Ver Factura' },
    ];
  }

  getInvoices(): void {
    this.invoiceService.getAllFilter(this.bodyFilter).subscribe(
      (resp: any) => {
        this.invoices = resp.data.invoceElectrolineraList;
        this.totalRecords = resp.data.totalRecords;
      }
    )
  }

  applyFilter($event: any, field: string, matchMode: string) {
    this.bodyFilter.page = 1;
    let value = ($event.target as HTMLInputElement)?.value;
    this.dt.filter(value, field, matchMode);
    // TODO
    if(field == 'nombreConsumidor') {
      this.bodyFilter.search.column = DBAttributeName.tabPaymentTransactions_AttribConsumer;
    }
    if(field == 'aaaa') {
      this.bodyFilter.search.column = DBAttributeName.tabPaymentTransactions_AttribNombreRazonSocial;
    }
    if(field == 'aaaa') {
      this.bodyFilter.search.column = DBAttributeName.tabPaymentTransactions_AttribNumeroDocumentoConsumer;
    }
    if(field == 'aaaa') {
      this.bodyFilter.search.column = DBAttributeName.tabPaymentTransactions_AttribEmailCliente;
    }
    if(field == 'aaaa') {
      this.bodyFilter.search.column = DBAttributeName.tabPaymentTransactions_AttribAmount;
    }
    if(field == 'aaaa') {
      this.bodyFilter.search.column = DBAttributeName.tabPaymentTransactions_AttribRemainingAmount;
    }
    if(field == 'aaaa') {
      this.bodyFilter.search.column = DBAttributeName.tabPaymentTransactions_AttribFechaRegistro;
    }
    if(field == 'aaaa') {
      this.bodyFilter.search.column = DBAttributeName.tabPaymentTransactions_AttribExpiration;
    }
    if(field == 'aaaa') {
      this.bodyFilter.search.column = DBAttributeName.tabPaymentTransactions_AttribPaymentDateConsumer;
    }
    if(field == 'aaaa') {
      this.bodyFilter.search.column = DBAttributeName.tabPaymentTransactions_AttribGiftCard;
    }
    if(field == 'aaaa') {
      this.bodyFilter.search.column = DBAttributeName.tabPaymentTransactions_AttribQrImage;
    }
    this.bodyFilter.search.value = value;
    this.getInvoices();
  }

  onOpenFactura(item) {

  }

  onPageChange(event: any) {
    this.bodyFilter.page = event.page + 1;
    this.bodyFilter.size = event.rows;
    this.getInvoices();
  }

}
