// excel.service.ts
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { reports } from 'src/app/core/constants/labels';
import { SegundosEnHoras } from 'src/app/core/utils/convertSegundosHoras';

@Injectable({
  providedIn: 'root'
})
export class CrearExcelService {

  constructor(
  ) { }

  // 1er Reporte Facturas compra - venta
  public excelFacturasCargaCredito(jsonData: any[], fileName: string, nombreHoja: string, rangoFechas): void {
    // Creacion del Libro
    const workbook = new ExcelJS.Workbook();
    // Agregando hoja de trabajo
    const worksheet = workbook.addWorksheet(nombreHoja);

    worksheet.addRow('');
    worksheet.addRow('');
    worksheet.addRow('');
    worksheet.addRow('');
    worksheet.addRow('');

    // Agregar encabezados de las filas
    const rowValues = [];
    rowValues[1] = 'Nombre/Razón Social';
    rowValues[2] = 'Nit/Ci';
    rowValues[3] = 'Cuf';
    rowValues[4] = 'Monto Bs';
    rowValues[5] = 'Fecha de Emisión';
    rowValues[6] = 'Tipo de Factura';
    rowValues[7] = 'Url Factura Siat';

    worksheet.addRow(rowValues);

    worksheet.getCell('A6').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('B6').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('C6').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('D6').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('E6').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('F6').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('G6').alignment = { vertical: 'middle', horizontal: 'center' };

    // Agregar datos del json
    jsonData.forEach((data: any) => {
      worksheet.addRow([
        data.razonSocial,
        data.nitCi,
        data.cuf,
        data.amount,
        data.fechaEmision ? moment(data.fechaEmision).format('DD/MM/YYYY, HH:mm:ss') : '',
        data.tipoFactura,
        data.urlFacturaSiat,
      ]);
    });

    // Ajustar el ancho de las columnas según el contenido
    worksheet.columns.forEach((column) => {
      let maxLength = 0;
      column.eachCell({ includeEmpty: true }, (cell) => {
        const cellValue = cell.value as string;
        if (cellValue) {
          const columnLength = cellValue.toString().length;
          if (columnLength > maxLength) {
            maxLength = columnLength;
          }
        }
      });
      column.width = maxLength < 10 ? 10 + 10 : maxLength; // Ajusta el ancho mínimo si es necesario
    });

    // poniendo titulo
    worksheet.getCell('C2').value = reports.tituloReporte1;
    worksheet.getCell('C2').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFFFF' },
      bgColor: { argb: 'afe' }
    };
    // poniendo subtitulo
    worksheet.getCell('C3').value = `DEL "${rangoFechas.initialDate}" AL "${rangoFechas.finalDate}"`;
    worksheet.getCell('C3').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFFFF' },
      bgColor: { argb: 'afe' }
    };


    worksheet.getCell('C2').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
    worksheet.getCell('C3').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

    // poniendo estilos a los titulos y subtitulos
    worksheet.mergeCells('C2:F2');
    worksheet.mergeCells('C3:F3');
    worksheet.getCell('C2').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('C3').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('C2').font = { bold: true, color: { argb: '000000' }, };
    worksheet.getCell('C3').font = { bold: true, color: { argb: '000000' }, };

    // poniendo bordes a las cabeceras
    for (let i = 6; i < jsonData.length + 7; i++) {
      const element = jsonData[i];
      worksheet.getCell(`A${i}`).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      worksheet.getCell(`B${i}`).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      worksheet.getCell(`C${i}`).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      worksheet.getCell(`D${i}`).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      worksheet.getCell(`E${i}`).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      worksheet.getCell(`F${i}`).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      worksheet.getCell(`G${i}`).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    }

    // estilo fondo azul a las cabeceras
    worksheet.getCell('A6').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '2C518F' } };
    worksheet.getCell('B6').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '2C518F' } };
    worksheet.getCell('C6').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '2C518F' } };
    worksheet.getCell('D6').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '2C518F' } };
    worksheet.getCell('E6').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '2C518F' } };
    worksheet.getCell('F6').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '2C518F' } };
    worksheet.getCell('G6').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '2C518F' } };

    // estilo letras blancas a las cabeceras
    worksheet.getCell('A6').font = { bold: true, color: { argb: 'FFFFFF' } };
    worksheet.getCell('B6').font = { bold: true, color: { argb: 'FFFFFF' } };
    worksheet.getCell('C6').font = { bold: true, color: { argb: 'FFFFFF' } };
    worksheet.getCell('D6').font = { bold: true, color: { argb: 'FFFFFF' } };
    worksheet.getCell('E6').font = { bold: true, color: { argb: 'FFFFFF' } };
    worksheet.getCell('F6').font = { bold: true, color: { argb: 'FFFFFF' } };
    worksheet.getCell('G6').font = { bold: true, color: { argb: 'FFFFFF' } };

    // Guardar el archivo
    workbook.xlsx.writeBuffer().then((data: BlobPart) => {
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, `${fileName}.xlsx`);
    });
  }

  // 2do Reporte Pagos de Crédito
  public excelCargasEnergias(jsonData: any[], fileName: string, nombreHoja: string, rangoFechas): void {
    // Creacion del Libro
    const workbook = new ExcelJS.Workbook();
    // Agregando hoja de trabajo
    const worksheet = workbook.addWorksheet(nombreHoja);
    worksheet.addRow('');
    worksheet.addRow('');
    worksheet.addRow('');
    worksheet.addRow('');
    worksheet.addRow('');

    // Agregar encabezados de las filas
    const rowValues = [];
    rowValues[1] = 'Nombre/Razón Social';
    rowValues[2] = 'Número de Documento';
    rowValues[3] = 'Banco';
    rowValues[4] = 'Monto Bs';
    rowValues[5] = 'Fecha de Carga';
    rowValues[6] = 'Hora de Carga';
    rowValues[7] = 'Cuf';

    worksheet.addRow(rowValues);

    worksheet.getCell('A6').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('B6').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('C6').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('D6').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('E6').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('F6').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('G6').alignment = { vertical: 'middle', horizontal: 'center' };

    // Agregar datos del json
    jsonData.forEach((data: any) => {
      worksheet.addRow([
        data.razonSocial,
        data.numeroDocumento,
        data.bank,
        data.monto,
        data.fechaCarga,
        data.horaCarga,
        data.cuf
      ]);
    });

    // Ajustar el ancho de las columnas según el contenido
    worksheet.columns.forEach((column) => {
      let maxLength = 0;
      column.eachCell({ includeEmpty: true }, (cell) => {
        const cellValue = cell.value as string;
        if (cellValue) {
          const columnLength = cellValue.toString().length;
          if (columnLength > maxLength) {
            maxLength = columnLength;
          }
        }
      });
      column.width = maxLength < 10 ? 20 : maxLength + 5; // Ajusta el ancho mínimo si es necesario
    });

    // poniendo titulo
    worksheet.getCell('C2').value = reports.tituloReporte2;
    worksheet.getCell('C2').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFFFF' },
      bgColor: { argb: 'afe' }
    };
    // poniendo subtitulo
    worksheet.getCell('C3').value = `DEL "${rangoFechas.initialDate}" AL "${rangoFechas.finalDate}"`;
    worksheet.getCell('C3').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFFFF' },
      bgColor: { argb: 'afe' }
    };

    // poniendo bordes a las cabeceras
    for (let i = 6; i < jsonData.length + 7; i++) {
      const element = jsonData[i];
      worksheet.getCell(`A${i}`).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      worksheet.getCell(`B${i}`).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      worksheet.getCell(`C${i}`).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      worksheet.getCell(`D${i}`).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      worksheet.getCell(`E${i}`).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      worksheet.getCell(`F${i}`).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      worksheet.getCell(`G${i}`).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    }

    // poniendo estilos a los titulos y subtitulos
    worksheet.mergeCells('C2:F2');
    worksheet.mergeCells('C3:F3');
    worksheet.getCell('C2').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('C3').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('C2').font = { bold: true, color: { argb: '000000' }, };
    worksheet.getCell('C3').font = { bold: true, color: { argb: '000000' }, };
    worksheet.getCell('C2').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
    worksheet.getCell('C3').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

    // estilo fondo azul a las cabeceras
    worksheet.getCell('A6').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '2C518F' } };
    worksheet.getCell('B6').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '2C518F' } };
    worksheet.getCell('C6').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '2C518F' } };
    worksheet.getCell('D6').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '2C518F' } };
    worksheet.getCell('E6').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '2C518F' } };
    worksheet.getCell('F6').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '2C518F' } };
    worksheet.getCell('G6').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '2C518F' } };

    // estilo letras blancas a las cabeceras
    worksheet.getCell('A6').font = { bold: true, color: { argb: 'FFFFFF' } };
    worksheet.getCell('B6').font = { bold: true, color: { argb: 'FFFFFF' } };
    worksheet.getCell('C6').font = { bold: true, color: { argb: 'FFFFFF' } };
    worksheet.getCell('D6').font = { bold: true, color: { argb: 'FFFFFF' } };
    worksheet.getCell('E6').font = { bold: true, color: { argb: 'FFFFFF' } };
    worksheet.getCell('F6').font = { bold: true, color: { argb: 'FFFFFF' } };
    worksheet.getCell('G6').font = { bold: true, color: { argb: 'FFFFFF' } };

    // Guardar el archivo
    workbook.xlsx.writeBuffer().then((data: BlobPart) => {
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, `${fileName}.xlsx`);
    });
  }

  // 3er Reporte Facturas Relacionadas
  public excelFacturasRelacionadas(jsonData: any[], fileName: string, nombreHoja: string, rangoFechas): void {

    // Creacion del Libro
    const workbook = new ExcelJS.Workbook();
    // Agregando hoja de trabajo
    const worksheet = workbook.addWorksheet(nombreHoja);

    // titulos
    worksheet.addRow('');
    worksheet.addRow('');
    worksheet.addRow('');
    worksheet.addRow('');
    worksheet.addRow('');

    // Agregar encabezados de las filas
    const rowValues = [];
    rowValues[1] = 'Código Recepción';
    rowValues[2] = 'Fecha Emisión';
    rowValues[3] = 'Cuf';
    rowValues[4] = 'Tipo de Pago';
    rowValues[5] = 'Código Recepción';
    rowValues[6] = 'Cuf';
    rowValues[7] = 'Tipo de Pago';
    rowValues[8] = 'Fecha Registro';
    rowValues[9] = 'Url Factura Siat';

    worksheet.addRow(rowValues);

    worksheet.getCell('A6').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('B6').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('C6').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('D6').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('E6').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('F6').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('G6').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('H6').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('I6').alignment = { vertical: 'middle', horizontal: 'center' };

    // Agregar datos del json

    jsonData.forEach((data: any) => {
      var row = worksheet.addRow([
        data.codigoDescripcion,
        moment(data.fechaRegistro).format('DD/MM/YYYY, HH:mm:ss'),
        data.cuf,
        data.paymentTransactionType,

      ]);
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
      if (data.invoicesPaymentTrasantionsResponseDtoList.length > 0) {
        const key = data.invoicesPaymentTrasantionsResponseDtoList[0];
        row.getCell(row.actualCellCount + 1).value = key.codigoDescripcion
        row.getCell(row.actualCellCount + 1).value = key.cuf
        row.getCell(row.actualCellCount + 1).value = key.paymentTransactionType
        row.getCell(row.actualCellCount + 1).value = moment(key.fechaRegistro).format('DD/MM/YYYY, HH:mm:ss')
        row.getCell(row.actualCellCount + 1).value = key.urlFacturaSiat
        row.eachCell((cell) => {
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };
        });
        if (data.invoicesPaymentTrasantionsResponseDtoList.length > 1) {
          for (let i = 1; i < data.invoicesPaymentTrasantionsResponseDtoList.length; i++) {
            var key1 = data.invoicesPaymentTrasantionsResponseDtoList[i];
            const row = worksheet.addRow([
              '',
              '',
              '',
              '',
              key1.codigoDescripcion,
              key1.cuf,
              key1.paymentTransactionType,
              moment(key1.fechaRegistro).format('DD/MM/YYYY, HH:mm:ss'),
              key1.urlFacturaSiat
            ]);
            row.eachCell((cell) => {
              cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
              };
            });
          }
        }
      }
      else {
        row.getCell(row.actualCellCount + 1).value = ''
        row.getCell(row.actualCellCount + 1).value = ''
        row.getCell(row.actualCellCount + 1).value = ''
        row.getCell(row.actualCellCount + 1).value = ''
        row.getCell(row.actualCellCount + 1).value = ''

        row.eachCell((cell) => {
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };
        });
      }

    });

    // Ajustar el ancho de las columnas según el contenido
    worksheet.columns.forEach((column) => {
      let maxLength = 0;
      column.eachCell({ includeEmpty: true }, (cell) => {
        const cellValue = cell.value as string;
        if (cellValue) {
          const columnLength = cellValue.toString().length;
          if (columnLength > maxLength) {
            maxLength = columnLength;
          }
        }
      });
      column.width = maxLength < 10 ? 10 + 10 : maxLength; // Ajusta el ancho mínimo si es necesario
    });

    // poniendo titulo
    worksheet.getCell('C2').value = reports.tituloReporte3;
    worksheet.getCell('C2').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFFFF' },
    };
    // poniendo subtitulo
    worksheet.getCell('C3').value = `DEL "${rangoFechas.initialDate}" AL "${rangoFechas.finalDate}"`;
    worksheet.getCell('C3').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFFFF' },
    };


    // poniendo bordes a las cabeceras
    for (let i = 6; i < jsonData.length + 7; i++) {
      const element = jsonData[i];
      worksheet.getCell(`A${i}`).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      worksheet.getCell(`B${i}`).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      worksheet.getCell(`C${i}`).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      worksheet.getCell(`D${i}`).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      worksheet.getCell(`E${i}`).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      worksheet.getCell(`F${i}`).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      worksheet.getCell(`G${i}`).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      worksheet.getCell(`H${i}`).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      worksheet.getCell(`I${i}`).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    }

    // poniendo estilos a los titulos y subtitulos
    worksheet.mergeCells('C2:G2');
    worksheet.mergeCells('C3:G3');
    worksheet.getCell('C2').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('C3').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('C2').font = { bold: true, color: { argb: '000000' }, };
    worksheet.getCell('C3').font = { bold: true, color: { argb: '000000' }, };

    worksheet.getCell('C2').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
    worksheet.getCell('C3').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    // titulo agrupado 1
    worksheet.mergeCells('A5:D5');
    worksheet.getCell('A5').value = reports.tituloAgrupador1Reporte3;
    worksheet.getCell('A5').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'C93D82' } };
    worksheet.getCell('A5').font = { bold: true, color: { argb: 'FFFFFF' } };
    worksheet.getCell('A5').alignment = { vertical: 'middle', horizontal: 'center' };
    // titulo agrupado 2
    worksheet.mergeCells('E5:I5');
    worksheet.getCell('E5').value = reports.tituloAgrupador1Reporte3;
    worksheet.getCell('E5').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '5457CD' } };
    worksheet.getCell('E5').font = { bold: true, color: { argb: 'FFFFFF' } };
    worksheet.getCell('E5').alignment = { vertical: 'middle', horizontal: 'center' };

    // estilo fondo azul a las cabeceras
    worksheet.getCell('A6').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '2C518F' } };
    worksheet.getCell('B6').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '2C518F' } };
    worksheet.getCell('C6').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '2C518F' } };
    worksheet.getCell('D6').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '2C518F' } };
    worksheet.getCell('E6').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '2C518F' } };
    worksheet.getCell('F6').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '2C518F' } };
    worksheet.getCell('G6').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '2C518F' } };
    worksheet.getCell('H6').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '2C518F' } };
    worksheet.getCell('I6').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '2C518F' } };

    // estilo letras blancas a las cabeceras
    worksheet.getCell('A6').font = { bold: true, color: { argb: 'FFFFFF' } };
    worksheet.getCell('B6').font = { bold: true, color: { argb: 'FFFFFF' } };
    worksheet.getCell('C6').font = { bold: true, color: { argb: 'FFFFFF' } };
    worksheet.getCell('D6').font = { bold: true, color: { argb: 'FFFFFF' } };
    worksheet.getCell('E6').font = { bold: true, color: { argb: 'FFFFFF' } };
    worksheet.getCell('F6').font = { bold: true, color: { argb: 'FFFFFF' } };
    worksheet.getCell('G6').font = { bold: true, color: { argb: 'FFFFFF' } };
    worksheet.getCell('H6').font = { bold: true, color: { argb: 'FFFFFF' } };
    worksheet.getCell('I6').font = { bold: true, color: { argb: 'FFFFFF' } };

    // Guardar el archivo
    workbook.xlsx.writeBuffer().then((data: BlobPart) => {
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, `${fileName}.xlsx`);
    });
  }

  // 4to Reporte Factura Suministro de Energía
  public excelPagoDatos(jsonData: any[], fileName: string, nombreHoja: string, rangoFechas): void {
    // Creacion del Libro
    const workbook = new ExcelJS.Workbook();
    // Agregando hoja de trabajo
    const worksheet = workbook.addWorksheet(nombreHoja);
    // titulos
    worksheet.addRow('');
    worksheet.addRow('');
    worksheet.addRow('');
    worksheet.addRow('');
    worksheet.addRow('');

    // Agregar encabezados de las filas
    const rowValues = [];
    rowValues[1] = 'Código';
    rowValues[2] = 'Fecha de Registro';
    rowValues[3] = 'Recepción';
    rowValues[4] = 'Cuf';
    rowValues[5] = 'Tipo de Transacción';
    rowValues[6] = 'Url Factura Siat';

    worksheet.addRow(rowValues);

    worksheet.getCell('A6').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('B6').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('C6').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('D6').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('E6').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('F6').alignment = { vertical: 'middle', horizontal: 'center' };

    // Agregar datos del json
    jsonData.forEach((data: any) => {
      worksheet.addRow([
        data.codigoDescripcion,
        moment(data.fechaRegistro).format('DD/MM/YYYY, HH:mm:ss'),
        data.codigoRecepcion,
        data.cuf,
        data.paymentTransactionType,
        data.urlFacturaSiat
      ]);
    });

    // Ajustar el ancho de las columnas según el contenido
    worksheet.columns.forEach((column) => {
      let maxLength = 0;
      column.eachCell({ includeEmpty: true }, (cell) => {
        const cellValue = cell.value as string;
        if (cellValue) {
          const columnLength = cellValue.toString().length;
          if (columnLength > maxLength) {
            maxLength = columnLength;
          }
        }
      });
      column.width = maxLength < 10 ? 10 + 10 : maxLength; // Ajusta el ancho mínimo si es necesario
    });

    // poniendo titulo
    worksheet.getCell('C2').value = reports.tituloReporte4;
    worksheet.getCell('C2').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFFFF' },
    };
    // poniendo subtitulo
    worksheet.getCell('C3').value = `DEL "${rangoFechas.initialDate}" AL "${rangoFechas.finalDate}"`;
    worksheet.getCell('C3').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFFFF' },
    };

    // poniendo bordes a las cabeceras y al contenido
    for (let i = 6; i < jsonData.length + 7; i++) {
      const element = jsonData[i];
      worksheet.getCell(`A${i}`).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      worksheet.getCell(`B${i}`).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      worksheet.getCell(`C${i}`).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      worksheet.getCell(`D${i}`).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      worksheet.getCell(`E${i}`).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      worksheet.getCell(`F${i}`).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    }

    // poniendo estilos a los titulos y subtitulos
    worksheet.mergeCells('C2:E2');
    worksheet.mergeCells('C3:E3');
    worksheet.getCell('C2').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('C3').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('C2').font = { bold: true, color: { argb: '000000' }, };
    worksheet.getCell('C3').font = { bold: true, color: { argb: '000000' }, };

    worksheet.getCell('C2').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
    worksheet.getCell('C3').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    // estilo fondo azul a las cabeceras
    worksheet.getCell('A6').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '2C518F' } };
    worksheet.getCell('B6').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '2C518F' } };
    worksheet.getCell('C6').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '2C518F' } };
    worksheet.getCell('D6').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '2C518F' } };
    worksheet.getCell('E6').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '2C518F' } };
    worksheet.getCell('F6').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '2C518F' } };

    // estilo letras blancas a las cabeceras
    worksheet.getCell('A6').font = { bold: true, color: { argb: 'FFFFFF' } };
    worksheet.getCell('B6').font = { bold: true, color: { argb: 'FFFFFF' } };
    worksheet.getCell('C6').font = { bold: true, color: { argb: 'FFFFFF' } };
    worksheet.getCell('D6').font = { bold: true, color: { argb: 'FFFFFF' } };
    worksheet.getCell('E6').font = { bold: true, color: { argb: 'FFFFFF' } };
    worksheet.getCell('F6').font = { bold: true, color: { argb: 'FFFFFF' } };

    // Guardar el archivo
    workbook.xlsx.writeBuffer().then((data: BlobPart) => {
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, `${fileName}.xlsx`);
    });
  }

  // 5to reporte - cargas de energia entre fechas
  public excelSuministroEnergia(jsonData: any[], fileName: string, nombreHoja: string, rangoFechas): void {

    // Creacion del Libro
    const workbook = new ExcelJS.Workbook();

    // Agregando hoja de trabajo
    const worksheet = workbook.addWorksheet(nombreHoja);

    // titulos
    worksheet.addRow('');
    worksheet.addRow('');
    worksheet.addRow('');
    worksheet.addRow('');
    worksheet.addRow('');

    // Agregar encabezados de las filas
    const rowValues = [];
    rowValues[1] = 'Usuario';
    rowValues[2] = 'Carga';
    rowValues[3] = 'Estado';
    rowValues[4] = 'Duración';
    rowValues[5] = 'Estación de Carga';
    rowValues[6] = 'Fecha Inicio';
    rowValues[7] = 'Fecha Finalización';
    rowValues[8] = 'Energía Consumida kW';
    rowValues[9] = 'Monto Bs';
    rowValues[10] = 'Total Energía Consumida kW';
    rowValues[11] = 'Total Monto Bs';

    worksheet.addRow(rowValues);

    worksheet.getCell('A6').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('B6').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('C6').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('D6').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('E6').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('F6').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('G6').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('H6').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('I6').alignment = { vertical: 'middle', horizontal: 'center' };

    // Agregar datos del json
    jsonData.forEach((data: any) => {
      const row = worksheet.addRow([
        data.username,
        data.changeFee,
        data.status == 'charged' ? 'Cargado' : 'Finalizado',
        // this.pipeTimeSegundos.segundosHoras(data.duration),
        SegundosEnHoras(data.duration),
        data.chargingStation,
        moment(data.staredChargingAt).format('DD/MM/YYYY, HH:mm:ss'),
        moment(data.finisheAt).format('DD/MM/YYYY, HH:mm:ss'),
        data.energyComsumed,
        data.amount]);
    });

    // Ajustar el ancho de las columnas según el contenido
    worksheet.columns.forEach((column) => {
      let maxLength = 0;
      column.eachCell({ includeEmpty: true }, (cell) => {
        const cellValue = cell.value as string;
        if (cellValue) {
          const columnLength = cellValue.toString().length;
          if (columnLength > maxLength) {
            maxLength = columnLength;
          }
        }
      });
      column.width = maxLength < 10 ? 10 + 10 : maxLength; // Ajusta el ancho mínimo si es necesario
    });

    // suma el monto total
    var filas = 7 + jsonData.length - 1;
    worksheet.getCell('J7').value = { formula: `SUM(H7:H${filas})` };
    worksheet.getCell('K7').value = { formula: `SUM(I7:I${filas})` };

    // poniendo titulo
    worksheet.getCell('C2').value = reports.tituloReporte5;
    worksheet.getCell('C2').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFFFF' },
      bgColor: { argb: 'afe' }
    };

    // poniendo subtitulo
    worksheet.getCell('C3').value = `DEL "${rangoFechas.initialDate}" AL "${rangoFechas.finalDate}"`;
    worksheet.getCell('C3').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFFFF' },
      bgColor: { argb: 'afe' }
    };

    // poniendo bordes a las cabeceras
    for (let i = 6; i < jsonData.length + 7; i++) {
      const element = jsonData[i];
      worksheet.getCell(`A${i}`).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      worksheet.getCell(`B${i}`).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      worksheet.getCell(`C${i}`).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      worksheet.getCell(`D${i}`).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      worksheet.getCell(`E${i}`).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      worksheet.getCell(`F${i}`).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      worksheet.getCell(`G${i}`).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      worksheet.getCell(`H${i}`).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      worksheet.getCell(`I${i}`).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    }

    // poniendo estilos a los titulos y subtitulos
    worksheet.mergeCells('C2:G2');
    worksheet.mergeCells('C3:G3');
    worksheet.getCell('C2').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('C3').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('C2').font = { bold: true, color: { argb: '000000' }, };
    worksheet.getCell('C3').font = { bold: true, color: { argb: '000000' }, };
    worksheet.getCell('C2').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
    worksheet.getCell('C3').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

    // estilo fondo azul a las cabeceras
    worksheet.getCell('A6').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '2C518F' } };
    worksheet.getCell('B6').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '2C518F' } };
    worksheet.getCell('C6').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '2C518F' } };
    worksheet.getCell('D6').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '2C518F' } };
    worksheet.getCell('E6').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '2C518F' } };
    worksheet.getCell('F6').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '2C518F' } };
    worksheet.getCell('G6').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '2C518F' } };
    worksheet.getCell('H6').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '2C518F' } };
    worksheet.getCell('I6').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '2C518F' } };
    worksheet.getCell('J6').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '2C518F' } };
    worksheet.getCell('K6').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '2C518F' } };
    worksheet.getCell('J7').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'C93D82' } };
    worksheet.getCell('K7').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '5457CD' } };

    // estilo letras blancas a las cabeceras
    worksheet.getCell('A6').font = { bold: true, color: { argb: 'FFFFFF' } };
    worksheet.getCell('B6').font = { bold: true, color: { argb: 'FFFFFF' } };
    worksheet.getCell('C6').font = { bold: true, color: { argb: 'FFFFFF' } };
    worksheet.getCell('D6').font = { bold: true, color: { argb: 'FFFFFF' } };
    worksheet.getCell('E6').font = { bold: true, color: { argb: 'FFFFFF' } };
    worksheet.getCell('F6').font = { bold: true, color: { argb: 'FFFFFF' } };
    worksheet.getCell('G6').font = { bold: true, color: { argb: 'FFFFFF' } };
    worksheet.getCell('H6').font = { bold: true, color: { argb: 'FFFFFF' } };
    worksheet.getCell('I6').font = { bold: true, color: { argb: 'FFFFFF' } };
    worksheet.getCell('J6').font = { bold: true, color: { argb: 'FFFFFF' } };
    worksheet.getCell('K6').font = { bold: true, color: { argb: 'FFFFFF' } };
    worksheet.getCell('J7').font = { bold: true, color: { argb: 'FFFFFF' } };
    worksheet.getCell('K7').font = { bold: true, color: { argb: 'FFFFFF' } };

    // estilo bordes a los resultados
    worksheet.getCell('J7').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    worksheet.getCell('K7').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

    // Guardar el archivo
    workbook.xlsx.writeBuffer().then((data: BlobPart) => {
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, `${fileName}.xlsx`);
    });
  }

  // 6to Reporte
  public excelFacturasCompraVenta(jsonData: any[], fileName: string, nombreHoja: string, rangoFechas): void {

    // Creacion del Libro
    const workbook = new ExcelJS.Workbook();
    // Agregando hoja de trabajo
    const worksheet = workbook.addWorksheet(nombreHoja);

    // titulos
    worksheet.addRow('');
    worksheet.addRow('');
    worksheet.addRow('');
    worksheet.addRow('');
    worksheet.addRow('');

    // Agregar encabezados de las filas
    const rowValues = [];
    rowValues[1] = 'Correo Electrónico';
    rowValues[2] = 'Nombres';
    rowValues[3] = 'Apellido Paterno';
    rowValues[4] = 'Apellido Materno';
    rowValues[5] = 'Número de Identificación';

    rowValues[6] = 'Cuf';
    rowValues[7] = 'Código Descripción';
    rowValues[8] = 'Código Recepción';
    rowValues[9] = 'Fecha Registro';
    rowValues[10] = 'Url Factura Siat';

    worksheet.addRow(rowValues);

    worksheet.getCell('A6').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('B6').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('C6').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('D6').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('E6').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('F6').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('G6').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('H6').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('I6').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('J6').alignment = { vertical: 'middle', horizontal: 'center' };

    // Agregar datos del json

    jsonData.forEach((data: any) => {
      var row = worksheet.addRow([
        data.electronicMail,
        data.names,
        data.lastName,
        data.motherLastName,
        data.identificationNumber ? data.identificationNumber : '',
      ]);
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
      if (data.clientInvoiceList.length > 0) {
        const key = data.clientInvoiceList[0];
        row.getCell(row.actualCellCount + 1).value = key.cuf
        row.getCell(row.actualCellCount + 1).value = key.codigoDescripcion
        row.getCell(row.actualCellCount + 1).value = key.codigoRecepcion
        row.getCell(row.actualCellCount + 1).value = key.fechaRegistro
        row.getCell(row.actualCellCount + 1).value = key.urlFacturaSiat
        row.eachCell((cell) => {
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };
        });
        if (data.clientInvoiceList.length > 1) {
          for (let i = 1; i < data.clientInvoiceList.length; i++) {
            var key1 = data.clientInvoiceList[i];
            const row = worksheet.addRow([
              '',
              '',
              '',
              '',
              '',
              key.cuf,
              key.codigoDescripcion,
              key.codigoRecepcion,
              key.fechaRegistro,
              key.urlFacturaSiat,
            ]);
            row.eachCell((cell) => {
              cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
              };
            });
          }
        }
      }
      else {
        row.getCell(row.actualCellCount + 1).value = ''
        row.getCell(row.actualCellCount + 1).value = ''
        row.getCell(row.actualCellCount + 1).value = ''
        row.getCell(row.actualCellCount + 1).value = ''
        row.getCell(row.actualCellCount + 1).value = ''
        row.eachCell((cell) => {
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };
        });
      }

    });

    // Ajustar el ancho de las columnas según el contenido
    worksheet.columns.forEach((column) => {
      let maxLength = 0;
      column.eachCell({ includeEmpty: true }, (cell) => {
        const cellValue = cell.value as string;
        if (cellValue) {
          const columnLength = cellValue.toString().length;
          if (columnLength > maxLength) {
            maxLength = columnLength;
          }
        }
      });
      column.width = maxLength < 10 ? 10 + 10 : maxLength; // Ajusta el ancho mínimo si es necesario
    });

    // poniendo titulo
    worksheet.getCell('C2').value = reports.tituloReporte6;
    worksheet.getCell('C2').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFFFF' },
    };

    // poniendo subtitulo
    worksheet.getCell('C3').value = `DEL "${rangoFechas.initialDate}" AL "${rangoFechas.finalDate}"`;
    worksheet.getCell('C3').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFFFF' },
    };

    // poniendo bordes a las cabeceras
    for (let i = 6; i < jsonData.length + 7; i++) {
      const element = jsonData[i];
      worksheet.getCell(`A${i}`).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      worksheet.getCell(`B${i}`).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      worksheet.getCell(`C${i}`).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      worksheet.getCell(`D${i}`).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      worksheet.getCell(`E${i}`).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      worksheet.getCell(`F${i}`).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      worksheet.getCell(`G${i}`).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      worksheet.getCell(`H${i}`).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      worksheet.getCell(`I${i}`).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      worksheet.getCell(`J${i}`).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    }

    // poniendo estilos a los titulos y subtitulos
    worksheet.mergeCells('C2:G2');
    worksheet.mergeCells('C3:G3');
    worksheet.getCell('C2').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('C3').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('C2').font = { bold: true, color: { argb: '000000' }, };
    worksheet.getCell('C3').font = { bold: true, color: { argb: '000000' }, };

    worksheet.getCell('C2').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
    worksheet.getCell('C3').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    // titulo agrupado 1
    worksheet.mergeCells('A5:E5');
    worksheet.getCell('A5').value = reports.tituloAgrupador1Reporte6;
    worksheet.getCell('A5').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'C93D82' } };
    worksheet.getCell('A5').font = { bold: true, color: { argb: 'FFFFFF' } };
    worksheet.getCell('A5').alignment = { vertical: 'middle', horizontal: 'center' };
    // titulo agrupado 2
    worksheet.mergeCells('F5:J5');
    worksheet.getCell('F5').value = reports.tituloAgrupador2Reporte6;
    worksheet.getCell('F5').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '5457CD' } };
    worksheet.getCell('F5').font = { bold: true, color: { argb: 'FFFFFF' } };
    worksheet.getCell('F5').alignment = { vertical: 'middle', horizontal: 'center' };

    // estilo fondo azul a las cabeceras
    worksheet.getCell('A6').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '2C518F' } };
    worksheet.getCell('B6').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '2C518F' } };
    worksheet.getCell('C6').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '2C518F' } };
    worksheet.getCell('D6').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '2C518F' } };
    worksheet.getCell('E6').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '2C518F' } };
    worksheet.getCell('F6').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '2C518F' } };
    worksheet.getCell('G6').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '2C518F' } };
    worksheet.getCell('H6').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '2C518F' } };
    worksheet.getCell('I6').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '2C518F' } };
    worksheet.getCell('J6').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '2C518F' } };

    // estilo letras blancas a las cabeceras
    worksheet.getCell('A6').font = { bold: true, color: { argb: 'FFFFFF' } };
    worksheet.getCell('B6').font = { bold: true, color: { argb: 'FFFFFF' } };
    worksheet.getCell('C6').font = { bold: true, color: { argb: 'FFFFFF' } };
    worksheet.getCell('D6').font = { bold: true, color: { argb: 'FFFFFF' } };
    worksheet.getCell('E6').font = { bold: true, color: { argb: 'FFFFFF' } };
    worksheet.getCell('F6').font = { bold: true, color: { argb: 'FFFFFF' } };
    worksheet.getCell('G6').font = { bold: true, color: { argb: 'FFFFFF' } };
    worksheet.getCell('H6').font = { bold: true, color: { argb: 'FFFFFF' } };
    worksheet.getCell('I6').font = { bold: true, color: { argb: 'FFFFFF' } };
    worksheet.getCell('J6').font = { bold: true, color: { argb: 'FFFFFF' } };

    // Guardar el archivo
    workbook.xlsx.writeBuffer().then((data: BlobPart) => {
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, `${fileName}.xlsx`);
    });
  }

  // 7mo Reporte
  public excelFacturasSuministroEnergia(jsonData: any[], fileName: string, nombreHoja: string, rangoFechas): void {

    // Creacion del Libro
    const workbook = new ExcelJS.Workbook();
    // Agregando hoja de trabajo
    const worksheet = workbook.addWorksheet(nombreHoja);

    // titulos
    worksheet.addRow('');
    worksheet.addRow('');
    worksheet.addRow('');
    worksheet.addRow('');
    worksheet.addRow('');

    // Agregar encabezados de las filas
    const rowValues = [];
    rowValues[1] = 'Correo Electrónico';
    rowValues[2] = 'Nombres';
    rowValues[3] = 'Apellido Paterno';
    rowValues[4] = 'Apellido Materno';
    rowValues[5] = 'Número de Identificación';

    rowValues[6] = 'Cuf';
    rowValues[7] = 'Código Descripción';
    rowValues[8] = 'Código Recepción';
    rowValues[9] = 'Fecha de Registro';
    rowValues[10] = 'Url Factura Siat';

    worksheet.addRow(rowValues);

    worksheet.getCell('A6').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('B6').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('C6').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('D6').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('E6').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('F6').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('G6').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('H6').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('I6').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('J6').alignment = { vertical: 'middle', horizontal: 'center' };

    // Agregar datos del json

    jsonData.forEach((data: any) => {
      var row = worksheet.addRow([
        data.electronicMail,
        data.names,
        data.lastName,
        data.motherLastName,
        data.identificationNumber ? data.identificationNumber : '',
      ]);
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
      if (data.clientInvoiceList.length > 0) {
        const key = data.clientInvoiceList[0];
        row.getCell(row.actualCellCount + 1).value = key.cuf
        row.getCell(row.actualCellCount + 1).value = key.codigoDescripcion
        row.getCell(row.actualCellCount + 1).value = key.codigoRecepcion
        row.getCell(row.actualCellCount + 1).value = key.fechaRegistro ? key.fechaRegistro : ''
        row.getCell(row.actualCellCount + 1).value = key.urlFacturaSiat

        row.eachCell((cell) => {
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };
        });
        if (data.clientInvoiceList.length > 1) {
          for (let i = 1; i < data.clientInvoiceList.length; i++) {
            var key1 = data.clientInvoiceList[i];
            const row = worksheet.addRow([
              '',
              '',
              '',
              '',
              '',
              key.cuf,
              key.codigoDescripcion,
              key.codigoRecepcion,
              key.fechaRegistro ? key.fechaRegistro : '',
              key.urlFacturaSiat
            ]);
            row.eachCell((cell) => {
              cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
              };
            });
          }
        }
      }
      else {
        row.getCell(row.actualCellCount + 1).value = ''
        row.getCell(row.actualCellCount + 1).value = ''
        row.getCell(row.actualCellCount + 1).value = ''
        row.getCell(row.actualCellCount + 1).value = ''
        row.getCell(row.actualCellCount + 1).value = ''

        row.eachCell((cell) => {
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };
        });
      }

    });

    // Ajustar el ancho de las columnas según el contenido
    worksheet.columns.forEach((column) => {
      let maxLength = 0;
      column.eachCell({ includeEmpty: true }, (cell) => {
        const cellValue = cell.value as string;
        if (cellValue) {
          const columnLength = cellValue.toString().length;
          if (columnLength > maxLength) {
            maxLength = columnLength;
          }
        }
      });
      column.width = maxLength < 10 ? 10 + 10 : maxLength; // Ajusta el ancho mínimo si es necesario
    });

    // poniendo titulo
    worksheet.getCell('C2').value = reports.tituloReporte7;
    worksheet.getCell('C2').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFFFF' },
    };
    // poniendo subtitulo
    worksheet.getCell('C3').value = `DEL "${rangoFechas.initialDate}" AL "${rangoFechas.finalDate}"`;
    worksheet.getCell('C3').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFFFF' },
    };


    // poniendo bordes a las cabeceras
    for (let i = 6; i < jsonData.length + 7; i++) {
      const element = jsonData[i];
      worksheet.getCell(`A${i}`).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      worksheet.getCell(`B${i}`).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      worksheet.getCell(`C${i}`).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      worksheet.getCell(`D${i}`).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      worksheet.getCell(`E${i}`).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      worksheet.getCell(`F${i}`).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      worksheet.getCell(`G${i}`).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      worksheet.getCell(`H${i}`).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      worksheet.getCell(`I${i}`).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      worksheet.getCell(`J${i}`).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    }

    // poniendo estilos a los titulos y subtitulos
    worksheet.mergeCells('C2:G2');
    worksheet.mergeCells('C3:G3');
    worksheet.getCell('C2').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('C3').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('C2').font = { bold: true, color: { argb: '000000' }, };
    worksheet.getCell('C3').font = { bold: true, color: { argb: '000000' }, };

    worksheet.getCell('C2').border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
    worksheet.getCell('C3').border = { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    // titulo agrupado 1
    worksheet.mergeCells('A5:E5');
    worksheet.getCell('A5').value = reports.tituloAgrupador1Reporte7;
    worksheet.getCell('A5').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'C93D82' } };
    worksheet.getCell('A5').font = { bold: true, color: { argb: 'FFFFFF' } };
    worksheet.getCell('A5').alignment = { vertical: 'middle', horizontal: 'center' };
    // titulo agrupado 2
    worksheet.mergeCells('F5:J5');
    worksheet.getCell('F5').value = reports.tituloAgrupador2Reporte7;
    worksheet.getCell('F5').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '5457CD' } };
    worksheet.getCell('F5').font = { bold: true, color: { argb: 'FFFFFF' } };
    worksheet.getCell('F5').alignment = { vertical: 'middle', horizontal: 'center' };

    // estilo fondo azul a las cabeceras
    worksheet.getCell('A6').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '2C518F' } };
    worksheet.getCell('B6').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '2C518F' } };
    worksheet.getCell('C6').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '2C518F' } };
    worksheet.getCell('D6').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '2C518F' } };
    worksheet.getCell('E6').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '2C518F' } };
    worksheet.getCell('F6').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '2C518F' } };
    worksheet.getCell('G6').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '2C518F' } };
    worksheet.getCell('H6').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '2C518F' } };
    worksheet.getCell('I6').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '2C518F' } };
    worksheet.getCell('J6').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '2C518F' } };

    // estilo letras blancas a las cabeceras
    worksheet.getCell('A6').font = { bold: true, color: { argb: 'FFFFFF' } };
    worksheet.getCell('B6').font = { bold: true, color: { argb: 'FFFFFF' } };
    worksheet.getCell('C6').font = { bold: true, color: { argb: 'FFFFFF' } };
    worksheet.getCell('D6').font = { bold: true, color: { argb: 'FFFFFF' } };
    worksheet.getCell('E6').font = { bold: true, color: { argb: 'FFFFFF' } };
    worksheet.getCell('F6').font = { bold: true, color: { argb: 'FFFFFF' } };
    worksheet.getCell('G6').font = { bold: true, color: { argb: 'FFFFFF' } };
    worksheet.getCell('H6').font = { bold: true, color: { argb: 'FFFFFF' } };
    worksheet.getCell('I6').font = { bold: true, color: { argb: 'FFFFFF' } };
    worksheet.getCell('J6').font = { bold: true, color: { argb: 'FFFFFF' } };

    // Guardar el archivo
    workbook.xlsx.writeBuffer().then((data: BlobPart) => {
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, `${fileName}.xlsx`);
    });
  }
}