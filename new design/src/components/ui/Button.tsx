import { ButtonHTMLAttributes, forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', isLoading, children, className = '', disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-xl transition-all duration-300 outline-none focus:ring-4';
    
    const variantStyles = {
      primary: 'bg-[var(--coral)] hover:bg-[var(--coral-hover)] text-white shadow-lg hover:shadow-xl focus:ring-[var(--coral)]/20 disabled:bg-[var(--gray)] disabled:cursor-not-allowed',
      secondary: 'bg-white border-2 border-[var(--light-gray)] hover:border-[var(--teal)] text-[var(--black)] hover:text-[var(--teal)] focus:ring-[var(--teal)]/20',
      ghost: 'bg-transparent hover:bg-neutral-100 text-[var(--black)] hover:text-[var(--teal)] focus:ring-neutral-200',
    };
    
    const sizeStyles = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
