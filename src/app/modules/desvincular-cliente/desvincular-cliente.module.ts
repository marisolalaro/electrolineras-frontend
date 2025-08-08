import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DesvincularClinteRoutingModule } from './desvincular-cliente-routing.module';
import { PrimeModule } from 'src/app/prime.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from 'src/app/core/pipes/pipes.module';
import { DesvincularClienteService } from './services/desvincular-cliente.service';
import { NotFoundComponent } from '../not-found/not-found.component';



@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    PrimeModule,
    FormsModule,
    PipesModule,
    DesvincularClinteRoutingModule,
    ReactiveFormsModule,
    NotFoundComponent,
  ],
  exports:[
    PrimeModule,
    CommonModule,
    NotFoundComponent,
  ],
  providers: [
    DesvincularClienteService,
  ]
})
export class DesvincularClienteModule { }
