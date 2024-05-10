import { Component } from '@angular/core';
import { CustomersModule } from './customers.module';
import { mainTitles } from 'src/app/core/constants/labels';
import { CustomerService } from './services/customer.service';
import { BodyFilterModel } from 'src/app/core/model/body-filter';
import { Global } from 'src/app/core/variables/globales';
import { NgFor } from '@angular/common';
import { Customer } from 'src/app/core/model/customer';
import { decodeLocal } from 'src/app/core/utils/decodeToken';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CustomersModule, NgFor],
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})

export default class CustomersComponent {

  public titleProduct: any = mainTitles['clientes'];
  public customers: Customer[] = [];
  public bodyFilter: BodyFilterModel = new BodyFilterModel(decodeLocal().user.roles[0].id, decodeLocal().user.id);

  constructor(
    public customerService: CustomerService,
    public global: Global
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
}