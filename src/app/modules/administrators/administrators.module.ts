import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimeModule } from 'src/app/prime.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// pipes
import { PipesModule } from 'src/app/core/pipes/pipes.module';
// Services
import { AdministratorsService } from './services/administrators.service';
// routes
import { AdministratorsRoutingModule } from './administrators-routing.module';

@NgModule({
  declarations: [
  ],
  imports: [
    AdministratorsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    PipesModule,
    CommonModule,
    PrimeModule,
  ],
  exports: [
    PrimeModule,
  ],
  providers: [
    AdministratorsService,
  ]
})
export class AdministratorsModule { }
