import { Component } from '@angular/core';
import { ContentModule } from './content.module';
import { NgClass, NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';
//components
import { FooterComponent } from 'src/app/core/layout/footer/footer.component';
import { HeaderComponent } from 'src/app/core/layout/header/header.component';

@Component({
  selector: 'app-content',
  standalone: true,
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss'],
  imports: [
    ContentModule, 
    RouterModule, 
    FooterComponent, 
    HeaderComponent, 
    NgIf, 
    NgClass
  ],
})
export default class ContentComponent {

  constructor() {
  }

  visibleSidebar: boolean = false;

  toggleSidebar() {
    this.visibleSidebar = !this.visibleSidebar;
  }

  onSidebarHide() {
    this.visibleSidebar = false;
  }
}
