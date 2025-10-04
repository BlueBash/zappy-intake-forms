/**
 * Interpolates variables in text strings
 * Supports ${calc.variable} and ${field_id} syntax
 */
export const interpolateText = (
  text: string,
  calculations: Record<string, any> = {},
  answers: Record<string, any> = {}
): string => {
  if (!text) return text;
  
  return text.replace(/\$\{([^}]+)\}/g, (match, expression) => {
    try {
      // Handle calc.variable syntax
      if (expression.startsWith('calc.')) {
        const calcKey = expression.substring(5); // Remove 'calc.'
        const value = calculations[calcKey];
        
        // Special handling for BMI rounding
        if (calcKey === 'bmi' && typeof value === 'number') {
          return (Math.round(value * 10) / 10).toString();
        }
        
        return value !== undefined ? String(value) : match;
      }
      
      // Handle direct field references
      const value = answers[expression];
      return value !== undefined ? String(value) : match;
    } catch (error) {
      console.error(`Error interpolating ${expression}:`, error);
      return match;
    }
  });
};
