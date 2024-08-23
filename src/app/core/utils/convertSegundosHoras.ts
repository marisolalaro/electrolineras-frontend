export function SegundosEnHoras(value: number): string {
    
    const hours = Math.floor(value / 3600);
    const minutes = Math.floor((value % 3600) / 60);
    const seconds = value % 60;

    const hoursStr = hours > 0 ? hours < 10 ? `0${hours}:` :`${hours}:` : '00:';
    const minutesStr = minutes > 0 ? minutes < 10 ? `0${minutes}:` :`${minutes}:` : '00:';
    const secondsStr = seconds > 0 ? seconds < 10 ? `0${seconds}` :`${seconds}` : '00';

    return `${hoursStr}${minutesStr}${secondsStr}`;
  }