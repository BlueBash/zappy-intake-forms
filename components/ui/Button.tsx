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
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed';
  
  const sizeClasses = {
    md: 'py-2.5 px-6 text-base',
    lg: 'py-3.5 px-8 text-base'
  };
  
  const variantClasses = {
    primary: 'text-white bg-[#FF6B6B] hover:bg-[#FF5555] shadow-lg hover:shadow-xl focus-visible:ring-4 focus-visible:ring-[#FF6B6B]/20',
    secondary: 'bg-white text-[#2D3436] border-2 border-[#E8E8E8] hover:enabled:border-[#00A896] hover:enabled:text-[#00A896] focus-visible:ring-4 focus-visible:ring-[#00A896]/20',
    ghost: 'text-[#2D3436] hover:enabled:bg-neutral-100 hover:enabled:text-[#00A896] focus-visible:ring-4 focus-visible:ring-[#00A896]/20'
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
