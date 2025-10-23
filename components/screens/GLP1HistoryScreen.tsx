import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, CheckCircle2, AlertCircle, Check } from 'lucide-react';
import Input from '../ui/Input';
import ScreenLayout from '../common/ScreenLayout';
import NavigationButtons from '../common/NavigationButtons';
import { ScreenProps } from './common';

interface MedicationDetail {
  currentlyTaking?: string;
  duration: string;
  lastTaken: string;
  highestDose: string;
  sideEffects?: string;
}

interface MedicationData {
  id: string;
  name: string;
  subtitle: string;
  category: 'semaglutide' | 'tirzepatide' | 'liraglutide' | 'other';
  doseOptions: { value: string; label: string }[];
}

const medications: MedicationData[] = [
  {
    id: 'wegovy',
    name: 'Wegovy',
    subtitle: 'Semaglutide for weight loss',
    category: 'semaglutide',
    doseOptions: [
      { value: '0.25mg', label: '0.25 mg' },
      { value: '0.5mg', label: '0.5 mg' },
      { value: '1mg', label: '1 mg' },
      { value: '1.7mg', label: '1.7 mg' },
      { value: '2mg', label: '2 mg' },
      { value: '2.4mg', label: '2.4 mg' },
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
      { value: '1mg', label: '1 mg' },
      { value: '2mg', label: '2 mg' },
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
      { value: '1mg', label: '1 mg' },
      { value: '1.7mg', label: '1.7 mg' },
      { value: '2mg', label: '2 mg' },
      { value: '2.4mg', label: '2.4 mg' },
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
      { value: '7.5mg', label: '7.5 mg' },
      { value: '10mg', label: '10 mg' },
      { value: '12.5mg', label: '12.5 mg' },
      { value: '15mg', label: '15 mg' },
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
      { value: '7.5mg', label: '7.5 mg' },
      { value: '10mg', label: '10 mg' },
      { value: '12.5mg', label: '12.5 mg' },
      { value: '15mg', label: '15 mg' },
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
      { value: '7.5mg', label: '7.5 mg' },
      { value: '10mg', label: '10 mg' },
      { value: '12.5mg', label: '12.5 mg' },
      { value: '15mg', label: '15 mg' },
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
];

const categoryLabels = {
  semaglutide: 'Semaglutide-based',
  tirzepatide: 'Tirzepatide-based',
  liraglutide: 'Liraglutide-based',
  other: 'Other',
};

const GLP1HistoryScreen: React.FC<ScreenProps & { screen: any }> = ({ 
  answers, 
  updateAnswer, 
  onSubmit, 
  showBack, 
  onBack, 
  showLoginLink 
}) => {
  const [selectedMedications, setSelectedMedications] = useState<string[]>([]);
  const [expandedMedication, setExpandedMedication] = useState<string | null>(null);
  const [medicationDetails, setMedicationDetails] = useState<Record<string, MedicationDetail>>({});
  const [otherMedication, setOtherMedication] = useState({
    selected: false,
    expanded: false,
    name: '',
    duration: '',
    lastTaken: '',
    highestDose: '',
    sideEffects: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const selected: string[] = [];
    const details: Record<string, MedicationDetail> = {};

    medications.forEach((med) => {
      if (answers[`used_${med.id}`]) {
        selected.push(med.id);
        details[med.id] = {
          currentlyTaking: answers[`${med.id}_currently_taking`],
          duration: answers[`${med.id}_duration`] || '',
          lastTaken: answers[`${med.id}_last_taken`] || '',
          highestDose: answers[`${med.id}_highest_dose`] || '',
          sideEffects: answers[`${med.id}_side_effects`] || '',
        };
      }
    });

    if (answers.used_other) {
      setOtherMedication({
        selected: true,
        expanded: false,
        name: answers.other_name || '',
        duration: answers.other_duration || '',
        lastTaken: answers.other_last_taken || '',
        highestDose: answers.other_highest_dose || '',
        sideEffects: answers.other_side_effects || '',
      });
    }

    setSelectedMedications(selected);
    setMedicationDetails(details);
  }, [answers]);

  const toggleMedication = (medId: string) => {
    const isSelected = selectedMedications.includes(medId);
    
    if (isSelected) {
      const newSelected = selectedMedications.filter(id => id !== medId);
      setSelectedMedications(newSelected);
      
      const newDetails = { ...medicationDetails };
      delete newDetails[medId];
      setMedicationDetails(newDetails);
      
      if (expandedMedication === medId) {
        setExpandedMedication(null);
      }
    } else {
      const newSelected = [...selectedMedications, medId];
      setSelectedMedications(newSelected);
      
      if (!medicationDetails[medId]) {
        setMedicationDetails({
          ...medicationDetails,
          [medId]: {
            currentlyTaking: undefined,
            duration: '',
            lastTaken: '',
            highestDose: '',
            sideEffects: '',
          },
        });
      }
      setExpandedMedication(medId);
    }
    setErrors({});
  };

  const toggleExpanded = (medId: string) => {
    setExpandedMedication(expandedMedication === medId ? null : medId);
  };

  const updateMedicationDetail = (medId: string, field: keyof MedicationDetail, value: string) => {
    setMedicationDetails({
      ...medicationDetails,
      [medId]: {
        ...medicationDetails[medId],
        [field]: value,
      },
    });
    
    const errorKey = `${medId}_${field}`;
    if (errors[errorKey]) {
      const newErrors = { ...errors };
      delete newErrors[errorKey];
      setErrors(newErrors);
    }
  };

  const hasCurrentMedication = (): boolean => {
    return selectedMedications.some(medId => medicationDetails[medId]?.currentlyTaking === 'yes');
  };

  const shouldAskCurrentlyTaking = (medId: string): boolean => {
    if (hasCurrentMedication()) {
      return medicationDetails[medId]?.currentlyTaking === 'yes';
    }
    return true;
  };

  const isMedicationComplete = (medId: string): boolean => {
    const details = medicationDetails[medId];
    if (!details) return false;
    
    const needsCurrentlyTaking = shouldAskCurrentlyTaking(medId);
    
    if (needsCurrentlyTaking) {
      if (!details.currentlyTaking) return false;
    }
    
    const hasRequired = details.duration && details.lastTaken && details.highestDose;
    return !!hasRequired;
  };

  const isOtherMedicationComplete = (): boolean => {
    if (!otherMedication.selected) return true;
    if (!otherMedication.name || !otherMedication.duration || !otherMedication.lastTaken || !otherMedication.highestDose) {
      return false;
    }
    return true;
  };

  const handleNext = () => {
    const newErrors: Record<string, string> = {};
    
    if (selectedMedications.length === 0 && !otherMedication.selected) {
      newErrors.general = "Please select at least one GLP-1 medication you've used";
    }

    selectedMedications.forEach((medId) => {
      if (!isMedicationComplete(medId)) {
        newErrors[medId] = 'Please complete all required fields';
      }
    });

    if (otherMedication.selected && !isOtherMedicationComplete()) {
      newErrors.other = 'Please complete all required fields';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const firstErrorElement = document.querySelector('[data-error="true"]');
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    medications.forEach((med) => {
      updateAnswer(`used_${med.id}`, selectedMedications.includes(med.id));
      if (selectedMedications.includes(med.id)) {
        const details = medicationDetails[med.id];
        if (details.currentlyTaking) updateAnswer(`${med.id}_currently_taking`, details.currentlyTaking);
        updateAnswer(`${med.id}_duration`, details.duration);
        updateAnswer(`${med.id}_last_taken`, details.lastTaken);
        updateAnswer(`${med.id}_highest_dose`, details.highestDose);
        if (details.sideEffects) updateAnswer(`${med.id}_side_effects`, details.sideEffects);
      }
    });

    updateAnswer('used_other', otherMedication.selected);
    if (otherMedication.selected) {
      updateAnswer('other_name', otherMedication.name);
      updateAnswer('other_duration', otherMedication.duration);
      updateAnswer('other_last_taken', otherMedication.lastTaken);
      updateAnswer('other_highest_dose', otherMedication.highestDose);
      if (otherMedication.sideEffects) updateAnswer('other_side_effects', otherMedication.sideEffects);
    }

    onSubmit();
  };

  const groupedMedications = medications.reduce((acc, med) => {
    if (!acc[med.category]) acc[med.category] = [];
    acc[med.category].push(med);
    return acc;
  }, {} as Record<string, MedicationData[]>);

  return (
    <ScreenLayout
      title="Which GLP-1 medications have you used?"
      helpText="Select each medication and provide details about your experience"
      showLoginLink={showLoginLink}
    >
      <div className="space-y-8">
        {(selectedMedications.length > 0 || otherMedication.selected) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 via-accent-warm/10 to-primary/10 border border-primary/20">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              <span className="text-sm text-neutral-700">
                {selectedMedications.length + (otherMedication.selected ? 1 : 0)} selected
              </span>
            </div>
          </motion.div>
        )}

        {errors.general && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3"
            data-error="true"
          >
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{errors.general}</p>
          </motion.div>
        )}

        {Object.entries(groupedMedications).map(([category, meds], categoryIndex) => (
          <div key={category}>
            <h3 className="text-sm uppercase tracking-wider text-neutral-500 mb-3 px-1">
              {categoryLabels[category as keyof typeof categoryLabels]}
            </h3>
            <div className="space-y-3">
              {meds.map((med, index) => {
                const isSelected = selectedMedications.includes(med.id);
                const isExpanded = expandedMedication === med.id;
                const isComplete = isMedicationComplete(med.id);
                const hasError = errors[med.id];
                const shouldShowCurrentlyTaking = shouldAskCurrentlyTaking(med.id);
                const details = medicationDetails[med.id];

                return (
                  <motion.div
                    key={med.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: categoryIndex * 0.05 + index * 0.03,
                      duration: 0.3,
                    }}
                    className={`rounded-xl border-2 transition-all duration-200 ${
                      hasError
                        ? 'border-red-300 bg-red-50'
                        : isSelected
                        ? 'border-primary bg-gradient-to-r from-primary/5 to-primary-light/5 shadow-sm'
                        : 'border-gray-200 bg-white'
                    }`}
                    data-error={hasError ? 'true' : undefined}
                  >
                    <button
                      onClick={() => toggleMedication(med.id)}
                      className="w-full text-left p-4 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 rounded-xl"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex-shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${
                            isSelected
                              ? 'bg-gradient-to-br from-primary to-primary-light border-primary'
                              : 'border-gray-300'
                          }`}
                        >
                          {isSelected && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className={`font-medium ${isSelected ? 'text-primary' : 'text-neutral-900'}`}>
                            {med.name}
                          </div>
                          <div className="text-sm text-neutral-600 truncate">{med.subtitle}</div>
                        </div>

                        <div className="flex items-center gap-2">
                          {isSelected && isComplete && (
                            <CheckCircle2 className="w-5 h-5 text-primary" />
                          )}
                          {isSelected && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleExpanded(med.id);
                              }}
                              className="p-1 hover:bg-primary/10 rounded transition-colors"
                            >
                              {isExpanded ? (
                                <ChevronUp className="w-5 h-5 text-primary" />
                              ) : (
                                <ChevronDown className="w-5 h-5 text-primary" />
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    </button>

                    <AnimatePresence>
                      {isSelected && isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4 pt-2 space-y-4 border-t border-primary/20">
                            {hasError && (
                              <div className="p-3 rounded-lg bg-red-100 border border-red-200 flex items-start gap-2">
                                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-red-700">{errors[med.id]}</p>
                              </div>
                            )}

                            {shouldShowCurrentlyTaking && (
                              <div>
                                <label className="block text-sm text-neutral-700 mb-3">
                                  Are you currently taking {med.name}? <span className="text-red-500">*</span>
                                </label>
                                <div className="flex gap-3">
                                  <button
                                    onClick={() => updateMedicationDetail(med.id, 'currentlyTaking', 'yes')}
                                    className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all duration-200 ${
                                      details?.currentlyTaking === 'yes'
                                        ? 'border-primary bg-primary text-white'
                                        : 'border-gray-200 bg-white text-neutral-700 hover:border-primary/30'
                                    }`}
                                  >
                                    Yes
                                  </button>
                                  <button
                                    onClick={() => updateMedicationDetail(med.id, 'currentlyTaking', 'no')}
                                    className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all duration-200 ${
                                      details?.currentlyTaking === 'no'
                                        ? 'border-primary bg-primary text-white'
                                        : 'border-gray-200 bg-white text-neutral-700 hover:border-primary/30'
                                    }`}
                                  >
                                    No
                                  </button>
                                </div>
                              </div>
                            )}

                            {(shouldShowCurrentlyTaking ? details?.currentlyTaking : true) && (
                              <>
                                <div>
                                  <label className="block text-sm text-neutral-700 mb-2">
                                    {shouldShowCurrentlyTaking && details?.currentlyTaking === 'yes'
                                      ? 'How long have you been on it?'
                                      : 'How long were you on it?'}{' '}
                                    <span className="text-red-500">*</span>
                                  </label>
                                  <Input
                                    value={details?.duration || ''}
                                    onChange={(e) => updateMedicationDetail(med.id, 'duration', e.target.value)}
                                    placeholder="e.g., 6 months, 1 year"
                                  />
                                </div>

                                <div>
                                  <label className="block text-sm text-neutral-700 mb-2">
                                    {shouldShowCurrentlyTaking && details?.currentlyTaking === 'yes'
                                      ? 'When did you last take it?'
                                      : 'When did you stop?'}{' '}
                                    <span className="text-red-500">*</span>
                                  </label>
                                  <Input
                                    value={details?.lastTaken || ''}
                                    onChange={(e) => updateMedicationDetail(med.id, 'lastTaken', e.target.value)}
                                    placeholder="e.g., Last week, 3 months ago"
                                  />
                                </div>

                                <div>
                                  <label className="block text-sm text-neutral-700 mb-2">
                                    Highest dose taken? <span className="text-red-500">*</span>
                                  </label>
                                  <p className="text-xs text-neutral-500 mb-3">
                                    A copy of the script will be required to continue doses higher than 0.5 mg
                                  </p>
                                  <div className="grid grid-cols-3 gap-2">
                                    {med.doseOptions.map((option) => (
                                      <button
                                        key={option.value}
                                        onClick={() => updateMedicationDetail(med.id, 'highestDose', option.value)}
                                        className={`py-2.5 px-3 rounded-lg border-2 transition-all duration-200 text-sm ${
                                          details?.highestDose === option.value
                                            ? 'border-primary bg-primary text-white'
                                            : 'border-gray-200 bg-white text-neutral-700 hover:border-primary/30'
                                        }`}
                                      >
                                        {option.label}
                                      </button>
                                    ))}
                                  </div>
                                </div>

                                <div>
                                  <label className="block text-sm text-neutral-700 mb-2">
                                    Any side effects? <span className="text-neutral-500">(optional)</span>
                                  </label>
                                  <textarea
                                    value={details?.sideEffects || ''}
                                    onChange={(e) => updateMedicationDetail(med.id, 'sideEffects', e.target.value)}
                                    placeholder="e.g., Nausea, constipation, fatigue"
                                    rows={3}
                                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all duration-200 resize-none"
                                  />
                                </div>
                              </>
                            )}

                            {isComplete && (
                              <div className="flex justify-end">
                                <motion.button
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  onClick={() => setExpandedMedication(null)}
                                  className="py-2 px-6 bg-gradient-to-r from-primary to-primary-light text-white rounded-lg hover:from-primary-dark hover:to-primary transition-all duration-200 shadow-md hover:shadow-lg text-sm"
                                >
                                  Done
                                </motion.button>
                              </div>
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

      <NavigationButtons
        showBack={showBack}
        onBack={onBack}
        onNext={handleNext}
        isNextDisabled={false}
      />
    </ScreenLayout>
  );
};

export default GLP1HistoryScreen;
