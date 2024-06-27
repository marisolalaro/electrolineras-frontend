import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { PrimeModule } from 'src/app/prime.module';
import { SidebarComponent } from 'src/app/core/layout/sidebar/sidebar.component';
// import ContentComponent from './content.component';

@NgModule({
  declarations: [
    // ContentComponent
    SidebarComponent
  ],
  imports: [
    CommonModule,
    PrimeModule,
    // SidebarComponent
  ],
  exports:[
    PrimeModule,
    SidebarComponent
  ],
})
export class ContentModule { }
