import { motion } from 'motion/react';
import Logo from './Logo';

interface UniversalProgressBarProps {
  currentStep: number;
  totalSteps: number;
  variant?: 'horizontal' | 'dots';
}

export default function UniversalProgressBar({
  currentStep,
  totalSteps,
  variant = 'horizontal'
}: UniversalProgressBarProps) {
  const progress = (currentStep / totalSteps) * 100;

  if (variant === 'dots') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed top-6 left-0 right-0 z-40 px-4 flex justify-center"
      >
        <div className="bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm border border-neutral-100 inline-flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalSteps }).map((_, index) => {
              const isCompleted = index < currentStep - 1;
              const isCurrent = index === currentStep - 1;
              
              return (
                <motion.div
                  key={index}
                  initial={false}
                  animate={{
                    width: isCurrent ? '24px' : '8px',
                    backgroundColor: isCompleted || isCurrent ? '#1a7f72' : '#E5E7EB',
                  }}
                  transition={{ duration: 0.3 }}
                  className="h-2 rounded-full"
                />
              );
            })}
          </div>
          <span className="text-xs text-neutral-600 ml-1">
            {currentStep}/{totalSteps}
          </span>
        </div>
      </motion.div>
    );
  }

  // Horizontal bar variant (default)
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full mb-4"
    >
      <div className="mb-2">
        <Logo size="lg" />
      </div>
      <div className="w-full h-1.5 bg-neutral-200/50 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="h-full bg-[#00A896]"
        />
      </div>
    </motion.div>
  );
}
