import { Injectable } from '@angular/core';
// import * as PDFDocument from 'pdfkit';
import { saveAs } from 'file-saver';
import { PDFDocument, rgb } from 'pdf-lib';

@Injectable({
  providedIn: 'root'
})
export class Base64ToPdfService {

  constructor() { }
  
  // Función para decodificar Base64 a una cadena
  public decodeBase64(base64: string): string {
    return atob(base64);
  }

  // Función para crear un archivo PDF desde un XML
  async createPdfFromXml(xmlContent: string, outputFileName: string): Promise<void> {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();

    page.drawText(xmlContent, {
      x: 50,
      y: height - 50,
      size: 12,
      color: rgb(0, 0, 0),
    });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    saveAs(blob, outputFileName);
  }

  // Función principal para manejar la conversión
  convertBase64ToPdf(base64: string, outputFileName: string): void {
    const xmlContent = this.decodeBase64(base64);
    this.createPdfFromXml(xmlContent, outputFileName);
  }
}

