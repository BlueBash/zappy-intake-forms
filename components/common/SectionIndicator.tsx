import React from 'react';
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
 * Displays the current section label above the progress bar.
 * Used to provide context about what section of the form the user is in.
 * 
 * Usage:
 * ```tsx
 * <SectionIndicator
 *   label="Medical History"
 *   currentStep={2}
 *   totalSteps={5}
 * />
 * ```
 */
export default function SectionIndicator({
  label,
  currentStep,
  totalSteps,
  className = ''
}: SectionIndicatorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex items-center justify-between ${className}`}
    >
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-[#666666] tracking-wide">
          {label}
        </span>
      </div>
    </motion.div>
  );
}
