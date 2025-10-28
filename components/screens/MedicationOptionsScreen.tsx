import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronDown, Info } from 'lucide-react';
import ScreenLayout from '../common/ScreenLayout';
import NavigationButtons from '../common/NavigationButtons';
import { ScreenProps } from './common';
import { apiClient, type MedicationOption } from '../../utils/api';
import { getDoseOptions, type DoseOption } from '../../utils/doseOptions';
import { InfoTooltip } from '../common/InfoTooltip';

const DEFAULT_SERVICE_TYPE = 'Weight Loss';

const MEDICATION_DESCRIPTIONS: Record<string, string> = {
  'Semaglutide': 'GLP-1 injection for weight management',
  'Tirzepatide': 'Dual GIP/GLP-1 injection for weight loss',
  'Wegovy': 'FDA-approved brand name semaglutide',
  'Ozempic': 'Brand name semaglutide originally for diabetes',
  'Mounjaro': 'Brand name tirzepatide for diabetes management',
  'Zepbound': 'FDA-approved brand name tirzepatide for weight loss',
  'Saxenda': 'Daily GLP-1 injection for weight management',
  'Victoza': 'Daily GLP-1 injection for diabetes',
};

const getMedicationDescription = (name: string): string => {
  return MEDICATION_DESCRIPTIONS[name] || 'GLP-1 medication for weight management';
};

const PHARMACY_METADATA: Record<string, { vitamin?: string }> = {
  'Empower': { vitamin: 'B6' },
  'Hallandale': { vitamin: 'B12' },
  'Olympia': {},
  'Wells': {},
};

interface MedicationOptionsScreenProps extends ScreenProps {
  goToScreen?: (screenId: string) => void;
}

