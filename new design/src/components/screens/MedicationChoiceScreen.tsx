import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ScreenLayout from '../common/ScreenLayout';
import NavigationButtons from '../common/NavigationButtons';
import { ScreenProps } from './common';
import { Check, Info, ChevronDown } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { InfoTooltip } from '../common/InfoTooltip';

// Pharmacy options - Replace these with your actual pharmacy partner names
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
    imageUrl: 'https://images.unsplash.com/photo-1609009630912-f16dcf3e03a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZW1hZ2x1dGlkZSUyMGluamVjdGlvbiUyMHZpYWx8ZW58MXx8fHwxNzYxMzYyMzU5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    id: 'tirzepatide',
    name: 'Tirzepatide',
    description: 'GLP-1 injection',
    popular: true,
    imageUrl: 'https://images.unsplash.com/photo-1609009631378-8b8be31f84fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aXJ6ZXBhdGlkZSUyMG1lZGljYXRpb24lMjBwZW58ZW58MXx8fHwxNzYxMzYyMzU5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
];

// Brand name medications
const BRAND_MEDICATIONS = [
  {
    id: 'ozempic',
    name: 'Ozempic',
    description: 'Brand name semaglutide',
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  },
  {
    id: 'wegovy',
    name: 'Wegovy',
    description: 'Brand name semaglutide',
    imageUrl: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  },
  {
    id: 'mounjaro',
    name: 'Mounjaro',
    description: 'Brand name tirzepatide',
    imageUrl: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  },
  {
    id: 'zepbound',
    name: 'Zepbound',
    description: 'Brand name tirzepatide',
    imageUrl: 'https://images.unsplash.com/photo-1628595351029-c2bf17511435?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  },
];

// Dose options by medication type (same for all pharmacies)
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

// Pharmacy button component with vitamin info
function PharmacyButton({ 
  pharmacy, 
  isSelected, 
  onClick, 
  index 
}: { 
  pharmacy: typeof PHARMACIES[0]; 
  isSelected: boolean; 
  onClick: () => void; 
  index: number;
}) {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.08, duration: 0.3 }}
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
      className={`px-4 py-2.5 rounded-full border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#1a7f72]/40 focus:ring-offset-2 flex items-center gap-2 ${
        isSelected
          ? 'border-[#00A896] bg-[#00A896] text-white shadow-md'
          : 'border-[#E8E8E8] bg-white text-[#2D3436] hover:border-[#00A896]/50 hover:bg-[#00A896]/5'
      }`}
      style={{ transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}
    >
      {isSelected && (
        <Check className="w-4 h-4" strokeWidth={3} />
      )}
      <span className="text-sm flex items-center gap-1.5">
        {pharmacy.name}
        {pharmacy.vitamin && (
          <>
            <span className="font-semibold"> (+ Vitamin {pharmacy.vitamin})</span>
            <InfoTooltip 
              content={`This formulation includes vitamin ${pharmacy.vitamin}. There is no difference in effectiveness compared to formulations without vitamins.`}
              side="top"
              asSpan
            />
          </>
        )}
      </span>
    </motion.button>
  );
}

