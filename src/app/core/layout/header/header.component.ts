import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PrimeModule } from 'src/app/prime.module';
import { MenuItem } from 'primeng/api';
import { mainTitles } from '../../constants/labels';
import { rutas } from '../../constants/rutas';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [CommonModule, RouterModule, PrimeModule],
  standalone: true,
})
export class HeaderComponent implements OnInit {

  // variables del menu horizontal
  public items: MenuItem[] | undefined;
  public activeItem: MenuItem | undefined;
  // public activeItemLateral: MenuItem | undefined;

  public menu: boolean = true;
  // @Output() newItemEvent = new EventEmitter<any>();
  @Output() toggleSidebar = new EventEmitter<void>();

  constructor(private router: Router) { }

  onToggleSidebar() {
    this.toggleSidebar.emit();
  }

  ngOnInit() {
    this.items = [
      {
        label: mainTitles['administradores'].mainTitle,
        icon: 'pi pi-fw pi-user',
        routerLink: ['/' + rutas.rutaPrincipal + '/' + rutas.rutaAdministradores],
      },
      {
        label: mainTitles['clientes'].mainTitle,
        icon: 'pi pi-fw pi-users',
        routerLink: ['/' + rutas.rutaPrincipal + '/' + rutas.rutaClientes],
      },
    ];
    this.activeItem = this.items[0];
    // this.activeItemLateral = this.items[0];
  }

  onActiveItemChange(event: MenuItem) {
    this.activeItem = event;
  }

  // activeMenu(event) {
  //   this.activeItemLateral = event;
  // }

  salir() {
    var c = confirm("¿Salir del sitio web?");
    if (c == true) {
      localStorage.removeItem('token');
      this.router.navigate(['']);
    }
  }

  onClickMenu() {
    // this.newItemEvent.emit(this.menu);
  }
}

