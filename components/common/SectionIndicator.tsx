import { motion } from 'framer-motion';

interface SectionIndicatorProps {
  label: string;
  currentStep?: number;
  totalSteps?: number;
  className?: string;
}

/**
 * SectionIndicator Component
 * 
 * Displays the current section name and optional step counter.
 * Used in screen headers to show user progress.
 * 
 * Examples:
 * - "Your Goals · 1/3"
 * - "Basic Information"
 * - "Medical Assessment · 2/6"
 * 
 * Note: Using framer-motion import (compatible with motion/react)
 */
export default function SectionIndicator({
  label,
  currentStep,
  totalSteps,
  className = ''
}: SectionIndicatorProps) {
  const showSteps = currentStep !== undefined && totalSteps !== undefined;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.4 }}
      className={className}
    >
      <p className="text-sm text-neutral-500">
        <span className="text-neutral-700">{label}</span>
        {showSteps && (
          <>
            <span className="mx-1.5">·</span>
            <span>{currentStep}/{totalSteps}</span>
          </>
        )}
      </p>
    </motion.div>
  );
}
