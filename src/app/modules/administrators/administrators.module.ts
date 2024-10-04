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
import { NotFoundComponent } from '../not-found/not-found.component';

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
    NotFoundComponent
  ],
  exports: [
    PrimeModule,
    NotFoundComponent
  ],
  providers: [
    AdministratorsService,
  ]
})
export class AdministratorsModule { }
