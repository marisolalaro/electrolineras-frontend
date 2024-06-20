import { Injectable } from '@angular/core';
import { xmlToJsonUtil } from 'xml-to-json-util';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { InvoiceTransaction } from './invoice-transaction';

@Injectable({
  providedIn: 'root',
})
export class PdfService {


  constructor(
    private invoiceTransaction: InvoiceTransaction
  ) {}

  generatePdfInvoiceTransaction(xml) {
    const jsonData: any = xmlToJsonUtil(xml);
    var doc = this.invoiceTransaction.getFactura(jsonData);
    pdfMake.createPdf(doc).open({}, window);
    // pdfMake.createPdf(doc).download("test.pdf");




    // const doc = new jsPDF(
    //   {
    //     orientation: "landscape",
    //     unit: "in",
    //     format: [4, 2]
    //   }
    // );

    // doc.text('FACTURA', 80, 10);
    // doc.text('CON DERECHO A CRÉDITO FISCAL', 50, 15);
    // doc.text(jsonData.facturaElectronicaCompraVenta.cabecera.razonSocialEmisor, 50, 30);
    // doc.text('DELAPAZ', 10, 10);

    // doc.save('facturaTransaccion.pdf');

  }

  generatePdfInvoiceCharging(archivo) {

    const xml: string = archivo;
    const options1 = { compact: true, spaces: 4 };
    // const result1: string = xml2json(xml, options1);

    // const doc = new jsPDF();
    // doc.text('FACTURA', 80, 10);
    // doc.text('CON DERECHO A CRÉDITO FISCAL', 50, 15);
    // doc.text('FACTURA SUMINISTRO DE ENERGÍA', 50, 30);


    // doc.save('sample.pdf');
  }


}
