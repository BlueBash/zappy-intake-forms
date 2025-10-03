import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  ...props 
}) => {
  const baseClasses = 'font-semibold rounded-full transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-primary/20 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'py-4 px-8 text-white text-base tracking-wide bg-gradient-primary shadow-primary disabled:shadow-none hover:enabled:-translate-y-0.5 hover:enabled:shadow-primary-lg',
    secondary: 'py-3 px-6 bg-white text-stone-600 border-2 border-stone-200 hover:enabled:bg-stone-50 hover:enabled:border-stone-300'
  };

  return (
    <button 
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;