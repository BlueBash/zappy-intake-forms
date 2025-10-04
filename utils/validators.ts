import { Field, Validation } from '../types';

/**
 * Validation utilities for form fields
 * Consolidates validation logic from TextScreen and CompositeScreen
 */

export const validateRequired = (value: any): string | undefined => {
  if (value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0)) {
    return 'This field is required.';
  }
  return undefined;
};

export const validatePattern = (value: string, pattern: string, errorMessage: string): string | undefined => {
  const regex = new RegExp(pattern);
  if (!regex.test(value)) {
    return errorMessage;
  }
  return undefined;
};

export const validateNumberRange = (
  value: string | number,
  min?: number,
  max?: number,
  errorMessage?: string
): string | undefined => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numValue)) {
    return 'Please enter a valid number.';
  }
  
  if (min !== undefined && numValue < min) {
    return errorMessage || `Value must be at least ${min}.`;
  }
  
  if (max !== undefined && numValue > max) {
    return errorMessage || `Value must be no more than ${max}.`;
  }
  
  return undefined;
};

export const validateDate = (
  value: string,
  mask: string,
  validation?: Validation,
  minToday?: boolean
): string | undefined => {
  if (!value) return undefined;
  
  const separator = mask.includes('/') ? '/' : '-';
  const parts = value.split(separator);
  
  // Check if date is complete
  if (parts.length !== 3 || parts[0].length !== 2 || parts[1].length !== 2 || parts[2].length !== 4) {
    return undefined; // Incomplete date, don't show error yet
  }
  
  const [month, day, year] = parts.map(Number);
  const inputDate = new Date(year, month - 1, day);
  
  // Check if date is valid
  if (
    isNaN(inputDate.getTime()) || 
    inputDate.getFullYear() !== year || 
    inputDate.getMonth() !== month - 1 || 
    inputDate.getDate() !== day
  ) {
    return validation?.error || 'Please enter a valid date.';
  }
  
  // Age validation
  if (validation?.min_age !== undefined || validation?.max_age !== undefined) {
    const today = new Date();
    let age = today.getFullYear() - inputDate.getFullYear();
    const m = today.getMonth() - inputDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < inputDate.getDate())) {
      age--;
    }
    
    if (validation.min_age !== undefined && age < validation.min_age) {
      return validation.error;
    }
    if (validation.max_age !== undefined && age > validation.max_age) {
      return validation.error;
    }
  }
  
  // Min today validation
  if (minToday) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (inputDate < today) {
      return 'Date cannot be in the past.';
    }
  }
  
  return undefined;
};

export const validateCrossField = (
  value: string | number,
  otherValue: string | number,
  operator: 'greater_than' | 'less_than' | 'matches',
  errorMessage: string
): string | undefined => {
  if (!value || otherValue === undefined || otherValue === null || otherValue === '') {
    return undefined;
  }
  
  if (operator === 'matches') {
    if (value !== otherValue) {
      return errorMessage;
    }
    return undefined;
  }
  
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  const numOther = typeof otherValue === 'string' ? parseFloat(otherValue) : otherValue;
  
  if (isNaN(numValue) || isNaN(numOther)) {
    return undefined;
  }
  
  if (operator === 'greater_than' && numValue <= numOther) {
    return errorMessage;
  }
  
  if (operator === 'less_than' && numValue >= numOther) {
    return errorMessage;
  }
  
  return undefined;
};

/**
 * Main validation function for any field type
 */
export const validateField = (
  field: Field,
  value: any,
  allAnswers: Record<string, any>
): string | undefined => {
  // Handle consent_item specially
  if (field.type === 'consent_item') {
    if (field.required && value !== true) {
      return 'This consent is required to continue.';
    }
    return undefined;
  }
  
  // Required validation
  if (field.required) {
    const requiredError = validateRequired(value);
    if (requiredError) return requiredError;
  }
  
  // If empty and not required, skip other validations
  if (!value || value === '' || (Array.isArray(value) && value.length === 0)) {
    return undefined;
  }
  
  // Pattern validation
  if (field.validation?.pattern && typeof value === 'string') {
    const patternError = validatePattern(value, field.validation.pattern, field.validation.error || 'Invalid format');
    if (patternError) return patternError;
  }
  
  // Number validation
  if (field.type === 'number') {
    const min = field.validation?.min ?? ('min' in field ? field.min : undefined);
    const max = field.validation?.max ?? ('max' in field ? field.max : undefined);
    const numberError = validateNumberRange(value, min, max, field.validation?.error);
    if (numberError) return numberError;
  }
  
  // Cross-field validation
  if (field.validation?.greater_than_field) {
    const otherValue = allAnswers[field.validation.greater_than_field.field];
    const crossError = validateCrossField(
      value,
      otherValue,
      'greater_than',
      field.validation.greater_than_field.error
    );
    if (crossError) return crossError;
  }
  
  if (field.validation?.less_than_field) {
    const otherValue = allAnswers[field.validation.less_than_field.field];
    const crossError = validateCrossField(
      value,
      otherValue,
      'less_than',
      field.validation.less_than_field.error
    );
    if (crossError) return crossError;
  }
  
  if (field.validation?.matches) {
    const otherValue = allAnswers[field.validation.matches];
    const matchError = validateCrossField(
      value,
      otherValue,
      'matches',
      field.validation.error || 'Values do not match'
    );
    if (matchError) return matchError;
  }
  
  return undefined;
};
