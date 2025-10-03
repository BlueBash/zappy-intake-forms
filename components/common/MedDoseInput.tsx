import React from 'react';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { Field } from '../../types';

interface MedDoseInputProps {
  field: Field;
  answers: Record<string, any>;
  updateAnswer: (id: string, value: any) => void;
  errors?: Record<string, string | undefined>;
  onBlur: (fieldId: string) => void;
}

const MedDoseInput: React.FC<MedDoseInputProps> = ({ field, answers, updateAnswer, errors, onBlur }) => {
  const { label, sub_fields, required } = field as any;
  if (!sub_fields) return null;
  
  return (
    <div className="w-full">
      <label className="block text-[0.9375rem] font-semibold mb-3 text-stone-900">
        {label}
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input
          id={sub_fields.amount.id}
          label={sub_fields.amount.label}
          type="text"
          inputMode="decimal"
          value={answers[sub_fields.amount.id] || ''}
          onChange={(e) => updateAnswer(sub_fields.amount.id, e.target.value)}
          placeholder={sub_fields.amount.placeholder}
          required={required}
          onBlur={() => onBlur(sub_fields.amount.id)}
          error={errors?.[sub_fields.amount.id]}
        />
        <Select
          id={sub_fields.unit.id}
          label={sub_fields.unit.label}
          options={sub_fields.unit.options}
          value={answers[sub_fields.unit.id] || ''}
          onChange={(e) => updateAnswer(sub_fields.unit.id, e.target.value)}
          required={required}
          onBlur={() => onBlur(sub_fields.unit.id)}
          error={errors?.[sub_fields.unit.id]}
        />
        <Select
          id={sub_fields.frequency.id}
          label={sub_fields.frequency.label}
          options={sub_fields.frequency.options}
          value={answers[sub_fields.frequency.id] || ''}
          onChange={(e) => updateAnswer(sub_fields.frequency.id, e.target.value)}
          required={required}
          onBlur={() => onBlur(sub_fields.frequency.id)}
          error={errors?.[sub_fields.frequency.id]}
        />
      </div>
    </div>
  );
};

export default MedDoseInput;