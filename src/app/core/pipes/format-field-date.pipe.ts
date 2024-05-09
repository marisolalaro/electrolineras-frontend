import { environment } from 'src/app/core/environments/environment.development';
import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
const formatDate = 'DD/MM/YYYY';

@Pipe({
  name: 'formatFieldDate',
})
export class FormatFieldDatePipe implements PipeTransform {
  transform(value: string, ...args: unknown[]): unknown {
    return moment(value).format(environment.formatDate);
  }
}
