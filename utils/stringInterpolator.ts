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
  
  let result = text.replace(/\$\{([^}]+)\}/g, (match, expression) => {
    try {
      // Handle calc.variable syntax
      if (expression.startsWith('calc.')) {
        const calcKey = expression.substring(5); // Remove 'calc.'
        let value = calculations[calcKey];
        
        // Special handling for BMI rounding
        if (calcKey === 'bmi' && typeof value === 'number') {
          return (Math.round(value * 10) / 10).toString();
        }
        
        // Special handling for weight_loss calculation (20% of highest_weight or weight)
        if (calcKey === 'weight_loss') {
          // Always calculate if not already set (undefined or null means not in calculations object)
          if (value === undefined || value === null) {
            // Try to get weight from answers, handling both string and number formats
            const highestWeightStr = answers['highest_weight'];
            const weightStr = answers['weight'];
            
            let highestWeight = 0;
            if (highestWeightStr !== undefined && highestWeightStr !== null && highestWeightStr !== '') {
              highestWeight = parseFloat(String(highestWeightStr));
            }
            if ((!highestWeight || isNaN(highestWeight)) && weightStr !== undefined && weightStr !== null && weightStr !== '') {
              highestWeight = parseFloat(String(weightStr));
            }
            
            if (highestWeight > 0 && !isNaN(highestWeight)) {
              value = Math.round(highestWeight * 0.2);
            }
          }
        }
        
        // Return calculated value if available, otherwise return match (to show placeholder for debugging)
        if (value !== undefined && value !== null && value !== '') {
          return String(value);
        }
        
        // For calc values, return match so user can see what's missing
        return match;
      }
      
      // Handle direct field references
      // Check multiple possible field name variations for common fields
      let value = answers[expression];
      
      // Fallback for common field name variations - check all variations for names
      // This ensures we check alternative field names even if the primary one exists but is empty
      if (expression === 'first_name') {
        // Check all possible field name variations in order of preference
        const firstNameFields = [
          answers['account_firstName'],
          answers['firstName'],
          answers['first_name'],
          answers['account_first_name']
        ];
        value = firstNameFields.find(field => field !== undefined && field !== null && field !== '');
      } else if (expression === 'last_name') {
        // Check all possible field name variations in order of preference
        const lastNameFields = [
          answers['account_lastName'],
          answers['lastName'],
          answers['last_name'],
          answers['account_last_name']
        ];
        value = lastNameFields.find(field => field !== undefined && field !== null && field !== '');
      }
      
      // Return the value if found, otherwise return empty string to clean up the template
      if (value !== undefined && value !== null && value !== '') {
        return String(value).trim();
      }
      
      // Return empty string for missing values so we can clean them up
      return '';
    } catch (error) {
      console.error(`Error interpolating ${expression}:`, error);
      return match; // Return original match on error for debugging
    }
  });
  
  // Clean up extra spaces and commas left by missing values
  // Remove trailing comma and space before punctuation
  result = result.replace(/,\s*!/g, '!');
  result = result.replace(/,\s*\./g, '.');
  result = result.replace(/,\s*:/g, ':');
  result = result.replace(/,\s*,/g, ','); // Remove duplicate commas
  result = result.replace(/\s{2,}/g, ' '); // Collapse multiple spaces to single space
  result = result.replace(/,\s*$/g, ''); // Remove trailing comma
  result = result.trim();
  
  return result;
};
