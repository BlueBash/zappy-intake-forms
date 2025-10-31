import { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import ScreenLayout from '../common/ScreenLayout';
import NavigationButtons from '../common/NavigationButtons';
import { ScreenProps } from './common';
import { apiClient, type MedicationOption } from '../../utils/api';
import { Loader2, AlertCircle } from 'lucide-react';

const DEFAULT_SERVICE_TYPE = 'Weight Loss';

export default function MedicationOptionsScreen({ screen, answers, updateAnswer, onSubmit, showBack, onBack, defaultCondition }: ScreenProps) {
  const title = 'headline' in screen ? screen.headline : (screen as any).title;
  const helpText = 'body' in screen ? screen.body : (screen as any).help_text;

  const stateCode = answers['demographics.state'] || answers['shipping_state'] || answers['state'] || '';
  const serviceType =
    typeof (screen as any)?.service_type === 'string'
      ? (screen as any).service_type
      : defaultCondition || DEFAULT_SERVICE_TYPE;

  const [medications, setMedications] = useState<MedicationOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedMedication, setSelectedMedication] = useState<string>(
    (answers['selected_medication'] as string) ||
      ((answers['medication_preferences'] as string[] | undefined)?.[0]) ||
      ''
  );
  const [pharmacySelections, setPharmacySelections] = useState<Record<string, string>>(() => {
    const stored = (answers['medication_pharmacy_preferences'] as Record<string, string[]>) || {};
    const map: Record<string, string> = {};
    Object.entries(stored).forEach(([med, list]) => {
      map[med] = list?.[0] ?? '';
    });
    return map;
  });

  useEffect(() => {
    const fetchMedications = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await apiClient.getMedications(stateCode, serviceType);
        const meds = response.medications || [];
        setMedications(meds);

        if (selectedMedication && meds.every((item) => item.medication !== selectedMedication)) {
          setSelectedMedication('');
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

  useEffect(() => {
    if (!selectedMedication) return;
    const medDetails = medications.find((item) => item.medication === selectedMedication);
    if (!medDetails) return;
    const pharmacies = medDetails.pharmacies || [];
    if (pharmacies.length !== 1) return;
    setPharmacySelections((prev) => ({
      ...prev,
      [selectedMedication]: pharmacies[0] ?? '',
    }));
  }, [medications, selectedMedication]);

  const handleMedicationSelect = (medication: string) => {
    setSelectedMedication(medication);
    setPharmacySelections((prev) => {
      const medDetails = medications.find((item) => item.medication === medication);
      const pharmacies = medDetails?.pharmacies || [];
      const defaultPharmacy = pharmacies.length === 1 ? pharmacies[0] : prev[medication] || '';
      return {
        ...prev,
        [medication]: defaultPharmacy,
      };
    });
  };

  const handlePharmacySelect = (medication: string, pharmacy: string) => {
    setPharmacySelections((prev) => ({
      ...prev,
      [medication]: pharmacy,
    }));
  };

  const selectedMedicationData = useMemo(
    () => medications.find((item) => item.medication === selectedMedication),
    [medications, selectedMedication]
  );

  const isComplete = useMemo(() => {
    if (!selectedMedication) return false;
    if (!selectedMedicationData) return false;
    const pharmacies = selectedMedicationData.pharmacies || [];
    if (pharmacies.length <= 1) return true;
    const selectedPharmacy = pharmacySelections[selectedMedication] || '';
    return selectedPharmacy.length > 0;
  }, [selectedMedication, selectedMedicationData, pharmacySelections]);

  useEffect(() => {
    const selections = selectedMedication ? [selectedMedication] : [];
    updateAnswer('medication_preferences', selections);
    updateAnswer('treatment.medication_preference', selectedMedication || '');
    updateAnswer('selected_medication', selectedMedication || '');
    if (!selectedMedication) {
      updateAnswer('plan_requires_dose_strategy', false);
      updateAnswer('dose_strategy', 'maintenance');
    }

    const selectedPharmacy = pharmacySelections[selectedMedication] || '';
    const serialized: Record<string, string[]> = {};
    if (selectedMedication) {
      if (selectedPharmacy) {
        serialized[selectedMedication] = [selectedPharmacy];
      } else if (selectedMedicationData && (selectedMedicationData.pharmacies || []).length === 1) {
        serialized[selectedMedication] = [selectedMedicationData.pharmacies[0]];
      }
    }
    updateAnswer('medication_pharmacy_preferences', serialized);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMedication, selectedMedicationData, pharmacySelections]);

  if (!stateCode) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <ScreenLayout title={title || ''} helpText={helpText}>
          <div className="text-center py-8 text-neutral-600">
            <AlertCircle className="w-12 h-12 mx-auto mb-3 text-neutral-400" />
            <p>Select your state first to view medication options.</p>
          </div>
          <NavigationButtons
            showBack={showBack}
            onBack={onBack}
            onNext={onSubmit}
            isNextDisabled
          />
        </ScreenLayout>
      </motion.div>
    );
  }

  if (loading) {
    return (
      <ScreenLayout title={title || ''} helpText={helpText}>
        <div className="text-center py-8">
          <Loader2 className="w-8 h-8 mx-auto mb-3 text-[#0D9488] animate-spin" />
          <p className="text-neutral-600">Loading medication options...</p>
        </div>
      </ScreenLayout>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <ScreenLayout title={title || ''} helpText={helpText}>
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 mx-auto mb-3 text-red-400" />
            <p className="text-red-500">{error}</p>
          </div>
          <NavigationButtons
            showBack={showBack}
            onBack={onBack}
            onNext={onSubmit}
            isNextDisabled
          />
        </ScreenLayout>
      </motion.div>
    );
  }

  if (medications.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <ScreenLayout title={title || ''} helpText={helpText}>
          <div className="text-center py-8 text-neutral-600">
            <AlertCircle className="w-12 h-12 mx-auto mb-3 text-neutral-400" />
            <p>No medications available for your state yet.</p>
          </div>
          <NavigationButtons
            showBack={showBack}
            onBack={onBack}
            onNext={onSubmit}
            isNextDisabled
          />
        </ScreenLayout>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <ScreenLayout title={title || ''} helpText={helpText}>
        <div className="space-y-4 mb-8">
          {medications.map((item, index) => {
            const isSelected = item.medication === selectedMedication;
            const pharmacies = item.pharmacies || [];
            const hasChoices = pharmacies.length > 1;
            const selectedPharmacy = pharmacySelections[item.medication] || '';

            const handleCardClick = (event: React.MouseEvent<HTMLDivElement>) => {
              const target = event.target as HTMLElement | null;
              if (target && target.closest('input, button, label, a, select, textarea')) {
                return;
              }
              if (!isSelected) {
                handleMedicationSelect(item.medication);
              }
            };

            return (
              <motion.div
                key={item.medication}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`border-2 rounded-xl p-5 shadow-sm transition-all duration-300 cursor-pointer ${
                  isSelected
                    ? 'border-[#0D9488] bg-gradient-to-r from-[#0D9488]/5 to-[#14B8A6]/5'
                    : 'border-gray-200 bg-white hover:border-[#0D9488]/30'
                }`}
                onClick={handleCardClick}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className={`text-xl mb-1 ${isSelected ? 'text-[#0D9488]' : 'text-neutral-900'}`}>
                      {item.medication}
                    </h3>
                    <p className="text-sm text-neutral-600">Available at {pharmacies.join(', ')}</p>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="medication-selection"
                      value={item.medication}
                      checked={isSelected}
                      onChange={() => handleMedicationSelect(item.medication)}
                      className="w-5 h-5 text-[#0D9488] focus:ring-[#0D9488]"
                    />
                    <span className="text-sm font-medium text-neutral-700">Interested</span>
                  </label>
                </div>

                {isSelected && hasChoices && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 space-y-2"
                  >
                    <p className="text-sm font-medium text-neutral-700">Where would you like to receive it?</p>
                    <div className="space-y-2">
                      {pharmacies.map((pharmacy) => (
                        <label
                          key={`${item.medication}-${pharmacy}`}
                          className={`flex items-center gap-2 cursor-pointer rounded-xl border px-4 py-2 transition-all duration-300 ${
                            selectedPharmacy === pharmacy
                              ? 'border-[#0D9488] bg-gradient-to-r from-[#0D9488]/10 to-[#14B8A6]/10'
                              : 'border-gray-200 hover:border-[#0D9488]/30'
                          }`}
                          htmlFor={`${item.medication}-${pharmacy}`}
                        >
                          <input
                            id={`${item.medication}-${pharmacy}`}
                            type="radio"
                            name={`${item.medication}-pharmacy`}
                            value={pharmacy}
                            checked={selectedPharmacy === pharmacy}
                            onChange={() => handlePharmacySelect(item.medication, pharmacy)}
                            className="w-4 h-4 text-[#0D9488] focus:ring-[#0D9488]"
                          />
                          <span className="text-sm text-neutral-700">{pharmacy}</span>
                        </label>
                      ))}
                    </div>
                  </motion.div>
                )}

                {isSelected && !hasChoices && pharmacies.length === 1 && (
                  <p className="mt-4 text-sm text-neutral-600">Pharmacy: {pharmacies[0]}</p>
                )}
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
}
