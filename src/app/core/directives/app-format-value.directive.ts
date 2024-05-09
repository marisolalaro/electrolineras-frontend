import { Directive, Input, ElementRef, Renderer2, HostBinding, OnInit } from '@angular/core';
import { isDateDBFormatValid, toDMYdateFormat } from '../utils/dateFormats';

@Directive({
  selector: '[appFormatValue]',
  standalone: true,
})
export class AppFormatValueDirective implements OnInit{

    @Input('appFormatValue') value: Date | string | number;
    @Input('appFormatvalueType') valueType: any;
    @HostBinding('textContent') textContent: string;


    constructor(private el: ElementRef, private renderer: Renderer2) {}

    ngOnInit() {
        switch(this.valueType) {
            case 'boolean':
                this.textContent = this.value ? 'SI' : 'NO';
                break;
            case 'object':
                this.textContent = toDMYdateFormat(this.value.toString());
                break;
            case 'string':
                this.textContent = isDateDBFormatValid(this.value.toString())?
                                    toDMYdateFormat(this.value.toString()) :
                                    this.value.toString();
                break;
            default:
                this.textContent = this.value.toString();
          }
    }
}