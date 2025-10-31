// String interpolation utility for dynamic text replacement

export function interpolateText(text: string, values: Record<string, any>): string {
  if (!text) return '';
  
  return text.replace(/\{\{(\w+(?:\.\w+)*)\}\}/g, (match, key) => {
    const value = getNestedValue(values, key);
    return value !== undefined && value !== null ? String(value) : match;
  });
}

function getNestedValue(obj: Record<string, any>, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}
