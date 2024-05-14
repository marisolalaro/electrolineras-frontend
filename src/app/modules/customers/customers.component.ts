import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
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
import {NgxPaginationModule} from 'ngx-pagination'; // <-- import the module
@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CustomersModule, NgFor, PipesModule, NgxPaginationModule],
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})

export default class CustomersComponent {

  public page: number = 1;
  public itemsPerPage: number = 10;
  public customers: Customer[] = [];
  public customer: Customer = new Customer();
  public titleProduct: any = mainTitles['clientes'];
  public bodyFilter: BodyFilterModel = new BodyFilterModel(decodeLocal().user.roles[0].id, decodeLocal().user.id);

  constructor(
    public customerService: CustomerService,
    public global: Global,
  ) {}

  ngOnInit() {
    this.getCustomers();
  }

  getCustomers(): void {
    this.customerService.getAllFilter(this.bodyFilter).subscribe(
      (resp : any) => {
        this.customers = resp.data;        
      }
    )
  }

  onSelecetedItem(item): void {
    this.customer = JSON.parse(JSON.stringify(item));
  }

  seleccionaSizeList(event) {
    this.itemsPerPage = event.target.value;
  }
}