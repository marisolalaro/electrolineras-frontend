import { Component } from '@angular/core';
import { CustomersModule } from './customers.module';
import { mainTitles } from 'src/app/core/constants/labels';
import { CustomerService } from './services/customer.service';
import { BodyFilterModel } from 'src/app/core/model/body-filter';
import { Global } from 'src/app/core/variables/globales';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CustomersModule],
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})

export default class CustomersComponent {

  public titleProduct: any = mainTitles['clientes'];
  public bodyFilter: BodyFilterModel = new BodyFilterModel(this.global.roleId, this.global.userId);

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
        console.log(JSON.stringify(resp));
        
      }
    )
  }
}