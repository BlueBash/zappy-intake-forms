import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';

interface BackButtonProps {
  onClick?: () => void;
  className?: string;
  'aria-label'?: string;
}

/**
 * BackButton Component
 * 
 * Standardized back button used across all screens.
 * Features:
 * - Consistent styling and animation
 * - Accessibility-first design with proper ARIA labels
 * - Hover and focus states
 * - Touch-friendly size (36x36px)
 * 
 * Note: Using framer-motion import (compatible with motion/react)
 */
export default function BackButton({ 
  onClick, 
  className = '',
  'aria-label': ariaLabel = 'Go back'
}: BackButtonProps) {
  if (!onClick) return null;

  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
      aria-label={ariaLabel}
      className={`flex items-center justify-center w-9 h-9 rounded-full hover:bg-neutral-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00A896]/40 ${className}`}
    >
      <ChevronLeft className="w-6 h-6 text-neutral-700" />
    </motion.button>
  );
}
