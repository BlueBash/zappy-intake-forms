import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight, Check, AlertCircle, Info } from 'lucide-react';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { ProgressIndicator } from './ProgressIndicator';

// Type definitions (these would come from your types file)
interface Field {
  id: string;
  type: string;
  label?: string;
  help_text?: string;
  placeholder?: string;
  required?: boolean;
  conditional_display?: {
    show_if: string;
  };
  validation?: {
    pattern?: string;
    error?: string;
    matches?: string;
    min?: number;
    max?: number;
    greater_than_field?: { field: string; error: string };
    less_than_field?: { field: string; error: string };
  };
}

interface TextField extends Field {
  type: 'text' | 'email' | 'password';
  multiline?: boolean;
  rows?: number;
  mask?: string;
}

interface NumberField extends Field {
  type: 'number';
  min?: number;
  max?: number;
  suffix?: string;
}

interface SelectField extends Field {
  type: 'single_select' | 'multi_select';
  options: Array<{ value: string; label: string }>;
  conditional_options?: {
    based_on: string;
    options_map: Record<string, Array<{ value: string; label: string }>>;
  };
}

interface CheckboxField extends Field {
  type: 'checkbox';
}

interface ConsentItemField extends Field {
  type: 'consent_item';
  links?: Array<{ label: string; url: string }>;
}

interface MedicationDetailsGroupField extends Field {
  type: 'medication_details_group';
  fields: FieldOrFieldGroup[];
}

type FieldOrFieldGroup = Field | Field[];

interface CompositeScreenProps {
  screen: {
    id: string;
    title: string;
    help_text?: string;
    fields: FieldOrFieldGroup[];
    footer_note?: string;
    post_screen_note?: string;
    validation?: {
      max_currently_taking?: {
        fields: string[];
        limit: number;
        error: string;
      };
    };
  };
  answers: Record<string, any>;
  updateAnswer: (fieldId: string, value: any) => void;
  onSubmit: () => void;
  showBack?: boolean;
  onBack?: () => void;
  currentStep?: number;
  totalSteps?: number;
  calculations?: Record<string, any>;
}

