import { Component } from '@angular/core';
import { ContentModule } from './content.module';
import { RouterModule } from '@angular/router';
import { FooterComponent } from 'src/app/core/layout/footer/footer.component';
import { HeaderComponent } from 'src/app/core/layout/header/header.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-content',
  standalone: true,
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss'],
  imports: [ContentModule, RouterModule, FooterComponent, HeaderComponent, NgIf],
})
export default class ContentComponent {

  public isMenu: boolean = true;
  constructor() {
  }

  onClickMenu(event) {
    this.isMenu = !this.isMenu;
  }
}
