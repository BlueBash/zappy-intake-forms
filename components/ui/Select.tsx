import React from 'react';
import { Option } from '../../types';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  id: string;
  label?: string;
  help_text?: string;
  error?: string;
  options: Option[];
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ id, label, help_text, error, options, ...props }, ref) => {
    const errorId = `${id}-error`;
    return (
      <div className="w-full">
        {label && (
          <label 
            htmlFor={id} 
            className="block font-semibold mb-3 text-stone-900 text-[0.9375rem]"
          >
            {label}
          </label>
        )}
        {help_text && (
          <p className="text-sm -mt-2 mb-3 text-stone-600">
            {help_text}
          </p>
        )}
        <div className="relative">
          <select
            id={id}
            ref={ref}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : undefined}
            className={`
              block w-full rounded-lg transition-all duration-200 bg-white appearance-none
              py-[18px] px-5 text-[1.0625rem] text-stone-900
              border-2 shadow-none
              focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none
              ${error ? 'border-red-500' : 'border-stone-200'}
            `}
            {...props}
          >
            <option value="" disabled>Select...</option>
            {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-5 text-stone-500">
            <svg className="fill-current h-5 w-5" xmlns="http://www.w.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
            </svg>
          </div>
        </div>
        {error && (
          <p id={errorId} className="mt-2 text-sm text-red-500">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;