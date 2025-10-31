import { motion } from 'motion/react';
import { ReactNode } from 'react';

interface TouchButtonProps {
  children: ReactNode;
  onClick?: () => void;
  selected?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  fullWidth?: boolean;
  type?: 'button' | 'submit';
}

/**
 * TouchButton - Mobile-optimized button with proper touch targets
 * 
 * Design Specs:
 * - Minimum touch target: 48x48px (exceeds Apple's 44px and Material's 48px guidelines)
 * - Spacing between elements: 8px minimum
 * - Responsive padding and sizing
 * - Clear visual feedback on hover/active states
 * - Supports multiple variants and sizes
 * 
 * Touch Target Sizes:
 * - sm: 44px height (minimum)
 * - md: 48px height (recommended)
 * - lg: 56px height (extra comfortable)
 * 
 * @example
 * <TouchButton variant="primary" size="md" onClick={handleClick}>
 *   Continue
 * </TouchButton>
 */
export function TouchButton({
  children,
  onClick,
  selected = false,
  variant = 'outline',
  size = 'md',
  disabled = false,
  className = '',
  fullWidth = false,
  type = 'button',
}: TouchButtonProps) {
  const sizeClasses = {
    sm: 'min-h-[44px] px-4 py-2.5 text-sm',
    md: 'min-h-[48px] px-5 py-3 text-base',
    lg: 'min-h-[56px] px-6 py-4 text-lg',
  };

  const variantClasses = {
    primary: selected
      ? 'bg-[#00A896] text-white border-2 border-[#00A896] shadow-md'
      : 'bg-gray-100 text-[#2D3436] border-2 border-[#E8E8E8] hover:bg-gray-200',
    secondary: selected
      ? 'bg-[#FF7A59]/10 text-[#FF7A59] border-2 border-[#FF7A59]'
      : 'bg-white text-neutral-700 border-2 border-gray-200 hover:border-[#FF7A59]/30',
    outline: selected
      ? 'border-2 border-[#00A896] bg-[#00A896]/5 text-[#00A896]'
      : 'border-2 border-[#E8E8E8] bg-white text-[#2D3436] hover:border-[#00A896]/30',
  };

  const disabledClasses = disabled
    ? 'opacity-50 cursor-not-allowed'
    : 'cursor-pointer active:scale-[0.98]';

  return (
    <motion.button
      type={type}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      whileTap={disabled ? {} : { scale: 0.98 }}
      className={`
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${disabledClasses}
        ${fullWidth ? 'w-full' : ''}
        rounded-xl font-medium transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-[#1a7f72]/40 focus:ring-offset-2
        ${className}
      `}
    >
      {children}
    </motion.button>
  );
}

/**
 * TouchToggleGroup - Group of toggle buttons with proper spacing
 * 
 * @example
 * <TouchToggleGroup
 *   options={[
 *     { value: 'yes', label: 'Yes' },
 *     { value: 'no', label: 'No' }
 *   ]}
 *   value={selectedValue}
 *   onChange={setValue}
 * />
 */
interface TouchToggleOption {
  value: string;
  label: string;
  icon?: ReactNode;
}

interface TouchToggleGroupProps {
  options: TouchToggleOption[];
  value: string;
  onChange: (value: string) => void;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
}

export function TouchToggleGroup({
  options,
  value,
  onChange,
  size = 'md',
  fullWidth = true,
  className = '',
}: TouchToggleGroupProps) {
  return (
    <div className={`flex gap-3 ${className}`}>
      {options.map((option) => (
        <TouchButton
          key={option.value}
          onClick={() => onChange(option.value)}
          selected={value === option.value}
          variant="outline"
          size={size}
          fullWidth={fullWidth}
          className="flex items-center justify-center gap-2"
        >
          {option.icon}
          {option.label}
        </TouchButton>
      ))}
    </div>
  );
}
