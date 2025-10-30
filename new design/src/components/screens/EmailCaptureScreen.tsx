import { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Check, Lock, Shield } from 'lucide-react';
import NavigationButtons from '../common/NavigationButtons';
import ScreenHeader from '../common/ScreenHeader';

interface EmailCaptureScreenProps {
  onSubmit: (email: string) => void;
  onBack?: () => void;
  progressPercentage?: number;
  currentStep?: number;
  totalSteps?: number;
  sectionLabel?: string;
}

export default function EmailCaptureScreen({
  onSubmit,
  onBack,
  progressPercentage = 75,
  currentStep,
  totalSteps,
  sectionLabel,
}: EmailCaptureScreenProps) {
  const [email, setEmail] = useState('');
  const [isValid, setIsValid] = useState(false);

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const handleChange = (value: string) => {
    setEmail(value);
    setIsValid(validateEmail(value));
  };

  const handleSubmit = () => {
    if (isValid) {
      // Show success toast (if you add sonner)
      // toast.success("Progress saved! You can return anytime.", { duration: 3000 });
      onSubmit(email);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isValid) {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-[#fef8f2] flex justify-center p-4 sm:p-6 pt-5 sm:pt-7">
      <div className="w-full max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Progress Bar */}
          <ScreenHeader
            onBack={onBack}
            sectionLabel={sectionLabel}
            currentStep={currentStep}
            totalSteps={totalSteps}
            progressPercentage={
              currentStep !== undefined && totalSteps !== undefined
                ? (currentStep / totalSteps) * 100
                : progressPercentage
            }
          />

          <div>
            {/* Header */}
            <div className="text-center mb-6">
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-2xl sm:text-3xl md:text-4xl text-neutral-900 mb-3 sm:mb-4 leading-snug tracking-tight"
                style={{ letterSpacing: '-0.02em' }}
              >
                One more step to get started
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-base text-neutral-600"
              >
                We'll keep you updated on your progress and next steps
              </motion.p>
            </div>



            {/* Email Input */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-6"
            >
              <label className="block text-sm text-neutral-700 mb-3">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => handleChange(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="you@example.com"
                  className={`w-full pl-12 pr-4 py-4 rounded-xl border-2 transition-all text-base outline-none shadow-sm ${
                    email && !isValid
                      ? 'border-red-300 bg-white focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-100'
                      : 'border-gray-300 bg-white focus:border-[#1a7f72] focus:bg-white focus:ring-4 focus:ring-[#1a7f72]/10'
                  }`}
                  autoFocus
                />
                {isValid && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#00A896] flex items-center justify-center"
                  >
                    <Check className="w-4 h-4 text-white" strokeWidth={3} />
                  </motion.div>
                )}
              </div>
              {email && !isValid && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-600 mt-2"
                >
                  Please enter a valid email address
                </motion.p>
              )}
            </motion.div>

            {/* Privacy Notice */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mb-8"
            >
              <div className="flex items-start gap-3 text-sm leading-relaxed text-neutral-700 bg-white/30 backdrop-blur-sm rounded-xl p-4 border border-neutral-200/40">
                <Lock className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#0D9488]" />
                <p className="leading-relaxed">
                  <strong className="text-neutral-900">Your Privacy:</strong> Your health information is protected under HIPAA. We use secure storage and encryption.
                </p>
              </div>
            </motion.div>

            {/* Submit Button */}
            <div className="mt-8">
              <NavigationButtons
                onNext={handleSubmit}
                isNextDisabled={!isValid}
                nextLabel="Continue"
              />
            </div>
          </div>
        </motion.div>


      </div>
    </div>
  );
}