export default function MedicationChoiceScreen({ 
  screen, 
  answers, 
  updateAnswer, 
  onSubmit, 
  showBack, 
  onBack 
}: ScreenProps) {
  const title = 'headline' in screen ? screen.headline : (screen as any).title;
  const helpText = 'body' in screen ? screen.body : (screen as any).help_text;

  const [expandedMedication, setExpandedMedication] = useState<string | null>(null);
  const selectedMedication = answers['selected_medication'] || null;
  const selectedPharmacy = answers['selected_pharmacy'] || null;
  const selectedDose = answers['preferred_dose'] || '';

  const handleMedicationClick = (medicationId: string) => {
    // Toggle expansion
    if (expandedMedication === medicationId) {
      setExpandedMedication(null);
    } else {
      setExpandedMedication(medicationId);
      
      // Clear pharmacy and dose if switching medications
      if (selectedMedication !== medicationId) {
        updateAnswer('selected_medication', '');
        updateAnswer('selected_pharmacy', '');
        updateAnswer('preferred_dose', '');
      }
    }
  };

  const handlePharmacySelect = (pharmacyId: string, pharmacyName: string, medicationId: string) => {
    updateAnswer('selected_pharmacy', pharmacyId);
    
    // Set medication info
    const medication = MEDICATIONS.find(m => m.id === medicationId) || BRAND_MEDICATIONS.find(m => m.id === medicationId);
    
    if (medication) {
      updateAnswer('selected_medication', medicationId);
      updateAnswer('medication_choice', medicationId);
      updateAnswer('selected_medication_name', medication.name);
      updateAnswer('pharmacy_name', pharmacyName);
    }
    
    // Clear dose when changing pharmacy
    updateAnswer('preferred_dose', '');
  };

  const handleDoseSelect = (doseValue: string) => {
    updateAnswer('preferred_dose', doseValue);
  };

  const handleDone = () => {
    // Collapse the expanded medication and proceed to next screen
    setExpandedMedication(null);
    onSubmit();
  };

  // Get dose options based on selected medication's base type
  const getDoseOptions = (medicationId: string) => {
    if (medicationId === 'semaglutide' || medicationId === 'ozempic' || medicationId === 'wegovy') {
      return DOSE_OPTIONS_BY_MEDICATION['semaglutide'] || [];
    } else if (medicationId === 'tirzepatide' || medicationId === 'mounjaro' || medicationId === 'zepbound') {
      return DOSE_OPTIONS_BY_MEDICATION['tirzepatide'] || [];
    }
    return [];
  };

  const doseOptions = selectedMedication ? getDoseOptions(selectedMedication) : [];
  const hasHigherDoses = doseOptions.some(d => d.requiresScript);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <ScreenLayout 
        title={title || 'Which medication is right for you?'} 
        helpText={helpText || 'A licensed provider will review your selection'}
        showBack={true}
        onBack={onBack}
      >
        <div className="mb-8 space-y-6">
          {/* Compounded Medications */}
          <div className="space-y-4">
            <h3 className="text-sm text-neutral-600 px-1">Compounded medications</h3>
            {MEDICATIONS.map((med, index) => {
            const isExpanded = expandedMedication === med.id;
            const isMedicationSelected = selectedMedication === med.id;

            return (
              <motion.div
                key={med.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08, duration: 0.3 }}
                className={isExpanded ? 'shadow-lg rounded-xl' : ''}
              >
                {/* Main Medication Card */}
                <motion.button
                  onClick={() => handleMedicationClick(med.id)}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-[18px] px-6 transition-all duration-300 text-left group relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-[#0D9488]/40 focus:ring-offset-2 ${
                    isExpanded 
                      ? 'rounded-t-xl border-2 border-b border-[#0D9488] bg-gradient-to-r from-[#0D9488]/5 via-[#FF7A59]/5 to-[#14B8A6]/5 border-b-[#0D9488]/20'
                      : isMedicationSelected
                      ? 'rounded-xl border-2 border-[#0D9488] bg-gradient-to-r from-[#0D9488]/5 via-[#FF7A59]/5 to-[#14B8A6]/5 shadow-md'
                      : 'rounded-xl border-2 border-gray-200 bg-white hover:border-[#FF7A59]/30 hover:shadow-md hover:scale-[1.01]'
                  }`}
                  style={{ transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}
                >
                  <div className="flex items-center gap-4">
                    {/* Small Medication Image */}
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
                        <span className={`leading-relaxed ${isMedicationSelected || isExpanded ? 'text-[#0D9488] font-medium' : 'text-neutral-700'}`}>
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

                {/* Expanded Pharmacy & Dose Selection Box */}
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
                        {/* Pharmacy Selection - Pill Buttons */}
                        <div className="space-y-3">
                          <p className="text-sm text-neutral-700">Do you have a preference for a pharmacy?</p>
                          <div className="flex flex-wrap gap-2">
                            {PHARMACIES.map((pharmacy, pIndex) => {
                              const isPharmacySelected = selectedPharmacy === pharmacy.id && selectedMedication === med.id;
                              
                              return (
                                <PharmacyButton
                                  key={pharmacy.id}
                                  pharmacy={pharmacy}
                                  isSelected={isPharmacySelected}
                                  onClick={(e: any) => {
                                    e?.stopPropagation();
                                    handlePharmacySelect(pharmacy.id, pharmacy.name, med.id);
                                  }}
                                  index={pIndex}
                                />
                              );
                            })}
                          </div>
                        </div>

                        {/* Dose Selection - Appears When Pharmacy Selected */}
                        <AnimatePresence mode="wait">
                          {selectedPharmacy && selectedMedication === med.id && doseOptions.length > 0 && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                              className="overflow-hidden space-y-3 pt-3 border-t-2 border-[#0D9488]/10"
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                <div>
                                  <p className="text-sm text-neutral-700">Do you have a preferred dose?</p>
                                  <p className="text-xs text-neutral-500 mt-0.5">Your provider will make the final determination</p>
                                </div>
                                {hasHigherDoses && (
                                  <div className="flex items-center gap-1.5 text-xs text-amber-700 whitespace-nowrap">
                                    <Info className="w-3.5 h-3.5" aria-hidden="true" />
                                    <span>* Copy of recent Rx needed</span>
                                  </div>
                                )}
                              </div>

                              {/* Dose Options - Pill Buttons */}
                              <div className="flex flex-wrap gap-2">
                                {doseOptions.map((dose, doseIndex) => {
                                  const isDoseSelected = selectedDose === dose.value;
                                  return (
                                    <motion.button
                                      key={dose.value}
                                      initial={{ opacity: 0, scale: 0.9 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      transition={{ delay: doseIndex * 0.05, duration: 0.3 }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDoseSelect(dose.value);
                                      }}
                                      whileTap={{ scale: 0.95 }}
                                      whileHover={{ scale: 1.02 }}
                                      className={`px-4 py-2.5 rounded-full border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#0D9488]/40 focus:ring-offset-2 flex items-center gap-2 ${
                                        isDoseSelected
                                          ? 'border-[#0D9488] bg-gradient-to-r from-[#0D9488] to-[#14B8A6] text-white shadow-md'
                                          : 'border-gray-300 bg-white text-neutral-700 hover:border-[#0D9488]/50 hover:bg-[#0D9488]/5'
                                      }`}
                                      style={{ transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}
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

                              {/* Done Button */}
                              {selectedDose && (
                                <motion.div
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.3 }}
                                  className="pt-2 flex justify-end"
                                >
                                  <button
                                    onClick={handleDone}
                                    className="py-2 px-6 rounded-lg bg-gradient-to-r from-[#0D9488] to-[#14B8A6] text-white transition-all duration-300 hover:shadow-lg hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[#0D9488]/40 focus:ring-offset-2"
                                    style={{ transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}
                                  >
                                    Continue to plan selection
                                  </button>
                                </motion.div>
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

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-[#FDFBF7] text-sm text-neutral-500">Brand name options</span>
            </div>
          </div>

          {/* Brand Name Medications */}
          <div className="space-y-4">
            {BRAND_MEDICATIONS.map((med, index) => {
            const isExpanded = expandedMedication === med.id;
            const isMedicationSelected = selectedMedication === med.id;

            return (
              <motion.div
                key={med.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (MEDICATIONS.length + index) * 0.08, duration: 0.3 }}
                className={isExpanded ? 'shadow-lg rounded-xl' : ''}
              >
                {/* Main Medication Card */}
                <motion.button
                  onClick={() => handleMedicationClick(med.id)}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-[18px] px-6 transition-all duration-300 text-left group relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-[#0D9488]/40 focus:ring-offset-2 ${
                    isExpanded 
                      ? 'rounded-t-xl border-2 border-b border-[#0D9488] bg-gradient-to-r from-[#0D9488]/5 via-[#FF7A59]/5 to-[#14B8A6]/5 border-b-[#0D9488]/20'
                      : isMedicationSelected
                      ? 'rounded-xl border-2 border-[#0D9488] bg-gradient-to-r from-[#0D9488]/5 via-[#FF7A59]/5 to-[#14B8A6]/5 shadow-md'
                      : 'rounded-xl border-2 border-gray-200 bg-white hover:border-[#FF7A59]/30 hover:shadow-md hover:scale-[1.01]'
                  }`}
                  style={{ transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}
                >
                  <div className="flex items-center gap-4">
                    {/* Small Medication Image */}
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
                        <span className={`leading-relaxed ${isMedicationSelected || isExpanded ? 'text-[#0D9488] font-medium' : 'text-neutral-700'}`}>
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

                {/* Expanded Pharmacy & Dose Selection Box */}
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
                        {/* Pharmacy Selection - Pill Buttons */}
                        <div className="space-y-3">
                          <p className="text-sm text-neutral-700">Do you have a preference for a pharmacy?</p>
                          <div className="flex flex-wrap gap-2">
                            {PHARMACIES.map((pharmacy, pIndex) => {
                              const isPharmacySelected = selectedPharmacy === pharmacy.id && selectedMedication === med.id;
                              
                              return (
                                <PharmacyButton
                                  key={pharmacy.id}
                                  pharmacy={pharmacy}
                                  isSelected={isPharmacySelected}
                                  onClick={(e: any) => {
                                    e?.stopPropagation();
                                    handlePharmacySelect(pharmacy.id, pharmacy.name, med.id);
                                  }}
                                  index={pIndex}
                                />
                              );
                            })}
                          </div>
                        </div>

                        {/* Dose Selection - Appears When Pharmacy Selected */}
                        <AnimatePresence mode="wait">
                          {selectedPharmacy && selectedMedication === med.id && doseOptions.length > 0 && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                              className="overflow-hidden space-y-3 pt-3 border-t-2 border-[#0D9488]/10"
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                <div>
                                  <p className="text-sm text-neutral-700">Do you have a preferred dose?</p>
                                  <p className="text-xs text-neutral-500 mt-0.5">Your provider will make the final determination</p>
                                </div>
                                {hasHigherDoses && (
                                  <div className="flex items-center gap-1.5 text-xs text-amber-700 whitespace-nowrap">
                                    <Info className="w-3.5 h-3.5" aria-hidden="true" />
                                    <span>* Copy of recent Rx needed</span>
                                  </div>
                                )}
                              </div>

                              {/* Dose Options - Pill Buttons */}
                              <div className="flex flex-wrap gap-2">
                                {doseOptions.map((dose, doseIndex) => {
                                  const isDoseSelected = selectedDose === dose.value;
                                  return (
                                    <motion.button
                                      key={dose.value}
                                      initial={{ opacity: 0, scale: 0.9 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      transition={{ delay: doseIndex * 0.05, duration: 0.3 }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDoseSelect(dose.value);
                                      }}
                                      whileTap={{ scale: 0.95 }}
                                      whileHover={{ scale: 1.02 }}
                                      className={`px-4 py-2.5 rounded-full border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#0D9488]/40 focus:ring-offset-2 flex items-center gap-2 ${
                                        isDoseSelected
                                          ? 'border-[#0D9488] bg-gradient-to-r from-[#0D9488] to-[#14B8A6] text-white shadow-md'
                                          : 'border-gray-300 bg-white text-neutral-700 hover:border-[#0D9488]/50 hover:bg-[#0D9488]/5'
                                      }`}
                                      style={{ transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}
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

                              {/* Done Button */}
                              {selectedDose && (
                                <motion.div
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.3 }}
                                  className="pt-2 flex justify-end"
                                >
                                  <button
                                    onClick={handleDone}
                                    className="py-2 px-6 rounded-lg bg-gradient-to-r from-[#0D9488] to-[#14B8A6] text-white transition-all duration-300 hover:shadow-lg hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[#0D9488]/40 focus:ring-offset-2"
                                    style={{ transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}
                                  >
                                    Continue to plan selection
                                  </button>
                                </motion.div>
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
        </div>

        <NavigationButtons
          showBack={showBack}
          onBack={onBack}
          onNext={onSubmit}
          isNextDisabled={!selectedPharmacy || !selectedDose}
        />
      </ScreenLayout>
    </motion.div>
  );
}
