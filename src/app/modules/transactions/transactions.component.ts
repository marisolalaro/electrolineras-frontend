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
import { TransactionsModule } from './transactions.module'; 
import { PipesModule } from 'src/app/core/pipes/pipes.module';
// models
import { BodyFilterModel } from 'src/app/core/model/body-filter';
import { TransactionsModel } from 'src/app/core/model/transactions';
// services
import { TransactionsService } from './services/transactions.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss'],
  standalone: true,
  imports: [TransactionsModule, NgFor, NgIf, PipesModule, NgSwitch, NgSwitchCase],

})
export default class TransactionsComponent implements OnInit{

  // variables propias del componente
  public transactions: TransactionsModel [] = [];
  public transaction: TransactionsModel = new TransactionsModel();

  // variables del paginator
  public page: number = 1;
  public itemsPerPage: number = 5;
  public totalRecords: number = 0;

  // variables globales
  public titlesGlobales = titles;
  public titleComponent: any = mainTitles['transacciones'];

  // variables para el filtro
  public bodyFilter: BodyFilterModel = new BodyFilterModel(this.page, this.itemsPerPage, decodeLocal().user.roles[0].id, decodeLocal().user.id);

  // variables de tabla
  @ViewChild('dt1') dt!: Table;
  public cols: any[] = [];

  // variables response database componenet
  public nombreConsumidor = DBAttributeName.tabPaymentConsumerName;
  public nombreRazonSocial = DBAttributeName.tabPaymentNombreRazonSocial;
  public numeroDocumento = DBAttributeName.tabPaymentDocumentoConsumer;
  public email = DBAttributeName.tabPaymentEmailCliente;
  public montoTransaccion = DBAttributeName.tabPaymentAmount;
  public creditoRestante = DBAttributeName.tabPaymentRemainingAmount;
  public fechaRegistro = DBAttributeName.tabPaymentFechaRegistro;
  public fechaExpiracion = DBAttributeName.tabPaymentExpiration;
  public fechaPago = DBAttributeName.tabPaymentPaymentDateConsumer;
  public giftCard = DBAttributeName.tabPaymentGiftCard;
  public qrImage = DBAttributeName.tabPaymentQrImage;

  constructor(
    public transactionService: TransactionsService,
  ) { }

  ngOnInit(): void {
    this.getTransactions();
    this.inicializaDatos();
  }

  inicializaDatos() {
    this.cols = [
      { field: this.nombreConsumidor, header: 'Nombres Consumidor' },
      { field: this.nombreRazonSocial, header: 'Nombre / Razón Social' },
      { field: this.numeroDocumento, header: 'Número de documento' },
      { field: this.email, header: 'Email' },
      { field: this.montoTransaccion, header: 'Monto de Transacción' },
      { field: this.creditoRestante, header: 'Crédito restante' },
      { field: this.fechaRegistro, header: 'Fecha registro' },
      { field: this.fechaExpiracion, header: 'Fecha expiración' },
      { field: this.fechaPago, header: 'Fecha pago' },
      { field: this.giftCard, header: 'Numero Gift card' },
      { field: this.qrImage, header: 'QR' }
    ];
  }

  getTransactions(): void {
    this.transactionService.getAllFilter(this.bodyFilter).subscribe(
      (resp: any) => {
        this.transactions = resp.data.clientList;
        this.totalRecords = resp.data.totalRecords;
      }
    )
  }

  applyFilter($event: any, field: string, matchMode: string) {
    this.bodyFilter.page = 1;
    let value = ($event.target as HTMLInputElement)?.value;
    this.dt.filter(value, field, matchMode);
    // TODO
    if(field == this.nombreConsumidor) {
      this.bodyFilter.search.column = DBAttributeName.tabPaymentTransactions_AttribConsumer;
    }
    if(field == this.nombreRazonSocial) {
      this.bodyFilter.search.column = DBAttributeName.tabPaymentTransactions_AttribNombreRazonSocial;
    }
    if(field == this.numeroDocumento) {
      this.bodyFilter.search.column = DBAttributeName.tabPaymentTransactions_AttribNumeroDocumentoConsumer;
    }
    if(field == this.email) {
      this.bodyFilter.search.column = DBAttributeName.tabPaymentTransactions_AttribEmailCliente;
    }
    if(field == this.montoTransaccion) {
      this.bodyFilter.search.column = DBAttributeName.tabPaymentTransactions_AttribAmount;
    }
    if(field == this.creditoRestante) {
      this.bodyFilter.search.column = DBAttributeName.tabPaymentTransactions_AttribRemainingAmount;
    }
    if(field == this.fechaRegistro) {
      this.bodyFilter.search.column = DBAttributeName.tabPaymentTransactions_AttribFechaRegistro;
    }
    if(field == this.fechaExpiracion) {
      this.bodyFilter.search.column = DBAttributeName.tabPaymentTransactions_AttribExpiration;
    }
    if(field == this.fechaPago) {
      this.bodyFilter.search.column = DBAttributeName.tabPaymentTransactions_AttribPaymentDateConsumer;
    }
    if(field == this.giftCard) {
      this.bodyFilter.search.column = DBAttributeName.tabPaymentTransactions_AttribGiftCard;
    }
    if(field == this.qrImage) {
      this.bodyFilter.search.column = DBAttributeName.tabPaymentTransactions_AttribQrImage;
    }
    this.bodyFilter.search.value = value;
    this.getTransactions();
  }

  onPageChange(event: any) {
    this.bodyFilter.page = event.page + 1;
    this.bodyFilter.size = event.rows;
    this.getTransactions();
  }
}
