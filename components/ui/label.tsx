import React from 'react';

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
  className?: string;
}

const Label: React.FC<LabelProps> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <label
      className={`text-sm leading-none font-medium select-none ${className}`}
      {...props}
    >
      {children}
    </label>
  );
};

export { Label };