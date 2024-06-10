import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PrimeModule } from 'src/app/prime.module';
import { MenuItem } from 'primeng/api';
import { mainTitles } from '../../constants/labels';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [CommonModule, RouterModule, PrimeModule],
  standalone: true,
})
export class HeaderComponent implements OnInit {

  // variables del menu Lateral
  public sidebarVisible: boolean = false;
  public itemsLateral: MenuItem[] | undefined;
  
  // variables del menu horizontal
  public items: MenuItem[] | undefined;
  public activeItem: MenuItem | undefined;
 
  constructor(private router: Router) { }

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
    ];
    this.itemsLateral = [
      {
        label: mainTitles['electrolineras'].mainTitle,
        icon: 'pi pi-fw pi-bolt',
        routerLink: ['/administration/electric-stations'],
      },
      {
        label: mainTitles['transacciones'].mainTitle,
        icon: 'pi pi-fw pi-money-bill',
        routerLink: ['/administration/transactions'],
      },
      {
        label: mainTitles['facturas'].mainTitle,
        icon: 'pi pi-fw pi-file',
        routerLink: ['/administration/invoices'],
      },
    ]
    this.activeItem = this.items[0];
  }

  onActiveItemChange(event: MenuItem) {
    this.activeItem = event;
  }

  salir() {
    var c = confirm("¿Salir del sitio web?");
    if (c == true) {
      localStorage.removeItem('token');
      this.router.navigate(['']);
    }
  }
}

