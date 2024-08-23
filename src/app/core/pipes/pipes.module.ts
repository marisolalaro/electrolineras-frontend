import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// dates
import { FormatDiaMesAnioPipe } from './dates/format-field-date.pipe';
import { FormatHoraMinutoSegundoPipe } from './dates/format-field-time.pipe';
import { FormatSegundosEnHoraMinutoSegundoPipe } from './dates/format-field-time-carga';
import { FormatDateAndTimePipe } from './dates/format-field-date-time.pipe';
// strings
import { TruncatePipe } from './strings/truncate.pipe';
import { FormatOnlineOfflinePipe } from './strings/format-online-offline.pipe';
// numbers
import { FormatFieldDecimalesPipe } from './numbers/format-field-decimales';
import { FormatPagadoNoPagadoPipe } from './numbers/format-pagado-no-pagado.pipe';
// booleans
import { FormatSiNoPipe } from './booleans/format-si-no.pipe';
import { FormatHabilitadoDeshabilitadoPipe } from './booleans/format-habilitado-deshabilitado.pipe';

@NgModule({
  declarations: [
    // dates
    FormatDiaMesAnioPipe,
    FormatDateAndTimePipe,
    FormatHoraMinutoSegundoPipe,
    FormatSegundosEnHoraMinutoSegundoPipe,
    // strings
    TruncatePipe,
    FormatOnlineOfflinePipe,
    // numbers
    FormatFieldDecimalesPipe,
    FormatPagadoNoPagadoPipe,
    // booleans
    FormatSiNoPipe,
    FormatHabilitadoDeshabilitadoPipe,
  ],
  exports: [
    // dates
    FormatDiaMesAnioPipe,
    FormatDateAndTimePipe,
    FormatHoraMinutoSegundoPipe,
    FormatSegundosEnHoraMinutoSegundoPipe,
    // strings
    TruncatePipe,
    FormatOnlineOfflinePipe,
    // numbers
    FormatFieldDecimalesPipe,
    FormatPagadoNoPagadoPipe,
    // booleans
    FormatSiNoPipe,
    FormatHabilitadoDeshabilitadoPipe,
  ],
  imports: [CommonModule],
})
export class PipesModule { }
