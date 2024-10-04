import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimeModule } from 'src/app/prime.module';
import { PipesModule } from 'src/app/core/pipes/pipes.module';
import { InvoiceElectricStationsRoutingModule } from './invoice-purchase-sales-routing.module';
// services
import { InvoiceTransaction } from './services/pdf-invoice-transaction';
import { InvoiceElectricStationsService } from './services/invoice-purchase-sales.service';
import { NotFoundComponent } from '../not-found/not-found.component';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    PrimeModule,
    PipesModule,
    NotFoundComponent,
    InvoiceElectricStationsRoutingModule,
  ], 
  exports:[
    CommonModule,
    PrimeModule,
    NotFoundComponent
  ],
  providers: [
    InvoiceElectricStationsService,
    InvoiceTransaction,
  ]
})
export class InvoiceElectricStationsModule { }
