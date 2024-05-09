import { Component, ViewEncapsulation } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PrimeModule } from 'src/app/prime.module';
import { MegaMenuItem } from 'primeng/api';
import { MenuItem } from 'primeng/api';
import { mainTitles } from '../../constants/labels';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [CommonModule, RouterModule, PrimeModule],
  standalone: true,
})
export class HeaderComponent {
  constructor(private router: Router) {}
  items: any;

    ngOnInit() {
        this.items = [
          {
            label: mainTitles['clientes'].mainTitle,
            icon: 'pi pi-fw pi-file',
            routerLink: ['/epagos-egsa/customers'],
          },
          {
            label: mainTitles['usuarios'].mainTitle,
            icon: 'pi pi-fw pi-file',
            routerLink: ['/epagos-egsa/users'],
          },
          {
            label: mainTitles['electrolineras'].mainTitle,
            icon: 'pi pi-fw pi-file',
            routerLink: ['/epagos-egsa/electric-stations'],
          },
          // {
          //   label: 'Productos',
          //   icon: 'pi pi-fw pi-file',
          //   routerLink: ['/products'],
          // },
        ];
    }
}

