import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Base64ToImageService {

  constructor() { }

  base64ToBlob(base64: string, contentType: string = 'image/jpeg', sliceSize: number = 512): Blob {
    const byteCharacters = atob(base64);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);

      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: contentType });
  }

  // Función para convertir Base64 a una URL de objeto
  base64ToImageUrl(base64: string): string {
    const blob = this.base64ToBlob(base64);
    return URL.createObjectURL(blob);
  }

}
