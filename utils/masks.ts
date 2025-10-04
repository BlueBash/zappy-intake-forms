/**
 * Input mask utilities
 * Consolidates masking logic from CompositeScreen and TextScreen
 */

/**
 * Apply phone mask: (###) ###-####
 */
export const applyPhoneMask = (value: string): string => {
  if (!value) return '';
  
  const digitsOnly = value.replace(/\D/g, '').slice(0, 10);
  const length = digitsOnly.length;

  if (length === 0) return '';
  if (length <= 3) return `(${digitsOnly}`;
  if (length <= 6) return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3)}`;
  return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6, 10)}`;
};

/**
 * Apply date mask: ##/##/#### or ##-##-####
 */
export const applyDateMask = (value: string, mask: string): string => {
  if (!value) return '';
  
  const separator = mask.includes('/') ? '/' : '-';
  const digitsOnly = value.replace(/\D/g, '');
  const limitedDigits = digitsOnly.slice(0, 8);
  
  let formattedValue = '';
  if (limitedDigits.length > 4) {
    formattedValue = `${limitedDigits.slice(0, 2)}${separator}${limitedDigits.slice(2, 4)}${separator}${limitedDigits.slice(4)}`;
  } else if (limitedDigits.length > 2) {
    formattedValue = `${limitedDigits.slice(0, 2)}${separator}${limitedDigits.slice(2)}`;
  } else {
    formattedValue = limitedDigits;
  }
  
  return formattedValue;
};

/**
 * Generic mask application router
 */
export const applyMask = (value: string, mask: string): string => {
  if (mask === '(###) ###-####') {
    return applyPhoneMask(value);
  }
  
  if (mask === '##/##/####' || mask === '##-##-####') {
    return applyDateMask(value, mask);
  }
  
  // No mask recognized, return as-is
  return value;
};
