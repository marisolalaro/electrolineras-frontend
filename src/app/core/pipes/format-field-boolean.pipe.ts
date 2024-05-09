import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatFieldBoolean'
})
export class FormatFieldBooleanPipe implements PipeTransform {

  transform(value: boolean, ...args: unknown[]): unknown {
    return value === true ? 'SI' : 'NO';
  }
}
