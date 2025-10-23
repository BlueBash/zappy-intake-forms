import React, { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

interface ProgressBarProps {
  progress: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
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
    <div
      className="w-full h-1.5 mb-12 bg-gray-200 rounded-full overflow-hidden"
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Form completion: ${Math.round(progress)}%`}
    >
      <motion.div
        className="h-full bg-gradient-progress"
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
  );
};

export default ProgressBar;
