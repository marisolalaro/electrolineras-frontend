import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private darkThemeLink = document.createElement('link');
  private themeChanged = new Subject<boolean>();
  themeChanged$ = this.themeChanged.asObservable();

  constructor() {
    this.darkThemeLink.rel = 'stylesheet';
    this.darkThemeLink.href = 'assets/layout/styles/theme/custom/theme-dark.css'; // este funciona como dark
    const savedTheme = localStorage.getItem('theme');
    if(savedTheme) {
      if (savedTheme == 'dark') {
          this.enableDarkTheme();
        } else {
          this.disableDarkTheme();
        }
    }
  }

  enableDarkTheme() {
    // Solo agregar si no está ya presente
    if (!this.isDarkThemeEnabled()) {
      document.head.appendChild(this.darkThemeLink);
    }
    localStorage.setItem('theme', 'dark');
    this.themeChanged.next(true); // Notificar que se activó tema oscuro
  }

  disableDarkTheme() {
    // Solo remover si está presente
    if (this.isDarkThemeEnabled()) {
      document.head.removeChild(this.darkThemeLink);
    }
    localStorage.setItem('theme', 'light');
    this.themeChanged.next(false); // Notificar que se desactivó tema oscuro
  }

  isDarkThemeEnabled(): boolean {
    return document.head.contains(this.darkThemeLink);
  }
}