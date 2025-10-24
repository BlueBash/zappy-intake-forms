import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, CheckCircle2, Check, AlertCircle } from 'lucide-react';
import ScreenLayout from '../common/ScreenLayout';
import NavigationButtons from '../common/NavigationButtons';
import { ScreenProps } from './common';

interface DoseOption {
  value: string;
  label: string;
  requiresScript?: boolean;
}

interface MedicationOption {
  id: string;
  name: string;
  subtitle: string;
  category: 'semaglutide' | 'tirzepatide' | 'liraglutide';
  startingPrice: number;
  doseOptions: DoseOption[];
}

const medications: MedicationOption[] = [
  {
    id: 'wegovy',
    name: 'Wegovy',
    subtitle: 'Semaglutide for weight loss',
    category: 'semaglutide',
    startingPrice: 299,
    doseOptions: [
      { value: '0.25mg', label: '0.25 mg' },
      { value: '0.5mg', label: '0.5 mg' },
      { value: '1mg', label: '1 mg', requiresScript: true },
      { value: '1.7mg', label: '1.7 mg', requiresScript: true },
      { value: '2.4mg', label: '2.4 mg', requiresScript: true },
    ],
  },
  {
    id: 'semaglutide_compound',
    name: 'Compounded Semaglutide',
    subtitle: 'From compounding pharmacy',
    category: 'semaglutide',
    startingPrice: 199,
    doseOptions: [
      { value: '0.25mg', label: '0.25 mg' },
      { value: '0.5mg', label: '0.5 mg' },
      { value: '1mg', label: '1 mg', requiresScript: true },
      { value: '1.7mg', label: '1.7 mg', requiresScript: true },
      { value: '2.4mg', label: '2.4 mg', requiresScript: true },
    ],
  },
  {
    id: 'zepbound',
    name: 'Zepbound',
    subtitle: 'Tirzepatide for weight loss',
    category: 'tirzepatide',
    startingPrice: 399,
    doseOptions: [
      { value: '2.5mg', label: '2.5 mg' },
      { value: '5mg', label: '5 mg' },
      { value: '7.5mg', label: '7.5 mg', requiresScript: true },
      { value: '10mg', label: '10 mg', requiresScript: true },
      { value: '12.5mg', label: '12.5 mg', requiresScript: true },
      { value: '15mg', label: '15 mg', requiresScript: true },
    ],
  },
  {
    id: 'tirzepatide_compound',
    name: 'Compounded Tirzepatide',
    subtitle: 'From compounding pharmacy',
    category: 'tirzepatide',
    startingPrice: 249,
    doseOptions: [
      { value: '2.5mg', label: '2.5 mg' },
      { value: '5mg', label: '5 mg' },
      { value: '7.5mg', label: '7.5 mg', requiresScript: true },
      { value: '10mg', label: '10 mg', requiresScript: true },
      { value: '12.5mg', label: '12.5 mg', requiresScript: true },
      { value: '15mg', label: '15 mg', requiresScript: true },
    ],
  },
  {
    id: 'saxenda',
    name: 'Saxenda',
    subtitle: 'Liraglutide for weight loss',
    category: 'liraglutide',
    startingPrice: 329,
    doseOptions: [
      { value: '0.6mg', label: '0.6 mg' },
      { value: '1.2mg', label: '1.2 mg' },
      { value: '1.8mg', label: '1.8 mg' },
      { value: '3mg', label: '3 mg' },
    ],
  },
  {
    id: 'victoza',
    name: 'Victoza',
    subtitle: 'Liraglutide for diabetes',
    category: 'liraglutide',
    startingPrice: 289,
    doseOptions: [
      { value: '0.6mg', label: '0.6 mg' },
      { value: '1.2mg', label: '1.2 mg' },
      { value: '1.8mg', label: '1.8 mg' },
    ],
  },
  {
    id: 'liraglutide_compound',
    name: 'Compounded Liraglutide',
    subtitle: 'From compounding pharmacy',
    category: 'liraglutide',
    startingPrice: 189,
    doseOptions: [
      { value: '0.6mg', label: '0.6 mg' },
      { value: '1.2mg', label: '1.2 mg' },
      { value: '1.8mg', label: '1.8 mg' },
      { value: '3mg', label: '3 mg' },
    ],
  },
];

