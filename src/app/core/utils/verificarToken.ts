export function ValidaToken() {
  let jwtToken = localStorage.getItem('token');
  let theme = localStorage.getItem('theme');
  try {
    if (localStorage.getItem('token')) {
      // Dividir el token en sus partes: header.payload.signature
      const [header, payload, signature] = localStorage
        .getItem('token')
        .split('.');

      // Decodificar el payload (base64url)
      const decodedPayload = JSON.parse(
        atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
      );

      // Verificar si tiene expiración
      if (!decodedPayload.exp) {
        // return null; // No tiene fecha de expiración
        return false;
      }

      // Convertir timestamp UNIX a fecha legible
      const expirationDate = new Date(decodedPayload.exp * 1000);
      // return {
      //     timestamp: decodedPayload.exp,
      //     date: expirationDate,
      //     isExpired: Date.now() >= expirationDate.getTime()
      // };
      return expirationDate.getTime() >= Date.now();
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error al decodificar el JWT:', error);
    // return null;
    return false;
  }
}
