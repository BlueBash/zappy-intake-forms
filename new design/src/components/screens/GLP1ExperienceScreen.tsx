import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ScreenHeader from '../common/ScreenHeader';
import SingleSelectButtonGroup from '../common/SingleSelectButtonGroup';

interface GLP1ExperienceScreenProps {
  onNext: (hasExperience: boolean, medicationPreference?: string) => void;
  onBack?: () => void;
  currentStep?: number;
  totalSteps?: number;
}

export default function GLP1ExperienceScreen({
  onNext,
  onBack,
  currentStep,
  totalSteps,
}: GLP1ExperienceScreenProps) {
  const [selectedValue, setSelectedValue] = useState<string>('');
  const [hasMedicationInMind, setHasMedicationInMind] = useState<string>('');

  const handleSelect = (value: string) => {
    setSelectedValue(value);
    if (value === 'yes') {
      // Auto-advance after selection for "yes"
      setTimeout(() => {
        onNext(true);
      }, 300); // Small delay for visual feedback
    } else {
      // For "no", don't auto-advance - show medication preference question
      setHasMedicationInMind('');
    }
  };

  const handleMedicationMindSelect = (value: string) => {
    setHasMedicationInMind(value);
    // Auto-advance after selection
    setTimeout(() => {
      onNext(false, value);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-[#fef8f2] flex justify-center p-4 sm:p-6 pt-5 sm:pt-7">
      <div className="w-full max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Progress Bar */}
          {currentStep !== undefined && totalSteps !== undefined && (
            <ScreenHeader
              onBack={onBack}
              sectionLabel="Medication History"
              progressPercentage={(currentStep / totalSteps) * 100}
            />
          )}

          {/* Header */}
          <div className="mb-10 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl sm:text-3xl md:text-4xl text-neutral-900 mb-3 sm:mb-4 leading-snug tracking-tight"
              style={{ letterSpacing: '-0.02em' }}
            >
              Have you tried a GLP-1 medication before?
            </motion.h1>
          </div>

          {/* Answer Options */}
          <SingleSelectButtonGroup
            selectedValue={selectedValue}
            onSelect={handleSelect}
            options={[
              { value: 'yes', label: 'Yes' },
              { value: 'no', label: 'No' },
            ]}
          />

          {/* Show medication in mind question when "No" is selected */}
          <AnimatePresence>
            {selectedValue === 'no' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-8 space-y-6"
              >
                <div className="text-center">
                  <h2 className="text-xl sm:text-2xl text-neutral-900 mb-4">
                    Do you have a medication in mind?
                  </h2>
                </div>

                <SingleSelectButtonGroup
                  selectedValue={hasMedicationInMind}
                  onSelect={handleMedicationMindSelect}
                  options={[
                    { value: 'yes', label: 'Yes' },
                    { value: 'no', label: 'No' },
                  ]}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
