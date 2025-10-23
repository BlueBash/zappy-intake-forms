import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
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
  const baseClasses = 'font-semibold rounded-xl transition-[transform,background-color,box-shadow,border-color,color,opacity] gpu-accelerated focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 disabled:opacity-50 disabled:cursor-not-allowed';
  
  // Use CSS custom properties for consistent timing
  const transitionStyles = {
    transitionDuration: 'var(--timing-normal)',
    transitionTimingFunction: 'var(--easing-elegant)'
  };
  
  const sizeClasses = {
    md: 'py-2.5 px-6 text-base',
    lg: 'py-3.5 px-8 text-base'
  };
  
  const variantClasses = {
    primary: 'text-white bg-gradient-primary shadow-lg hover:enabled:shadow-xl hover:enabled:bg-gradient-primary-hover',
    secondary: 'bg-white text-neutral-600 border-2 border-gray-200 hover:enabled:bg-neutral-50 hover:enabled:border-neutral-300',
    ghost: 'text-neutral-600 hover:enabled:bg-neutral-100 hover:enabled:text-neutral-900'
  };

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      style={transitionStyles}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
