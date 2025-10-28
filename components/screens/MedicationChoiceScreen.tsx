import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NavigationButtons from '../common/NavigationButtons';
import { Check, ChevronDown } from 'lucide-react';
import { InfoTooltip } from '../common/InfoTooltip';
import { ScreenProps } from './common';

// Simple image component with fallback
const ImageWithFallback = ({ src, alt, className }: { src: string; alt: string; className: string }) => (
  <img src={src} alt={alt} className={className} onError={(e) => { (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080"%3E%3Crect fill="%23f3f4f6" width="1080" height="1080"/%3E%3C/svg%3E'; }} />
);

// Pharmacy options
const PHARMACIES = [
  { id: 'no-preference', name: 'No preference', vitamin: null },
  { id: 'empower', name: 'Empower', vitamin: 'B6' },
  { id: 'hallandale', name: 'Hallandale', vitamin: 'B12' },
  { id: 'olympia', name: 'Olympia', vitamin: null },
  { id: 'wells', name: 'Wells', vitamin: null },
];

// Unified medication list
const MEDICATIONS = [
  {
    id: 'semaglutide',
    name: 'Semaglutide',
    description: 'GLP-1 injection',
    popular: true,
    imageUrl: 'https://images.unsplash.com/photo-1609009630912-f16dcf3e03a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  },
  {
    id: 'tirzepatide',
    name: 'Tirzepatide',
    description: 'GLP-1 injection',
    popular: true,
    imageUrl: 'https://images.unsplash.com/photo-1609009631378-8b8be31f84fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  },
];

// Dose options by medication type
const DOSE_OPTIONS_BY_MEDICATION: Record<string, Array<{ value: string; label: string; requiresScript?: boolean }>> = {
  semaglutide: [
    { value: 'no-preference', label: 'No preference' },
    { value: '0.25mg', label: '0.25 mg' },
    { value: '0.5mg', label: '0.5 mg' },
    { value: '1mg', label: '1 mg', requiresScript: true },
    { value: '1.7mg', label: '1.7 mg', requiresScript: true },
    { value: '2.4mg', label: '2.4 mg', requiresScript: true },
  ],
  tirzepatide: [
    { value: 'no-preference', label: 'No preference' },
    { value: '2.5mg', label: '2.5 mg' },
    { value: '5mg', label: '5 mg' },
    { value: '7.5mg', label: '7.5 mg', requiresScript: true },
    { value: '10mg', label: '10 mg', requiresScript: true },
    { value: '12.5mg', label: '12.5 mg', requiresScript: true },
    { value: '15mg', label: '15 mg', requiresScript: true },
  ],
};

interface MedicationChoiceScreenProps extends ScreenProps {
  key?: string;
}

export default function MedicationChoiceScreen({
  screen,
  answers,
  updateAnswer,
  onSubmit,
  showBack,
  onBack,
  defaultCondition,
  showLoginLink,
  calculations,
}: MedicationChoiceScreenProps) {
  const hasGLP1Experience = answers['glp1_has_tried'] === 'yes';
  const [expandedMedication, setExpandedMedication] = useState<string | null>(null);
  const [selectedMedication, setSelectedMedication] = useState<string>(answers['selected_medication'] || '');
  const [selectedPharmacy, setSelectedPharmacy] = useState<string>(answers['selected_pharmacy'] || '');
  const [selectedDose, setSelectedDose] = useState<string>(answers['selected_dose'] || '');

  const handleMedicationClick = (medicationId: string) => {
    if (expandedMedication === medicationId) {
      setExpandedMedication(null);
    } else {
      setExpandedMedication(medicationId);
      
      // Clear selections if switching medications
      if (selectedMedication !== medicationId) {
        setSelectedMedication('');
        setSelectedPharmacy('');
        setSelectedDose('');
      }
    }
  };

  const handlePharmacySelect = (pharmacyId: string, medicationId: string) => {
    setSelectedMedication(medicationId);
    setSelectedPharmacy(pharmacyId);
    
    // Save to answers
    updateAnswer('selected_medication', medicationId);
    updateAnswer('selected_pharmacy', pharmacyId);
    
    // Also save in the format expected by PlanSelectionScreen
    const pharmacyPreferences = answers['medication_pharmacy_preferences'] || {};
    pharmacyPreferences[medicationId] = [pharmacyId];
    updateAnswer('medication_pharmacy_preferences', pharmacyPreferences);
    
    // If no GLP-1 experience, auto-select the starter dose
    if (!hasGLP1Experience) {
      const doseOptions = DOSE_OPTIONS_BY_MEDICATION[medicationId] || [];
      const starterDose = doseOptions.find(d => d.value !== 'no-preference');
      if (starterDose) {
        setSelectedDose(starterDose.value);
        updateAnswer('selected_dose', starterDose.value);
      }
    }
  };

  const handleDoseSelect = (dose: string) => {
    setSelectedDose(dose);
    updateAnswer('selected_dose', dose);
  };

  const canContinue = selectedMedication && selectedPharmacy && selectedDose;

  return (
    <div className="min-h-screen bg-[#fef8f2] flex justify-center p-4 sm:p-6 pt-5 sm:pt-7 w-full">
      <div className="w-full max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >

          {/* Header */}
          <div className="mb-10 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl sm:text-3xl md:text-4xl text-neutral-900 mb-3 sm:mb-4 leading-snug tracking-tight"
              style={{ letterSpacing: '-0.02em' }}
            >
              Choose your medication
            </motion.h1>
          </div>

          <div className="space-y-4">
          {MEDICATIONS.map((med, index) => {
            const isExpanded = expandedMedication === med.id;
            const isMedicationSelected = selectedMedication === med.id;
            const doseOptions = DOSE_OPTIONS_BY_MEDICATION[med.id] || [];

            return (
              <motion.div
                key={med.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {/* Medication Button */}
                <motion.button
                  type="button"
                  onClick={() => handleMedicationClick(med.id)}
                  className={`w-full p-4 text-left ${
                    isExpanded
                      ? 'rounded-t-xl border-2 border-[#0D9488] bg-gradient-to-r from-[#0D9488]/5 via-[#FF7A59]/5 to-[#14B8A6]/5 shadow-md'
                      : isMedicationSelected
                      ? 'rounded-xl border-2 border-[#0D9488] bg-gradient-to-r from-[#0D9488]/5 via-[#FF7A59]/5 to-[#14B8A6]/5 shadow-md'
                      : 'rounded-xl border-2 border-gray-200 bg-white hover:border-[#FF7A59]/30 hover:shadow-md hover:scale-[1.01]'
                  }`}
                  style={{ transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}
                >
                  <div className="flex items-center gap-4">
                    {/* Medication Image */}
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gradient-to-br from-[#FDFBF7] to-gray-50 flex items-center justify-center flex-shrink-0 border border-gray-100">
                      <ImageWithFallback
                        src={med.imageUrl}
                        alt={med.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`leading-relaxed ${isMedicationSelected || isExpanded ? 'text-[#0D9488]' : 'text-neutral-700'}`}>
                          {med.name}
                        </span>
                      </div>
                      <p className="text-sm text-neutral-600">{med.description}</p>
                    </div>

                    {/* Expand Chevron */}
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex-shrink-0"
                    >
                      <ChevronDown className={`w-5 h-5 ${isMedicationSelected || isExpanded ? 'text-[#0D9488]' : 'text-gray-400'}`} />
                    </motion.div>
                  </div>
                </motion.button>

                {/* Expanded Section */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-4 rounded-b-xl bg-gradient-to-r from-[#0D9488]/5 via-[#FF7A59]/5 to-[#14B8A6]/5 border-2 border-t-0 border-[#0D9488] space-y-5">
                        {/* Pharmacy Selection */}
                        <div className="space-y-3">
                          <p className="text-sm text-neutral-700">Do you have a preference for a pharmacy?</p>
                          <div className="flex flex-wrap gap-2">
                            {PHARMACIES.map((pharmacy) => {
                              const isPharmacySelected = selectedPharmacy === pharmacy.id && selectedMedication === med.id;
                              
                              return (
                                <motion.button
                                  key={pharmacy.id}
                                  type="button"
                                  onClick={() => handlePharmacySelect(pharmacy.id, med.id)}
                                  whileTap={{ scale: 0.97 }}
                                  className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full transition-all duration-200 touch-manipulation ${
                                    isPharmacySelected
                                      ? 'bg-[#0D9488] text-white shadow-md'
                                      : 'bg-white text-neutral-700 border-2 border-gray-200 hover:border-[#0D9488]/30'
                                  }`}
                                >
                                  {isPharmacySelected && (
                                    <Check className="w-4 h-4" strokeWidth={3} />
                                  )}
                                  <span className="text-sm">{pharmacy.name}</span>
                                  {pharmacy.vitamin && (
                                    <InfoTooltip 
                                      content={`This formulation includes vitamin ${pharmacy.vitamin}. There is no difference in effectiveness compared to formulations without vitamins.`}
                                      side="top"
                                      asSpan
                                    />
                                  )}
                                </motion.button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Dose Selection */}
                        <AnimatePresence>
                          {selectedPharmacy && selectedMedication === med.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="space-y-3"
                            >
                              {!hasGLP1Experience ? (
                                <>
                                  <p className="text-sm text-neutral-700">Starter dose</p>
                                  <div className="p-4 rounded-xl bg-gradient-to-r from-[#0D9488]/5 via-[#FF7A59]/5 to-[#14B8A6]/5 border border-[#0D9488]/20">
                                    <p className="text-sm text-neutral-600 mb-3">
                                      Since you're new to GLP-1 medications, we'll start you on the lowest dose to minimize side effects and allow your body to adjust.
                                    </p>
                                    <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#0D9488] text-white shadow-md w-fit">
                                      <Check className="w-4 h-4" strokeWidth={3} />
                                      <span className="text-sm">{doseOptions.find(d => d.value !== 'no-preference')?.label}</span>
                                    </div>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <p className="text-sm text-neutral-700">What dose do you prefer?</p>
                                  <div className="flex flex-wrap gap-2">
                                    {doseOptions.map((dose) => {
                                      const isDoseSelected = selectedDose === dose.value;
                                      
                                      return (
                                        <motion.button
                                          key={dose.value}
                                          type="button"
                                          onClick={() => handleDoseSelect(dose.value)}
                                          whileTap={{ scale: 0.97 }}
                                          className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full transition-all duration-200 touch-manipulation ${
                                            isDoseSelected
                                              ? 'bg-[#0D9488] text-white shadow-md'
                                              : 'bg-white text-neutral-700 border-2 border-gray-200 hover:border-[#0D9488]/30'
                                          }`}
                                        >
                                          {isDoseSelected && (
                                            <Check className="w-4 h-4" strokeWidth={3} />
                                          )}
                                          <span className="text-sm">{dose.label}</span>
                                          {dose.requiresScript && (
                                            <span className="text-xs opacity-70">*</span>
                                          )}
                                        </motion.button>
                                      );
                                    })}
                                  </div>
                                </>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

          <NavigationButtons
            showBack={showBack}
            onBack={onBack}
            onNext={onSubmit}
            isNextDisabled={!canContinue}
            layout="grouped"
          />
        </motion.div>
      </div>
    </div>
  );
}

