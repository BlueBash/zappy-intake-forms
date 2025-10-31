import { SelectHTMLAttributes } from 'react';
import { Option } from '../../types';
import { Label } from './label';
import { ChevronDown } from 'lucide-react';

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  id?: string;
  label?: string;
  options: Option[];
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export default function Select({ id, label, options, value, onChange, required, ...props }: SelectProps) {
  return (
    <div className="w-full">
      {label && (
        <Label htmlFor={id} className="mb-2 text-neutral-800">
          {label}
          {required && <span className="text-[#FF7A59] ml-1">*</span>}
        </Label>
      )}
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={onChange}
          required={required}
          className="w-full px-4 py-3 pr-10 rounded-xl border-2 border-gray-200 bg-white transition-all duration-300 focus:border-[#0D9488] focus:ring-4 focus:ring-[#0D9488]/10 outline-none appearance-none cursor-pointer"
          {...props}
        >
          <option value="">Select an option...</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500 pointer-events-none" />
      </div>
    </div>
  );
}
