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
      ? 'bg-gradient-to-br from-[#0D9488] to-[#14B8A6] text-white border-2 border-[#0D9488] shadow-md'
      : 'bg-white text-neutral-700 border-2 border-gray-200 hover:border-[#0D9488]/30',
    primary: 'bg-gradient-to-r from-[#0D9488] to-[#14B8A6] text-white hover:from-[#0F766E] hover:to-[#0D9488] shadow-md hover:shadow-lg',
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
