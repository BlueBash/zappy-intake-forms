import React, { useEffect } from 'react';
import { ScreenProps } from './common';
import { CompositeScreen as CompositeScreenType, Field, FieldOrFieldGroup, SelectField } from '../../types';
import ScreenLayout from '../common/ScreenLayout';
import NavigationButtons from '../common/NavigationButtons';
import Input from '../ui/Input';
import Select from '../ui/Select';
import CheckboxGroup from '../common/CheckboxGroup';
import RegionDropdown from '../common/RegionDropdown';

const checkCondition = (condition: string, answers: Record<string, any>): boolean => {
  const match = condition.match(/(\w+)\s*(==|!=)\s*['"]?([\w\s/.-]+)['"]?/);
  if (!match) return true;

  const [, fieldId, operator, value] = match;
  const fieldValue = answers[fieldId];

  if (operator === '==') return fieldValue === value;
  if (operator === '!=') return fieldValue !== value;
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

const CompositeScreen: React.FC<ScreenProps & { screen: CompositeScreenType }> = ({ screen, answers, updateAnswer, onSubmit, showBack, onBack }) => {
  const { title, help_text, fields, footer_note } = screen;

  const flattenFields = (fields: FieldOrFieldGroup[]): Field[] => {
    return fields.flat();
  };

  const allFields = flattenFields(fields);
  const visibleFields = allFields.filter(field => shouldShowField(field, answers));

  useEffect(() => {
    const initialDemographicState = answers['demographics.state'];
    if (initialDemographicState && !answers['shipping_state']) {
      updateAnswer('shipping_state', initialDemographicState);
    }
  }, [answers, updateAnswer]);
  
  const isComplete = visibleFields
    .filter(field => field.required)
    .every(field => {
      const value = answers[field.id];
      if (Array.isArray(value)) return value.length > 0;
      return value !== undefined && value !== null && value !== '';
    });
  
  const renderField = (field: Field) => {
    if (!shouldShowField(field, answers)) {
      return null;
    }
    const value = answers[field.id];

    switch (field.type) {
      case 'text':
      case 'email':
      case 'password':
        const isMultiline = 'multiline' in field && field.multiline;
        return isMultiline ? (
          <textarea
            id={field.id}
            value={value || ''}
            onChange={(e) => updateAnswer(field.id, e.target.value)}
            placeholder={field.placeholder}
            className="block w-full rounded-lg transition-all duration-200 py-[18px] px-5 text-[1.0625rem] text-stone-900 border-2 border-stone-200 focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none"
          />
        ) : (
          <Input
            id={field.id}
            type={field.type}
            label={field.label}
            help_text={field.help_text}
            placeholder={field.placeholder}
            value={value || ''}
            onChange={(e) => updateAnswer(field.id, e.target.value)}
          />
        );
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
          />
        );
      case 'single_select': {
        const selectField = field as SelectField;
        if (field.id === 'shipping_state') {
          return (
            <div className="text-left">
              <label htmlFor={field.id} className="block text-sm font-medium text-stone-700 mb-2">
                {field.label}
              </label>
              {field.help_text && (
                <p className="text-sm text-stone-500 mb-2">{field.help_text}</p>
              )}
              <RegionDropdown
                value={value || ''}
                onChange={(stateCode) => updateAnswer(field.id, stateCode)}
                placeholder={field.placeholder || 'Select state'}
              />
            </div>
          );
        }
        const options = selectField.conditional_options 
            ? (selectField.conditional_options.options_map[answers[selectField.conditional_options.based_on]] || [])
            : selectField.options;
        return (
          <Select
            id={field.id}
            label={field.label}
            help_text={field.help_text}
            options={options}
            value={value || ''}
            onChange={(e) => updateAnswer(field.id, e.target.value)}
          />
        );
      }
      case 'multi_select': {
          const multiSelectField = field as SelectField;
          return (
            <CheckboxGroup
                id={field.id}
                label={field.label}
                help_text={field.help_text}
                options={multiSelectField.options}
                selectedValues={value || []}
                onChange={(newValues) => updateAnswer(field.id, newValues)}
            />
          )
      }
      default:
        return <div>Unsupported field type: {(field as any).type}</div>;
    }
  };

  return (
    <ScreenLayout title={title} helpText={help_text}>
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
          }
          return <div key={fieldOrGroup.id}>{renderField(fieldOrGroup)}</div>;
        })}
      </div>

      {footer_note && (
        <p className="text-sm text-center mt-8 p-4 rounded-lg text-secondary bg-primary-50">
            {footer_note}
        </p>
      )}

      <NavigationButtons
        showBack={showBack}
        onBack={onBack}
        onNext={onSubmit}
        isNextDisabled={!isComplete}
      />
    </ScreenLayout>
  );
};

export default CompositeScreen;
