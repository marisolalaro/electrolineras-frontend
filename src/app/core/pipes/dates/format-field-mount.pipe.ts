import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatMesPipe',
})
export class FormatMesPipe implements PipeTransform {
  private meses: string[] = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  transform(value: string | number): string {
    if (!value) return '';
    const index = Number(value) - 1; // porque el array empieza en 0
    return this.meses[index] ?? '';
  }
}
