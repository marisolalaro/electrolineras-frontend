import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mapeaModoCarga',
})
export class MapeoModoCargaPipe implements PipeTransform {
  transform(value: string): string {

    if (value == 'CARGA LENTA, ULTRA LENTA, Ba') {
      return 'CARGA LENTA, ULTRA LENTA, Bloque alto';
    }
    if (value == 'CARGA LENTA, ULTRA LENTA, Bm') {
      return 'CARGA LENTA, ULTRA LENTA, Bloque medio';
    }
    if (value == 'CARGA SEMI RAPIDA, Ba') {
      return 'CARGA SEMI RAPIDA, Bloque alto';
    }
    if (value == 'CARGA SEMI RAPIDA, Bm') {
      return 'CARGA SEMI RAPIDA, Bloque medio';
    }
    if (value == 'CARGA SEMI RAPIDA, Bb') {
      return 'CARGA SEMI RAPIDA, Bloque bajo';
    }
    if (value == 'CARGA LENTA, ULTRA LENTA, Bb') {
      return 'CARGA LENTA, ULTRA LENTA, Bloque bajo';
    }
  }
}
