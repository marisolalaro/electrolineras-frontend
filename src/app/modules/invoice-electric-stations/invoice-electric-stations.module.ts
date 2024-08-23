import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimeModule } from 'src/app/prime.module';
import { PipesModule } from 'src/app/core/pipes/pipes.module';
import { InvoiceElectricStationsRoutingModule } from './invoice-electric-stations-routing.module';
// services
import { InvoiceTransaction } from './services/pdf-invoice-transaction';
import { InvoiceElectricStationsService } from './services/invoice-electric-stations.service';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    PrimeModule,
    PipesModule,
    InvoiceElectricStationsRoutingModule,
  ], 
  exports:[
    CommonModule,
    PrimeModule
  ],
  providers: [
    InvoiceElectricStationsService,
    InvoiceTransaction,
  ]
})
export class InvoiceElectricStationsModule { }
