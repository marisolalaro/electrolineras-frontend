import { Injectable } from '@angular/core';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { HttpClient } from '@angular/common/http';
import { ParTasaCargaService } from '../../par-tasa-carga/service/par-tasa-carga.service';

@Injectable({
  providedIn: 'root',
})
export class ExcelService {
  private datosElectrolinera;
  // obtener el mes actual
  public fechaActual = new Date();
  private mesActual = (this.fechaActual.getMonth()) ; // Retorna 0-11 (0 = Enero, 11 = Diciembre)
  //private mesActual = 0
  private fechaServer;
  private columnasExcel: string[] = [
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
    'AA',
    'AB',
    'AC',
    'AD',
    'AE',
    'AF',
    'AG',
    'AH',
    'AI',
    'AJ',
    'AK',
    'AL',
    'AM',
    'AN',
    'AO',
    'AP',
    'AQ',
    'AR',
    'AS',
    'AT',
    'AU',
    'AV',
    'AW',
    'AX',
    'AY',
    'AZ',
    'BA',
    'BB',
    'BC',
    'BD',
    'BE',
    'BF',
    'BG',
    'BH',
    'BI',
    'BJ',
    'BK',
    'BL',
    'BM',
    'BN',
    'BO',
    'BP',
    'BQ',
    'BR',
    'BS',
    'BT',
    'BU',
    'BV',
    'BW',
    'BX',
    'BY',
    'BZ',
    'CA',
    'CB',
    'CC',
    'CD',
    'CE',
    'CF',
    'CG',
    'CH',
    'CI',
    'CJ',
    'CK',
    'CL',
    'CM',
    'CN',
    'CO',
    'CP',
    'CQ',
    'CR',
    'CS',
    'CT',
    'CU',
    'CV',
    'CW',
    'CX',
    'CY',
    'CZ',
    'DA',
    'DB',
    'DC',
    'DD',
    'DE',
    'DF',
    'DG',
    'DH',
    'DI',
  ];
  constructor(private http: HttpClient,
    private tasaCargaService: ParTasaCargaService
  ) {
    this.getFullDate()
  }

  // TODO HACER LA PRUEVA Y VER SI LA HOJA DEL EXCEL CAMBIA CON EL ANIO
  async processExcelFromAssets(datos): Promise<void> {
    try {
      var fechaServer = new Date(this.fechaServer);
      var fechaServerSinModificar = new Date(this.fechaServer);
      var anio = fechaServer.getFullYear();
      
      this.datosElectrolinera = JSON.parse(JSON.stringify(datos));

      // 1. Obtener el archivo desde assets
      const arrayBuffer = await this.getExcelFromAssets();

      // 2. Cargar el workbook
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(arrayBuffer);

      // 3. Obtener la hoja (ajusta el nombre según tu archivo)
      const worksheet =
        workbook.getWorksheet('2025_42SET') || workbook.worksheets[0];

      // 4. Modificar los datos necesarios
      this.updateCompanyName(worksheet, datos, fechaServerSinModificar);
      
      fechaServer.setMonth(fechaServer.getMonth() - 1)
      var mesShort = fechaServer.toLocaleString('es', { month: 'short' });

      // 5. Exportar el archivo modificado
      await this.exportModifiedExcel(workbook, 'Set42_a_' + mesShort + anio+'.xlsx');

    } catch (error) {
      console.error('Error procesando el archivo Excel:', error);
      throw error;
    }
  }

  private async getExcelFromAssets(): Promise<ArrayBuffer> {
    const url = 'assets/file/Set42_a_Jun25.xlsx';
    return this.http.get(url, { responseType: 'arraybuffer' }).toPromise();
  }

  private updateCompanyName(worksheet: ExcelJS.Worksheet, datos: any, fechaServer: any): void {
    const celdaGestion = worksheet.getCell('E7');
    celdaGestion.value = fechaServer.getFullYear();
    
    if(fechaServer.getMonth() == 0) {
      this.mesActual = 12
      celdaGestion.value = fechaServer.getFullYear() -1 ;
      var anioAnterior = fechaServer.getFullYear() -1;
      // TODO
      worksheet.name = anioAnterior + '_42SET'
    } else {
      worksheet.name = fechaServer.getFullYear() + '' + '_42SET'
    }
    var count = 0;
    for (let i: number = 0; i < 9 * this.mesActual; i++) {
      for (let j = 25; j < 28; j++) {
        const filaColumna = this.columnasExcel[i] + j;
        const celda = worksheet.getCell(filaColumna);
        celda.value = datos[count];
        count = count + 1;
      }
      const element = this.columnasExcel[i];
    }
  }

  private async exportModifiedExcel(
    workbook: ExcelJS.Workbook,
    fileName: string
  ): Promise<void> {
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(blob, fileName);
  }

  private getFullDate() {
    this.tasaCargaService.getCurrentDate().subscribe(
      (resp: any) => {
        this.fechaServer = resp.data;
        //this.fechaServer = '2025-01-20T16:17:52.000-04:00';
      }
    )
  }
}
