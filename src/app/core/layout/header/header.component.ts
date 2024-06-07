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
  constructor(private router: Router) { }
  items: any;

  ngOnInit() {
    this.items = [
      {
        label: mainTitles['administradores'].mainTitle,
        icon: 'pi pi-fw pi-user',
        routerLink: ['/administration/administrators'],
      },
      {
        label: mainTitles['clientes'].mainTitle,
        icon: 'pi pi-fw pi-users',
        routerLink: ['/administration/customers'],
      },
      {
        label: mainTitles['electrolineras'].mainTitle,
        icon: 'pi pi-fw pi-bolt',
        routerLink: ['/administration/electric-stations'],
      },
      // {
      //   label: 'Productos',
      //   icon: 'pi pi-fw pi-file',
      //   routerLink: ['/products'],
      // },
    ];
  }

  salir() {
    var c = confirm("¿Salir del sitio web?");
    if (c == true) {
     localStorage.removeItem('token');
      this.router.navigate(['']);
    }
  }
}

