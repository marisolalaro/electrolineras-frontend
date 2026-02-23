import { Component, OnInit, OnDestroy } from '@angular/core';
import { ContentModule } from './content.module';
import { NgClass, NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';
//components
import { FooterComponent } from 'src/app/core/layout/footer/footer.component';
import { HeaderComponent } from 'src/app/core/layout/header/header.component';
// services
import { ThemeService } from 'src/app/core/services/theme.service'; // Ajusta la ruta según tu proyecto
// rxjs
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

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
export default class ContentComponent implements OnInit, OnDestroy {
  visibleSidebar: boolean = true;
  isMobile: boolean = false;
  logoUrl: string = '';
  isDarkTheme: boolean = false;
  
  private destroy$ = new Subject<void>();

  constructor(private themeService: ThemeService) {
    this.checkScreenSize();
  }

  ngOnInit() {
    // Escuchar cambios en el tema
    this.themeService.themeChanged$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isDark => {
        this.isDarkTheme = isDark;
        this.actualizarLogo();
      });

    // Obtener estado inicial del tema
    this.isDarkTheme = this.themeService.isDarkThemeEnabled();
    this.actualizarLogo();

    // Detectar cambios en el tamaño de la pantalla
    window.addEventListener('resize', () => {
      this.checkScreenSize();
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    
    // Limpiar event listener
    window.removeEventListener('resize', () => {
      this.checkScreenSize();
    });
  }

  private actualizarLogo() {
    this.logoUrl = this.isDarkTheme 
      ? 'assets/img/logo_claro.png'      // Logo para tema oscuro
      : 'assets/img/logo_obscuro.png';  // Logo para tema claro
  }

  checkScreenSize() {
    this.isMobile = window.innerWidth <= 768;
    // En móvil, el sidebar comienza cerrado
    if (this.isMobile) {
      this.visibleSidebar = false;
    }
  }

  toggleSidebar() {
    console.log("toggleSidebar called");
    this.visibleSidebar = !this.visibleSidebar;
  }

  selectedItemSidebar() {
    console.log("selectedItemSidebar called");
    if (this.isMobile) {
      this.visibleSidebar = !this.visibleSidebar;
    }
  }

  onSidebarHide() {
    console.log("onSidebarHide called");
    this.visibleSidebar = false;
  }

  // Método para cerrar sidebar en móvil al hacer clic en contenido
  onContentClick() {
    console.log("onContentClick called");
    if (this.isMobile && this.visibleSidebar) {
      this.visibleSidebar = false;
    }
  }
}