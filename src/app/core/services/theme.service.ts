import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private darkThemeLink = document.createElement('link');

  constructor() {
    this.darkThemeLink.rel = 'stylesheet';
    this.darkThemeLink.href = 'assets/layout/styles/theme/custom/theme-dark.css'; // este funciona como dark
    const savedTheme = localStorage.getItem('theme');
    if(savedTheme) {
      if (savedTheme == 'dark') {
          this.enableDarkTheme();
        } else {
        }
    }
  }

  enableDarkTheme() {
    document.head.appendChild(this.darkThemeLink);
    localStorage.setItem('theme', 'dark');
  }

  disableDarkTheme() {
    document.head.removeChild(this.darkThemeLink);
    localStorage.setItem('theme', 'light');
  }

  isDarkThemeEnabled(): boolean {
    return document.head.contains(this.darkThemeLink);
  }
}
