import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronDown, Info } from 'lucide-react';
import ScreenLayout from '../common/ScreenLayout';
import NavigationButtons from '../common/NavigationButtons';
import { ScreenProps } from './common';
import { apiClient, type MedicationOption } from '../../utils/api';
import { getDoseOptions, type DoseOption } from '../../utils/doseOptions';

const DEFAULT_SERVICE_TYPE = 'Weight Loss';

const MedicationOptionsScreen: React.FC<ScreenProps> = ({
  screen,
  answers,
  updateAnswer,
  onSubmit,
  showBack,
  onBack,
  defaultCondition,
}) => {
  const title = 'headline' in screen ? screen.headline : (screen as any).title;
  const helpText = 'body' in screen ? screen.body : (screen as any).help_text;

  const stateCode =
    answers['demographics.state'] || answers['shipping_state'] || answers['state'] || '';
  const serviceType =
    typeof (screen as any)?.service_type === 'string'
      ? (screen as any).service_type
      : defaultCondition || DEFAULT_SERVICE_TYPE;

  const [medications, setMedications] = useState<MedicationOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [expandedMedication, setExpandedMedication] = useState<string | null>(null);
  const [selectedMedication, setSelectedMedication] = useState<string>(
    (answers['selected_medication'] as string) ||
      ((answers['medication_preferences'] as string[] | undefined)?.[0]) ||
      ''
  );
  const [selectedPharmacy, setSelectedPharmacy] = useState<string>('');
  const [selectedDose, setSelectedDose] = useState<string>(
    (answers['preferred_dose'] as string) || ''
  );

  // Fetch medications from API
  useEffect(() => {
    const fetchMedications = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await apiClient.getMedications(stateCode, serviceType);
        const meds = response.medications || [];
        setMedications(meds);

        // If previously selected medication no longer available, clear it
        if (selectedMedication && meds.every((item) => item.medication !== selectedMedication)) {
          setSelectedMedication('');
          setSelectedPharmacy('');
          setSelectedDose('');
        }
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
      setSelectedMedication('');
    }
  }, [stateCode, serviceType]);

  const handleMedicationClick = (medicationName: string) => {
    // Toggle expansion
    if (expandedMedication === medicationName) {
      setExpandedMedication(null);
    } else {
      setExpandedMedication(medicationName);
      
      // Clear pharmacy and dose if switching medications
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
    setSelectedDose(''); // Clear dose when changing pharmacy
    
    // Update answers
    updateAnswer('selected_medication', medicationName);
    updateAnswer('medication_preferences', [medicationName]);
    updateAnswer('treatment.medication_preference', medicationName);
  };

  const handleDoseSelect = (doseValue: string) => {
    setSelectedDose(doseValue);
    updateAnswer('preferred_dose', doseValue);
  };

  const handleDone = () => {
    // Collapse the expanded medication
    setExpandedMedication(null);
    
    // Save pharmacy preferences in the format the backend expects
    if (selectedMedication && selectedPharmacy) {
      const pharmacyPrefs: Record<string, string[]> = {
        [selectedMedication]: [selectedPharmacy]
      };
      updateAnswer('medication_pharmacy_preferences', pharmacyPrefs);
    }
  };

  // Get the current medication's pharmacies and dose options
  const currentMedicationData = useMemo(
    () => medications.find((item) => item.medication === expandedMedication),
    [medications, expandedMedication]
  );

  const pharmacies = currentMedicationData?.pharmacies || [];
  const doseOptions = expandedMedication ? getDoseOptions(expandedMedication) : [];
  const hasHigherDoses = doseOptions.some(d => d.requiresScript);

  const isComplete = !!(selectedMedication && selectedPharmacy && selectedDose);

  // Loading state
  if (loading) {
    return (
      <ScreenLayout title={title} helpText={helpText}>
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-4 text-neutral-600">Loading medication options...</p>
        </div>
      </ScreenLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <ScreenLayout title={title} helpText={helpText}>
        <div className="text-center py-8">
          <p className="text-red-500 mb-4">{error}</p>
          <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
            <p><strong>Debug Info:</strong></p>
            <p>State: {stateCode || 'Not selected'}</p>
            <p>Service Type: {serviceType}</p>
          </div>
        </div>
        <NavigationButtons
          showBack={showBack}
          onBack={onBack}
          onNext={onSubmit}
          isNextDisabled
        />
      </ScreenLayout>
    );
  }

  // No state selected
  if (!stateCode) {
    return (
      <ScreenLayout title={title} helpText={helpText}>
        <p className="text-center text-neutral-500">Select your state first to view medication options.</p>
        <NavigationButtons
          showBack={showBack}
          onBack={onBack}
          onNext={onSubmit}
          isNextDisabled
        />
      </ScreenLayout>
    );
  }

  // No medications available
  if (medications.length === 0) {
    return (
      <ScreenLayout title={title} helpText={helpText}>
        <p className="text-center text-neutral-500">No medications available for your state yet.</p>
        <NavigationButtons
          showBack={showBack}
          onBack={onBack}
          onNext={onSubmit}
          isNextDisabled
        />
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
                {/* Main Medication Card */}
                <motion.button
                  onClick={() => handleMedicationClick(med.medication)}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-5 px-6 transition-all duration-300 text-left relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 ${
                    isExpanded 
                      ? 'rounded-t-xl border-2 border-b border-primary bg-primary/5 border-b-primary/20'
                      : isMedicationSelected
                      ? 'rounded-xl border-2 border-primary bg-primary/5 shadow-md'
                      : 'rounded-xl border-2 border-gray-200 bg-white hover:border-primary/30 hover:shadow-md hover:scale-[1.01]'
                  }`}
                  style={{ transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}
                >
                  <div className="flex items-center justify-between">
                    {/* Medication Name */}
                    <div className="flex-1">
                      <span className={`text-lg leading-relaxed ${isMedicationSelected || isExpanded ? 'text-primary font-medium' : 'text-neutral-800'}`}>
                        {med.medication}
                      </span>
                      <p className="text-sm text-neutral-600 mt-1">
                        Available at {med.pharmacies.length} {med.pharmacies.length === 1 ? 'pharmacy' : 'pharmacies'}
                      </p>
                    </div>

                    {/* Expand Chevron */}
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex-shrink-0"
                    >
                      <ChevronDown className={`w-5 h-5 ${isMedicationSelected || isExpanded ? 'text-primary' : 'text-gray-400'}`} />
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
                      <div className="px-6 pb-6 pt-4 rounded-b-xl bg-primary/5 border-2 border-t-0 border-primary space-y-5">
                        {/* Pharmacy Selection */}
                        <div className="space-y-3">
                          <p className="text-sm font-medium text-neutral-700">Select pharmacy:</p>
                          <div className="flex flex-wrap gap-2">
                            {pharmacies.map((pharmacy, pIndex) => (
                              <motion.button
                                key={pharmacy}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: pIndex * 0.05, duration: 0.3 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handlePharmacySelect(pharmacy, med.medication);
                                }}
                                whileTap={{ scale: 0.95 }}
                                whileHover={{ scale: 1.02 }}
                                className={`px-4 py-2.5 rounded-full border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 flex items-center gap-2 ${
                                  isThisPharmacySelected(pharmacy)
                                    ? 'border-primary bg-primary text-white shadow-md'
                                    : 'border-gray-300 bg-white text-neutral-700 hover:border-primary/50 hover:bg-primary/5'
                                }`}
                                style={{ transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}
                              >
                                {isThisPharmacySelected(pharmacy) && (
                                  <Check className="w-4 h-4" strokeWidth={3} />
                                )}
                                <span className="text-sm">{pharmacy}</span>
                              </motion.button>
                            ))}
                          </div>
                        </div>

                        {/* Dose Selection - Appears When Pharmacy Selected */}
                        <AnimatePresence mode="wait">
                          {selectedPharmacy && selectedMedication === med.medication && doseOptions.length > 0 && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                              className="overflow-hidden space-y-3 pt-3 border-t-2 border-primary/10"
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                <div>
                                  <p className="text-sm font-medium text-neutral-700">Preferred dose (optional):</p>
                                  <p className="text-xs text-neutral-500 mt-0.5">Your provider will make the final determination</p>
                                </div>
                                {hasHigherDoses && (
                                  <div className="flex items-center gap-1.5 text-xs text-amber-700 whitespace-nowrap">
                                    <Info className="w-3.5 h-3.5" aria-hidden="true" />
                                    <span>* Copy of recent Rx needed</span>
                                  </div>
                                )}
                              </div>

                              {/* Dose Options */}
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
                                      className={`px-4 py-2.5 rounded-full border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 flex items-center gap-2 ${
                                        isDoseSelected
                                          ? 'border-primary bg-primary text-white shadow-md'
                                          : 'border-gray-300 bg-white text-neutral-700 hover:border-primary/50 hover:bg-primary/5'
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
                                    className="py-2 px-6 rounded-lg bg-primary text-white transition-all duration-300 hover:shadow-lg hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2"
                                    style={{ transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}
                                  >
                                    Done
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

        <NavigationButtons
          showBack={showBack}
          onBack={onBack}
          onNext={onSubmit}
          isNextDisabled={!isComplete}
        />
      </ScreenLayout>
    </motion.div>
  );
};

export default MedicationOptionsScreen;
