import { motion } from 'framer-motion';
import BackButton from './BackButton';
import Logo from './Logo';
import SectionIndicator from './SectionIndicator';
import ProgressBar from '../ui/ProgressBar';

interface ScreenHeaderProps {
  onBack?: () => void;
  sectionLabel?: string;
  currentStep?: number;
  totalSteps?: number;
  showProgress?: boolean;
  progressPercentage?: number;
  className?: string;
}

/**
 * ScreenHeader Component
 * 
 * Standardized header used across all questionnaire screens.
 * Combines: Back button + Logo + Section indicator + Progress bar
 * 
 * This is the SINGLE SOURCE OF TRUTH for screen headers.
 * Any changes to header styling/behavior should be made here.
 * 
 * Usage:
 * ```tsx
 * <ScreenHeader
 *   onBack={handleBack}
 *   sectionLabel="Your Goals"
 *   currentStep={1}
 *   totalSteps={3}
 *   showProgress={true}
 *   progressPercentage={33}
 * />
 * ```
 */
export default function ScreenHeader({
  onBack,
  sectionLabel,
  currentStep,
  totalSteps,
  showProgress = true,
  progressPercentage,
  className = ''
}: ScreenHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`${className}`}
    >
      {/* Header Row */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Back Button */}
          <BackButton onClick={onBack} />
          
          {/* Logo */}
          <Logo />
        </div>
        
        {/* Section Indicator */}
        {sectionLabel && (
          <SectionIndicator
            label={sectionLabel}
            currentStep={currentStep}
            totalSteps={totalSteps}
          />
        )}
      </div>

      {/* Progress Bar */}
      {showProgress && progressPercentage !== undefined && (
        <ProgressBar
          progress={progressPercentage}
          sectionDescription={sectionLabel}
          currentStep={currentStep}
          totalSteps={totalSteps}
        />
      )}
    </motion.div>
  );
}