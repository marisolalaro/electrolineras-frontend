import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TasaCargaRoutingModule } from './tasa-carga-routing.module';
import { PrimeModule } from 'src/app/prime.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from 'src/app/core/pipes/pipes.module';
import { TasaCargaService } from './services/tasa-carga.service';
import { NotFoundComponent } from '../../not-found/not-found.component';



@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    PrimeModule,
    FormsModule,
    PipesModule,
    TasaCargaRoutingModule,
    ReactiveFormsModule,
    NotFoundComponent,
  ],
  exports:[
    PrimeModule,
    CommonModule,
    PipesModule,
    NotFoundComponent,
  ],
  providers: [
    TasaCargaService,
  ]
})
export class TasaCargaModule { }
