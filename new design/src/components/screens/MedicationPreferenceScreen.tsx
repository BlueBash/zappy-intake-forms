import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, CheckCircle2, AlertCircle, ChevronRight, Info } from 'lucide-react';
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
  doseOptions: DoseOption[];
}

const medications: MedicationOption[] = [
  {
    id: 'wegovy',
    name: 'Wegovy',
    subtitle: 'Semaglutide for weight loss',
    category: 'semaglutide',
    doseOptions: [
      { value: '0.25mg', label: '0.25 mg' },
      { value: '0.5mg', label: '0.5 mg' },
      { value: '1mg', label: '1 mg', requiresScript: true },
      { value: '1.7mg', label: '1.7 mg', requiresScript: true },
      { value: '2.4mg', label: '2.4 mg', requiresScript: true },
    ],
  },
  {
    id: 'ozempic',
    name: 'Ozempic',
    subtitle: 'Semaglutide for diabetes',
    category: 'semaglutide',
    doseOptions: [
      { value: '0.25mg', label: '0.25 mg' },
      { value: '0.5mg', label: '0.5 mg' },
      { value: '1mg', label: '1 mg', requiresScript: true },
      { value: '2mg', label: '2 mg', requiresScript: true },
    ],
  },
  {
    id: 'semaglutide_compound',
    name: 'Compounded Semaglutide',
    subtitle: 'From compounding pharmacy',
    category: 'semaglutide',
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
    id: 'mounjaro',
    name: 'Mounjaro',
    subtitle: 'Tirzepatide for diabetes',
    category: 'tirzepatide',
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

const categoryInfo = {
  semaglutide: 'Most widely prescribed GLP-1 medication',
  tirzepatide: 'Dual-action GIP/GLP-1 receptor agonist',
  liraglutide: 'Daily injection for weight management',
};

const MedicationPreferenceScreen: React.FC<ScreenProps & { screen: any }> = ({
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
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  useEffect(() => {
    if (hasPreference === 'no') {
      setSelectedMedication(null);
      setSelectedDose(null);
      setExpandedCategory(null);
    }
  }, [hasPreference]);

  const handlePreferenceChange = (value: string) => {
    setHasPreference(value);
    updateAnswer('has_medication_preference', value);
    
    if (value === 'no') {
      setSelectedMedication(null);
      setSelectedDose(null);
      setExpandedCategory(null);
      updateAnswer('preferred_medication', null);
      updateAnswer('preferred_dose', null);
    }
  };

  const handleMedicationSelect = (medId: string, category: string) => {
    // If selecting the same medication, deselect it
    if (selectedMedication === medId) {
      setSelectedMedication(null);
      setSelectedDose(null);
      setExpandedCategory(null);
      updateAnswer('preferred_medication', null);
      updateAnswer('preferred_dose', null);
    } else {
      // Select new medication and expand its category
      setSelectedMedication(medId);
      setSelectedDose(null);
      setExpandedCategory(category);
      updateAnswer('preferred_medication', medId);
      updateAnswer('preferred_dose', null);
    }
  };

  const handleDoseSelect = (dose: string) => {
    setSelectedDose(dose);
    updateAnswer('preferred_dose', dose);
  };

  const handleNext = () => {
    if (hasPreference === 'yes' && (!selectedMedication || !selectedDose)) {
      return;
    }
    onSubmit();
  };

  const isNextDisabled = hasPreference === null || (hasPreference === 'yes' && (!selectedMedication || !selectedDose));

  const groupedMedications = medications.reduce((acc, med) => {
    if (!acc[med.category]) acc[med.category] = [];
    acc[med.category].push(med);
    return acc;
  }, {} as Record<string, MedicationOption[]>);

  const selectedMedicationData = medications.find(m => m.id === selectedMedication);

  return (
    <ScreenLayout
      title="Do you have a medication in mind?"
      helpText="Tell us if you have a preference, or we'll recommend the best option for you"
      showLoginLink={showLoginLink}
    >
      <div className="space-y-8">
        {/* Yes/No Selection */}
        <div className="grid grid-cols-2 gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handlePreferenceChange('yes')}
            className={`relative p-6 rounded-2xl border-2 transition-all duration-300 overflow-hidden ${
              hasPreference === 'yes'
                ? 'border-[#0D9488] bg-gradient-to-br from-[#0D9488]/10 via-white to-[#14B8A6]/10 shadow-xl'
                : 'border-gray-200 bg-white hover:border-[#0D9488]/30 hover:shadow-lg'
            }`}
          >
            {hasPreference === 'yes' && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gradient-to-br from-[#0D9488] to-[#14B8A6] flex items-center justify-center shadow-lg"
              >
                <Check className="w-5 h-5 text-white" strokeWidth={3} />
              </motion.div>
            )}
            <div className={`text-xl mb-2 transition-colors ${
              hasPreference === 'yes' ? 'text-[#0D9488]' : 'text-neutral-900'
            }`}>
              Yes
            </div>
            <div className="text-sm text-neutral-600">I have a preference</div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handlePreferenceChange('no')}
            className={`relative p-6 rounded-2xl border-2 transition-all duration-300 overflow-hidden ${
              hasPreference === 'no'
                ? 'border-[#0D9488] bg-gradient-to-br from-[#0D9488]/10 via-white to-[#14B8A6]/10 shadow-xl'
                : 'border-gray-200 bg-white hover:border-[#0D9488]/30 hover:shadow-lg'
            }`}
          >
            {hasPreference === 'no' && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gradient-to-br from-[#0D9488] to-[#14B8A6] flex items-center justify-center shadow-lg"
              >
                <Check className="w-5 h-5 text-white" strokeWidth={3} />
              </motion.div>
            )}
            <div className={`text-xl mb-2 transition-colors ${
              hasPreference === 'no' ? 'text-[#0D9488]' : 'text-neutral-900'
            }`}>
              No
            </div>
            <div className="text-sm text-neutral-600">Open to recommendations</div>
          </motion.button>
        </div>

        {/* Medication Selection with Inline Dose Selection */}
        <AnimatePresence>
          {hasPreference === 'yes' && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="space-y-6 pt-2">
                {/* Header */}
                <div className="text-center">
                  <h3 className="text-xl text-neutral-900 mb-2">
                    Select your preferred medication
                  </h3>
                  <p className="text-sm text-neutral-600">Choose one, then pick your dose</p>
                </div>

                {/* Medication groups with inline dose selection */}
                {Object.entries(groupedMedications).map(([category, meds], categoryIndex) => (
                  <div key={category}>
                    {/* Category Header */}
                    <div className="flex items-center gap-2 mb-3 px-1">
                      <h4 className="text-sm uppercase tracking-wider text-neutral-500">
                        {categoryLabels[category as keyof typeof categoryLabels]}
                      </h4>
                      <div className="flex-1 h-px bg-gray-200" />
                      <span className="text-xs text-neutral-400">
                        {categoryInfo[category as keyof typeof categoryInfo]}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {meds.map((med, index) => {
                        const isSelected = selectedMedication === med.id;
                        const showDoses = isSelected && expandedCategory === category;

                        return (
                          <motion.div
                            key={med.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              delay: categoryIndex * 0.05 + index * 0.03,
                              duration: 0.3,
                            }}
                            className="space-y-3"
                          >
                            {/* Medication Card */}
                            <motion.button
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.99 }}
                              onClick={() => handleMedicationSelect(med.id, category)}
                              className={`w-full rounded-xl border-2 transition-all duration-300 p-4 ${
                                isSelected
                                  ? 'border-[#0D9488] bg-gradient-to-r from-[#0D9488]/5 to-[#14B8A6]/5 shadow-lg'
                                  : 'border-gray-200 bg-white hover:border-[#0D9488]/30 hover:shadow-md'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3 flex-1">
                                  <div
                                    className={`flex-shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all duration-300 ${
                                      isSelected
                                        ? 'bg-gradient-to-br from-[#0D9488] to-[#14B8A6] border-[#0D9488]'
                                        : 'border-gray-300'
                                    }`}
                                  >
                                    {isSelected && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
                                  </div>

                                  <div className="flex-1 text-left">
                                    <div className={`transition-colors ${
                                      isSelected ? 'text-[#0D9488]' : 'text-neutral-900'
                                    }`}>
                                      {med.name}
                                    </div>
                                    <div className="text-sm text-neutral-600">{med.subtitle}</div>
                                  </div>
                                </div>

                                <ChevronRight className={`w-5 h-5 transition-all ${
                                  isSelected ? 'text-[#0D9488] rotate-90' : 'text-neutral-400'
                                }`} />
                              </div>
                            </motion.button>

                            {/* Inline Dose Selection - Appears immediately below selected medication */}
                            <AnimatePresence>
                              {showDoses && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0, y: -10 }}
                                  animate={{ height: 'auto', opacity: 1, y: 0 }}
                                  exit={{ height: 0, opacity: 0, y: -10 }}
                                  transition={{ duration: 0.3 }}
                                  className="overflow-hidden pl-10"
                                >
                                  <div className="p-4 rounded-xl bg-gradient-to-br from-[#0D9488]/5 to-[#14B8A6]/5 border border-[#0D9488]/20">
                                    <div className="mb-4">
                                      <h4 className="text-sm text-neutral-900 mb-1">
                                        Select your preferred dose
                                      </h4>
                                      <p className="text-xs text-neutral-600">
                                        Choose your starting dose strength
                                      </p>
                                    </div>

                                    {/* Script warning for this medication */}
                                    {med.doseOptions.some(d => d.requiresScript) && (
                                      <div className="mb-4 p-3 rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 flex items-start gap-2">
                                        <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                                        <div className="text-xs text-amber-900">
                                          {med.category === 'semaglutide'
                                            ? 'Doses above 0.5 mg require prescription'
                                            : med.category === 'tirzepatide'
                                            ? 'Doses above 5 mg require prescription'
                                            : 'Some doses require prescription'}
                                        </div>
                                      </div>
                                    )}

                                    <div className="grid grid-cols-3 gap-2">
                                      {med.doseOptions.map((dose, idx) => (
                                        <motion.button
                                          key={dose.value}
                                          initial={{ opacity: 0, scale: 0.9 }}
                                          animate={{ opacity: 1, scale: 1 }}
                                          transition={{ delay: idx * 0.05 }}
                                          whileHover={{ scale: 1.05 }}
                                          whileTap={{ scale: 0.95 }}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleDoseSelect(dose.value);
                                          }}
                                          className={`relative py-3 px-2 rounded-lg border-2 transition-all duration-300 ${
                                            selectedDose === dose.value
                                              ? 'border-[#0D9488] bg-gradient-to-br from-[#0D9488] to-[#14B8A6] text-white shadow-lg'
                                              : 'border-gray-200 bg-white text-neutral-700 hover:border-[#0D9488]/30'
                                          }`}
                                        >
                                          <div className="text-center text-sm">
                                            <div className="mb-0.5">{dose.label}</div>
                                            {dose.requiresScript && (
                                              <div className={`text-xs ${
                                                selectedDose === dose.value ? 'text-white/90' : 'text-amber-600'
                                              }`}>
                                                Rx
                                              </div>
                                            )}
                                          </div>
                                        </motion.button>
                                      ))}
                                    </div>

                                    {/* Dose selected confirmation */}
                                    {selectedDose && (
                                      <motion.div
                                        initial={{ opacity: 0, y: -5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-3 flex items-center justify-center gap-2 text-sm text-[#0D9488]"
                                      >
                                        <CheckCircle2 className="w-4 h-4" />
                                        <span>{selectedDose} selected</span>
                                      </motion.div>
                                    )}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
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
      />
    </ScreenLayout>
  );
};

export default MedicationPreferenceScreen;
