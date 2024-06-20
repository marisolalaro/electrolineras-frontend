import { Injectable } from '@angular/core';
@Injectable()

export class InvoiceTransaction {
    constructor() {}

    getFactura(data): any {
        var contenido = {
            pageSize: 'A7',
            pageMargins: [ 20, 10, 20, 10 ],
            content: [
                {
                  text: 'FACTURA',
                  alignment: 'center',
                  bold: true,
                },
                {
                  text: 'CON DERECHO A CRÉDITO FISCAL',
                  alignment: 'center',
                  bold: true,
                },
                {
                  text: '_______________________________________________________________________________________',
                  alignment: 'justify'
                },
                {
                  text: '\n  DATOS DE PAGO',
                  alignment: 'justify',
                  bold: true,
                },
                {
                  text: '\n',
                },
                {
                  text: 'El pago solo puede ser realizado en las agencias del BANCO UNIÓN. \n\n',
                  alignment: 'justify'
                },
                {
                  ul: [
                    {text: 'CPT : ' + 11111,
                    bold: true
                    },
                    'Monto : ' + 10,
                    'Tramite : ' + 'uno',
                    'Interesado : '+ 'dataTransactions.requestData.nombre',
                    'CI : '+ 'dataTransactions.requestData.numeroDocumento',
                    // 'Fecha de emisión: ' + moment(dataTransactions.payment.inicioVigencia).format('DD [de] MMMM [de] YYYY'),
                    'Valido por : ' + 30 + ' días hábiles'
                  ],
                  alignment: 'justify'
                }

            ],
            styles: {
                header: {
                    fontSize: 18,
                    bold: true,
                    alignment: 'justify'
                }
            }
        }
          return contenido
    }
}