import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  size?: 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary',
  size = 'md',
  className = '', 
  ...props 
}) => {
  const baseClasses = 'font-semibold rounded-full transition-all duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const sizeClasses = {
    md: 'py-4 px-8 text-base',
    lg: 'py-5 px-10 text-lg'
  };
  
  const variantClasses = {
    primary: 'text-white tracking-wide bg-gradient-primary shadow-primary disabled:shadow-none hover:enabled:-translate-y-0.5 hover:enabled:shadow-primary-lg',
    secondary: 'bg-white text-stone-600 border-2 border-stone-200 hover:enabled:bg-stone-50 hover:enabled:border-stone-300'
  };

  return (
    <button 
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
