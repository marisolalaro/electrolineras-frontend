import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { PrimeModule } from 'src/app/prime.module';


@NgModule({
  declarations: [
    
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    PrimeModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    PrimeModule,
    ReactiveFormsModule
    ]
})
export class LoginModule { }
