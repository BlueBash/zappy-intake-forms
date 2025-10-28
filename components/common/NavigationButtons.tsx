import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Button from '../ui/Button';

interface NavigationButtonsProps {
  showBack?: boolean;
  onBack?: () => void;
  onNext: () => void;
  isNextDisabled?: boolean;
  isNextLoading?: boolean;
  nextLabel?: string;
  nextButtonType?: 'button' | 'submit';
  style?: React.CSSProperties;
}

const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  showBack,
  onBack,
  onNext,
  isNextDisabled,
  isNextLoading,
  nextLabel = 'Continue',
  nextButtonType = 'button',
  style,
}) => {
  return (
    <motion.div
      // 🎬 FADE-IN + SLIDE-UP ANIMATION
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4 }}
      className="flex justify-between items-center mt-12 w-full"
      style={style}
    >
      {/* BACK BUTTON - Left side */}
      <div className="flex-shrink-0">
        {showBack && onBack ? (
          <Button
            onClick={onBack}
            variant="ghost"
            type="button"
            className="group"
          >
            {/* Arrow slides left on hover */}
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back
          </Button>
        ) : (
          <div className="w-[100px]" /> 
        )}
      </div>

      {/* CONTINUE BUTTON - Right side */}
      <div className="flex-shrink-0">
        <Button
          onClick={nextButtonType === 'button' ? onNext : undefined}
          type={nextButtonType}
          variant="primary"
          size="lg"
          disabled={isNextDisabled}
          isLoading={isNextLoading}
          className="group"
        >
          {nextLabel}
          {/* Arrow slides right on hover */}
          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </motion.div>
  );
};

export default NavigationButtons;
