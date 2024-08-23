import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatHabilitadoDeshabilitado'
})

export class FormatHabilitadoDeshabilitadoPipe implements PipeTransform {

  transform(value: boolean, ...args: unknown[]): unknown {
    return value ? 'Habilitado' : 'Deshabilitado';
  }
}
