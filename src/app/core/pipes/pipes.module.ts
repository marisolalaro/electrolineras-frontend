import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormatFieldBooleanPipe } from './format-field-boolean.pipe';
import { FormatFieldDatePipe } from './format-field-date.pipe';
import { FormatFieldTimePipe } from './format-field-time.pipe';
import { FormatFieldDecimalesPipe } from './format-field-decimales';
import { FormatFieldTimeCargaPipe } from './format-field-time-carga';
import { TruncatePipe } from './truncate.pipe';
import { FormatFieldDateTimePipe } from './format-field-date-time.pipe';

@NgModule({
  declarations: [
    FormatFieldBooleanPipe,
    FormatFieldDatePipe,
    FormatFieldTimePipe,
    FormatFieldDecimalesPipe,
    FormatFieldTimeCargaPipe,
    TruncatePipe,
    FormatFieldDateTimePipe
  ],
  imports: [CommonModule],
  exports: [
    FormatFieldBooleanPipe,
    FormatFieldDatePipe,
    FormatFieldTimePipe,
    FormatFieldDecimalesPipe,
    FormatFieldTimeCargaPipe,
    FormatFieldDateTimePipe,
    TruncatePipe,
  ],
})
export class PipesModule {}
