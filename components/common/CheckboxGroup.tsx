import React from 'react';
import { Option } from '../../types';
import Checkbox from '../ui/Checkbox';

interface CheckboxGroupProps {
  id: string;
  label: string;
  help_text?: string;
  options: Option[];
  selectedValues: string[];
  onChange: (newValues: string[]) => void;
}

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({ id, label, help_text, options, selectedValues, onChange }) => {
  const handleToggle = (value: string) => {
    const newValues = selectedValues.includes(value)
      ? selectedValues.filter(v => v !== value)
      : [...selectedValues, value];
    onChange(newValues);
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
        {options.map(option => (
          <div
            key={option.value}
            className={`
              p-4 bg-white rounded-lg cursor-pointer transition-all duration-200
              border-2 
              ${selectedValues.includes(option.value)
                ? 'border-primary ring-4 ring-primary/10'
                : 'border-stone-200 hover:border-stone-300'
              }
            `}
            onClick={() => handleToggle(option.value)}
          >
            <Checkbox
              id={`${id}-${option.value}`}
              label={option.label}
              checked={selectedValues.includes(option.value)}
              // The outer div's onClick handles the logic, this just syncs the visual state
              onChange={() => {}}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CheckboxGroup;
