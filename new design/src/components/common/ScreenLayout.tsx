import { motion } from 'motion/react';
import { ReactNode } from 'react';
import ScreenHeader from './ScreenHeader';

interface ScreenLayoutProps {
  title?: string;
  helpText?: string;
  headerSize?: string;
  children: ReactNode;
  showHeader?: boolean;
  progress?: number; // Progress percentage 0-100
  currentStep?: number; // Current step number
  totalSteps?: number; // Total steps
  sectionLabel?: string; // Section name (e.g., "Medical History")
  sectionStep?: number; // Current step within section
  sectionTotal?: number; // Total steps in section
  showBack?: boolean; // Show back arrow
  onBack?: () => void; // Back handler
}

export default function ScreenLayout({ 
  title, 
  helpText, 
  headerSize, 
  children, 
  showHeader = true,
  progress,
  currentStep,
  totalSteps,
  sectionLabel,
  sectionStep,
  sectionTotal,
  showBack,
  onBack
}: ScreenLayoutProps) {
  const titleSize = headerSize === 'large' ? 'text-3xl sm:text-4xl md:text-5xl' : 'text-2xl sm:text-3xl md:text-4xl';
  
  return (
    <div className="min-h-screen bg-[#fef8f2] flex justify-center p-4 sm:p-6 pt-5 sm:pt-7">
      <div className="w-full max-w-2xl mx-auto">
        {/* Progress Bar */}
        {(progress !== undefined || (currentStep !== undefined && totalSteps !== undefined)) && (
          <ScreenHeader
            onBack={onBack}
            sectionLabel={sectionLabel}
            currentStep={sectionStep}
            totalSteps={sectionTotal}
            progressPercentage={progress ?? ((currentStep! / totalSteps!) * 100)}
          />
        )}
        
        {showHeader && title && (
          <div className="mb-6 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`${titleSize} text-[#2D3436] mb-3 sm:mb-4 leading-tight tracking-tight`}
              style={{ letterSpacing: '-0.02em' }}
            >
              {title}
            </motion.h1>
            {helpText && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-base sm:text-lg text-[#666666] max-w-xl mx-auto"
                style={{ lineHeight: '1.65' }}
              >
                {helpText}
              </motion.p>
            )}
          </div>
        )}
        <div>{children}</div>
      </div>
    </div>
  );
}
