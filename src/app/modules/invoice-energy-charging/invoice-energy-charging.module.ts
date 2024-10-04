import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimeModule } from 'src/app/prime.module';
import { PipesModule } from 'src/app/core/pipes/pipes.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NotFoundComponent } from '../not-found/not-found.component';
import { InvoiceEnergyChargingRoutingModule } from './invoice-energy-charging-routing.module';
// servicios
import { InvoiceTransaction } from './services/pdf-invoice-transaction';
import { InvoiveEnergyChargingService } from './services/invoive-energy-charging.service';

@NgModule({
  declarations: [
  ],
  imports: [
    InvoiceEnergyChargingRoutingModule,
    PrimeModule,
    FormsModule,
    ReactiveFormsModule,
    PipesModule,
    NotFoundComponent,
    CommonModule,
  ],
  exports:[
    PrimeModule,
    NotFoundComponent
  ],
  providers: [
    InvoiveEnergyChargingService,
    InvoiceTransaction
  ]
})
export class InvoiceEnergyChargingModule { }
