import React from 'react';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: React.ReactNode;
  id: string;
}

const Checkbox: React.FC<CheckboxProps> = ({ label, id, ...props }) => {
  return (
    <div className="flex items-start gap-3">
      <input
        id={id}
        type="checkbox"
        className="h-5 w-5 rounded border-2 border-stone-200 text-primary accent-primary transition duration-200 ease-in-out cursor-pointer mt-0.5 focus:ring-2 focus:ring-primary/30 focus:ring-offset-2"
        {...props}
      />
      <label 
        htmlFor={id} 
        className="text-base text-stone-700 leading-snug select-none cursor-pointer flex-1"
      >
        {label}
      </label>
    </div>
  );
};

export default Checkbox;