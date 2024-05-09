import { Component } from '@angular/core';
import { CustomersModule } from './customers.module';
import { mainTitles } from 'src/app/core/constants/labels';
import { CustomerService } from './services/customer.service';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CustomersModule],
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})

export default class CustomersComponent {
  public titleProduct: any = mainTitles['clientes'];

  constructor(public customerService: CustomerService) {}

  ngOnInit() {

  }

  getCustomers(): void {
    
  }
}