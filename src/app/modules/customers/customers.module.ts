import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomersRoutingModule } from './customers-routing.module';
import { PrimeModule } from 'src/app/prime.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from 'src/app/core/pipes/pipes.module';
import { CustomerService } from './services/customer.service';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    CustomersRoutingModule,
    PrimeModule,
    FormsModule,
    ReactiveFormsModule,
    PipesModule,

  ],
  exports:[
    PrimeModule,
    CommonModule
  ],
  providers: [
    CustomerService,
  ]
})
export class CustomersModule { }
