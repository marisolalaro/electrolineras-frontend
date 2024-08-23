import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberDecimal',
})

export class FormatFieldDecimalesPipe implements PipeTransform {
  transform(value: number, decimals: number = 2): string {    
    return value?.toFixed(decimals);
  }
}
