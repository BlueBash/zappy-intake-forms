import { motion } from 'motion/react';
import ScreenLayout from '../common/ScreenLayout';
import NavigationButtons from '../common/NavigationButtons';
import { ScreenProps } from './common';
import { Check, Info } from 'lucide-react';

// Dose options by medication type
const DOSE_OPTIONS = {
  semaglutide: [
    { value: '0.25mg', label: '0.25 mg', description: 'Starting dose' },
    { value: '0.5mg', label: '0.5 mg', description: 'Low dose' },
    { value: '1mg', label: '1 mg', description: 'Medium dose', requiresScript: true },
    { value: '1.7mg', label: '1.7 mg', description: 'Higher dose', requiresScript: true },
    { value: '2.4mg', label: '2.4 mg', description: 'Maximum dose', requiresScript: true },
  ],
  tirzepatide: [
    { value: '2.5mg', label: '2.5 mg', description: 'Starting dose' },
    { value: '5mg', label: '5 mg', description: 'Low dose' },
    { value: '7.5mg', label: '7.5 mg', description: 'Medium dose', requiresScript: true },
    { value: '10mg', label: '10 mg', description: 'Higher dose', requiresScript: true },
    { value: '12.5mg', label: '12.5 mg', description: 'High dose', requiresScript: true },
    { value: '15mg', label: '15 mg', description: 'Maximum dose', requiresScript: true },
  ],
};

export default function DosePreferenceScreen({ 
  screen, 
  answers, 
  updateAnswer, 
  onSubmit, 
  showBack, 
  onBack 
}: ScreenProps) {
  const title = 'headline' in screen ? screen.headline : (screen as any).title;
  const helpText = 'body' in screen ? screen.body : (screen as any).help_text;

  const selectedMedication = answers['selected_medication'] || answers['medication_choice'] || '';
  const selectedMedicationName = answers['selected_medication_name'] || '';
  const selectedDose = answers['preferred_dose'] || '';

  const doseOptions = DOSE_OPTIONS[selectedMedication as keyof typeof DOSE_OPTIONS] || [];
  const hasHigherDoses = doseOptions.some(d => d.requiresScript);

  const handleDoseSelect = (doseValue: string) => {
    updateAnswer('preferred_dose', doseValue);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <ScreenLayout 
        title={title || 'Select Your Preferred Dose'} 
        helpText={helpText || 'Choose your starting dose strength'}
      >
        {selectedMedicationName && (
          <div className="mb-6 p-4 bg-gradient-to-r from-[#0D9488]/5 to-[#14B8A6]/5 rounded-xl border border-[#0D9488]/20">
            <p className="text-sm text-neutral-600">
              Selected Medication: <span className="text-[#0D9488]">{selectedMedicationName}</span>
            </p>
          </div>
        )}

        <div className="mb-8">
          {/* Prescription Info Banner */}
          {hasHigherDoses && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 flex items-start gap-3"
            >
              <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm text-amber-900 mb-1">Prescription Requirements</h4>
                <p className="text-xs text-amber-800">
                  {selectedMedication === 'semaglutide'
                    ? 'Doses above 0.5 mg require a prescription from your provider'
                    : 'Doses above 5 mg require a prescription from your provider'}
                </p>
              </div>
            </motion.div>
          )}

          {/* Dose Selection Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {doseOptions.map((dose, index) => {
              const isSelected = selectedDose === dose.value;
              return (
                <motion.button
                  key={dose.value}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleDoseSelect(dose.value)}
                  className={`relative p-5 rounded-xl border-2 transition-all duration-300 text-left overflow-hidden ${
                    isSelected
                      ? 'border-[#0D9488] bg-gradient-to-br from-[#0D9488]/10 to-[#14B8A6]/5 shadow-lg'
                      : 'border-gray-200 bg-white hover:border-[#0D9488]/30 hover:shadow-md'
                  }`}
                >
                  {/* Prescription Badge */}
                  {dose.requiresScript && (
                    <div className="absolute top-3 right-3">
                      <div className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 text-xs border border-amber-300">
                        Rx Required
                      </div>
                    </div>
                  )}

                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <h4 className={`text-xl mb-1 ${isSelected ? 'text-[#0D9488]' : 'text-neutral-900'}`}>
                        {dose.label}
                      </h4>
                      <p className="text-sm text-neutral-600">{dose.description}</p>
                    </div>

                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                        className="w-7 h-7 rounded-full bg-gradient-to-br from-[#0D9488] to-[#14B8A6] flex items-center justify-center shadow-md flex-shrink-0"
                      >
                        <Check className="w-5 h-5 text-white" strokeWidth={3} />
                      </motion.div>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Helper Text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200"
          >
            <p className="text-sm text-blue-900">
              💡 <span className="font-medium">Not sure which dose to choose?</span> Don't worry—your healthcare provider will help determine the best starting dose for you during your consultation.
            </p>
          </motion.div>
        </div>

        <NavigationButtons
          showBack={showBack}
          onBack={onBack}
          onNext={onSubmit}
          isNextDisabled={!selectedDose}
        />
      </ScreenLayout>
    </motion.div>
  );
}
