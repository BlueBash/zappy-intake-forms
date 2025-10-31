import { motion, AnimatePresence } from 'motion/react';

interface ErrorMessageProps {
  error?: string | null;
  className?: string;
}

/**
 * ErrorMessage Component
 * 
 * Standardized error message display with icon and animation.
 * Automatically shows/hides based on error prop.
 * 
 * Usage:
 * ```tsx
 * <ErrorMessage error={validationError} />
 * ```
 */
export default function ErrorMessage({
  error,
  className = ''
}: ErrorMessageProps) {
  return (
    <AnimatePresence>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
          className={`text-base text-red-700 mt-1 flex items-center gap-1 ${className}`}
        >
          <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path 
              fillRule="evenodd" 
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" 
              clipRule="evenodd" 
            />
          </svg>
          {error}
        </motion.p>
      )}
    </AnimatePresence>
  );
}
