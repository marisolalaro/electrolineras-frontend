import { Injectable } from '@angular/core';
import * as moment from 'moment/moment';

@Injectable()

export class InvoiceTransaction {
  constructor() {
    moment.locale("es");
  }

  getFactura(data): any {
    var contenido = {
      pageSize: {
        width: 298.28,
        height: 'auto'
      },
      pageMargins: [20, 40, 20, 40],
      content: [
        {
          text: 'FACTURA',
          alignment: 'center',
          bold: true,
          fontSize: 10
        },
        {
          text: 'CON DERECHO A CRÉDITO FISCAL',
          alignment: 'center',
          bold: true,
          fontSize: 10
        },
        {
          text: data.facturaElectronicaSuministroEnergia.cabecera.razonSocialEmisor,
          alignment: 'center',
          fontSize: 10
        },
        {
          text: 'Casa Matriz',
          alignment: 'center',
          fontSize: 10
        },
        {
          text: 'No. Punto de Venta ' + data.facturaElectronicaSuministroEnergia.cabecera.codigoPuntoVenta,
          alignment: 'center',
          fontSize: 10
        },
        {
          text: data.facturaElectronicaSuministroEnergia.cabecera.direccion,
          alignment: 'center',
          fontSize: 10
        },
        {
          text: '\n',
        },
        {
          text: 'Tel. ' + data.facturaElectronicaSuministroEnergia.cabecera.telefono,
          alignment: 'center',
          fontSize: 10
        },
        {
          text: data.facturaElectronicaSuministroEnergia.cabecera.municipio,
          alignment: 'center',
          fontSize: 10
        },
        {
          text: '-----------------------------------------------------------------------------',
          alignment: 'center'
        },
        {
          text: 'NIT',
          alignment: 'center',
          bold: true,
        },
        {
          text: data.facturaElectronicaSuministroEnergia.cabecera.nitEmisor,
          alignment: 'center',
          fontSize: 10
        },
        {
          text: 'FACTURA N°',
          alignment: 'center',
          bold: true,
        },
        {
          text: data.facturaElectronicaSuministroEnergia.cabecera.numeroFactura,
          alignment: 'center',
          fontSize: 10
        },
        {
          text: 'CÓD. AUTORIZACIÓN',
          alignment: 'center',
          bold: true,
        },
        {
          text: data.facturaElectronicaSuministroEnergia.cabecera.cuf,
          alignment: 'center',
          fontSize: 10
        },
        {
          text: '-----------------------------------------------------------------------------',
          alignment: 'center'
        },

        {
          columns: [
            {
              width: '50%',
              text: 'NOMBRE/RAZÓN SOCIAL:',
              style: 'clienteTitle'
            },
            {
              width: '5%',
              text: '',
            },
            {
              width: '50%',
              text: data.facturaElectronicaSuministroEnergia.cabecera.nombreRazonSocial,
              style: 'clienteData'
            }
          ],
        },
        {
          columns: [
            {
              width: '50%',
              text: 'NIT/CI/CEX:',
              style: 'clienteTitle'
            },
            {
              width: '5%',
              text: '',
            },
            {
              width: '50%',
              text: data.facturaElectronicaSuministroEnergia.cabecera.numeroDocumento,
              style: 'clienteData'
            }
          ],
        },
        {
          columns: [
            {
              width: '50%',
              text: 'COD. CLIENTE:',
              style: 'clienteTitle'
            },
            {
              width: '5%',
              text: '',
            },
            {
              width: '50%',
              text: data.facturaElectronicaSuministroEnergia.cabecera.codigoCliente,
              style: 'clienteData'
            }
          ],
        },
        {
          columns: [
            {
              width: '50%',
              text: 'FECHA DE EMISIÓN:',
              style: 'clienteTitle'
            },
            {
              width: '5%',
              text: '',
            },
            {
              width: '50%',
              text: moment(data.facturaElectronicaSuministroEnergia.cabecera.fechaEmision).format('DD/MM/YYYY HH:mm A'),
              style: 'clienteData'
            }
          ],
        },
        {
          text: '-----------------------------------------------------------------------------',
          alignment: 'center'
        },
        {
          text: 'DETALLE',
          alignment: 'center',
          bold: true,
        },
        {
          text: '1.- ' + data.facturaElectronicaSuministroEnergia.detalle.descripcion,
          alignment: 'left',
          fontSize: 10,
          bold: true,
        },
        {
          text: 'Unidad de Medida: Unidad (Servicios)',
          alignment: 'left',
          fontSize: 10,
        },
        {
          columns: [
            {
              width: '*',
              text: data.facturaElectronicaSuministroEnergia.detalle.cantidad + 'X' + data.facturaElectronicaSuministroEnergia.detalle.precioUnitario + '-' + data.facturaElectronicaSuministroEnergia.detalle.montoDescuento,
              fontSize: 10,
            },
            {
              width: '10%',
              text: data.facturaElectronicaSuministroEnergia.cabecera.montoTotal,
              fontSize: 10,
            }
          ],
        },
        {
          text: '-----------------------------------------------------------------------------',
          alignment: 'center'
        },
        {
          columns: [
            {
              width: '*',
              text: 'SUBTOTAL Bs',
              fontSize: 10,
              alignment: 'right'
            },
            {
              width: '20%',
              text: '',
            },
            {
              width: '10%',
              text: data.facturaElectronicaSuministroEnergia.detalle.subTotal,
              fontSize: 10,
              alignment: 'right'
            }
          ],
        },
        {
          columns: [
            {
              width: '*',
              text: 'DESCUENTO Bs',
              fontSize: 10,
              alignment: 'right'
            },
            {
              width: '20%',
              text: '',
            },
            {
              width: '10%',
              text: data.facturaElectronicaSuministroEnergia.detalle.montoDescuento,
              fontSize: 10,
              alignment: 'right'
            }
          ],
        },
        {
          columns: [
            {
              width: '*',
              text: 'TOTAL Bs',
              style: 'total'
            },
            {
              width: '20%',
              text: '',
            },
            {
              width: '10%',
              text: data.facturaElectronicaSuministroEnergia.cabecera.montoTotal,
              style: 'total'
            }
          ],
        },
        {
          columns: [
            {
              width: '*',
              text: 'MONTO GIF CARD Bs',
              fontSize: 10,
              alignment: 'right'

            },
            {
              width: '20%',
              text: '',
            },
            {
              width: '10%',
              text: data.facturaElectronicaSuministroEnergia.cabecera.montoGiftCard,
              fontSize: 10,
              alignment: 'right'
            }
          ],
        },
        {
          columns: [
            {
              width: '*',
              text: 'IMPORTE BASE CRÉDITO FISCAL',
              style: 'total'
            },
            {
              width: '20%',
              text: '',
            },
            {
              width: '10%',
              text: '0.00',
              style: 'total'
            }
          ],
        },
        {
          text: '\n',
        },
        { text: 'Son: Cero 00/100 Bolivianos ', fontSize: 10 },
        {
          text: '-----------------------------------------------------------------------------',
          alignment: 'center'
        },
        {
          text: '\n',
        },
        {
          text: 'ESTA FACTURA CONTRIBUYE AL DESARROLLO DEL PAÍS, EL USO ILÍCITO SERÁ SANCIONADO PENALMENTE DE ACUERDO A LEY',
          alignment: 'center',
          fontSize: 10
        },
        {
          text: '\n',
        },
        {
          text: data.facturaElectronicaSuministroEnergia.cabecera.leyenda,
          alignment: 'center',
          fontSize: 8
        },
        {
          text: '\n',
        },
        {
          text: '“Este documento es la Representación Gráfica de un Documento Fiscal Digital emitido en una modalidad de facturación en línea”',
          alignment: 'center',
          fontSize: 8
        },

      ],

      styles: {
        total: {
          bold: true,
          fontSize: 10,
          alignment: 'right',
        },
        clienteTitle: {
          bold: true,
          fontSize: 10,
          alignment: 'right',
        },
        clienteData: {
          fontSize: 10,
          alignment: 'left',
        }
      }
    }
    return contenido
  }
}