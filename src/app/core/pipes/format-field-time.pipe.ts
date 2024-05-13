import { environment } from 'src/app/core/environments/environment.development';
import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
const formatDate = 'HH:mm:ss';

@Pipe({
  name: 'formatFieldTime',
})
export class FormatFieldTimePipe implements PipeTransform {
  transform(value: string, ...args: unknown[]): unknown {
    return moment(value).format(formatDate);
  }
}
