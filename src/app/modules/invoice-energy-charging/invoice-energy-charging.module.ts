import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoiceEnergyChargingRoutingModule } from './invoice-energy-charging-routing.module';
import { PrimeModule } from 'src/app/prime.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from 'src/app/core/pipes/pipes.module';
import { FilterInformationComponent } from 'src/app/shared/components/filter-information/filter-information.component';
import { InvoiveEnergyChargingService } from './services/invoive-energy-charging.service';
import { InvoiceTransaction } from './services/invoice-transaction';


@NgModule({
  declarations: [
    
  ],
  imports: [
    InvoiceEnergyChargingRoutingModule,
    PrimeModule,
    FormsModule,
    ReactiveFormsModule,
    PipesModule,
    FilterInformationComponent,
    CommonModule,
  ],
  exports:[
    PrimeModule
  ],
  providers: [
    InvoiveEnergyChargingService,
    InvoiceTransaction
  ]
})
export class InvoiceEnergyChargingModule { }
