import { Injectable } from '@angular/core';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ExcelService {
  private datosElectrolinera;
  // obtener el mes actual
  private fechaActual = new Date();
  // const mesActual = (fechaActual.getMonth() + 1) ; // Retorna 0-11 (0 = Enero, 11 = Diciembre)
  private mesActual = 2;

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
  constructor(private http: HttpClient) {}

  async processExcelFromAssets(datos): Promise<void> {
    try {
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
      this.updateCompanyName(worksheet, datos);

      // 5. Exportar el archivo modificado
      await this.exportModifiedExcel(workbook, 'Set42_a_Jun25_MOD.xlsx');
    } catch (error) {
      console.error('Error procesando el archivo Excel:', error);
      throw error;
    }
  }

  private async getExcelFromAssets(): Promise<ArrayBuffer> {
    const url = 'assets/file/Set42_a_Jun25.xlsx';
    return this.http.get(url, { responseType: 'arraybuffer' }).toPromise();
  }

  private updateCompanyName(worksheet: ExcelJS.Worksheet, datos: any): void {
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
}
