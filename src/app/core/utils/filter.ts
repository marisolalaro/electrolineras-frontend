export function setTitlesForPanelFilter(data: any): string {
    let attributesMessages: string[] = [];
    data.forEach((value: string, key: any) => {
        if(value){
            attributesMessages.push(key + ': ' + value);
        }
      });
    return `Filtrar por: ${attributesMessages.join(', ')}`;
}

export function getSelectedTags(receivedDocument: Document, idComponent: string): Map<string, any>{
    let datos = new Map<string, any>();
    const container = receivedDocument.getElementById(idComponent);

    if (!container) {
        return datos;
    }

    container.querySelectorAll('label').forEach((label) => {
        const labelText = label.textContent.trim();
        const inputId = label.getAttribute('for');
        const inputElement = receivedDocument.getElementById(inputId) as HTMLInputElement | HTMLSelectElement | null;

        if (inputElement) {
            const inputValue = getInputValue(inputElement);
            datos.set(labelText, inputValue);
        }
    });
    return datos;
}

function getInputValue(inputElement: HTMLInputElement | HTMLSelectElement): string {
    if (inputElement.tagName === 'INPUT' || inputElement.tagName === 'SELECT') {
      return inputElement.value;
    }
    const trimmedText = inputElement.textContent.trim();
    return (trimmedText.includes('Seleccion')) ? '' : trimmedText;
}

