import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormatFieldBooleanPipe } from './format-field-boolean.pipe';
import { FormatFieldDatePipe } from './format-field-date.pipe';
@NgModule({
  declarations: [
    FormatFieldBooleanPipe,
    FormatFieldDatePipe
  ],
  imports: [CommonModule],
  exports: [
    FormatFieldBooleanPipe,
    FormatFieldDatePipe
  ],
})
export class PipesModule {}
