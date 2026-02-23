function getCssVariable(variable) {
    const value = getComputedStyle(document.documentElement)
        .getPropertyValue(variable).trim();
    // Asegurar que tenga el # al inicio
    return value.startsWith('#') ? value : `#${value}`;
}

export const color: any =
{
    sistema: getCssVariable('--color-claro'), // Retorna '#001b67' como string
}