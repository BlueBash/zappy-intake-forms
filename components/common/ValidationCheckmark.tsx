import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';

interface ValidationCheckmarkProps {
  show: boolean;
  className?: string;
}

/**
 * ValidationCheckmark Component
 * 
 * Animated checkmark that appears when a form field is successfully validated.
 * Features spring animation and gradient background.
 * 
 * Usage:
 * ```tsx
 * <ValidationCheckmark show={isValid && isFilled} />
 * ```
 * 
 * Note: Using framer-motion import (compatible with motion/react)
 */
export default function ValidationCheckmark({
  show,
  className = ''
}: ValidationCheckmarkProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 180 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className={`absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gradient-to-br from-[#10b981] to-[#059669] flex items-center justify-center ${className}`}
        >
          <Check className="w-4 h-4 text-white" strokeWidth={3} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
