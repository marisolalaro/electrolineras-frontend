import { Injectable } from '@angular/core';
import { HttpBackend, HttpClient, HttpHeaders } from '@angular/common/http';
import { EndPoins } from 'src/app/core/constants/endPoints';
import { of } from 'rxjs';
// models

@Injectable()

export class AgenteIaService {

 private apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
  // Tu API Key (Recuerda no compartirla públicamente en producción)
  private apiKey = 'AIzaSyDp4DPW0byQ12fzymhKVBHXkAQX91wE7JA';

  private httpSinInterceptor: HttpClient;

  constructor(
    private http: HttpClient, 
    private handler: HttpBackend 
  ) {
    // Cliente HTTP limpio que ignora los interceptores (evita el error 401 por tokens propios)
    this.httpSinInterceptor = new HttpClient(this.handler);
  }

  obtenerPrediccionIa(semillas: any) {
    const url = `${this.apiUrl}?key=${this.apiKey}`;
    const semillasModificadas = {
      "fechaHoraActual": new Date().toISOString(), // Genera formato "2024-12-25T10:00:00.000Z"
     "data": semillas
    };
   
    const semillasComoTexto = typeof semillasModificadas === 'string' ? semillasModificadas : JSON.stringify(semillasModificadas);

    const systemInstructionText = `Eres un experto en análisis de series temporales y predicción de consumo energético.

**TAREA:**
1. Recibirás un historial de consumo eléctrico en formato JSON.
2. Recibirás la fecha y hora actual como punto de inicio y segun a eso tienes que estimar las siguientes horas, si la consulta es a las 12:32 tu estimas de 13:00, 14:00 y asi susecivamente .
3. Debes predecir el consumo horario (kWh) para las próximas 24 horas (a partir de la hora actual).
4. Cada predicción debe incluir un margen de error (intervalo de confianza).

**DATOS DE ENTRADA QUE TE PROVEO (JSON):**
recibiras una lista con los siguientes datos en formato json:
1. 'startedAt': Fecha y hora de conexion en formato ISO 8601 (ej: "2024-01-15T14:00:00Z")
2. 'finishedAt': Fecha y hora de desconexion en formato ISO 8601 (ej: "2024-01-15T14:00:00Z")
3. 'energyConsumed': Energia consumida en ese rango de conexion de fechas : numeric(19, 2), consumption_kwh
4. 'currentOfferedMode': intensidad de carga : numeric(19, 2), intensity
5. 'fechaHoraActual': es la fecha actual de la consulta y segun eso se tiene que predecir el consumo de las siguientes horas en formato ISO 8601 (ej: "2024-01-15T14:00:00Z")


**REQUISITOS DE LA PREDICCIÓN:**
- Período: 24 horas completas (24 predicciones horarias)
- Unidad: kWh (kilovatios-hora)
- Cada predicción debe incluir:
  - Hora específica (formato ISO 8601)
  - Consumo estimado (valor central)
  - Margen de error (± valor)
  - Límite inferior y superior del intervalo

**INSTRUCCIONES DE ANÁLISIS:**
1. Analiza patrones en los datos históricos (diarios, semanales, estacionales).
2. Considera la hora del día en los patrones de consumo.
3. Usa métodos estadísticos o de ML apropiados para series temporales.
4. Calcula márgenes de error basados en la variabilidad histórica.

**FORMATO DE SALIDA EXACTO (JSON):**
solo devuelvemelo el json sin ninguna descripcion adjunta
\`\`\`json
{
  "prediction_start": "2024-01-15T14:00:00Z",
  "prediction_end": "2024-01-16T14:00:00Z",
  "generated_at": "2024-01-15T14:00:00Z",
  "timezone": "UTC",
  "predictions": [
    {
      "hour": 0,
      "timestamp": "2024-01-15T14:00:00Z",
      "consumption_estimated": 15.3,
      "margin_error": 1.2
    },
    {
      "hour": 1,
      "timestamp": "2024-01-15T15:00:00Z",
      "consumption_estimated": 14.8,
      "margin_error": 1.1
    }
  ]
}
\`\`\`
`;

    const bodyParams = {
      systemInstruction: {
        parts: [ { text: systemInstructionText } ]
      },
      contents: [
        {
          role: "user",
          parts: [ 
            // Aquí usamos la variable ya convertida a texto
            { text: semillasComoTexto } 
          ]
        }
      ],
      generationConfig: {
        seed: 123456,
        temperature: 1.0,
        maxOutputTokens: 20000
      }
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.httpSinInterceptor.post(url, bodyParams, { headers: headers });
  }

 obtenerPrediccionIaTest(semillas: any) {
    const mockResponse = {
      "candidates": [
        {
          "content": {
            "parts": [
              {
                 "text": "```json\n{\n  \"prediction_start\": \"2026-03-02T17:00:00Z\",\n  \"prediction_end\": \"2026-03-03T17:00:00Z\",\n  \"predictions\": [\n    { \"hour\": 0, \"timestamp\": \"2026-03-02T17:00:00Z\", \"consumption_estimated\": 0.45, \"margin_error\": 0.05 },\n    { \"hour\": 1, \"timestamp\": \"2026-03-02T18:00:00Z\", \"consumption_estimated\": 0.82, \"margin_error\": 0.08 },\n    { \"hour\": 2, \"timestamp\": \"2026-03-02T19:00:00Z\", \"consumption_estimated\": 1.35, \"margin_error\": 0.12 },\n    { \"hour\": 3, \"timestamp\": \"2026-03-02T20:00:00Z\", \"consumption_estimated\": 1.10, \"margin_error\": 0.10 },\n    { \"hour\": 4, \"timestamp\": \"2026-03-02T21:00:00Z\", \"consumption_estimated\": 0.75, \"margin_error\": 0.07 },\n    { \"hour\": 5, \"timestamp\": \"2026-03-02T22:00:00Z\", \"consumption_estimated\": 0.40, \"margin_error\": 0.04 },\n    { \"hour\": 6, \"timestamp\": \"2026-03-02T23:00:00Z\", \"consumption_estimated\": 0.25, \"margin_error\": 0.03 },\n    { \"hour\": 7, \"timestamp\": \"2026-03-03T00:00:00Z\", \"consumption_estimated\": 0.15, \"margin_error\": 0.02 },\n    { \"hour\": 8, \"timestamp\": \"2026-03-03T01:00:00Z\", \"consumption_estimated\": 0.12, \"margin_error\": 0.01 },\n    { \"hour\": 9, \"timestamp\": \"2026-03-03T02:00:00Z\", \"consumption_estimated\": 0.10, \"margin_error\": 0.01 },\n    { \"hour\": 10, \"timestamp\": \"2026-03-03T03:00:00Z\", \"consumption_estimated\": 0.18, \"margin_error\": 0.02 },\n    { \"hour\": 11, \"timestamp\": \"2026-03-03T04:00:00Z\", \"consumption_estimated\": 0.35, \"margin_error\": 0.04 }\n  ]\n}\n```"
              }
            ],
            "role": "model"
          },
          "finishReason": "STOP",
          "index": 0
        }
      ],
      "usageMetadata": {
        "promptTokenCount": 11331,
        "candidatesTokenCount": 1747,
        "totalTokenCount": 19684,
        "promptTokensDetails": [
          {
            "modality": "TEXT",
            "tokenCount": 11331
          }
        ],
        "thoughtsTokenCount": 6606
      },
      "modelVersion": "gemini-2.5-flash",
      "responseId": "R11MaZ2GBvi6qtsPxoeLoQQ"
    };

    // 'of' crea un Observable que emite este objeto inmediatamente
    return of(mockResponse);
  }
}