import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScreenProps } from './common';
import { CompositeScreen as CompositeScreenType, Field, FieldOrFieldGroup, SelectField, TextField, ConsentItemField, Link, MedicationDetailsGroupField, CheckboxField } from '../../types';
import ScreenLayout from '../common/ScreenLayout';
import NavigationButtons from '../common/NavigationButtons';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Checkbox from '../ui/Checkbox';
import CheckboxGroup from '../common/CheckboxGroup';
import SingleSelectButtonGroup from '../common/SingleSelectButtonGroup';
import { BMIGauge } from '../ui/Illustrations';
import RegionDropdown from '../common/RegionDropdown';

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

const CompositeScreen: React.FC<ScreenProps & { screen: CompositeScreenType }> = ({ screen, answers, updateAnswer, onSubmit, showBack, onBack, headerSize, calculations = {}, showLoginLink }) => {
  const { title, help_text, fields, footer_note, validation, post_screen_note } = screen;
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const autoAdvanceTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const initialState = answers['demographics.state'];
    if (initialState && (answers['state'] === undefined || answers['state'] === null || answers['state'] === '')) {
      updateAnswer('state', initialState);
    }
  }, [answers, updateAnswer]);

  useEffect(() => {
    return () => {
      if (autoAdvanceTimeoutRef.current) {
        clearTimeout(autoAdvanceTimeoutRef.current);
      }
    };
  }, []);

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
        if (isNaN(numValue)) { return 'Please enter a valid number.'; }

        if (field.validation.min !== undefined && numValue < field.validation.min) {
          return field.validation.error;
        }
        if (field.validation.max !== undefined && numValue > field.validation.max) {
          return field.validation.error;
        }
      }

      const numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        if (field.validation.greater_than_field) {
          const otherFieldId = field.validation.greater_than_field.field;
          const otherValueStr = currentAnswers[otherFieldId];
          if (otherValueStr !== undefined && otherValueStr !== null && otherValueStr !== '') {
            const otherValue = parseFloat(otherValueStr);
            if (!isNaN(otherValue) && numValue < otherValue) {
              return field.validation.greater_than_field.error;
            }
          }
        }
        if (field.validation.less_than_field) {
          const otherFieldId = field.validation.less_than_field.field;
          const otherValueStr = currentAnswers[otherFieldId];
          if (otherValueStr !== undefined && otherValueStr !== null && otherValueStr !== '') {
            const otherValue = parseFloat(otherValueStr);
            if (!isNaN(otherValue) && numValue > otherValue) {
              return field.validation.less_than_field.error;
            }
          }
        }
      }
    }
    
    if (field.type === 'number' && (!field.validation || (field.validation.min === undefined && field.validation.max === undefined))) {
      const numValue = parseFloat(value);
      if (isNaN(numValue)) { return 'Please enter a valid number.'; }
      
      const min = 'min' in field ? field.min : undefined;
      const max = 'max' in field ? field.max : undefined;

      if (min !== undefined && numValue < min) {
        return `Value must be at least ${min}.`;
      }
      if (max !== undefined && numValue > max) {
        return `Value must be no more than ${max}.`;
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

    if (validation?.max_currently_taking) {
      const rule = validation.max_currently_taking;
      const currentlyTakingCount = rule.fields.filter(fieldId => answers[fieldId] === 'yes').length;
      
      if (currentlyTakingCount > rule.limit) {
        allValid = false;
        rule.fields.forEach(fieldId => {
          if (answers[fieldId] === 'yes') {
            newErrors[fieldId] = rule.error;
          }
        });
      }
    }

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
  
  const renderConsentLabel = (item: { label?: string, links?: Link[] }) => {
    if (!item.label) {
      return null;
    }
    if (!item.links || item.links.length === 0) {
      return item.label;
    }
  
    let label: (string | React.ReactNode)[] = [item.label];
    item.links.forEach((link, i) => {
      const newLabel: (string | React.ReactNode)[] = [];
      label.forEach(part => {
        if (typeof part !== 'string') {
          newLabel.push(part);
          return;
        }
        const split = part.split(link.label);
        split.forEach((text, j) => {
          newLabel.push(text);
          if (j < split.length - 1) {
            newLabel.push(
              <a 
                key={`${link.url}-${i}-${j}`} 
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-primary font-semibold hover:underline" 
                onClick={e => e.stopPropagation()}
              >
                {link.label}
              </a>
            );
          }
        });
      });
      label = newLabel;
    });
  
    return <span>{label}</span>;
  };

  const renderField = (field: Field): React.ReactNode => {
    if (!shouldShowField(field, answers)) {
      return null;
    }
    const value = answers[field.id];

    switch (field.type) {
      case 'text':
      case 'email':
      case 'password': {
        const textField = field as TextField;
        const isPhoneMask = textField.mask === '(###) ###-####';

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const val = e.target.value;
            if (isPhoneMask) {
                updateAnswer(field.id, applyPhoneMask(val));
            } else {
                updateAnswer(field.id, val);
            }
        };

        return textField.multiline ? (
          <div>
            {field.label && <label htmlFor={field.id} className="block text-base font-bold mb-2 text-stone-800 tracking-tight">{field.label}</label>}
            {field.help_text && <p className="text-sm -mt-2 mb-3 text-stone-600">{field.help_text}</p>}
            <textarea
              id={field.id}
              value={value || ''}
              onChange={(e) => updateAnswer(field.id, e.target.value)}
              onBlur={() => handleBlur(field.id)}
              placeholder={field.placeholder}
              rows={textField.rows || 4}
              className={`block w-full rounded-lg transition-all duration-200 py-[18px] px-5 text-[1.0625rem] text-stone-900 border-2 ${errors[field.id] ? 'border-red-500' : 'border-stone-200'} focus:border-primary focus:outline-none`}
            />
            {errors[field.id] && <p className="mt-2 text-sm font-medium text-red-500">{errors[field.id]}</p>}
          </div>
        ) : (
          <Input
            id={field.id}
            type={field.type}
            label={field.label}
            help_text={field.help_text}
            placeholder={field.placeholder}
            value={value || ''}
            onChange={handleChange}
            onBlur={() => handleBlur(field.id)}
            error={errors[field.id]}
            maxLength={isPhoneMask ? 14 : undefined}
          />
        );
      }
      case 'number':
        return (
          <Input
            id={field.id}
            type="text"
            inputMode="numeric"
            label={field.label}
            help_text={field.help_text}
            placeholder={field.placeholder}
            suffix={'suffix' in field ? field.suffix : undefined}
            value={value || ''}
            onChange={(e) => {
                if (/^\d*\.?\d*$/.test(e.target.value)) {
                    updateAnswer(field.id, e.target.value);
                }
            }}
            onBlur={() => handleBlur(field.id)}
            error={errors[field.id]}
          />
        );
      case 'single_select': {
        if (field.id === 'state') {
          return (
            <div>
              {field.label && (
                <label className="block text-base font-bold mb-2 text-stone-800 tracking-tight">
                  {field.label}
                </label>
              )}
              {field.help_text && (
                <p className="text-sm -mt-2 mb-3 text-stone-600">{field.help_text}</p>
              )}
              <RegionDropdown
                value={value || ''}
                onChange={(stateCode) => updateAnswer(field.id, stateCode)}
                placeholder={field.placeholder || 'Select state'}
              />
              {errors[field.id] && <p className="mt-2 text-sm font-medium text-red-500">{errors[field.id]}</p>}
            </div>
          );
        }

        const selectField = field as SelectField;
        const options = selectField.conditional_options 
            ? (selectField.conditional_options.options_map[answers[selectField.conditional_options.based_on]] || [])
            : selectField.options;

        return (
            <div>
                {field.label && (
                    <label className="block text-base font-bold mb-2 text-stone-800 tracking-tight">
                        {field.label}
                    </label>
                )}
                {field.help_text && (
                    <p className="text-sm -mt-2 mb-3 text-stone-600">
                        {field.help_text}
                    </p>
                )}
                <SingleSelectButtonGroup
                    options={options}
                    selectedValue={value}
                    onSelect={(val) => updateAnswer(field.id, val)}
                />
                {errors[field.id] && <p className="mt-2 text-sm font-medium text-red-500">{errors[field.id]}</p>}
            </div>
        )
      }
      case 'multi_select': {
          const multiSelectField = field as SelectField;
          const handleMultiSelectChange = (newValues: string[]) => {
            if (field.id === 'mental_health_diagnosis' && !newValues.includes('other')) {
              updateAnswer('mental_health_other', '');
            }
            updateAnswer(field.id, newValues);
            
            // Handle auto-advance for screens with auto_advance_on property
            if ('auto_advance_on' in screen && screen.auto_advance_on && newValues.includes(screen.auto_advance_on)) {
              if (autoAdvanceTimeoutRef.current) {
                clearTimeout(autoAdvanceTimeoutRef.current);
              }
              const delay = ('auto_advance_delay' in screen && screen.auto_advance_delay) ? screen.auto_advance_delay : 600;
              autoAdvanceTimeoutRef.current = setTimeout(() => {
                onSubmit();
              }, delay);
            }
          };
          return (
            <div>
              <CheckboxGroup
                id={field.id}
                label={field.label}
                help_text={field.help_text}
                options={multiSelectField.options}
                selectedValues={value || []}
                onChange={handleMultiSelectChange}
                exclusiveValue="none"
              />
              {errors[field.id] && <p className="mt-2 text-sm font-medium text-red-500">{errors[field.id]}</p>}
            </div>
          )
      }
      case 'medication_details_group': {
        const groupField = field as MedicationDetailsGroupField;
        const findFirstCheckbox = (items: FieldOrFieldGroup[]): CheckboxField | undefined => {
          for (const item of items) {
            if (Array.isArray(item)) {
              const nested = findFirstCheckbox(item);
              if (nested) return nested;
            } else if (item.type === 'checkbox') {
              return item as CheckboxField;
            }
          }
          return undefined;
        };

        const primaryCheckbox = findFirstCheckbox(groupField.fields);
        const handleGroupClick = (event: React.MouseEvent<HTMLDivElement>) => {
          if (!primaryCheckbox) return;

          const target = event.target as HTMLElement | null;
          if (!target) return;

          const interactive = target.closest('input, select, textarea, button, a');
          if (interactive) {
            return;
          }

          const labelEl = target.closest('label');
          if (labelEl) {
            return;
          }

          const currentValue = !!answers[primaryCheckbox.id];
          updateAnswer(primaryCheckbox.id, !currentValue);
        };

        return (
          <div
            className="p-6 border-2 border-stone-100 rounded-2xl space-y-6 bg-stone-50/75 my-4 cursor-pointer"
            onClick={handleGroupClick}
          >
            <h3 className="font-bold text-lg text-stone-800 tracking-tight">{groupField.label}</h3>
            {groupField.fields.map((subFieldOrGroup, index) => {
              if (Array.isArray(subFieldOrGroup)) {
                return (
                  <div key={`sub-group-${index}`} className="grid grid-cols-2 gap-4">
                    {subFieldOrGroup.map(subField => (
                      <div key={subField.id}>{renderField(subField)}</div>
                    ))}
                  </div>
                );
              }
              return <div key={subFieldOrGroup.id}>{renderField(subFieldOrGroup)}</div>;
            })}
          </div>
        );
      }
      case 'consent_item': {
        const consentField = field as ConsentItemField;
        return (
          <div 
            className={`p-5 bg-white rounded-2xl shadow-sm cursor-pointer transition-all ${
              value ? 'border-2 border-primary' : 'border-2 border-stone-200 hover:border-primary/50'
            }`}
            onClick={() => updateAnswer(consentField.id, !value)}
          >
            <Checkbox
              id={consentField.id}
              label={renderConsentLabel(consentField)}
              checked={!!value}
              onChange={(e) => updateAnswer(consentField.id, e.target.checked)}
            />
            {errors[field.id] && <p className="mt-2 text-sm font-medium text-red-500">{errors[field.id]}</p>}
          </div>
        );
      }
      case 'checkbox': {
        const checkboxField = field as CheckboxField;
        return (
          <div 
            className={`p-5 bg-white rounded-2xl shadow-sm cursor-pointer transition-all ${
              value ? 'border-2 border-primary' : 'border-2 border-stone-200 hover:border-primary/50'
            }`}
            onClick={(event) => {
              const target = event.target as HTMLElement | null;
              if (target && (target.closest('label') || target.closest('input'))) {
                return;
              }
              event.stopPropagation();
              updateAnswer(checkboxField.id, !value);
            }}
          >
            <Checkbox
              id={checkboxField.id}
              label={checkboxField.label || ''}
              checked={!!value}
              onChange={(e) => {
                updateAnswer(checkboxField.id, e.target.checked);
              }}
            />
            {errors[field.id] && <p className="mt-2 text-sm font-medium text-red-500">{errors[field.id]}</p>}
          </div>
        );
      }
      default:
        return <div>Unsupported field type: {(field as any).type}</div>;
    }
  };

  const showBmiGauge = screen.id === 'assess.body_measurements' && calculations && 'bmi' in calculations && calculations.bmi && isComplete;

  return (
    <ScreenLayout title={title} helpText={help_text} headerSize={headerSize} showLoginLink={showLoginLink}>
      {screen.promo_banner && (
        <div className="mb-6 p-4 bg-teal-50 border-2 border-teal-200 rounded-xl flex items-center gap-3">
          <div className="flex-shrink-0 w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" strokeWidth="2.5" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="text-teal-800 font-medium">{screen.promo_banner.text}</span>
        </div>
      )}
      <div className="space-y-6 text-left">
        {fields.map((fieldOrGroup, index) => {
          if (Array.isArray(fieldOrGroup)) {
            return (
              <div key={`group-${index}`} className="grid grid-cols-2 gap-4">
                {fieldOrGroup.map(field => (
                  <div key={field.id}>{renderField(field)}</div>
                ))}
              </div>
            );
          } else {
            return <div key={fieldOrGroup.id}>{renderField(fieldOrGroup)}</div>;
          }
        })}
      </div>

      {footer_note && (
        <p className="text-sm text-center mt-8 p-4 rounded-lg text-secondary bg-primary-50">
            {footer_note}
        </p>
      )}

      <AnimatePresence>
        {showBmiGauge && (
          <motion.div
            initial={{ opacity: 0, y: 20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            className="mt-8 flex justify-center"
          >
            <BMIGauge bmi={calculations.bmi as number} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isComplete && post_screen_note && !showBmiGauge && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="mt-8 text-center"
          >
            <div className="inline-block bg-emerald-50 text-emerald-800 font-semibold px-5 py-2.5 rounded-full text-sm tracking-wide">
              {post_screen_note}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <NavigationButtons
        showBack={showBack}
        onBack={onBack}
        onNext={handleSubmit}
        isNextDisabled={!isComplete}
        nextButtonType="button"
      />
    </ScreenLayout>
  );
};

export default CompositeScreen;
