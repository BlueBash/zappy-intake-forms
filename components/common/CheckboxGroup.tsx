import React, { useEffect, useMemo, useState } from 'react';
import { Option } from '../../types';
import Checkbox from '../ui/Checkbox';

interface CheckboxGroupProps {
  id: string;
  label: string;
  help_text?: string;
  options: Option[];
  selectedValues: string[];
  onChange: (newValues: string[]) => void;
  exclusiveValue?: string;
  exclusiveMessage?: string;
}

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  id,
  label,
  help_text,
  options,
  selectedValues,
  onChange,
  exclusiveValue,
  exclusiveMessage,
}) => {
  const [clearedMessage, setClearedMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!clearedMessage) return;
    const timer = window.setTimeout(() => setClearedMessage(null), 5000);
    return () => window.clearTimeout(timer);
  }, [clearedMessage]);

  const exclusiveOptionValue = useMemo(() => {
    if (exclusiveValue) return exclusiveValue;
    const hasNone = options.some((option) => option.value === 'none');
    return hasNone ? 'none' : undefined;
  }, [exclusiveValue, options]);

  const exclusiveOptionLabel = exclusiveOptionValue
    ? options.find((option) => option.value === exclusiveOptionValue)?.label ?? exclusiveOptionValue
    : undefined;

  const exclusiveSelected = exclusiveOptionValue ? selectedValues.includes(exclusiveOptionValue) : false;

  const handleToggle = (value: string) => {
    if (exclusiveOptionValue && value === exclusiveOptionValue) {
      const alreadySelected = selectedValues.includes(exclusiveOptionValue);
      if (alreadySelected) {
        const newValues = selectedValues.filter((v) => v !== exclusiveOptionValue);
        onChange(newValues);
        setClearedMessage(null);
      } else {
        const hadOtherSelections = selectedValues.some((v) => v !== exclusiveOptionValue);
        onChange([exclusiveOptionValue]);
        if (hadOtherSelections) {
          setClearedMessage(
            exclusiveMessage ??
              `We cleared your other selections so we can record "${exclusiveOptionLabel ?? 'None of these'}".`
          );
        } else {
          setClearedMessage(null);
        }
      }
      return;
    }

    let workingValues = selectedValues;
    if (exclusiveOptionValue && selectedValues.includes(exclusiveOptionValue)) {
      workingValues = selectedValues.filter((v) => v !== exclusiveOptionValue);
    }

    const newValues = workingValues.includes(value)
      ? workingValues.filter((v) => v !== value)
      : [...workingValues, value];

    onChange(newValues);
    setClearedMessage(null);
  };

  return (
    <div className="w-full">
      <label className="block font-semibold mb-3 text-stone-900 text-[0.9375rem]">
        {label}
      </label>
      {help_text && (
        <p className="text-sm -mt-2 mb-3 text-stone-600">
          {help_text}
        </p>
      )}
      <div className="space-y-3">
        {options.map(option => {
          const isDisabled = exclusiveSelected && option.value !== exclusiveOptionValue;
          const isSelected = selectedValues.includes(option.value);
          return (
            <Checkbox
              key={option.value}
              id={`${id}-${option.value}`}
              label={option.label}
              checked={isSelected}
              onChange={() => {
                if (isDisabled) return;
                handleToggle(option.value);
              }}
              disabled={isDisabled}
              className={`w-full rounded-lg transition-all duration-200 border-2 p-4 ${
                isSelected
                  ? 'border-primary ring-4 ring-primary/10 bg-white'
                  : isDisabled
                    ? 'border-stone-200 opacity-60 cursor-not-allowed bg-white'
                    : 'border-stone-200 hover:border-stone-300 bg-white'
              }`}
            />
          );
        })}
      </div>
      {clearedMessage && (
        <div
          className="mt-4 rounded-2xl border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-primary"
          role="status"
          aria-live="polite"
        >
          {clearedMessage}
        </div>
      )}
    </div>
  );
};

export default CheckboxGroup;
