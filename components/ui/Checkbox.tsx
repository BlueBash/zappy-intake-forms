import React from 'react';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: React.ReactNode;
  id: string;
  className?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({ label, id, disabled, className = '', ...props }) => {
  return (
    <label
      htmlFor={id}
      className={`flex items-start gap-3 ${
        disabled ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'
      } ${className}`.trim()}
    >
      <input
        id={id}
        type="checkbox"
        aria-required={props.required}
        className={`h-5 w-5 rounded border-0 text-primary accent-primary transition-colors mt-0.5 focus:ring-2 focus:ring-primary/10 focus:ring-offset-2 ${
          disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
        }`}
        style={{
          transitionDuration: 'var(--timing-fast)',
          transitionTimingFunction: 'var(--easing-elegant)'
        }}
        disabled={disabled}
        {...props}
      />
      <span className="text-base text-stone-700 leading-snug select-none flex-1">
        {label}
      </span>
    </label>
  );
};

export default Checkbox;
