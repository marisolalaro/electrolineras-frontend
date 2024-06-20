import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimeModule } from 'src/app/prime.module';
import { PipesModule } from 'src/app/core/pipes/pipes.module';
import { FilterInformationComponent } from 'src/app/shared/components/filter-information/filter-information.component';
import { InvoiceElectricStationsService } from './services/invoice-electric-stations.service';
import { InvoiceElectricStationsRoutingModule } from './invoice-electric-stations-routing.module';
import { InvoiceTransaction } from './services/invoice-transaction';


@NgModule({
  declarations: [
    
  ],
  imports: [
    CommonModule,
    PrimeModule,
    PipesModule,
    InvoiceElectricStationsRoutingModule,
    FilterInformationComponent,
  ], 
  exports:[
    PrimeModule
  ],
  providers: [
    InvoiceElectricStationsService,
    InvoiceTransaction,
  ]
})
export class InvoiceElectricStationsModule { }
