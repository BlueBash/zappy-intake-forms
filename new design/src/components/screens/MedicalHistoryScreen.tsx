import { useState } from 'react';
import { motion } from 'motion/react';
import { Heart, Info, Check } from 'lucide-react';

interface MedicalHistoryScreenProps {
  onComplete: (conditions: string[]) => void;
  onBack?: () => void;
  initialConditions?: string[];
}

const MEDICAL_CONDITIONS = [
  { value: 'diabetes_type2', label: 'Type 2 Diabetes' },
  { value: 'prediabetes', label: 'Prediabetes' },
  { value: 'high_blood_pressure', label: 'High Blood Pressure' },
  { value: 'high_cholesterol', label: 'High Cholesterol' },
  { value: 'heart_disease', label: 'Heart Disease' },
  { value: 'pcos', label: 'PCOS (Polycystic Ovary Syndrome)' },
  { value: 'sleep_apnea', label: 'Sleep Apnea' },
  { value: 'thyroid', label: 'Thyroid Issues' },
  { value: 'none', label: 'None of the above' },
];

export default function MedicalHistoryScreen({
  onComplete,
  onBack,
  initialConditions = [],
}: MedicalHistoryScreenProps) {
  const [selectedConditions, setSelectedConditions] = useState<string[]>(initialConditions);

  const handleToggle = (value: string) => {
    if (value === 'none') {
      // If "none" is selected, clear all others
      setSelectedConditions(selectedConditions.includes('none') ? [] : ['none']);
    } else {
      // Remove "none" if selecting any condition
      let newConditions = selectedConditions.filter((c) => c !== 'none');
      
      if (newConditions.includes(value)) {
        newConditions = newConditions.filter((c) => c !== value);
      } else {
        newConditions.push(value);
      }
      
      setSelectedConditions(newConditions);
    }
  };

  const canContinue = selectedConditions.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FDFBF7] via-white to-[#F8FCF9] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-[0_20px_80px_rgba(0,0,0,0.08)] border border-neutral-100 p-6 sm:p-8 md:p-10"
        >
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0D9488]/10 to-[#14B8A6]/10 flex items-center justify-center">
                <Heart className="w-6 h-6 text-[#0D9488]" />
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl text-neutral-900">
                Any relevant health conditions?
              </h2>
            </div>
            <p className="text-base sm:text-lg text-neutral-600 leading-relaxed flex items-start gap-2">
              <Info className="w-5 h-5 mt-1 flex-shrink-0 text-[#0D9488]" />
              <span>
                This helps your provider create the safest, most effective plan for you
              </span>
            </p>
          </div>

          {/* Conditions List */}
          <div className="space-y-3 mb-8">
            {MEDICAL_CONDITIONS.map((condition, index) => {
              const isSelected = selectedConditions.includes(condition.value);
              const isNone = condition.value === 'none';

              return (
                <motion.button
                  key={condition.value}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  onClick={() => handleToggle(condition.value)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-4 px-5 rounded-xl border-2 transition-all duration-300 text-left flex items-center justify-between group ${
                    isSelected
                      ? 'border-[#0D9488] bg-gradient-to-r from-[#0D9488]/5 via-[#FF7A59]/5 to-[#14B8A6]/5 shadow-md'
                      : isNone
                      ? 'border-neutral-300 bg-neutral-50 hover:border-[#0D9488]/30 hover:shadow-md'
                      : 'border-neutral-200 bg-white hover:border-[#0D9488]/30 hover:shadow-md'
                  }`}
                >
                  <span
                    className={`text-base ${
                      isSelected ? 'text-[#0D9488]' : isNone ? 'text-neutral-600' : 'text-neutral-700'
                    }`}
                  >
                    {condition.label}
                  </span>

                  <div
                    className={`w-6 h-6 rounded-lg border-2 transition-all flex items-center justify-center ${
                      isSelected
                        ? 'border-transparent bg-gradient-to-br from-[#0D9488] to-[#14B8A6] shadow-md'
                        : 'border-neutral-300 group-hover:border-[#0D9488]/50'
                    }`}
                  >
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                      >
                        <Check className="w-4 h-4 text-white" strokeWidth={3} />
                      </motion.div>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Selected Count */}
          {selectedConditions.length > 0 && !selectedConditions.includes('none') && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 text-center text-sm text-neutral-600"
            >
              {selectedConditions.length} condition{selectedConditions.length !== 1 ? 's' : ''} selected
            </motion.div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between pt-6 border-t border-neutral-100">
            {onBack && (
              <button
                onClick={onBack}
                className="text-neutral-600 hover:text-neutral-900 transition-colors px-4 py-2"
              >
                ← Back
              </button>
            )}

            <motion.button
              onClick={() => canContinue && onComplete(selectedConditions)}
              disabled={!canContinue}
              whileHover={canContinue ? { scale: 1.02 } : {}}
              whileTap={canContinue ? { scale: 0.98 } : {}}
              className={`ml-auto px-6 sm:px-8 py-3 sm:py-4 rounded-full transition-all duration-300 flex items-center gap-2 ${
                canContinue
                  ? 'bg-gradient-to-r from-[#0D9488] to-[#14B8A6] text-white shadow-[0_10px_40px_rgba(13,148,136,0.3)] hover:shadow-[0_20px_60px_rgba(13,148,136,0.4)]'
                  : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
              }`}
            >
              <span className="text-base sm:text-lg">Continue</span>
              {canContinue && <Check className="w-5 h-5" />}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
