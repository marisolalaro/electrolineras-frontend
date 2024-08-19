import { Component, OnInit, ViewChild } from '@angular/core';
import { NgFor, NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import * as moment from 'moment';
// Primeng
import { Table } from 'primeng/table';
import { SortEvent } from 'primeng/api';
// cores
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
import { Base64ToImageService } from '../invoice-electric-stations/services/base-64-to-image.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss'],
  standalone: true,
  imports: [TransactionsModule, NgFor, NgIf, PipesModule, NgSwitch, NgSwitchCase],

})
export default class TransactionsComponent implements OnInit {

  // variables de control
  public orden: boolean = false;
  public visible: boolean = false;

  // variables propias del componente
  public titulosGlobales = titles;
  public imageUrl: string | null = null;
  public transactions: TransactionsModel[] = [];
  public transaction: TransactionsModel = new TransactionsModel();

  // variables del paginator
  public page: number = 0;
  public itemsPerPage: number = 5;
  public totalRecords: number = 0;

  // variables globales
  public titlesGlobales = titles;
  public titleComponent: any = mainTitles['transacciones'];

  // variables para el filtro
  public bodyFilter: BodyFilterModel = new BodyFilterModel(
    this.page,
    this.itemsPerPage,
    decodeLocal().user.roles[0].id,
    decodeLocal().user.id
  );

  // variables clave json
  // public nombreConsumidor = DBAttributeName.tabPaymentConsumerName;
  public nombreRazonSocial = DBAttributeName.tabPaymentNombreRazonSocial;
  public numeroDocumento = DBAttributeName.tabPaymentDocumentoConsumer;
  public email = DBAttributeName.tabPaymentEmailCliente;
  public montoTransaccion = DBAttributeName.tabPaymentAmount;
  public fechaRegistro = DBAttributeName.tabPaymentFechaRegistro;
  public giftCard = DBAttributeName.tabPaymentGiftCard;
  public glosa = DBAttributeName.tabPaymentGloss;
  public nombreCliente = DBAttributeName.tabPaymentNombreCliente;
  public placaVehiculo = DBAttributeName.tabPaymentPlacaVehiculo;
  public recibeBanck = DBAttributeName.tabPaymentReciveBank;
  public recibeeDocument = DBAttributeName.tabPaymentReciveDocument;
  public date: Date | undefined;
  // variables de tabla
  @ViewChild('dt1') dt!: Table;
  public cabeceras: any[] = [];

  es: any;

  public campoNombreRazonSocial: string = '';
  public campoNumeroDocumento: string = '';
  public campoEmailCliente: string = '';
  public campoAmount: string = '';
  public campoRegistrationAt: string = '';
  public campoGiftCardNumber: string = '';
  public campoGloss: string = '';
  public campoPlacaVehiculo: string = '';
  public campoReceiverBank: string = '';
  public campoReceiverDocument: string = '';
  
  constructor(
    public transactionService: TransactionsService,
    public base64ImageService: Base64ToImageService,
  ) { }

