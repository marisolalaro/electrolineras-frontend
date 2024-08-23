import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

// servicio para cambiar de color a todo el sistema
export class ColorServiceService {

  constructor() { }

  updateColors(primaryColor: string) {
    const root = document.documentElement;

    // Set the primary color
    root.style.setProperty('--primary-color', primaryColor);

    // Convert hex to RGB
    const rgb = this.hexToRgb(primaryColor);

    // Calculate new values based on the primary color
    const darkColor = this.shadeColor(rgb, -40); // Darken by 40%
    const highlightColor = this.shadeColor(rgb, -20); // Darken by 20%
    const focusColor = this.shadeColor(rgb, 50); // Lighten by 50%
    const claroColor = this.shadeColor(rgb, -10); // Darken by 10%
    const primary60 = this.rgbToHex(this.shadeColor(rgb, -40)) + '99'; // Darken by 40% and add 60% opacity
    const transparent1 = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.24)`;
    const transparent2 = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.16)`;
    const transparent3 = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.04)`;

    // Set the new color values
    root.style.setProperty('--dark-primary-color', this.rgbToHex(darkColor));
    root.style.setProperty('--highlight-text-color', this.rgbToHex(highlightColor));
    root.style.setProperty('--color-focus', this.rgbToHex(focusColor));
    root.style.setProperty('--color-claro', this.rgbToHex(claroColor));
    root.style.setProperty('--primary-color-60', primary60);
    root.style.setProperty('--primary-transparent-1', transparent1);
    root.style.setProperty('--primary-transparent-2', transparent2);
    root.style.setProperty('--primary-transparent-3', transparent3);
  }

  private hexToRgb(hex: string) {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
  }

  private shadeColor(color: { r: number, g: number, b: number }, percent: number) {
    const t = percent < 0 ? 0 : 255;
    const p = percent < 0 ? percent * -1 : percent;
    const R = Math.round((t - color.r) * p / 100) + color.r;
    const G = Math.round((t - color.g) * p / 100) + color.g;
    const B = Math.round((t - color.b) * p / 100) + color.b;
    return { r: R, g: G, b: B };
  }

  private rgbToHex(color: { r: number, g: number, b: number }) {
    const r = color.r.toString(16).padStart(2, '0');
    const g = color.g.toString(16).padStart(2, '0');
    const b = color.b.toString(16).padStart(2, '0');
    return `#${r}${g}${b}`;
  }
  
}
