export function TraducirEstado(estado: string): string {
    switch (estado) {
        case 'Available':
          return 'Disponible';
        case 'Preparing':
          return 'Preparando';
        case 'Charging':
          return 'Cargando';
        case 'Finishing':
          return 'Terminando';
        case 'Unavailable':
          return 'No disponible';
        case 'SuspendedEV':
          return 'Carga completa';
        case 'SuspendedEVSE':
          return 'Verificando';
        default:
          return estado;
      }
  }