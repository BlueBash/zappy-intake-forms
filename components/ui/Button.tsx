import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const sizeClasses = {
    md: 'py-2.5 px-6 text-base',
    lg: 'py-3.5 px-8 text-base'
  };
  
  const variantClasses = {
    primary: 'text-white bg-gradient-to-r from-[#0D9488] to-[#14B8A6] hover:from-[#0F766E] hover:to-[#0D9488] shadow-lg hover:shadow-xl',
    secondary: 'bg-white text-neutral-600 border-2 border-gray-200 hover:enabled:bg-neutral-50 hover:enabled:border-neutral-300',
    ghost: 'text-neutral-600 hover:enabled:bg-neutral-100 hover:enabled:text-neutral-900'
  };

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {children}
    </button>
  );
};

export default Button;
