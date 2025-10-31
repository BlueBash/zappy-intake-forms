import { motion } from 'motion/react';
import { ReactNode } from 'react';
import { Check } from 'lucide-react';
import NavigationButtons from '../common/NavigationButtons';
import ScreenHeader from '../common/ScreenHeader';

interface SimpleInterstitialWrapperProps {
  children: ReactNode;
  onNext: () => void;
  onBack?: () => void;
  currentStep?: number;
  totalSteps?: number;
  sectionName?: string;
}

export default function SimpleInterstitialWrapper({
  children,
  onNext,
  onBack,
  currentStep,
  totalSteps,
  sectionName,
}: SimpleInterstitialWrapperProps) {
  return (
    <div className="min-h-screen bg-[#fef8f2] flex justify-center p-4 sm:p-6 pt-5 sm:pt-7">
      <div className="w-full max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {/* Progress Bar */}
          {currentStep !== undefined && totalSteps !== undefined && (
            <ScreenHeader
              onBack={onBack}
              sectionLabel={sectionName}
              progressPercentage={(currentStep / totalSteps) * 100}
            />
          )}

          {/* Content */}
          <div className="mb-8">{children}</div>

          {/* Navigation */}
          <div className="mt-8 pt-6 border-t border-neutral-100">
            <NavigationButtons
              onNext={onNext}
              nextLabel="Continue"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