  ngOnInit(): void {
    this.getTransactions();
    this.inicializaDatos();
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

  inicializaDatos() {
    this.cabeceras = [
      // { field: this.nombreConsumidor, header: 'Nombres Consumidor' },
      { field: this.nombreRazonSocial, header: 'Nombre / Razón Social' },
      { field: this.numeroDocumento, header: 'Número de documento' },
      { field: this.email, header: 'Email' },
      { field: this.montoTransaccion, header: 'Monto de Transacción' },
      { field: this.fechaRegistro, header: 'Fecha registro' },
      { field: this.giftCard, header: 'Numero Gift card' },
      { field: this.glosa, header: 'Glosa' },
      // { field: this.nombreCliente, header: 'Nombre Cliente' },
      { field: this.placaVehiculo, header: 'Placa Vehículo' },
      { field: this.recibeBanck, header: 'Banco recibido' },
      { field: this.recibeeDocument, header: 'Documento Recibido' },
      { field: 'QR', header: 'Opciones' }
    ];
  }

  getTransactions(): void {
    this.date = null
    this.transactionService.getAllFilter(this.bodyFilter).subscribe(
      (resp: any) => {
        this.transactions = resp.data.paymentTransactionElectrolinerasList;
        this.totalRecords = resp.data.totalRecords ? resp.data.totalRecords : 0;
      }
    )
  }

  applyFilter($event: any, field: string, matchMode: string) {
    let value = ($event.target as HTMLInputElement)?.value;
    this.dt.filter(value, field, matchMode);
    this.bodyFilter.page = 0;
    this.bodyFilter.sort.column = '';
    this.bodyFilter.sort.direction = '';

    // if (field == this.nombreConsumidor) {
    //   this.bodyFilter.search.column = DBAttributeName.tabPaymentTransactions_AttribConsumer;
    // }
    if (field == this.nombreRazonSocial) {
      this.bodyFilter.search.column = DBAttributeName.tabPaymentTransactions_AttribNombreRazonSocial;
    }
    if (field == this.numeroDocumento) {
      this.bodyFilter.search.column = DBAttributeName.tabPaymentTransactions_AttribNumeroDocumentoConsumer;
    }
    if (field == this.email) {
      this.bodyFilter.search.column = DBAttributeName.tabPaymentTransactions_AttribEmailCliente;
    }
    if (field == this.montoTransaccion) {
      this.bodyFilter.search.column = DBAttributeName.tabPaymentTransactions_AttribAmount;
    }
    if (field == this.fechaRegistro) {
      value = moment($event).utc().format('YYYY-MM-DD')
      this.bodyFilter.search.column = DBAttributeName.tabPaymentTransactions_AttribRegistrationAt;
    }
    if (field == this.giftCard) {
      this.bodyFilter.search.column = DBAttributeName.tabPaymentTransactions_AttribGiftCard;
    }
    if (field == this.glosa) {
      this.bodyFilter.search.column = DBAttributeName.tabPaymentGloss;
    }
    // if (field == this.nombreCliente) {
    //   this.bodyFilter.search.column = DBAttributeName.tabPaymentNombreCliente;
    // }
    if (field == this.placaVehiculo) {
      this.bodyFilter.search.column = DBAttributeName.tabPaymentTransactions_AttribPlaca;
    }
    if (field == this.recibeBanck) {
      this.bodyFilter.search.column = DBAttributeName.tabPaymentTransactions_AttribBank;
    }
    if (field == this.recibeeDocument) {
      this.bodyFilter.search.column = DBAttributeName.tabPaymentTransactions_AttribDocReciveid;
    }
    this.bodyFilter.search.value = value;
    this.getTransactions();
  }

  customSort(field, orden) {
    this.orden = !orden;
    this.bodyFilter.search.column = "";
    this.bodyFilter.search.value = "";

    // if (field == this.nombreConsumidor) {
    //   this.bodyFilter.sort.column = DBAttributeName.tabPaymentTransactions_AttribConsumer;
    // }
    if (field == this.nombreRazonSocial) {
      this.bodyFilter.sort.column = DBAttributeName.tabPaymentTransactions_AttribNombreRazonSocial;
    }
    if (field == this.numeroDocumento) {
      this.bodyFilter.sort.column = DBAttributeName.tabPaymentTransactions_AttribNumeroDocumentoConsumer;
    }
    if (field == this.email) {
      this.bodyFilter.sort.column = DBAttributeName.tabPaymentTransactions_AttribEmailCliente;
    }
    if (field == this.montoTransaccion) {
      this.bodyFilter.sort.column = DBAttributeName.tabPaymentTransactions_AttribAmount;
    }
    if (field == this.fechaRegistro) {
      this.bodyFilter.sort.column = DBAttributeName.tabPaymentTransactions_AttribFechaRegistro;
    }
    if (field == this.giftCard) {
      this.bodyFilter.sort.column = DBAttributeName.tabPaymentTransactions_AttribGiftCard;
    }
    if (field == this.glosa) {
      this.bodyFilter.sort.column = DBAttributeName.tabPaymentGloss;
    }
    // if (field == this.nombreCliente) {
    //   this.bodyFilter.sort.column = DBAttributeName.tabPaymentNombreCliente;
    // }
    if (field == this.placaVehiculo) {
      this.bodyFilter.sort.column = DBAttributeName.tabPaymentPlacaVehiculo;
    }
    if (field == this.recibeBanck) {
      this.bodyFilter.sort.column = DBAttributeName.tabPaymentReciveBank;
    }
    if (field == this.recibeeDocument) {
      this.bodyFilter.sort.column = DBAttributeName.tabPaymentReciveDocument;
    }
    if (this.orden) {
      this.bodyFilter.sort.direction = "desc"
    } else {
      this.bodyFilter.sort.direction = "asc"
    }
    this.bodyFilter.page = 0;
    this.getTransactions();
  }

  onPageChange(event: any) {
    // this.bodyFilter.page = event.page + 1;
    this.bodyFilter.page = event.page;
    this.bodyFilter.size = event.rows;
    this.getTransactions();
  }

  onOpenImagenQR(item) {
    this.visible = true;
    this.imageUrl = this.base64ImageService.base64ToImageUrl(item.qrImage);
  }

  clear(table: Table) {
    this.date = null;
    table.clear();
    table.clearFilterValues();

    this.campoNombreRazonSocial = '';
    this.campoNumeroDocumento = '';
    this.campoEmailCliente = '';
    this.campoAmount = '';
    this.campoRegistrationAt = '';
    this.campoGiftCardNumber = '';
    this.campoGloss = '';
    this.campoPlacaVehiculo = '';
    this.campoReceiverBank = '';
    this.campoReceiverDocument = '';

    this.bodyFilter = new BodyFilterModel(
      this.page,
      this.itemsPerPage,
      decodeLocal().user.roles[0].id,
      decodeLocal().user.id
    );
  }
}
