import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronUp, CheckCircle2, AlertCircle, Check } from 'lucide-react';
import Input from '../ui/Input';
import ScreenHeader from '../common/ScreenHeader';
import { TouchButton } from '../common/TouchButton';
import { InfoTooltip } from '../common/InfoTooltip';
import NavigationButtons from '../common/NavigationButtons';

interface MedicationDetail {
  currentlyTaking?: string; // Only for first medication
  duration: string;
  lastTaken: string; // "When did you last take it?" or "When did you stop?"
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

interface GLP1HistoryScreenProps {
  onNext: (data: Record<string, any>) => void;
  onBack: () => void;
  initialData?: Record<string, any>;
  currentStep?: number;
  totalSteps?: number;
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

export function GLP1HistoryScreen({ onNext, onBack, initialData = {}, currentStep, totalSteps }: GLP1HistoryScreenProps) {
  const [selectedMedications, setSelectedMedications] = useState<string[]>([]); // Array to maintain order
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
  const [showFullList, setShowFullList] = useState(true); // Toggle between full list and action buttons
  
  // Track if we've already initialized to prevent infinite loop
  const hasInitialized = useRef(false);

  // Initialize from saved data - only run once
  useEffect(() => {
    // Only initialize once
    if (hasInitialized.current) return;
    hasInitialized.current = true;
    
    const selected: string[] = [];
    const details: Record<string, MedicationDetail> = {};

    medications.forEach((med) => {
      if (initialData[`used_${med.id}`]) {
        selected.push(med.id);
        details[med.id] = {
          currentlyTaking: initialData[`${med.id}_currently_taking`],
          duration: initialData[`${med.id}_duration`] || '',
          lastTaken: initialData[`${med.id}_last_taken`] || '',
          highestDose: initialData[`${med.id}_highest_dose`] || '',
          sideEffects: initialData[`${med.id}_side_effects`] || '',
        };
      }
    });

    if (initialData.used_other) {
      setOtherMedication({
        selected: true,
        expanded: false,
        name: initialData.other_name || '',
        duration: initialData.other_duration || '',
        lastTaken: initialData.other_last_taken || '',
        highestDose: initialData.other_highest_dose || '',
        sideEffects: initialData.other_side_effects || '',
      });
    }

    setSelectedMedications(selected);
    setMedicationDetails(details);
  }, []); // Empty dependency array - only run once on mount

  const toggleMedication = (medId: string) => {
    const isSelected = selectedMedications.includes(medId);
    
    if (isSelected) {
      // Deselecting
      const newSelected = selectedMedications.filter(id => id !== medId);
      setSelectedMedications(newSelected);
      
      const newDetails = { ...medicationDetails };
      delete newDetails[medId];
      setMedicationDetails(newDetails);
      
      if (expandedMedication === medId) {
        setExpandedMedication(null);
      }
    } else {
      // Selecting - add to array and expand
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
    
    // Clear specific error when user starts fixing it
    const errorKey = `${medId}_${field}`;
    if (errors[errorKey]) {
      const newErrors = { ...errors };
      delete newErrors[errorKey];
      setErrors(newErrors);
    }
  };

  // Check if any medication is marked as "currently taking"
  const hasCurrentMedication = (): boolean => {
    return selectedMedications.some(medId => medicationDetails[medId]?.currentlyTaking === 'yes');
  };

  // Determine if we should ask "currently taking" for this medication
  const shouldAskCurrentlyTaking = (medId: string): boolean => {
    // If we already have a current medication, don't ask
    if (hasCurrentMedication()) {
      // Unless this IS the current medication
      return medicationDetails[medId]?.currentlyTaking === 'yes';
    }
    // Otherwise, ask for all medications until one is marked as current
    return true;
  };

  const isMedicationComplete = (medId: string): boolean => {
    const details = medicationDetails[medId];
    if (!details) return false;
    
    const needsCurrentlyTaking = shouldAskCurrentlyTaking(medId);
    
    if (needsCurrentlyTaking) {
      // This medication needs currentlyTaking answered
      if (!details.currentlyTaking) return false;
    }
    
    // All medications need duration, lastTaken, and highestDose
    const hasRequired = details.duration && details.lastTaken && details.highestDose;
    return hasRequired;
  };

  const isOtherMedicationComplete = (): boolean => {
    if (!otherMedication.selected) return true;
    if (!otherMedication.name || !otherMedication.duration || !otherMedication.lastTaken || !otherMedication.highestDose) {
      return false;
    }
    return true;
  };

  // Check if we have at least one complete medication
  const hasCompleteMedication = (): boolean => {
    const hasCompleteStandard = selectedMedications.some(medId => isMedicationComplete(medId));
    const hasCompleteOther = otherMedication.selected && isOtherMedicationComplete();
    return hasCompleteStandard || hasCompleteOther;
  };

  const handleNext = () => {
    const newErrors: Record<string, string> = {};
    
    // Check if at least one medication selected
    if (selectedMedications.length === 0 && !otherMedication.selected) {
      newErrors.general = "Please select at least one GLP-1 medication you've used";
    }

    // Validate all selected medications are complete
    selectedMedications.forEach((medId) => {
      if (!isMedicationComplete(medId)) {
        newErrors[medId] = 'Please complete all required fields';
      }
    });

    // Validate other medication if selected
    if (otherMedication.selected && !isOtherMedicationComplete()) {
      newErrors.other = 'Please complete all required fields';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Scroll to first error
      const firstErrorElement = document.querySelector('[data-error="true"]');
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // Build output data
    const outputData: Record<string, any> = {};

    medications.forEach((med) => {
      outputData[`used_${med.id}`] = selectedMedications.includes(med.id);
      if (selectedMedications.includes(med.id)) {
        const details = medicationDetails[med.id];
        if (details.currentlyTaking) outputData[`${med.id}_currently_taking`] = details.currentlyTaking;
        outputData[`${med.id}_duration`] = details.duration;
        outputData[`${med.id}_last_taken`] = details.lastTaken;
        outputData[`${med.id}_highest_dose`] = details.highestDose;
        if (details.sideEffects) outputData[`${med.id}_side_effects`] = details.sideEffects;
      }
    });

    outputData.used_other = otherMedication.selected;
    if (otherMedication.selected) {
      outputData.other_name = otherMedication.name;
      outputData.other_duration = otherMedication.duration;
      outputData.other_last_taken = otherMedication.lastTaken;
      outputData.other_highest_dose = otherMedication.highestDose;
      if (otherMedication.sideEffects) outputData.other_side_effects = otherMedication.sideEffects;
    }

    onNext(outputData);
  };

  // Group medications by category and sort: selected ones first, then alphabetically
  const groupedMedications = medications.reduce((acc, med) => {
    if (!acc[med.category]) acc[med.category] = [];
    acc[med.category].push(med);
    return acc;
  }, {} as Record<string, MedicationData[]>);

  // Sort each category: selected medications at the top
  Object.keys(groupedMedications).forEach((category) => {
    groupedMedications[category].sort((a, b) => {
      const aSelected = selectedMedications.includes(a.id);
      const bSelected = selectedMedications.includes(b.id);
      
      // Selected items come first
      if (aSelected && !bSelected) return -1;
      if (!aSelected && bSelected) return 1;
      
      // Within same selection state, keep original order
      return 0;
    });
  });



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
              Which GLP-1 have you tried?
            </motion.h1>
          </div>

          <div className="space-y-6">
        {/* Selection count - More subtle */}
        {(selectedMedications.length > 0 || otherMedication.selected) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0D9488]/5 border border-[#0D9488]/20">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#0D9488]" />
              <span className="text-xs text-neutral-700">
                {selectedMedications.length + (otherMedication.selected ? 1 : 0)} selected
              </span>
            </div>
          </motion.div>
        )}

        {/* General error message */}
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

        {/* Show completed medications and action buttons if we have at least one complete */}
        {!showFullList && hasCompleteMedication() && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Show only selected/complete medications */}
            {Object.entries(groupedMedications).map(([category, meds]) => {
              const selectedInCategory = meds.filter(med => selectedMedications.includes(med.id));
              if (selectedInCategory.length === 0) return null;

              return (
                <div key={category}>
                  <h3 className="text-xs uppercase tracking-wider text-neutral-400 mb-2 px-1">
                    {categoryLabels[category as keyof typeof categoryLabels]}
                  </h3>
                  <div className="space-y-2">
                    {selectedInCategory.map((med) => {
                      const isComplete = isMedicationComplete(med.id);
                      return (
                        <div
                          key={med.id}
                          className="rounded-xl border-2 border-[#0D9488] bg-gradient-to-r from-[#0D9488]/5 to-[#14B8A6]/5 p-3"
                        >
                          <div className="flex items-center gap-2.5">
                            <CheckCircle2 className="w-5 h-5 text-[#0D9488] flex-shrink-0" />
                            <div className="flex-1">
                              <div className="text-sm font-medium text-[#0D9488]">{med.name}</div>
                            </div>
                            {isComplete && (
                              <div className="text-xs text-neutral-600">Complete</div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* Show other medication if selected */}
            {otherMedication.selected && (
              <div>
                <h3 className="text-xs uppercase tracking-wider text-neutral-400 mb-2 px-1">Other</h3>
                <div className="rounded-xl border-2 border-[#0D9488] bg-gradient-to-r from-[#0D9488]/5 to-[#14B8A6]/5 p-3">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-[#0D9488] flex-shrink-0" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-[#0D9488]">
                        {otherMedication.name || 'Other GLP-1'}
                      </div>
                    </div>
                    {isOtherMedicationComplete() && (
                      <div className="text-xs text-neutral-600">Complete</div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex justify-between items-center gap-3 pt-4">
              <TouchButton
                onClick={() => setShowFullList(true)}
                variant="outline"
                size="lg"
              >
                + Add Another Medication
              </TouchButton>
              
              <TouchButton
                onClick={handleNext}
                variant="primary"
                size="lg"
              >
                Continue
              </TouchButton>
            </div>
          </motion.div>
        )}

        {/* Full medication list - shown initially or when "Add Another" is clicked */}
        {showFullList && (
        <>
        {Object.entries(groupedMedications).map(([category, meds], categoryIndex) => (
          <div key={category}>
            <h3 className="text-xs uppercase tracking-wider text-neutral-400 mb-2 px-1">
              {categoryLabels[category as keyof typeof categoryLabels]}
            </h3>
            <div className="space-y-2">
              {meds.map((med, index) => {
                const isSelected = selectedMedications.includes(med.id);
                const isExpanded = expandedMedication === med.id;
                const isComplete = isMedicationComplete(med.id);
                const hasError = errors[med.id];
                const shouldShowCurrentlyTaking = shouldAskCurrentlyTaking(med.id);
                const details = medicationDetails[med.id];
                
                // Check if this is the first unselected item (separator needed)
                const prevMed = index > 0 ? meds[index - 1] : null;
                const isPrevSelected = prevMed ? selectedMedications.includes(prevMed.id) : false;
                const showSeparator = !isSelected && isPrevSelected;

                return (
                  <div key={`wrapper-${med.id}`} className="space-y-2">
                    {/* Visual separator between selected and unselected */}
                    {showSeparator && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-2 py-1 px-1"
                      >
                        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-neutral-200 to-transparent" />
                        <span className="text-[10px] uppercase tracking-wider text-neutral-400">Available</span>
                        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-neutral-200 to-transparent" />
                      </motion.div>
                    )}
                  <motion.div
                    key={med.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{
                      layout: { type: "spring", stiffness: 350, damping: 30 },
                      opacity: { duration: 0.2 },
                    }}
                    className={`rounded-xl border-2 transition-all duration-200 ${
                      hasError
                        ? 'border-red-300 bg-red-50'
                        : isSelected
                        ? 'border-[#0D9488] bg-gradient-to-r from-[#0D9488]/5 to-[#14B8A6]/5 shadow-sm'
                        : 'border-gray-200 bg-white'
                    }`}
                    data-error={hasError ? 'true' : undefined}
                  >
                    {/* Header - Compact */}
                    <button
                      onClick={() => toggleMedication(med.id)}
                      className="w-full text-left p-3 min-h-[48px] focus:outline-none focus:ring-2 focus:ring-[#1a7f72]/40 focus:ring-offset-2 rounded-xl"
                    >
                      <div className="flex items-center gap-2.5">
                        {/* Checkbox */}
                        <div
                          className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                            isSelected
                              ? 'bg-gradient-to-br from-[#0D9488] to-[#14B8A6] border-[#0D9488]'
                              : 'border-gray-300'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                        </div>

                        {/* Text - More compact */}
                        <div className="flex-1 min-w-0">
                          <div className={`text-sm font-medium ${isSelected ? 'text-[#0D9488]' : 'text-neutral-900'}`}>
                            {med.name}
                          </div>
                        </div>

                        {/* Status indicators - More compact */}
                        <div className="flex items-center gap-1">
                          {isSelected && isComplete && (
                            <CheckCircle2 className="w-4 h-4 text-[#0D9488]" />
                          )}
                          {isSelected && (
                            <div
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleExpanded(med.id);
                              }}
                              className="p-1 hover:bg-[#0D9488]/10 rounded transition-colors cursor-pointer"
                            >
                              {isExpanded ? (
                                <ChevronUp className="w-4 h-4 text-[#0D9488]" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-[#0D9488]" />
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </button>

                    {/* Expanded Details Form - Progressive Disclosure */}
                    <AnimatePresence>
                      {isSelected && isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-3 pb-3 pt-2 space-y-3 border-t border-[#0D9488]/10">
                            {hasError && (
                              <div className="p-2.5 rounded-lg bg-red-100 border border-red-200 flex items-start gap-2">
                                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                                <p className="text-xs text-red-700">{errors[med.id]}</p>
                              </div>
                            )}

                            {/* Ask if currently taking (until one is marked as current) */}
                            {shouldShowCurrentlyTaking && (
                              <div>
                                <div className="flex items-center gap-1.5 mb-2">
                                  <label className="text-xs text-neutral-700">
                                    Currently taking? <span className="text-[#FF7A59]">*</span>
                                  </label>
                                  <InfoTooltip 
                                    content="This helps us understand if you're actively using this medication."
                                    side="right"
                                  />
                                </div>
                                <div className="flex gap-2">
                                  <TouchButton
                                    onClick={() => updateMedicationDetail(med.id, 'currentlyTaking', 'yes')}
                                    selected={details?.currentlyTaking === 'yes'}
                                    variant="outline"
                                    size="sm"
                                    fullWidth
                                  >
                                    Yes
                                  </TouchButton>
                                  <TouchButton
                                    onClick={() => updateMedicationDetail(med.id, 'currentlyTaking', 'no')}
                                    selected={details?.currentlyTaking === 'no'}
                                    variant="outline"
                                    size="sm"
                                    fullWidth
                                  >
                                    No
                                  </TouchButton>
                                </div>
                              </div>
                            )}

                            {/* Show duration question */}
                            {(shouldShowCurrentlyTaking ? details?.currentlyTaking : true) && (
                              <div>
                                <label className="block text-xs text-neutral-700 mb-1.5">
                                  {shouldShowCurrentlyTaking && details?.currentlyTaking === 'yes'
                                    ? 'How long?'
                                    : 'Duration'}{' '}
                                  <span className="text-[#FF7A59]">*</span>
                                </label>
                                <Input
                                  value={details?.duration || ''}
                                  onChange={(e) => updateMedicationDetail(med.id, 'duration', e.target.value)}
                                  placeholder="e.g., 6 months"
                                />
                              </div>
                            )}

                            {/* Show last taken question */}
                            {(shouldShowCurrentlyTaking ? details?.currentlyTaking : true) && (
                              <div>
                                <label className="block text-xs text-neutral-700 mb-1.5">
                                  {shouldShowCurrentlyTaking && details?.currentlyTaking === 'yes'
                                    ? 'Last dose'
                                    : 'When stopped'}{' '}
                                  <span className="text-[#FF7A59]">*</span>
                                </label>
                                <Input
                                  value={details?.lastTaken || ''}
                                  onChange={(e) => updateMedicationDetail(med.id, 'lastTaken', e.target.value)}
                                  placeholder="e.g., Last week"
                                />
                              </div>
                            )}

                            {/* Show highest dose question */}
                            {(shouldShowCurrentlyTaking ? details?.currentlyTaking : true) && (
                              <div>
                                <div className="flex items-center gap-1.5 mb-2">
                                  <label className="text-xs text-neutral-700">
                                    Highest dose <span className="text-[#FF7A59]">*</span>
                                  </label>
                                  <InfoTooltip 
                                    content="A prescription copy is required to continue doses higher than 0.5 mg."
                                    side="right"
                                  />
                                </div>
                                <div className="grid grid-cols-3 gap-1.5">
                                  {med.doseOptions.map((option) => (
                                    <TouchButton
                                      key={option.value}
                                      onClick={() => updateMedicationDetail(med.id, 'highestDose', option.value)}
                                      selected={details?.highestDose === option.value}
                                      variant="outline"
                                      size="sm"
                                      className="text-xs"
                                    >
                                      {option.label}
                                    </TouchButton>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Side effects (optional, always shown if form is visible) */}
                            {(shouldShowCurrentlyTaking ? details?.currentlyTaking : true) && (
                              <div>
                                <label className="block text-xs text-neutral-700 mb-1.5">
                                  Side effects? <span className="text-neutral-500">(optional)</span>
                                </label>
                                <textarea
                                  value={details?.sideEffects || ''}
                                  onChange={(e) => updateMedicationDetail(med.id, 'sideEffects', e.target.value)}
                                  placeholder="e.g., Nausea"
                                  rows={2}
                                  className="w-full px-3 py-2 text-sm bg-white border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a7f72]/40 focus:border-[#1a7f72] transition-all duration-200 resize-none"
                                />
                              </div>
                            )}

                            {/* Done button - appears when all required fields are complete */}
                            {isComplete && (
                              <div className="flex justify-end pt-1">
                                <TouchButton
                                  onClick={() => {
                                    setExpandedMedication(null);
                                    // Hide the full list after first medication is complete
                                    setShowFullList(false);
                                  }}
                                  variant="primary"
                                  size="sm"
                                  className="px-6"
                                >
                                  Done
                                </TouchButton>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Other medication */}
        <div>
          <h3 className="text-sm uppercase tracking-wider text-neutral-500 mb-3 px-1">Other</h3>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.3 }}
            className={`rounded-xl border-2 transition-all duration-200 ${
              errors.other
                ? 'border-red-300 bg-red-50'
                : otherMedication.selected
                ? 'border-[#0D9488] bg-gradient-to-r from-[#0D9488]/5 to-[#14B8A6]/5 shadow-sm'
                : 'border-gray-200 bg-white'
            }`}
            data-error={errors.other ? 'true' : undefined}
          >
            {/* Header */}
            <button
              onClick={() => {
                const newSelected = !otherMedication.selected;
                setOtherMedication({
                  ...otherMedication,
                  selected: newSelected,
                  expanded: newSelected,
                });
                setErrors({});
              }}
              className="w-full text-left p-4 focus:outline-none focus:ring-2 focus:ring-[#1a7f72]/40 focus:ring-offset-2 rounded-xl"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex-shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${
                    otherMedication.selected
                      ? 'bg-gradient-to-br from-[#0D9488] to-[#14B8A6] border-[#0D9488]'
                      : 'border-gray-300'
                  }`}
                >
                  {otherMedication.selected && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
                </div>

                <div className="flex-1">
                  <div className={`font-medium ${otherMedication.selected ? 'text-[#0D9488]' : 'text-neutral-900'}`}>
                    Other GLP-1
                  </div>
                  <div className="text-sm text-neutral-600">Not listed above</div>
                </div>

                <div className="flex items-center gap-2">
                  {otherMedication.selected && isOtherMedicationComplete() && (
                    <CheckCircle2 className="w-5 h-5 text-[#0D9488]" />
                  )}
                  {otherMedication.selected && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOtherMedication({ ...otherMedication, expanded: !otherMedication.expanded });
                      }}
                      className="p-1 hover:bg-[#0D9488]/10 rounded transition-colors"
                    >
                      {otherMedication.expanded ? (
                        <ChevronUp className="w-5 h-5 text-[#0D9488]" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-[#0D9488]" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            </button>

            {/* Expanded Details Form */}
            <AnimatePresence>
              {otherMedication.selected && otherMedication.expanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 pt-2 space-y-4 border-t border-[#0D9488]/20">
                    {errors.other && (
                      <div className="p-3 rounded-lg bg-red-100 border border-red-200 flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-red-700">{errors.other}</p>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm text-neutral-700 mb-2">
                        Medication name <span className="text-[#FF7A59]">*</span>
                      </label>
                      <Input
                        value={otherMedication.name}
                        onChange={(e) => setOtherMedication({ ...otherMedication, name: e.target.value })}
                        placeholder="Name of medication"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-neutral-700 mb-2">
                        How long were you on it? <span className="text-[#FF7A59]">*</span>
                      </label>
                      <Input
                        value={otherMedication.duration}
                        onChange={(e) => setOtherMedication({ ...otherMedication, duration: e.target.value })}
                        placeholder="e.g., 6 months, 1 year"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-neutral-700 mb-2">
                        When did you stop? <span className="text-[#FF7A59]">*</span>
                      </label>
                      <Input
                        value={otherMedication.lastTaken}
                        onChange={(e) => setOtherMedication({ ...otherMedication, lastTaken: e.target.value })}
                        placeholder="e.g., Last week, 3 months ago"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-neutral-700 mb-2">
                        Highest dose taken? <span className="text-[#FF7A59]">*</span>
                      </label>
                      <Input
                        value={otherMedication.highestDose}
                        onChange={(e) => setOtherMedication({ ...otherMedication, highestDose: e.target.value })}
                        placeholder="Dose and frequency"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-neutral-700 mb-2">
                        Any side effects? <span className="text-neutral-500">(optional)</span>
                      </label>
                      <textarea
                        value={otherMedication.sideEffects}
                        onChange={(e) => setOtherMedication({ ...otherMedication, sideEffects: e.target.value })}
                        placeholder="e.g., Nausea, constipation, fatigue"
                        rows={3}
                        className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a7f72]/40 focus:border-[#1a7f72] transition-all duration-200 resize-none"
                      />
                    </div>

                    {/* Done button - appears when all required fields are complete */}
                    {isOtherMedicationComplete() && (
                      <div className="flex justify-end">
                        <TouchButton
                          onClick={() => {
                            setOtherMedication({ ...otherMedication, expanded: false });
                            // Hide the full list after completing
                            setShowFullList(false);
                          }}
                          variant="primary"
                          size="sm"
                          className="px-6"
                        >
                          Done
                        </TouchButton>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
        </>
        )}

          {/* Navigation - only show Back/Continue when full list is visible */}
          {showFullList && (
            <NavigationButtons
              onNext={handleNext}
              layout="grouped"
            />
          )}
        </div>
        </motion.div>
      </div>
    </div>
  );
}
