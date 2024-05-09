import { Component } from '@angular/core';
import { ContentModule } from './content.module';
import { RouterModule } from '@angular/router';
import { FooterComponent } from 'src/app/core/layout/footer/footer.component';
import { HeaderComponent } from 'src/app/core/layout/header/header.component';

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [ContentModule, RouterModule, FooterComponent, HeaderComponent],
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export default class ContentComponent {

}
