import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Component, ViewChild, ChangeDetectorRef  } from '@angular/core';
import { NgFor, NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
// Primeng
import { Table } from 'primeng/table';
import { ConfirmationService, MessageService } from 'primeng/api';
// cores
import { Global } from 'src/app/core/variables/globales';
import { messages } from 'src/app/core/constants/messages';
import { decodeLocal } from 'src/app/core/utils/decodeToken';
import { ValidaToken } from 'src/app/core/utils/verificarToken';
import { mainTitles, titles } from 'src/app/core/constants/labels';
import { DBAttributeName } from 'src/app/core/constants/dbAttributeName';
// modules
import { CustomersModule } from './customers.module';
import { PipesModule } from 'src/app/core/pipes/pipes.module';
// models
import { Customer } from 'src/app/core/model/customer';
import { BodyFilterModel } from 'src/app/core/model/body-filter';
import { ChargingHistoryModel } from 'src/app/core/model/charging-history';
// services
import { CustomerService } from './services/customer.service';
import { ChargingHistoryService } from 'src/app/core/services/charging-history.service';
import { ProcessService } from './services/process.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss'],
  standalone: true,
  imports: [
    CustomersModule,
    NgFor,
    NgIf,
    PipesModule,
    FormsModule,
    NgSwitch,
    NgSwitchCase
  ],
  providers: [
    ConfirmationService
  ]
})

export default class CustomersComponent {

  // variables de control
  public previousState: boolean;
  public orden: boolean = false;
  public loading: boolean = true;
  public esSuperAdmin: boolean = false;
  public serviceResponse: boolean = true;

  // variables del paginador
  public page: number = 0;
  public totalCargas: number = 0;
  public itemsPerPage: number = 5;
  public totalRecords: number = 0;
  public totalHistorial: number = 0;
  public totalTransacciones: number = 0;

  // variables propias del componente
  public customers: Customer[] = [];
  public customer: Customer = new Customer();
  public mensaje: string = messages.noConexion;
  public customerHistory: ChargingHistoryModel[] = [];
  public filaSeleccionada: any;
  public datosFactSaldo: any;

  // variables globales
  public titlesGlobales = titles;
  public titleComponent: any = mainTitles['clientes'];

  // Variables Dialog
  public selectedCustomers!: Customer;
  public dialogDetalle: boolean = false;

  // variables de tabla
  @ViewChild('dt1') dt!: Table;

  // variables para el filtro
  public saldo: string = '';
  public ultimaCompra: string = '';
  public ultimoConsumo: string = '';
  public username: string = '';
  public fechaRegistro: string = '';

  public bodyFilter: BodyFilterModel = new BodyFilterModel(
    this.page,
    this.itemsPerPage,
    0,
    0
  );

  constructor(
    public global: Global,
    private router: Router,
    public customerService: CustomerService,
    public processService: ProcessService,
    private confirmationService: ConfirmationService,
    private chargingHistoryService: ChargingHistoryService,
  ) { }

  ngOnInit() {  
    if (ValidaToken()) {
      this.inicializaDatos()
      this.getCustomers();
      this.esSuperAdmin = this.global.getEsSuperAdmin();
    } else {
      this.router.navigate(['']);
    }
  }

  inicializaDatos() {
    this.bodyFilter = new BodyFilterModel(
      this.page,
      this.itemsPerPage,
      decodeLocal().user.roles[0].id,
      decodeLocal().user.id
    );
  }

  getCustomers(): void {
    this.loading = true;
    this.customerService.getAllFilter(this.bodyFilter).subscribe(
      (resp: any) => {
        if (resp) {
          this.customers = resp.data.clientList;
          this.totalRecords = resp.data.totalRecords ? resp.data.totalRecords : 0;
          this.loading = false;
        } else {
          this.loading = false
        }
        this.serviceResponse = true;
      }, err => {
        this.loading = false
        this.serviceResponse = false;
      }
    )
  }

  onSelecetedItem(item): void {
    this.customer = JSON.parse(JSON.stringify(item));
  }

  seleccionaSizeList(event) {
    this.itemsPerPage = event.target.value;
  }

  onOpenDetail(customer) {
    this.customer = customer;
    this.totalTransacciones = customer.paymentTransactionsElectrolineraList.length;
    this.totalCargas = customer.chargeClientList.length;
    this.getHistorial();
    this.getFacturacionSaldo(this.customer.id);
    this.dialogDetalle = true;
  }

  getFacturacionSaldo(id) {
    this.processService.getInquiryElectrolinera(id).subscribe(
      (resp: any) => {
        if (resp) {
          this.datosFactSaldo = resp.data;
        }
      }, err => {
      }
    )
  }
  getHistorial() {
    this.chargingHistoryService.getAllHistoryByIdclient(this.customer.id).subscribe(
      (resp: any) => {
        if (resp) {
          this.customerHistory = resp.data;
          this.totalHistorial = this.customerHistory.length;
          this.obtieneVelocidadCarga();
        }
      }, err => {
        
      }
    )
  }

