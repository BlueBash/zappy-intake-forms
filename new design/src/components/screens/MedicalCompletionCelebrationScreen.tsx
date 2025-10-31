import { motion } from 'motion/react';
import { CheckCircle2, Sparkles } from 'lucide-react';
import NavigationButtons from '../common/NavigationButtons';
import ScreenHeader from '../common/ScreenHeader';

interface MedicalCompletionCelebrationScreenProps {
  onNext: () => void;
  onBack?: () => void;
  currentStep?: number;
  totalSteps?: number;
}

export default function MedicalCompletionCelebrationScreen({
  onNext,
  onBack,
  currentStep,
  totalSteps,
}: MedicalCompletionCelebrationScreenProps) {
  return (
    <div className="min-h-screen bg-[#fef8f2] flex justify-center p-4 sm:p-6 pt-5 sm:pt-7">
      <div className="w-full max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
        >
          {/* Progress Bar */}
          {currentStep !== undefined && totalSteps !== undefined && (
            <ScreenHeader
              onBack={onBack}
              progressPercentage={(currentStep / totalSteps) * 100}
            />
          )}

          {/* Celebration Content */}
          <div className="text-center py-12 sm:py-16">
            {/* Animated Checkmark */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                delay: 0.2, 
                duration: 0.6,
                type: "spring",
                stiffness: 200,
                damping: 15
              }}
              className="inline-flex items-center justify-center mb-6 sm:mb-8"
            >
              <div className="relative">
                <CheckCircle2 className="w-20 h-20 sm:w-24 sm:h-24 text-[#10b981]" strokeWidth={2} />
                
                {/* Sparkle effects */}
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute -top-2 -right-2"
                >
                  <Sparkles className="w-6 h-6 text-[#f59e0b]" />
                </motion.div>
                
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5
                  }}
                  className="absolute -bottom-1 -left-2"
                >
                  <Sparkles className="w-5 h-5 text-[#f59e0b]" />
                </motion.div>
              </div>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="text-2xl sm:text-3xl md:text-4xl text-neutral-900 mb-4 sm:mb-5 leading-snug tracking-tight"
              style={{ letterSpacing: '-0.02em' }}
            >
              Great work! 🎉
            </motion.h1>

            {/* Body Text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="space-y-4 mb-8 sm:mb-10"
            >
              <p className="text-base sm:text-lg text-neutral-700 leading-relaxed max-w-lg mx-auto">
                You've completed your medical assessment! Next, we'll ask about your GLP-1 medication history and help you choose the perfect treatment plan tailored to your goals and needs.
              </p>
            </motion.div>
          </div>

          {/* Navigation */}
          <div className="mt-8 pt-6 border-t border-neutral-100">
            <NavigationButtons
              onNext={onNext}
              nextLabel="Choose My Plan"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
