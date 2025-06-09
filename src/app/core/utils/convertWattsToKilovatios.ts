export function WattsEnKilovatios(value: number, decimals: number = 2): string {
    
    if (isNaN(value) || value === null) {
      return 'Valor inválido';
    }
    // watts a kilovatios (1 kW = 1000 W)
    const kilowatts = value / 1000;
    
    // Redondear a la cantidad de decimales especificada + ' kW'
    return kilowatts.toFixed(decimals);
  }
