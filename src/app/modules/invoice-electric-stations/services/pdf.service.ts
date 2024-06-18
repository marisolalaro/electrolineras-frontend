import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import { xml2json } from 'xml-js';

@Injectable({
  providedIn: 'root',
})
export class PdfService {


  constructor() { }

  generatePdfInvoiceTransaction() {
    const doc = new jsPDF();
    doc.text('FACTURA TRANSACTION MONTO DE CRÉDITO', 10, 10);
    doc.save('sample.pdf');
  }

  generatePdfInvoiceCharging(archivo) {

    const xml: string = archivo;
    const options1 = { compact: true, spaces: 4 };
    const result1: string = xml2json(xml, options1);

    const doc = new jsPDF();
    doc.text('FACTURA', 80, 10);
    doc.text('CON DERECHO A CRÉDITO FISCAL', 50, 15);
    doc.text('FACTURA SUMINISTRO DE ENERGÍA', 50, 30);


    doc.save('sample.pdf');
  }


}
