import { Injectable } from '@angular/core';
import { HttpBackend, HttpClient, HttpHeaders } from '@angular/common/http';
import { EndPoins } from 'src/app/core/constants/endPoints';
import { of } from 'rxjs';
// models

@Injectable()

export class AgenteIaService {

 private apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
  // Tu API Key (Recuerda no compartirla públicamente en producción)
  private apiKey = 'AIzaSyCEG_v6Ut0TmaLGMNppgQMY7sJF4-g-5yg';

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
                  "text": "```json\n{\n  \"prediction_start\": \"2025-05-16T11:00:00Z\",\n  \"prediction_end\": \"2025-05-17T11:00:00Z\",\n  \"generated_at\": \"2024-07-30T12:00:00Z\",\n  \"timezone\": \"UTC\",\n  \"predictions\": [\n    {\n      \"hour\": 0,\n      \"timestamp\": \"2025-05-16T11:00:00Z\",\n      \"consumption_estimated\": 362.62,\n      \"margin_error\": 45.42\n    },\n    {\n      \"hour\": 1,\n      \"timestamp\": \"2025-05-16T12:00:00Z\",\n      \"consumption_estimated\": 305.13,\n      \"margin_error\": 206.66\n    },\n    {\n      \"hour\": 2,\n      \"timestamp\": \"2025-05-16T13:00:00Z\",\n      \"consumption_estimated\": 573.51,\n      \"margin_error\": 114.7\n    },\n    {\n      \"hour\": 3,\n      \"timestamp\": \"2025-05-16T14:00:00Z\",\n      \"consumption_estimated\": 573.51,\n      \"margin_error\": 114.7\n    },\n    {\n      \"hour\": 4,\n      \"timestamp\": \"2025-05-16T15:00:00Z\",\n      \"consumption_estimated\": 573.51,\n      \"margin_error\": 114.7\n    },\n    {\n      \"hour\": 5,\n      \"timestamp\": \"2025-05-16T16:00:00Z\",\n      \"consumption_estimated\": 573.51,\n      \"margin_error\": 114.7\n    },\n    {\n      \"hour\": 6,\n      \"timestamp\": \"2025-05-16T17:00:00Z\",\n      \"consumption_estimated\": 573.51,\n      \"margin_error\": 114.7\n    },\n    {\n      \"hour\": 7,\n      \"timestamp\": \"2025-05-16T18:00:00Z\",\n      \"consumption_estimated\": 573.51,\n      \"margin_error\": 114.7\n    },\n    {\n      \"hour\": 8,\n      \"timestamp\": \"2025-05-16T19:00:00Z\",\n      \"consumption_estimated\": 573.51,\n      \"margin_error\": 114.7\n    },\n    {\n      \"hour\": 9,\n      \"timestamp\": \"2025-05-16T20:00:00Z\",\n      \"consumption_estimated\": 573.51,\n      \"margin_error\": 114.7\n    },\n    {\n      \"hour\": 10,\n      \"timestamp\": \"2025-05-16T21:00:00Z\",\n      \"consumption_estimated\": 573.51,\n      \"margin_error\": 114.7\n    },\n    {\n      \"hour\": 11,\n      \"timestamp\": \"2025-05-16T22:00:00Z\",\n      \"consumption_estimated\": 573.51,\n      \"margin_error\": 114.7\n    },\n    {\n      \"hour\": 12,\n      \"timestamp\": \"2025-05-16T23:00:00Z\",\n      \"consumption_estimated\": 573.51,\n      \"margin_error\": 114.7\n    },\n    {\n      \"hour\": 13,\n      \"timestamp\": \"2025-05-17T00:00:00Z\",\n      \"consumption_estimated\": 573.51,\n      \"margin_error\": 114.7\n    },\n    {\n      \"hour\": 14,\n      \"timestamp\": \"2025-05-17T01:00:00Z\",\n      \"consumption_estimated\": 573.51,\n      \"margin_error\": 114.7\n    },\n    {\n      \"hour\": 15,\n      \"timestamp\": \"2025-05-17T02:00:00Z\",\n      \"consumption_estimated\": 573.51,\n      \"margin_error\": 114.7\n    },\n    {\n      \"hour\": 16,\n      \"timestamp\": \"2025-05-17T03:00:00Z\",\n      \"consumption_estimated\": 573.51,\n      \"margin_error\": 114.7\n    },\n    {\n      \"hour\": 17,\n      \"timestamp\": \"2025-05-17T04:00:00Z\",\n      \"consumption_estimated\": 573.51,\n      \"margin_error\": 114.7\n    },\n    {\n      \"hour\": 18,\n      \"timestamp\": \"2025-05-17T05:00:00Z\",\n      \"consumption_estimated\": 573.51,\n      \"margin_error\": 114.7\n    },\n    {\n      \"hour\": 19,\n      \"timestamp\": \"2025-05-17T06:00:00Z\",\n      \"consumption_estimated\": 573.51,\n      \"margin_error\": 114.7\n    },\n    {\n      \"hour\": 20,\n      \"timestamp\": \"2025-05-17T07:00:00Z\",\n      \"consumption_estimated\": 573.51,\n      \"margin_error\": 114.7\n    },\n    {\n      \"hour\": 21,\n      \"timestamp\": \"2025-05-17T08:00:00Z\",\n      \"consumption_estimated\": 573.51,\n      \"margin_error\": 114.7\n    },\n    {\n      \"hour\": 22,\n      \"timestamp\": \"2025-05-17T09:00:00Z\",\n      \"consumption_estimated\": 573.51,\n      \"margin_error\": 114.7\n    },\n    {\n      \"hour\": 23,\n      \"timestamp\": \"2025-05-17T10:00:00Z\",\n      \"consumption_estimated\": 1052.78,\n      \"margin_error\": 1292.89\n    }\n  ]\n}\n```"
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