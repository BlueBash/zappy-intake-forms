import React from 'react';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: React.ReactNode;
  id: string;
}

const Checkbox: React.FC<CheckboxProps> = ({ label, id, disabled, ...props }) => {
  return (
    <div className="flex items-start gap-3">
      <input
        id={id}
        type="checkbox"
        aria-required={props.required}
        className={`h-5 w-5 rounded border-2 border-stone-200 text-primary accent-primary transition duration-200 ease-in-out mt-0.5 focus:ring-2 focus:ring-primary/10 focus:ring-offset-2 ${
          disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
        }`}
        disabled={disabled}
        {...props}
      />
      <label 
        htmlFor={id} 
        className={`text-base text-stone-700 leading-snug select-none flex-1 ${
          disabled ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'
        }`}
      >
        {label}
      </label>
    </div>
  );
};

export default Checkbox;
