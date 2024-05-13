import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormatFieldBooleanPipe } from './format-field-boolean.pipe';
import { FormatFieldDatePipe } from './format-field-date.pipe';
import { FormatFieldTimePipe } from './format-field-time.pipe';
@NgModule({
  declarations: [
    FormatFieldBooleanPipe,
    FormatFieldDatePipe,
    FormatFieldTimePipe
  ],
  imports: [CommonModule],
  exports: [
    FormatFieldBooleanPipe,
    FormatFieldDatePipe,
    FormatFieldTimePipe
  ],
})
export class PipesModule {}
