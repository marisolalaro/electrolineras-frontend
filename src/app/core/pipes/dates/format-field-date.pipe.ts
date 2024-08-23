import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
const formatDate = 'DD/MM/YYYY';

@Pipe({
  name: 'formatDiaMesAnio',
})
export class FormatDiaMesAnioPipe implements PipeTransform {
  transform(value: string, ...args: unknown[]): unknown {
    return moment(value).format(formatDate);
  }
}
