import React from 'react';
import { motion } from 'framer-motion';

interface TouchButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  selected?: boolean;
  variant?: 'outline' | 'primary';
  size?: 'sm' | 'md';
  fullWidth?: boolean;
}

export const TouchButton: React.FC<TouchButtonProps> = ({
  children,
  selected = false,
  variant = 'outline',
  size = 'md',
  fullWidth = false,
  className = '',
  ...props
}) => {
  const baseClasses = 'min-h-[48px] rounded-xl font-medium transition-all duration-200 focus:outline-none';
  
  const variantClasses = {
    outline: selected
      ? 'bg-[#00A896] border-[#00A896] bg-[#E0F5F3] text-[#00A896] border-2 shadow-md'
      : 'bg-white text-[#2D3436] border-2 border-[#E8E8E8] hover:border-[#00A896]/30',
    primary: 'bg-[#FF6B6B] text-white hover:bg-[#FF5555] shadow-md hover:shadow-lg',
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
  };

  const widthClasses = fullWidth ? 'w-full' : '';

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClasses} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};
