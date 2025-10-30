import { motion } from 'motion/react';

interface ProgressBarProps {
  percentage: number;
  className?: string;
  barClassName?: string;
  height?: 'sm' | 'md' | 'lg';
}

/**
 * ProgressBar Component
 * 
 * Animated progress bar used throughout the application.
 * Shows completion percentage with smooth animation.
 * 
 * Props:
 * - percentage: 0-100 completion percentage
 * - height: 'sm' (1px), 'md' (1.5px), 'lg' (2px)
 */
export default function ProgressBar({
  percentage,
  className = '',
  barClassName = '',
  height = 'md'
}: ProgressBarProps) {
  const heightClasses = {
    sm: 'h-1',
    md: 'h-1.5',
    lg: 'h-2'
  };

  return (
    <div className={`w-full ${heightClasses[height]} bg-neutral-200/50 rounded-full overflow-hidden ${className}`}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`h-full bg-[#00A896] ${barClassName}`}
      />
    </div>
  );
}
