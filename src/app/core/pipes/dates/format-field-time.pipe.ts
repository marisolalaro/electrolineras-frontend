import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
const formatDate = 'HH:mm:ss';

@Pipe({
  name: 'formatHoraMinutoSegundo',
})
export class FormatHoraMinutoSegundoPipe implements PipeTransform {
  transform(value: string, ...args: unknown[]): unknown {
    return moment(value).format(formatDate);
  }
}
