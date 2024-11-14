import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PasswordRoutingModule } from './password-routing.module';
import { PrimeModule } from 'src/app/prime.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from 'src/app/core/pipes/pipes.module';
import { PasswordService } from './services/password.service';
import { NotFoundComponent } from '../../not-found/not-found.component';



@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    PrimeModule,
    FormsModule,
    PipesModule,
    PasswordRoutingModule,
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
    PasswordService,
  ]
})
export class PasswordModule { }
