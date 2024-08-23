import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatSegundosEnHoraMinutoSegundo',
})

// de segundos a HH:mm:ss en string
export class FormatSegundosEnHoraMinutoSegundoPipe implements PipeTransform {

  transform(value: number): string {
    const hours = Math.floor(value / 3600);
    const minutes = Math.floor((value % 3600) / 60);
    const seconds = value % 60;

    const hoursStr = hours > 0 ? `${hours}` : '00';
    const minutesStr = minutes > 0 ? `${minutes}` : '00';
    const secondsStr = seconds > 0 ?`${seconds}`: '00';

    return `${hoursStr}:${minutesStr}:${secondsStr}`;
  }

}
