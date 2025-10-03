import React from 'react';
import Button from '../ui/Button';

interface NavigationButtonsProps {
  showBack: boolean;
  onBack: () => void;
  nextLabel?: string;
  onNext: () => void;
  isNextDisabled?: boolean;
  nextButtonType?: 'button' | 'submit' | 'reset';
}

const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  showBack,
  onBack,
  nextLabel = 'Continue',
  onNext,
  isNextDisabled = false,
  nextButtonType = 'button',
}) => {
  return (
    <div className="w-full flex flex-col-reverse sm:flex-row sm:justify-between items-center mt-12 gap-3 sm:gap-5">
      {/* Back Button */}
      {showBack ? (
        <Button
          variant="secondary"
          onClick={onBack}
          aria-label="Go back to the previous question"
          className="w-full sm:w-auto"
        >
          Back
        </Button>
      ) : (
        // Placeholder to keep the Continue button on the right
        <div className="hidden sm:block sm:w-auto"><div className="py-3 px-6 invisible">Back</div></div>
      )}

      {/* Next/Submit Button */}
      <Button
        onClick={onNext}
        disabled={isNextDisabled}
        type={nextButtonType}
        className="w-full sm:w-auto sm:max-w-[240px]"
      >
        {nextLabel}
      </Button>
    </div>
  );
};

export default NavigationButtons;