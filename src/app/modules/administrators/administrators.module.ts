import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdministratorsRoutingModule } from './administrators-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from 'src/app/core/pipes/pipes.module';
import { AdministratorsService } from './services/administrators.service';

@NgModule({
  declarations: [
    
  ],
  imports: [
    CommonModule,
    AdministratorsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    PipesModule
  ],
  providers: [
    AdministratorsService,
  ]
})
export class AdministratorsModule { }
