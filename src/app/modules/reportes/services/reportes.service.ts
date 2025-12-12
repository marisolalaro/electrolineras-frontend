import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EndPoins } from 'src/app/core/constants/endPoints';

@Injectable({
  providedIn: 'root'
})

export class ReportesService {

  private apiService: string;

  constructor(private http: HttpClient) {
    this.apiService = EndPoins.apiUrl + EndPoins.api;
  }

  // 1er Reporte Facturas compra - venta
  getFacturasCompraVenta(rangoFechas) {
    return this.http.post(this.apiService + EndPoins.transaction + EndPoins.facturaDatos, rangoFechas);
  }

  // 2do Reporte Pagos de Crédito
  getCargaEnergia(rangoFechas) {
    return this.http.post(this.apiService + EndPoins.transaction + EndPoins.cargasEnergia, rangoFechas);
  }

  // 3er Reporte Facturas Relacionadas
  getFacturasRelacionadas(rangoFechas) {
    return this.http.post(this.apiService + EndPoins.transaction + EndPoins.facturasRelacionadas, rangoFechas);
  }

  // 4to Reporte Factura Suministro de Energía
  getPagoDatos(rangoFechas) {
    return this.http.post(this.apiService + EndPoins.invoicePaymentTransaction + EndPoins.cargasEnergia, rangoFechas);
  }

  // 5to Reporte - cargas de energia entre fechas
  getSuministroEnergia(rangoFechas) {
    return this.http.post(this.apiService + EndPoins.clientesCarga + EndPoins.cargasDatos, rangoFechas);
  }

  // 6to Reporte - FacturaCompraVenta
  getFacturaCompraVenta(rangoFechas) {
    return this.http.post(this.apiService + EndPoins.invoicePaymentTransaction + EndPoins.facturaClienteCompraVenta, rangoFechas);
  }
  
  // 7mo Reporte - FacturaSuministroEnergia
  getFacturaSuministroEnergia(rangoFechas) {
    return this.http.post(this.apiService + EndPoins.invoicePaymentTransaction + EndPoins.facturaSuministro, rangoFechas);
  }

  // 8vo Reporte - Datos Mensuales
 getReporteDatosMensuales() {
    return this.http.get(this.apiService + EndPoins.reportes + EndPoins.datosMensualesExcel,
      { responseType: 'blob' as 'json' }
    );
  }

  // 9no Reporte
  getSuministroCliente(rangoFechas) {
    return this.http.post(this.apiService + EndPoins.chargingHistory + EndPoins.suministroCliente, rangoFechas)
  }

  // 10mo Reporte de consumo de credito 
 getConsumoCredito() {
    return this.http.get(this.apiService + EndPoins.transaction + EndPoins.consumoCreditoExcel,
      {  responseType: 'blob' as 'json'}
    );
}
}
