import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatOnlineOffline'
})

export class FormatOnlineOfflinePipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): unknown {
    return value == 'ONLINE' ? 'En línea' : 'Fuera de línea';
  }
}
