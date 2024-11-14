import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimeModule } from 'src/app/prime.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from 'src/app/core/pipes/pipes.module';
import { AddressRoutingModule } from './address-routing.module';
import { NotFoundComponent } from '../../not-found/not-found.component';
import { AddressService } from './services/address.service';



@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    PrimeModule,
    FormsModule,
    PipesModule,
    AddressRoutingModule,
    ReactiveFormsModule,
    NotFoundComponent,
  ],
  exports:[
    PrimeModule,
    CommonModule,
    NotFoundComponent,
  ],
  providers: [
    AddressService,
  ]
})
export class AddressModule { }