const categoryLabels = {
  semaglutide: 'Semaglutide-based',
  tirzepatide: 'Tirzepatide-based',
  liraglutide: 'Liraglutide-based',
};

const MedicationPreferenceInitialScreen: React.FC<ScreenProps & { screen: any }> = ({
  answers,
  updateAnswer,
  onSubmit,
  showBack,
  onBack,
  showLoginLink,
}) => {
  const [hasPreference, setHasPreference] = useState<string | null>(
    answers.has_medication_preference || null
  );
  const [selectedMedication, setSelectedMedication] = useState<string | null>(
    answers.preferred_medication || null
  );
  const [selectedDose, setSelectedDose] = useState<string | null>(
    answers.preferred_dose || null
  );
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDoneButton, setShowDoneButton] = useState(false);

  useEffect(() => {
    if (hasPreference === 'yes' && !isExpanded) {
      setIsExpanded(true);
    } else if (hasPreference === 'no') {
      setIsExpanded(false);
      setSelectedMedication(null);
      setSelectedDose(null);
      setShowDoneButton(false);
    }
  }, [hasPreference]);

  useEffect(() => {
    if (selectedMedication && selectedDose) {
      setShowDoneButton(true);
    } else {
      setShowDoneButton(false);
    }
  }, [selectedMedication, selectedDose]);

  const handlePreferenceChange = (value: string) => {
    setHasPreference(value);
    updateAnswer('has_medication_preference', value);
    
    if (value === 'no') {
      setSelectedMedication(null);
      setSelectedDose(null);
      setShowDoneButton(false);
      updateAnswer('preferred_medication', null);
      updateAnswer('preferred_dose', null);
    }
  };

  const handleMedicationSelect = (medId: string) => {
    setSelectedMedication(medId);
    setSelectedDose(null); // Reset dose when changing medication
    setShowDoneButton(false);
    updateAnswer('preferred_medication', medId);
    updateAnswer('preferred_dose', null);
  };

  const handleDoseSelect = (dose: string) => {
    setSelectedDose(dose);
    updateAnswer('preferred_dose', dose);
  };

  const handleDone = () => {
    setTimeout(() => {
      onSubmit();
    }, 600);
  };

  const handleNext = () => {
    if (hasPreference === 'yes' && (!selectedMedication || !selectedDose)) {
      return;
    }
    onSubmit();
  };

  const isNextDisabled = hasPreference === null || (hasPreference === 'yes' && (!selectedMedication || !selectedDose)) && !showDoneButton;

  const groupedMedications = medications.reduce((acc, med) => {
    if (!acc[med.category]) acc[med.category] = [];
    acc[med.category].push(med);
    return acc;
  }, {} as Record<string, MedicationOption[]>);

  const selectedMedicationData = medications.find(m => m.id === selectedMedication);
  const selectedDoseData = selectedMedicationData?.doseOptions.find(d => d.value === selectedDose);

  return (
    <ScreenLayout
      title="Do you have a GLP-1 medication in mind?"
      showLoginLink={showLoginLink}
    >
      <div className="space-y-6">
        {/* Yes/No Selection */}
        <div className="flex gap-4">
          <button
            onClick={() => handlePreferenceChange('yes')}
            className={`flex-1 py-4 px-6 rounded-xl border-2 transition-all duration-200 ${
              hasPreference === 'yes'
                ? 'border-primary bg-primary text-white shadow-lg'
                : 'border-gray-200 bg-white text-neutral-700 hover:border-primary/30'
            }`}
          >
            <div className="text-lg font-semibold">Yes</div>
            <div className="text-sm mt-1 opacity-90">I have a preference</div>
          </button>
          <button
            onClick={() => handlePreferenceChange('no')}
            className={`flex-1 py-4 px-6 rounded-xl border-2 transition-all duration-200 ${
              hasPreference === 'no'
                ? 'border-primary bg-primary text-white shadow-lg'
                : 'border-gray-200 bg-white text-neutral-700 hover:border-primary/30'
            }`}
          >
            <div className="text-lg font-semibold">No</div>
            <div className="text-sm mt-1 opacity-90">Open to recommendations</div>
          </button>
        </div>

        {/* Expandable Medication Selection */}
        <AnimatePresence>
          {hasPreference === 'yes' && isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="space-y-6 pt-4">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                    Which medication are you interested in?
                  </h3>
                  <p className="text-sm text-neutral-600">Select one medication below</p>
                </div>

                {Object.entries(groupedMedications).map(([category, meds], categoryIndex) => (
                  <div key={category}>
                    <h4 className="text-sm uppercase tracking-wider text-neutral-500 mb-3 px-1">
                      {categoryLabels[category as keyof typeof categoryLabels]}
                    </h4>
                    <div className="space-y-3">
                      {meds.map((med, index) => {
                        const isSelected = selectedMedication === med.id;

                        return (
                          <motion.div key={med.id}>
                            <motion.button
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{
                                delay: categoryIndex * 0.05 + index * 0.03,
                                duration: 0.3,
                              }}
                              onClick={() => handleMedicationSelect(med.id)}
                              className={`w-full rounded-xl border-2 transition-all duration-200 p-4 ${
                                isSelected
                                  ? 'border-primary bg-primary/5'
                                  : 'border-gray-200 bg-white hover:border-primary/30'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  className={`flex-shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${
                                    isSelected
                                      ? 'bg-primary border-primary'
                                      : 'border-gray-300'
                                  }`}
                                >
                                  {isSelected && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
                                </div>

                                <div className="flex-1 text-left">
                                  <div className={`font-medium ${isSelected ? 'text-primary' : 'text-neutral-900'}`}>
                                    {med.name}
                                  </div>
                                  <div className="text-sm text-neutral-600">Starting from ${med.startingPrice}</div>
                                </div>

                                {isSelected && <CheckCircle2 className="w-5 h-5 text-primary" />}
                              </div>
                            </motion.button>

                            {/* Inline Dose Selection */}
                            {isSelected && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="mt-4 ml-9 space-y-4"
                              >
                                <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                                  <div className="mb-4">
                                    <h4 className="text-sm font-medium text-neutral-900 mb-1">
                                      Do you have a preference for the dose?
                                    </h4>
                                    <p className="text-xs text-neutral-600">
                                      A copy of your prescription is required.*
                                    </p>
                                  </div>
                                  
                                  <div className="grid grid-cols-3 gap-2">
                                    {med.doseOptions.map((dose) => (
                                      <button
                                        key={dose.value}
                                        onClick={() => handleDoseSelect(dose.value)}
                                        className={`py-2 px-3 rounded-lg border-2 transition-all duration-200 text-sm ${
                                          selectedDose === dose.value
                                            ? 'border-primary bg-primary text-white'
                                            : 'border-gray-200 bg-white text-neutral-700 hover:border-primary/30'
                                        }`}
                                      >
                                        <div className="font-medium">{dose.label}</div>
                                        {dose.requiresScript && (
                                          <div className={`text-xs mt-1 ${selectedDose === dose.value ? 'text-white/80' : 'text-amber-600'}`}>
                                            *
                                          </div>
                                        )}
                                      </button>
                                    ))}
                                  </div>
                                  
                                  <div className="mt-3 pt-3 border-t border-primary/20">
                                    <button
                                      onClick={() => handleDoseSelect('no_preference')}
                                      className={`w-full py-3 px-4 rounded-lg border-2 transition-all duration-200 text-sm ${
                                        selectedDose === 'no_preference'
                                          ? 'border-primary bg-primary text-white'
                                          : 'border-gray-200 bg-white text-neutral-700 hover:border-primary/30'
                                      }`}
                                    >
                                      <div className="font-medium">I have no preference</div>
                                      <div className={`text-xs mt-1 ${selectedDose === 'no_preference' ? 'text-white/80' : 'text-neutral-500'}`}>
                                        I'll follow medical advice
                                      </div>
                                    </button>
                                  </div>

                                  {/* Done Button - Right aligned */}
                                  {showDoneButton && (
                                    <motion.div
                                      initial={{ opacity: 0, scale: 0.95 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      className="pt-4 flex justify-end"
                                    >
                                      <button
                                        onClick={handleDone}
                                        className="px-8 py-2 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-all duration-200 shadow-md hover:shadow-lg"
                                      >
                                        Done
                                      </button>
                                    </motion.div>
                                  )}
                                </div>
                              </motion.div>
                            )}
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <NavigationButtons
        showBack={showBack}
        onBack={onBack}
        onNext={handleNext}
        isNextDisabled={isNextDisabled}
        style={{ display: showDoneButton ? 'none' : 'flex' }}
      />
    </ScreenLayout>
  );
};

export default MedicationPreferenceInitialScreen;
