import { FormsModule } from '@angular/forms';
import { Component, ViewChild } from '@angular/core';
import { NgFor, NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
// Primeng
import { Table } from 'primeng/table';
import { SortEvent } from 'primeng/api';
// cores
import { Global } from 'src/app/core/variables/globales';
import { decodeLocal } from 'src/app/core/utils/decodeToken';
import { mainTitles, titles } from 'src/app/core/constants/labels';
import { DBAttributeName } from 'src/app/core/constants/dbAttributeName';
// modules
import { CustomersModule } from './customers.module';
import { PipesModule } from 'src/app/core/pipes/pipes.module';
// models
import { Customer } from 'src/app/core/model/customer';
import { BodyFilterModel } from 'src/app/core/model/body-filter';
// services
import { CustomerService } from './services/customer.service';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CustomersModule, NgFor, NgIf, PipesModule, FormsModule, NgSwitch, NgSwitchCase],
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss'],
  providers: [ConfirmationService]
})

export default class CustomersComponent {

  // variables de control
  public orden: boolean = false;

  // variables del paginador
  public page: number = 0;
  public itemsPerPage: number = 5;
  public totalRecords: number = 0;
  public totalTransacciones: number = 0;
  public totalCargas: number = 0;

  // variables propias del componente
  public customers: Customer[] = [];
  public customer: Customer = new Customer();

  // variables globales
  public titlesGlobales = titles;
  public titleComponent: any = mainTitles['clientes'];

  // Variables Dialog
  public dialogDetalle: boolean = false;
  public selectedCustomers!: Customer;

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
    public customerService: CustomerService,
    public global: Global,
    private confirmationService: ConfirmationService,
  ) { }

  ngOnInit() {
    this.getCustomers();
  }

  getCustomers(): void {
    this.customerService.getAllFilter(this.bodyFilter).subscribe(
      (resp: any) => {
        this.customers = resp.data.clientList;
        this.totalRecords = resp.data.totalRecords ? resp.data.totalRecords : 0;
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

    this.dialogDetalle = true;
  }

  applyFilter($event: any, field: string, matchMode: string) {
    this.bodyFilter.page = 0;
    this.bodyFilter.sort.column = '';
    this.bodyFilter.sort.direction = '';
    let value = ($event.target as HTMLInputElement)?.value;
    this.dt.filter(value, field, matchMode);

    if (field == 'names') {
      this.bodyFilter.search.column = DBAttributeName.tabClientUser_AttribName;
    }
    if (field == 'lastName') {
      this.bodyFilter.search.column = DBAttributeName.tabClientUser_AttribLastName;
    }
    if (field == 'motherLastName') {
      this.bodyFilter.search.column = DBAttributeName.tabClientUser_AttribMotherLastName;
    }
    if (field == 'electronicMail') {
      this.bodyFilter.search.column = DBAttributeName.tabClientUser_AttribElectronicMail;
    }
    if (field == 'paymentTransactionsElectrolineraList') {
      this.bodyFilter.search.column = 'paymentTransactionsElectrolineraList.amount';
    }
    if (field == 'chargeClientList') {
      this.bodyFilter.search.column = DBAttributeName.tabClientUser_AttribChargeClientList;
    }
    if (field == 'enabled') {
      this.bodyFilter.search.column = DBAttributeName.tabClientUser_AttribEnabled;
    }
    this.bodyFilter.search.value = value;
    this.getCustomers();
  }

  customSort(field, orden) {
    this.orden = !orden;
    this.bodyFilter.search.column = "";
    this.bodyFilter.search.value = "";
    this.bodyFilter.sort.column = "";
    if (field == 'names') {
      this.bodyFilter.sort.column = DBAttributeName.tabClientUser_AttribName;
    }
    if (field == 'lastName') {
      this.bodyFilter.sort.column = DBAttributeName.tabClientUser_AttribLastName;
    }
    if (field == 'motherLastName') {
      this.bodyFilter.sort.column = DBAttributeName.tabClientUser_AttribMotherLastName;
    }
    if (field == 'electronicMail') {
      this.bodyFilter.sort.column = DBAttributeName.tabClientUser_AttribElectronicMail;
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

  confirm(event, item, tipo) {
    var texto = tipo? 'Habilitar' : 'Deshabilitar';
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `¿${texto} a ${item.lastName} ${item.motherLastName} ${item.names} ?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Si',
      rejectLabel: 'No',
      accept: () => {
        if (tipo) {
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
      }
    });
  }

  onPageChange(event: any) {
    // this.bodyFilter.page = event.page + 1; // cuando el paginador empieza en 1
    this.bodyFilter.page = event.page;
    this.bodyFilter.size = event.rows;
    this.getCustomers();
  }

}