// Utility functions
const checkCondition = (condition: string, answers: Record<string, any>): boolean => {
  const containsMatch = condition.match(/(\w+)\s+contains\s+['"]?([\w\s/.-]+)['"]?/);
  if (containsMatch) {
    const [, fieldId, value] = containsMatch;
    const fieldValue = answers[fieldId];
    return Array.isArray(fieldValue) && fieldValue.includes(value);
  }

  const match = condition.match(/([\w.]+)\s*(==|!=)\s*['"]?([\w\s/.-]+)['"]?/);
  if (!match) return true;

  const [, fieldId, operator, value] = match;
  const fieldValue = answers[fieldId];

  if (operator === '==') return String(fieldValue) === value;
  if (operator === '!=') return String(fieldValue) !== value;
  return true;
};

const shouldShowField = (field: Field, answers: Record<string, any>): boolean => {
  if (!field.conditional_display) return true;
  const { show_if } = field.conditional_display;

  if (show_if.includes(' OR ')) {
    return show_if.split(' OR ').some(cond => checkCondition(cond.trim(), answers));
  }
  if (show_if.includes(' AND ')) {
    return show_if.split(' AND ').every(cond => checkCondition(cond.trim(), answers));
  }
  return checkCondition(show_if, answers);
};

const applyPhoneMask = (value: string): string => {
  if (!value) return '';
  const digitsOnly = value.replace(/\D/g, '').slice(0, 10);
  const length = digitsOnly.length;

  if (length === 0) return '';
  if (length <= 3) return `(${digitsOnly}`;
  if (length <= 6) return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3)}`;
  return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6, 10)}`;
};

export function ElegantCompositeScreen({
  screen,
  answers,
  updateAnswer,
  onSubmit,
  showBack,
  onBack,
  currentStep = 1,
  totalSteps = 1,
  calculations = {},
}: CompositeScreenProps) {
  const { title, help_text, fields, footer_note, validation, post_screen_note } = screen;
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  // Flatten all fields for validation
  const allFields = useMemo(() => {
    const flattened: Field[] = [];
    const recurse = (items: FieldOrFieldGroup[]) => {
      for (const item of items) {
        if (Array.isArray(item)) {
          recurse(item);
        } else {
          flattened.push(item);
          if (item.type === 'medication_details_group') {
            recurse((item as MedicationDetailsGroupField).fields);
          }
        }
      }
    };
    recurse(fields);
    return flattened;
  }, [fields]);

  const validateField = (field: Field, value: any, currentAnswers: Record<string, any>): string | undefined => {
    if (!field) return undefined;

    if (field.type === 'consent_item') {
      if (field.required && value !== true) {
        return 'This consent is required to continue.';
      }
      return undefined;
    }

    if (field.required && (value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0))) {
      return 'This field is required.';
    }

    if (value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0)) {
      return undefined;
    }

    if (field.validation) {
      if (field.validation.pattern && typeof value === 'string') {
        const regex = new RegExp(field.validation.pattern);
        if (!regex.test(value)) {
          return field.validation.error;
        }
      }
      if (field.validation.matches) {
        if (value !== currentAnswers[field.validation.matches]) {
          return field.validation.error;
        }
      }
      if (field.type === 'number') {
        const numValue = parseFloat(value);
        if (isNaN(numValue)) return 'Please enter a valid number.';

        if (field.validation.min !== undefined && numValue < field.validation.min) {
          return field.validation.error;
        }
        if (field.validation.max !== undefined && numValue > field.validation.max) {
          return field.validation.error;
        }
      }
    }

    return undefined;
  };

  const handleBlur = (fieldId: string) => {
    const field = allFields.find(f => f.id === fieldId);
    if (field) {
      const error = validateField(field, answers[fieldId], answers);
      setErrors(prev => ({ ...prev, [fieldId]: error }));
    }
  };

  const handleSubmit = () => {
    const newErrors: Record<string, string | undefined> = {};
    let allValid = true;

    const validateVisibleFields = (fieldsToValidate: FieldOrFieldGroup[]) => {
      for (const fieldOrGroup of fieldsToValidate) {
        if (Array.isArray(fieldOrGroup)) {
          validateVisibleFields(fieldOrGroup);
        } else {
          const field = fieldOrGroup;
          if (shouldShowField(field, answers)) {
            if (field.type === 'medication_details_group') {
              validateVisibleFields((field as MedicationDetailsGroupField).fields);
            } else {
              const error = validateField(field, answers[field.id], answers);
              if (error) {
                allValid = false;
                newErrors[field.id] = error;
              }
            }
          }
        }
      }
    };
    validateVisibleFields(fields);

    setErrors(newErrors);

    if (allValid) {
      onSubmit();
    }
  };

  const isComplete = useMemo(() => {
    let complete = true;
    const checkCompletionRecursively = (fieldsToCheck: FieldOrFieldGroup[]) => {
      for (const fieldOrGroup of fieldsToCheck) {
        if (!complete) return;

        if (Array.isArray(fieldOrGroup)) {
          checkCompletionRecursively(fieldOrGroup);
        } else {
          const field = fieldOrGroup;
          if (shouldShowField(field, answers)) {
            if (field.type === 'medication_details_group') {
              checkCompletionRecursively((field as MedicationDetailsGroupField).fields);
            } else if (field.required) {
              const value = answers[field.id];
              if (field.type === 'consent_item') {
                if (value !== true) complete = false;
              } else if (Array.isArray(value)) {
                if (value.length === 0) complete = false;
              } else if (value === undefined || value === null || value === '') {
                complete = false;
              }
            }
          }
        }
      }
    };
    checkCompletionRecursively(fields);
    return complete;
  }, [fields, answers]);

  // Render field based on type
  const renderField = (field: Field, index: number): React.ReactNode => {
    if (!shouldShowField(field, answers)) {
      return null;
    }

    const value = answers[field.id];
    const error = errors[field.id];

    switch (field.type) {
      case 'text':
      case 'email':
      case 'password': {
        const textField = field as TextField;
        const isPhoneMask = textField.mask === '(###) ###-####';

        return (
          <motion.div
            key={field.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
          >
            {field.label && (
              <Label htmlFor={field.id} className="mb-2 text-neutral-800">
                {field.label}
                {field.required && <span className="text-[#FF7A59] ml-1">*</span>}
              </Label>
            )}
            {field.help_text && (
              <p className="text-sm text-neutral-600 mb-3 flex items-start gap-2">
                <Info className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#0D9488]" />
                {field.help_text}
              </p>
            )}
            {textField.multiline ? (
              <textarea
                id={field.id}
                value={value || ''}
                onChange={(e) => updateAnswer(field.id, e.target.value)}
                onBlur={() => handleBlur(field.id)}
                placeholder={field.placeholder}
                rows={textField.rows || 4}
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 bg-white ${
                  error
                    ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                    : 'border-gray-200 focus:border-[#1a7f72] focus:ring-4 focus:ring-[#1a7f72]/10'
                } outline-none resize-none`}
              />
            ) : (
              <input
                id={field.id}
                type={field.type}
                value={value || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  updateAnswer(field.id, isPhoneMask ? applyPhoneMask(val) : val);
                }}
                onBlur={() => handleBlur(field.id)}
                placeholder={field.placeholder}
                maxLength={isPhoneMask ? 14 : undefined}
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 bg-white ${
                  error
                    ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                    : 'border-gray-200 focus:border-[#0D9488] focus:ring-4 focus:ring-[#0D9488]/10'
                } outline-none`}
              />
            )}
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-sm text-red-500 flex items-center gap-1"
              >
                <AlertCircle className="w-4 h-4" />
                {error}
              </motion.p>
            )}
          </motion.div>
        );
      }

      case 'number': {
        const numberField = field as NumberField;
        return (
          <motion.div
            key={field.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
          >
            {field.label && (
              <Label htmlFor={field.id} className="mb-2 text-neutral-800">
                {field.label}
                {field.required && <span className="text-[#FF7A59] ml-1">*</span>}
              </Label>
            )}
            {field.help_text && (
              <p className="text-sm text-neutral-600 mb-3 flex items-start gap-2">
                <Info className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#0D9488]" />
                {field.help_text}
              </p>
            )}
            <div className="relative">
              <input
                id={field.id}
                type="text"
                inputMode="numeric"
                value={value || ''}
                onChange={(e) => {
                  if (/^\d*\.?\d*$/.test(e.target.value)) {
                    updateAnswer(field.id, e.target.value);
                  }
                }}
                onBlur={() => handleBlur(field.id)}
                placeholder={field.placeholder}
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 bg-white ${
                  numberField.suffix ? 'pr-16' : ''
                } ${
                  error
                    ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                    : 'border-gray-200 focus:border-[#0D9488] focus:ring-4 focus:ring-[#0D9488]/10'
                } outline-none`}
              />
              {numberField.suffix && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500">
                  {numberField.suffix}
                </span>
              )}
            </div>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-sm text-red-500 flex items-center gap-1"
              >
                <AlertCircle className="w-4 h-4" />
                {error}
              </motion.p>
            )}
          </motion.div>
        );
      }

      case 'single_select': {
        const selectField = field as SelectField;
        const options = selectField.conditional_options
          ? selectField.conditional_options.options_map[answers[selectField.conditional_options.based_on]] || []
          : selectField.options;

        return (
          <motion.div
            key={field.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
          >
            {field.label && (
              <Label className="mb-3 text-neutral-800">
                {field.label}
                {field.required && <span className="text-[#FF7A59] ml-1">*</span>}
              </Label>
            )}
            {field.help_text && (
              <p className="text-sm text-neutral-600 mb-3 flex items-start gap-2">
                <Info className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#0D9488]" />
                {field.help_text}
              </p>
            )}
            <div className="space-y-2">
              {options.map((option, optIndex) => (
                <motion.button
                  key={option.value}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: optIndex * 0.05, duration: 0.2 }}
                  onClick={() => updateAnswer(field.id, option.value)}
                  className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left group relative overflow-hidden ${
                    value === option.value
                      ? 'border-[#1a7f72] bg-[#e6f3f2] shadow-sm'
                      : 'border-gray-200 bg-white hover:border-[#1a7f72]/40 hover:shadow-sm hover:scale-[1.01]'
                  }`}
                  style={{ transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}
                >
                  <div className="flex items-center justify-between">
                    <span className={value === option.value ? 'text-[#0D9488]' : 'text-neutral-700'}>
                      {option.label}
                    </span>
                    {value === option.value ? (
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                        className="w-6 h-6 rounded-full bg-[#00A896] flex items-center justify-center shadow-md"
                      >
                        <Check className="w-4 h-4 text-white" strokeWidth={3} />
                      </motion.div>
                    ) : (
                      <div className="w-6 h-6 rounded-full border-2 border-gray-300 group-hover:border-[#0D9488]/40 transition-colors" />
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-sm text-red-500 flex items-center gap-1"
              >
                <AlertCircle className="w-4 h-4" />
                {error}
              </motion.p>
            )}
          </motion.div>
        );
      }

      case 'checkbox':
      case 'consent_item': {
        const checkboxField = field as CheckboxField | ConsentItemField;
        return (
          <motion.div
            key={field.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            onClick={() => updateAnswer(field.id, !value)}
            className={`p-5 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
              value
                ? 'border-[#1a7f72] bg-[#e6f3f2]'
                : 'border-gray-200 bg-white hover:border-[#1a7f72]/30'
            }`}
          >
            <div className="flex items-start gap-3">
              <Checkbox
                id={field.id}
                checked={!!value}
                onCheckedChange={(checked) => updateAnswer(field.id, checked)}
                className="mt-0.5"
              />
              <Label htmlFor={field.id} className="cursor-pointer flex-1">
                {field.label}
              </Label>
            </div>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 text-sm text-red-500 flex items-center gap-1 ml-8"
              >
                <AlertCircle className="w-4 h-4" />
                {error}
              </motion.p>
            )}
          </motion.div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-6 py-8">
      {totalSteps > 1 && (
        <ProgressIndicator currentStep={currentStep} totalSteps={totalSteps} />
      )}

      <div className="mb-8 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl text-[#1a1a1a] mb-3 leading-tight"
        >
          {title}
        </motion.h1>
        {help_text && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-neutral-600 max-w-xl mx-auto"
          >
            {help_text}
          </motion.p>
        )}
      </div>

      <div className="space-y-6">
        {fields.map((fieldOrGroup, index) => {
          if (Array.isArray(fieldOrGroup)) {
            return (
              <div key={`group-${index}`} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fieldOrGroup.map((field, subIndex) => renderField(field, index + subIndex))}
              </div>
            );
          } else {
            return renderField(fieldOrGroup, index);
          }
        })}
      </div>

      {footer_note && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 p-4 rounded-xl bg-[#0D9488]/10 text-[#0D9488] text-sm text-center"
        >
          {footer_note}
        </motion.div>
      )}

      <AnimatePresence>
        {isComplete && post_screen_note && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="mt-6 text-center"
          >
            <div className="inline-flex items-center gap-2 bg-[#00A896] text-white px-5 py-2.5 rounded-full text-sm">
              <Check className="w-4 h-4" />
              {post_screen_note}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-between items-center mt-12">
        {showBack && onBack ? (
          <Button
            onClick={onBack}
            variant="ghost"
            className="text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 px-5 py-3 rounded-xl group"
          >
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back
          </Button>
        ) : (
          <div />
        )}

        <Button
          onClick={handleSubmit}
          disabled={!isComplete}
          className={`px-8 py-3 rounded-xl transition-all duration-300 group ${
            isComplete
              ? 'bg-[#FF6B6B] hover:bg-[#FF5252] text-white shadow-lg hover:shadow-xl'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Continue
          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
}

export default ElegantCompositeScreen;
