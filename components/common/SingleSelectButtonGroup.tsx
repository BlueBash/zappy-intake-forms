import React from 'react';
import { Option } from '../../types';

interface SingleSelectButtonGroupProps {
  options: Option[];
  selectedValue?: string;
  onSelect: (value: string) => void;
}

const SingleSelectButtonGroup: React.FC<SingleSelectButtonGroupProps> = ({
  options,
  selectedValue,
  onSelect
}) => {
  return (
    <div className="space-y-4">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onSelect(option.value)}
          type="button"
          className={`w-full text-left p-5 border-2 rounded-2xl text-lg transition-all duration-200 ease-in-out transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-200/75
            ${selectedValue === option.value
              ? 'bg-selection-selected border-selection-border-selected text-white shadow-lg -translate-y-0.5'
              : 'bg-white border-stone-200 shadow hover:border-selection-active hover:bg-selection-hover hover:-translate-y-0.5 hover:shadow-lg'
            }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default SingleSelectButtonGroup;
