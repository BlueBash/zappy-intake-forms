import React from 'react';
import { motion } from 'framer-motion';
import Button from '../ui/Button';

interface NavigationButtonsProps {
  showBack: boolean;
  onBack: () => void;
  nextLabel?: string;
  onNext: () => void;
  isNextDisabled?: boolean;
  nextButtonType?: 'button' | 'submit' | 'reset';
  isNextLoading?: boolean;
}

const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  showBack,
  onBack,
  nextLabel = 'Continue',
  onNext,
  isNextDisabled = false,
  nextButtonType = 'button',
  isNextLoading = false,
}) => {
  const reducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <motion.div
      initial={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reducedMotion ? { duration: 0.01 } : {
        delay: 0.25,
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1]
      }}
      className="w-full flex flex-col-reverse sm:flex-row sm:justify-between items-center mt-12 gap-3 sm:gap-5"
    >
      {/* Back Button */}
      {showBack ? (
        <Button
          variant="ghost"
          onClick={onBack}
          type="button"
          className="w-full sm:w-auto"
        >
          Back
        </Button>
      ) : (
        // Placeholder to keep the Continue button on the right
        <div className="hidden sm:block sm:w-auto"><div className="py-3 px-5 invisible">Back</div></div>
      )}

      {/* Next/Submit Button */}
      <Button
        onClick={onNext}
        disabled={isNextDisabled || isNextLoading}
        type={nextButtonType}
        size="lg"
        className="w-full sm:w-auto sm:max-w-[240px]"
      >
        {isNextLoading ? 'Submitting…' : nextLabel}
      </Button>
    </motion.div>
  );
};

export default NavigationButtons;