  obtieneVelocidadCarga() {
    this.customerHistory = this.customerHistory.map(history => {
      let tipo = '';
      let color = '';
      let potencia = 230 * history.currentOfferedMode;
    let carga: number = potencia / 1000;
      if (carga >= 0 && carga < 2.3) {
        tipo = 'Carga Ultra Lenta';
        color = '#808080';
      } else if (carga >= 3.7 && carga < 7.4) {
        tipo = 'Carga Lenta';
        color = '#32CD32';
      } else if (carga >= 7.4 && carga < 22) {
        tipo = 'Carga Semi Rápida';
        color = '#00FF00';
      }
      else if (carga >= 22 && carga < 50) {
        tipo = 'Carga Rápida';
        color = '#FF8C00';
      }
      else if (carga >= 50 && carga < 350) {
        tipo = 'Carga Ultra Rápida';
        color = '#B22222';
      } else {
        tipo = 'Carga no definida';
        color = '#8e44ad';
      }
      return { ...history, tipocurrentOfferedMode: tipo , color: color};
    });
  }

  applyFilter($event: any, field: string, matchMode: string) {
    this.bodyFilter.page = 0;
    this.bodyFilter.sort.column = '';
    this.bodyFilter.sort.direction = '';
    let value = ($event.target as HTMLInputElement)?.value;
    this.dt.filter(value, field, matchMode);
    if (field == 'username') {
      this.bodyFilter.search.column = DBAttributeName.tabClientUser_AttribUsername;
    }
    if (field == 'saldo') {
      this.bodyFilter.search.column = DBAttributeName.tabClientUser_AttribSaldo;
    }
    if (field == 'ultimaCompra') {
      this.bodyFilter.search.column = DBAttributeName.tabClientUser_AttribUltimaCompra;
    }
    if (field == 'ultimoConsumo') {
      this.bodyFilter.search.column = DBAttributeName.tabClientUser_AttribUltimoConsumo;
    }
    if (field == 'fechaRegistro') {
      this.bodyFilter.search.column = DBAttributeName.tabClientUser_AttribRegistrationDt;
    }
    this.bodyFilter.search.value = value;
    this.getCustomers();
  }

  customSort(field, orden) {
    this.orden = !orden;
    this.bodyFilter.search.column = "";
    this.bodyFilter.search.value = "";
    this.bodyFilter.sort.column = "";
    if (field == 'saldo') {
      this.bodyFilter.sort.column = DBAttributeName.tabClientUser_AttribSaldo;
    }
    if (field == 'ultimaCompra') {
      this.bodyFilter.sort.column = DBAttributeName.tabClientUser_AttribUltimaCompra;
    }
    if (field == 'ultimoConsumo') {
      this.bodyFilter.sort.column = DBAttributeName.tabClientUser_AttribUltimoConsumo;
    }
    if (field == 'username') {
      this.bodyFilter.sort.column = DBAttributeName.tabClientUser_AttribUsername;
    }
    if (field == 'fechaRegistro') {
      this.bodyFilter.sort.column = DBAttributeName.tabClientUser_AttribRegistrationDt;
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
    this.getCustomers();
  }

  confirmSwitchChange(event: any, item) {
    this.filaSeleccionada = item;
    var texto = item.enabled ? 'Habilitar' : 'Deshabilitar';
    this.previousState = item.enabled;
    this.confirmationService.confirm({
      target: event.originalEvent.target,
      header: 'Confirmación',
      message: `¿${texto} a ${item.electronicMail} ?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => {
        item.enabled = !this.previousState;
        if (!item.enabled) {
          this.customerService.enabledCustomer(item.id).subscribe(
            (resp: any) => {
              this.getCustomers();
            }
          )
        } else {
          this.customerService.disabledCustomer(item.id).subscribe(
            (resp: any) => {
              this.getCustomers();
            }
          )
        }
      },
      reject: () => {
        item.enabled = !this.previousState;
      }
    });
  }

  onPageChange(event: any) {
    this.bodyFilter.page = event.page;
    this.bodyFilter.size = event.rows;
    this.getCustomers();
  }

  clearFilters(table: Table) {
    table.clear();
    table.clearFilterValues();
    this.bodyFilter.search.value = '';
    this.bodyFilter = new BodyFilterModel(
      this.page,
      this.itemsPerPage,
      decodeLocal().user.roles[0].id,
      decodeLocal().user.id
    );
    this.saldo = '';
    this.ultimaCompra = '';
    this.ultimoConsumo = '';
    this.username = '';
    this.fechaRegistro = '';
  }

}