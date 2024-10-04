import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrandRoutingModule } from './brand-routing.module';
import { PrimeModule } from 'src/app/prime.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from 'src/app/core/pipes/pipes.module';
import { BrandService } from './services/brand.service';
import { NotFoundComponent } from '../../not-found/not-found.component';



@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    PrimeModule,
    FormsModule,
    PipesModule,
    BrandRoutingModule,
    ReactiveFormsModule,
    NotFoundComponent,
  ],
  exports:[
    PrimeModule,
    CommonModule,
    NotFoundComponent,
  ],
  providers: [
    BrandService,
  ]
})
export class BrandModule { }
