import React, { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

interface ProgressBarProps {
  progress: number;
  sectionDescription?: string;
  currentStep?: number;
  totalSteps?: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, sectionDescription, currentStep, totalSteps }) => {
  const [displayProgress, setDisplayProgress] = useState(0);
  const springProgress = useSpring(displayProgress, {
    stiffness: 40,
    damping: 25,
    mass: 1.2
  });

  useEffect(() => {
    setDisplayProgress(progress);
  }, [progress]);

  return (
    <div className="w-full mb-12">
      {/* Progress Bar */}
      <div
        className="w-full h-1.5 bg-[#E8E8E8] rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Form completion: ${Math.round(progress)}%`}
      >
        <motion.div
          className="h-full bg-[#00A896]"
          style={{
            width: springProgress,
            // Respect reduced motion preferences
            transition: window.matchMedia('(prefers-reduced-motion: reduce)').matches
              ? 'width 0.01ms'
              : undefined
          }}
          initial={{ width: '0%' }}
          animate={{ width: `${displayProgress}%` }}
          transition={{
            type: "spring",
            stiffness: 40,
            damping: 25,
            mass: 1.2
          }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
