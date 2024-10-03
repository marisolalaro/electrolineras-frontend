import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NotFoundModule } from './not-found.module';

@Component({
  standalone: true,
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss'],
  imports: [
    NotFoundModule
  ]
})
export class NotFoundComponent {

  @Input() mensajeNotFound: any;
  @Output() datosEnviados: EventEmitter<string> = new EventEmitter<string>();

  constructor(
  ) { }

  ngOnInit() {

  }

  recargar() {
    this.datosEnviados.emit();
  }
}
