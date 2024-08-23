import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimeModule } from 'src/app/prime.module';
import { SidebarComponent } from 'src/app/core/layout/sidebar/sidebar.component';
import { PipesModule } from 'src/app/core/pipes/pipes.module';

@NgModule({
  declarations: [
    SidebarComponent
  ],
  imports: [
    CommonModule,
    PrimeModule,
    PipesModule,
  ],
  exports:[
    PrimeModule,
    SidebarComponent,
    PipesModule,
  ],
})
export class ContentModule { }
