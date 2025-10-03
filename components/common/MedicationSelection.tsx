import React, { useEffect, useState } from 'react';
import { apiClient, type MedicationOption } from '../../utils/api';

interface MedicationSelectionProps {
  condition: string;
  region: string;
  selectedMedication: string;
  onSelect: (medication: string) => void;
}

const MedicationSelection: React.FC<MedicationSelectionProps> = ({
  condition,
  region,
  selectedMedication,
  onSelect,
}) => {
  const [medications, setMedications] = useState<MedicationOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMedications = async () => {
      if (!region || !condition) {
        setMedications([]);
        return;
      }

      setLoading(true);
      setError('');

      try {
        const data = await apiClient.getMedications(region, condition);
        setMedications(data.medications || []);
      } catch (fetchError) {
        console.error(fetchError);
        setError(fetchError instanceof Error ? fetchError.message : 'Failed to load medications');
        setMedications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMedications();
  }, [region, condition]);

  if (!region) {
    return <p className="text-center text-stone-500">Select your state to see medication options.</p>;
  }

  if (loading) {
    return <p className="text-center text-stone-500">Loading medication options…</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  if (medications.length === 0) {
    return <p className="text-center text-stone-500">No medications available for your region yet.</p>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-stone-900 text-center">Select your medication</h2>
      <div className="space-y-4">
        {medications.map((medication) => (
          <div key={medication.medication} className="border-2 border-stone-200 rounded-xl p-4">
            <h3 className="font-semibold text-stone-900 text-lg">{medication.medication}</h3>
            <ul className="space-y-1 mt-2 text-sm text-stone-600">
              {medication.pharmacies.map((pharmacy) => (
                <li key={`${medication.medication}-${pharmacy}`}>
                  Available at: <span className="font-medium text-stone-700">{pharmacy}</span>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => onSelect(medication.medication)}
              className={`mt-4 w-full py-3 rounded-lg font-semibold transition-colors ${
                selectedMedication === medication.medication
                  ? 'bg-primary text-white'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {selectedMedication === medication.medication ? 'Selected' : 'Select medication'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MedicationSelection;
