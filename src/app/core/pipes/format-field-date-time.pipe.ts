import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'formatFieldDateTime',
})
export class FormatFieldDateTimePipe implements PipeTransform {
  transform(value: string, ...args: unknown[]): unknown {
    return moment(value).format('DD/MM/YYYY, HH:mm:ss')
  }
}
