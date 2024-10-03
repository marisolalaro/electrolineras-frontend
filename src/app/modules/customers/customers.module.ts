import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomersRoutingModule } from './customers-routing.module';
import { PrimeModule } from 'src/app/prime.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from 'src/app/core/pipes/pipes.module';
import { CustomerService } from './services/customer.service';
import { NotFoundComponent } from '../not-found/not-found.component';

@NgModule({
  declarations: [
  ],
  imports: [
    NotFoundComponent,
    CommonModule,
    CustomersRoutingModule,
    PrimeModule,
    FormsModule,
    ReactiveFormsModule,
    PipesModule,

  ],
  exports:[
    PrimeModule,
    CommonModule,
    NotFoundComponent
  ],
  providers: [
    CustomerService,
  ]
})
export class CustomersModule { }
