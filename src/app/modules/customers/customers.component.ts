import { NgFor, NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
// cores
import { Global } from 'src/app/core/variables/globales';
import { mainTitles } from 'src/app/core/constants/labels';
import { decodeLocal } from 'src/app/core/utils/decodeToken';
// modules
import { CustomersModule } from './customers.module';
import { PipesModule } from 'src/app/core/pipes/pipes.module';
// models
import { Customer } from 'src/app/core/model/customer';
import { BodyFilterModel } from 'src/app/core/model/body-filter';
// services
import { CustomerService } from './services/customer.service';
import { NgxPaginationModule } from 'ngx-pagination'; // <-- import the module

import { ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { DBAttributeName } from 'src/app/core/constants/dbAttributeName';


interface PageEvent {
  first: number;
  rows: number;
  page: number;
  pageCount: number;
}

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CustomersModule, NgFor, NgIf, PipesModule, NgxPaginationModule, FormsModule, NgSwitch, NgSwitchCase],
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})

export default class CustomersComponent {

  // variables
  public page: number = 1;
  public itemsPerPage: number = 5;
  public totalRecords: number = 0;
  public customers: Customer[] = [];
  public customer: Customer = new Customer();
  public titleProduct: any = mainTitles['clientes'];
  public bodyFilter: BodyFilterModel = new BodyFilterModel(this.page, this.itemsPerPage, decodeLocal().user.roles[0].id, decodeLocal().user.id);

  // Variables Dialog
  public dialogDetalle: boolean = false;
  selectedCustomers!: Customer;

  // products: Product[] = [];
  cols: any[] = [];

  value: any = null;

  @ViewChild('dt1') dt!: Table;

  constructor(
    public customerService: CustomerService,
    public global: Global,
  ) { }


  ngOnInit() {
    this.getCustomers();
    this.cols = [
      { field: 'names', header: 'Nombres' },
      { field: 'lastName', header: 'Apellido Paterno' },
      { field: 'motherLastName', header: 'Apellido Materno' },
      { field: 'electronicMail', header: 'Email' },
      { field: '', header: 'Opciones' },

    ];
  }

  getCustomers(): void {
    this.customerService.getAllFilter(this.bodyFilter).subscribe(
      (resp: any) => {
        this.customers = resp.data.clientList;
        this.totalRecords = resp.data.totalRecords;
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
    this.dialogDetalle = true;
  }

  applyFilter($event: any, field: string, matchMode: string) {
    this.bodyFilter.page = 1;
    let value = ($event.target as HTMLInputElement)?.value;
    this.dt.filter(value, field, matchMode);

    if(field == 'names') {
      this.bodyFilter.search.column = DBAttributeName.tabClientUser_AttribName;
    }
    if(field == 'lastName') {
      this.bodyFilter.search.column = DBAttributeName.tabClientUser_AttribLastName;
    }
    if(field == 'motherLastName') {
      this.bodyFilter.search.column = DBAttributeName.tabClientUser_AttribMotherLastName;
    }
    if(field == 'electronicMail') {
      this.bodyFilter.search.column = DBAttributeName.tabClientUser_AttribElectronicMail;
    }
    this.bodyFilter.search.value = value;
    this.getCustomers();
  }

  onPageChange(event: any) {
    this.bodyFilter.page = event.page + 1;
    this.bodyFilter.size = event.rows;
    this.getCustomers();

  }

}