import React, { useEffect, useMemo, useState } from 'react';
import ScreenLayout from '../common/ScreenLayout';
import NavigationButtons from '../common/NavigationButtons';
import { ScreenProps } from './common';
import { apiClient, type MedicationOption } from '../../utils/api';
import Checkbox from '../ui/Checkbox';

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
  const [selectedMedication, setSelectedMedication] = useState<string>(
    (answers['selected_medication'] as string) ||
      ((answers['medication_preferences'] as string[] | undefined)?.[0]) ||
      ''
  );
  const [pharmacySelections, setPharmacySelections] = useState<Record<string, Set<string>>>(() => {
    const stored = (answers['medication_pharmacy_preferences'] as Record<string, string[]>) || {};
    const map: Record<string, Set<string>> = {};
    Object.entries(stored).forEach(([med, list]) => {
      map[med] = new Set(list);
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
    setPharmacySelections((prev) => {
      const next: Record<string, Set<string>> = {};
      Object.entries(prev).forEach(([key, value]) => {
        next[key] = new Set(value);
      });
      const set = new Set<string>();
      set.add(pharmacies[0]);
      next[selectedMedication] = set;
      return next;
    });
  }, [medications, selectedMedication]);

  const handleMedicationSelect = (medication: string) => {
    setSelectedMedication(medication);
    setPharmacySelections((prev) => {
      const next: Record<string, Set<string>> = {};
      Object.entries(prev).forEach(([key, value]) => {
        next[key] = new Set(value);
      });
      const existing = next[medication] ? new Set(next[medication]) : new Set<string>();
      const medDetails = medications.find((item) => item.medication === medication);
      if (medDetails && (medDetails.pharmacies || []).length === 1) {
        existing.clear();
        existing.add(medDetails.pharmacies[0]);
      }
      next[medication] = existing;
      return next;
    });
  };

  const handlePharmacyToggle = (medication: string, pharmacy: string) => {
    setPharmacySelections((prev) => {
      const next: Record<string, Set<string>> = {};
      Object.entries(prev).forEach(([key, value]) => {
        next[key] = new Set(value);
      });
      const set = next[medication] ?? new Set<string>();
      if (set.has(pharmacy)) {
        set.delete(pharmacy);
      } else {
        set.add(pharmacy);
      }
      next[medication] = set;
      return next;
    });
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
    const selectedSet = pharmacySelections[selectedMedication];
    return !!selectedSet && selectedSet.size > 0;
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

    const selectedSet = pharmacySelections[selectedMedication];
    const serialized: Record<string, string[]> = {};
    if (selectedMedication && selectedSet) {
      if (selectedSet.size === 0 && selectedMedicationData && (selectedMedicationData.pharmacies || []).length === 1) {
        serialized[selectedMedication] = [selectedMedicationData.pharmacies[0]];
      } else if (selectedSet.size > 0) {
        serialized[selectedMedication] = Array.from(selectedSet);
      }
    }
    updateAnswer('medication_pharmacy_preferences', serialized);
  }, [selectedMedication, selectedMedicationData, pharmacySelections, updateAnswer]);

  if (!stateCode) {
    return (
      <ScreenLayout title={title} helpText={helpText}>
        <p className="text-center text-stone-500">Select your state first to view medication options.</p>
        <NavigationButtons
          showBack={showBack}
          onBack={onBack}
          onNext={onSubmit}
          isNextDisabled
        />
      </ScreenLayout>
    );
  }

  if (loading) {
    return (
      <ScreenLayout title={title} helpText={helpText}>
        <p className="text-center text-stone-500">Loading medication options…</p>
      </ScreenLayout>
    );
  }

  if (error) {
    return (
      <ScreenLayout title={title} helpText={helpText}>
        <p className="text-center text-red-500">{error}</p>
        <NavigationButtons
          showBack={showBack}
          onBack={onBack}
          onNext={onSubmit}
          isNextDisabled
        />
      </ScreenLayout>
    );
  }

  if (medications.length === 0) {
    return (
      <ScreenLayout title={title} helpText={helpText}>
        <p className="text-center text-stone-500">No medications available for your state yet.</p>
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
    <ScreenLayout title={title} helpText={helpText}>
      <div className="space-y-6">
        {medications.map((item) => {
          const isSelected = item.medication === selectedMedication;
          const pharmacies = item.pharmacies || [];
          const hasChoices = pharmacies.length > 1;
          const selectedPharmaciesSet = pharmacySelections[item.medication] || new Set<string>();

          return (
            <div
              key={item.medication}
              className={`border-2 rounded-2xl p-5 shadow-sm transition ${
                isSelected ? 'border-primary bg-primary/5' : 'border-stone-200 bg-white'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-stone-900">{item.medication}</h3>
                  <p className="text-sm text-stone-600">Available at {pharmacies.join(', ')}</p>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="medication-selection"
                    value={item.medication}
                    checked={isSelected}
                    onChange={() => handleMedicationSelect(item.medication)}
                    className="w-5 h-5 text-primary focus:ring-primary"
                  />
                  <span className="text-sm font-medium text-stone-700">Interested</span>
                </label>
              </div>

              {isSelected && hasChoices && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium text-stone-700">Where would you like to receive it?</p>
                  <div className="space-y-2">
                    {pharmacies.map((pharmacy) => (
                      <Checkbox
                        key={`${item.medication}-${pharmacy}`}
                        id={`${item.medication}-${pharmacy}`}
                        checked={selectedPharmaciesSet.has(pharmacy)}
                        onChange={() => handlePharmacyToggle(item.medication, pharmacy)}
                        label={pharmacy}
                      />
                    ))}
                  </div>
                </div>
              )}

              {isSelected && !hasChoices && pharmacies.length === 1 && (
                <p className="mt-4 text-sm text-stone-600">Pharmacy: {pharmacies[0]}</p>
              )}
            </div>
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
  );
};

export default MedicationOptionsScreen;
