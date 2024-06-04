import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdministratorsRoutingModule } from './administrators-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from 'src/app/core/pipes/pipes.module';
import { AdministratorsService } from './services/administrators.service';
import { PrimeModule } from 'src/app/prime.module';

@NgModule({
  declarations: [
    
  ],
  imports: [
    AdministratorsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    PipesModule,
    CommonModule,
    PrimeModule
  ],
  exports: [
    PrimeModule
  ],
  providers: [
    AdministratorsService,
  ]
})
export class AdministratorsModule { }