const MedicationOptionsScreen: React.FC<MedicationOptionsScreenProps> = ({
  screen,
  answers,
  updateAnswer,
  onSubmit,
  showBack,
  onBack,
  defaultCondition,
  goToScreen,
}) => {
  const title = 'headline' in screen ? screen.headline : (screen as any).title;
  const helpText = 'body' in screen ? screen.body : (screen as any).help_text;

  const stateCode = answers['home_state'] || answers['shipping_state'] || answers['state'] || '';
  const serviceType = typeof (screen as any)?.service_type === 'string' 
    ? (screen as any).service_type 
    : defaultCondition || DEFAULT_SERVICE_TYPE;

  const [medications, setMedications] = useState<MedicationOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [expandedMedication, setExpandedMedication] = useState<string | null>(null);
  const [selectedMedication, setSelectedMedication] = useState<string>(
    (answers['selected_medication'] as string) || ''
  );
  const [selectedPharmacy, setSelectedPharmacy] = useState<string>('');
  const [selectedDose, setSelectedDose] = useState<string>(
    (answers['preferred_dose'] as string) || ''
  );

  useEffect(() => {
    const fetchMedications = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await apiClient.getMedications(stateCode, serviceType);
        const meds = response.medications || [];
        setMedications(meds);
      } catch (fetchError) {
        console.error(fetchError);
        setError(fetchError instanceof Error ? fetchError.message : 'Failed to load medications');
        setMedications([]);
      } finally {
        setLoading(false);
      }
    };

    if (stateCode) {
      fetchMedications();
    } else {
      setMedications([]);
    }
  }, [stateCode, serviceType]);

  useEffect(() => {
    if (selectedMedication && selectedPharmacy && selectedDose) {
      const pharmacyPrefs: Record<string, string[]> = {
        [selectedMedication]: [selectedPharmacy],
      };
      updateAnswer('medication_pharmacy_preferences', pharmacyPrefs);
      updateAnswer('selected_medication', selectedMedication);
      updateAnswer('medication_preferences', [selectedMedication]);
      updateAnswer('treatment.medication_preference', selectedMedication);
      updateAnswer('preferred_dose', selectedDose);

      const timer = setTimeout(() => {
        if (goToScreen && typeof goToScreen === 'function') {
          goToScreen('treatment.plan_selection.generic');
        } else {
          onSubmit();
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [selectedMedication, selectedPharmacy, selectedDose, updateAnswer, onSubmit, goToScreen]);

  const handleMedicationClick = (medicationName: string) => {
    if (expandedMedication === medicationName) {
      setExpandedMedication(null);
    } else {
      setExpandedMedication(medicationName);
      if (selectedMedication !== medicationName) {
        setSelectedMedication('');
        setSelectedPharmacy('');
        setSelectedDose('');
      }
    }
  };

  const handlePharmacySelect = (pharmacyName: string, medicationName: string) => {
    setSelectedMedication(medicationName);
    setSelectedPharmacy(pharmacyName);
    setSelectedDose('');
  };

  const handleDoseSelect = (doseValue: string) => {
    setSelectedDose(doseValue);
  };

  const currentMedicationData = useMemo(
    () => medications.find((item) => item.medication === expandedMedication),
    [medications, expandedMedication]
  );

  const pharmacies = currentMedicationData?.pharmacies || [];
  const doseOptions = selectedMedication ? getDoseOptions(selectedMedication) : [];
  const hasHigherDoses = doseOptions.some(d => d.requiresScript);

  if (loading) {
    return (
      <ScreenLayout title={title} helpText={helpText}>
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#0D9488]"></div>
          <p className="mt-4 text-neutral-600">Loading medication options...</p>
        </div>
      </ScreenLayout>
    );
  }

  if (error) {
    return (
      <ScreenLayout title={title} helpText={helpText}>
        <div className="text-center py-8">
          <p className="text-red-500 mb-4">{error}</p>
        </div>
        <NavigationButtons showBack={showBack} onBack={onBack} onNext={onSubmit} isNextDisabled />
      </ScreenLayout>
    );
  }

  if (!stateCode || medications.length === 0) {
    return (
      <ScreenLayout title={title} helpText={helpText}>
        <p className="text-center text-neutral-500">
          {!stateCode ? 'Select your state first' : 'No medications available for your state'}
        </p>
        <NavigationButtons showBack={showBack} onBack={onBack} onNext={onSubmit} isNextDisabled />
      </ScreenLayout>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <ScreenLayout title={title || 'Choose Your Medication'} helpText={helpText}>
        <div className="mb-8 space-y-4">
          {medications.map((med, index) => {
            const isExpanded = expandedMedication === med.medication;
            const isMedicationSelected = selectedMedication === med.medication;
            const isThisPharmacySelected = (pharmacy: string) =>
              selectedPharmacy === pharmacy && selectedMedication === med.medication;

            return (
              <motion.div
                key={med.medication}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08, duration: 0.3 }}
                className={isExpanded ? 'shadow-lg rounded-xl' : ''}
              >
                <motion.button
                  onClick={() => handleMedicationClick(med.medication)}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-[18px] px-6 transition-all duration-300 text-left group relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-[#0D9488]/40 focus:ring-offset-2 ${
                    isExpanded
                      ? 'rounded-t-xl border-2 border-[#0D9488] bg-gradient-to-r from-[#0D9488]/5 via-[#FF7A59]/5 to-[#14B8A6]/5'
                      : isMedicationSelected
                      ? 'rounded-xl border-2 border-[#0D9488] bg-gradient-to-r from-[#0D9488]/5 via-[#FF7A59]/5 to-[#14B8A6]/5 shadow-md'
                      : 'rounded-xl border-2 border-gray-300 bg-white hover:border-[#0D9488]/40 hover:shadow-md hover:scale-[1.01]'
                  }`}
                  style={{ transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gradient-to-br from-[#FDFBF7] to-gray-50 flex items-center justify-center flex-shrink-0 border border-gray-100">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`leading-relaxed ${isMedicationSelected || isExpanded ? 'text-[#0D9488] font-medium' : 'text-neutral-700'}`}>
                          {med.medication}
                        </span>
                      </div>
                      <p className="text-sm text-neutral-600">{getMedicationDescription(med.medication)}</p>
                    </div>
                    <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.3 }} className="flex-shrink-0">
                      <ChevronDown className={`w-5 h-5 ${isMedicationSelected || isExpanded ? 'text-[#0D9488]' : 'text-gray-400'}`} />
                    </motion.div>
                  </div>
                </motion.button>

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
                        <div className="space-y-3">
                          <p className="text-sm text-neutral-700">Do you have a preference for a pharmacy?</p>
                          <div className="flex flex-wrap gap-2">
                            {pharmacies.map((pharmacy, pIndex) => {
                              const isPharmacySelected = isThisPharmacySelected(pharmacy);
                              const pharmacyMeta = PHARMACY_METADATA[pharmacy];
                              return (
                                <motion.button
                                  key={pharmacy}
                                  type="button"
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: pIndex * 0.08, duration: 0.3 }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handlePharmacySelect(pharmacy, med.medication);
                                  }}
                                  whileTap={{ scale: 0.95 }}
                                  whileHover={{ scale: 1.02 }}
                                  className={`px-4 py-2.5 rounded-full border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#0D9488]/40 focus:ring-offset-2 flex items-center gap-2 ${
                                    isPharmacySelected
                                      ? 'border-[#0D9488] bg-gradient-to-r from-[#0D9488] to-[#14B8A6] text-white shadow-md'
                                      : 'border-gray-300 bg-white text-neutral-700 hover:border-[#0D9488]/50 hover:bg-[#0D9488]/5'
                                  }`}
                                  style={{ transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}
                                >
                                  {isPharmacySelected && <Check className="w-4 h-4" strokeWidth={3} />}
                                  <span className="text-sm">
                                    {pharmacy}
                                    {pharmacyMeta?.vitamin && (
                                      <span className="font-semibold ml-1">
                                        (+ Vitamin {pharmacyMeta.vitamin})
                                        <InfoTooltip content={`Vitamin ${pharmacyMeta.vitamin} included.`} side="top" />
                                      </span>
                                    )}
                                  </span>
                                </motion.button>
                              );
                            })}
                          </div>
                        </div>

                        {selectedPharmacy && selectedMedication === med.medication && doseOptions.length > 0 && (
                          <AnimatePresence mode="wait">
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                              className="overflow-hidden space-y-3 pt-3 border-t-2 border-[#0D9488]/10"
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                <div>
                                  <p className="text-sm text-neutral-700">Do you have any preference for the dose?</p>
                                  <p className="text-xs text-neutral-500 mt-0.5">Your provider will make the final determination</p>
                                </div>
                                {hasHigherDoses && (
                                  <div className="flex items-center gap-1.5 text-xs text-amber-700 whitespace-nowrap">
                                    <Info className="w-3.5 h-3.5" aria-hidden="true" />
                                    <span>* Copy of recent Rx needed</span>
                                  </div>
                                )}
                              </div>

                              <div className="flex flex-wrap gap-2">
                                {doseOptions.map((dose, doseIndex) => {
                                  const isDoseSelected = selectedDose === dose.value;
                                  return (
                                    <motion.button
                                      key={dose.value}
                                      type="button"
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
                                      {isDoseSelected && <Check className="w-4 h-4" strokeWidth={3} />}
                                      <span className="text-sm">{dose.label}</span>
                                      {dose.requiresScript && <span className="text-xs opacity-70">*</span>}
                                    </motion.button>
                                  );
                                })}
                              </div>
                            </motion.div>
                          </AnimatePresence>
                        )}
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
          isNextDisabled={!selectedMedication || !selectedPharmacy || !selectedDose}
        />
      </ScreenLayout>
    </motion.div>
  );
};

export default MedicationOptionsScreen;
