import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatPagadoNoPagado'
})
export class FormatPagadoNoPagadoPipe implements PipeTransform {

  transform(value: any, ...args: unknown[]): unknown {
    if (value == 1) {
      return 'Pagado';
    } else {
      return 'No Pagado';
    }
  }
}
