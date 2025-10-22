import React, { useState } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label?: string;
  help_text?: string;
  error?: string;
  suffix?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ id, label, help_text, error, suffix, type = 'text', ...props }, ref) => {
    const isPasswordField = type === 'password';
    const [showPassword, setShowPassword] = useState(false);
    const inputType = isPasswordField ? (showPassword ? 'text' : 'password') : type;
    const hasTrailingAdornment = !!suffix || isPasswordField;
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
          <input
            id={id}
            ref={ref}
            type={inputType}
            aria-required={props.required}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : undefined}
            className={`
              block w-full rounded-lg transition-all duration-200
              py-[18px] px-5 text-[1.0625rem] text-stone-900
              border-2 border-stone-200 shadow-none
              focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none
              ${hasTrailingAdornment ? 'pr-14' : ''}
              ${error ? 'border-red-500' : ''}
            `}
            {...props}
          />
          {suffix && !isPasswordField && (
            <span className="absolute inset-y-0 right-0 flex items-center pr-5 pointer-events-none font-medium text-stone-500 text-[0.9375rem]">
              {suffix}
            </span>
          )}
          {isPasswordField && (
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center px-4 text-sm font-semibold text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              onClick={() => setShowPassword(prev => !prev)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          )}
        </div>
        {error && (
          <p id={errorId} className="mt-2 text-sm font-medium text-red-500">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
