import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from 'src/app/core/pipes/pipes.module';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

@NgModule({
  declarations: [
    
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PipesModule,
    LeafletModule
  ],
  providers: [
  ]
})
export class SharedModule { }
