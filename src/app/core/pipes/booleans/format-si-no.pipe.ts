import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatSiNo'
})

export class FormatSiNoPipe implements PipeTransform {

  transform(value: boolean, ...args: unknown[]): unknown {
    return value ? 'Si' : 'No';
  }
}
