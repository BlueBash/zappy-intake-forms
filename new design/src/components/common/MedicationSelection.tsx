import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { apiClient, type MedicationOption } from '../../utils/api';
import { Loader2, AlertCircle } from 'lucide-react';
import { Check } from 'lucide-react';

interface MedicationSelectionProps {
  serviceType: string;
  state: string;
  selectedMedication: string;
  onSelect: (medication: string) => void;
}

export default function MedicationSelection({ serviceType, state, selectedMedication, onSelect }: MedicationSelectionProps) {
  const [medications, setMedications] = useState<MedicationOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMedications = async () => {
      if (!state) return;
      
      setLoading(true);
      setError('');

      try {
        const response = await apiClient.getMedications(state, serviceType);
        setMedications(response.medications || []);
        setError(''); // Clear any previous errors
      } catch (err) {
        console.error('Error fetching medications:', err);
        setError(err instanceof Error ? err.message : 'Failed to load medications');
        // Fallback to default medications on error
        setMedications([
          { medication: 'Semaglutide', pharmacies: ['Compounding Pharmacy', 'Local Pharmacy'] },
          { medication: 'Tirzepatide', pharmacies: ['Compounding Pharmacy'] },
          { medication: 'Metformin', pharmacies: ['Local Pharmacy'] },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchMedications();
  }, [state, serviceType]);

  if (!state) {
    return (
      <div className="text-center py-8 text-neutral-600">
        <AlertCircle className="w-12 h-12 mx-auto mb-3 text-neutral-400" />
        <p>Please select your state first to view medication options.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <Loader2 className="w-8 h-8 mx-auto mb-3 text-[#0D9488] animate-spin" />
        <p className="text-neutral-600">Loading medication options...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="w-12 h-12 mx-auto mb-3 text-red-400" />
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (medications.length === 0) {
    return (
      <div className="text-center py-8 text-neutral-600">
        <AlertCircle className="w-12 h-12 mx-auto mb-3 text-neutral-400" />
        <p>No medications available for your state yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {medications.map((item, index) => {
        const isSelected = item.medication === selectedMedication;
        return (
          <motion.button
            key={item.medication}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onSelect(item.medication)}
            className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left ${
              isSelected
                ? 'border-[#1a7f72] bg-[#e6f3f2] shadow-sm'
                : 'border-gray-200 bg-white hover:border-[#1a7f72]/40 hover:shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className={`text-lg ${isSelected ? 'text-[#1a7f72]' : 'text-neutral-900'}`}>
                  {item.medication}
                </h3>
                <p className="text-sm text-neutral-600">Available at {item.pharmacies.join(', ')}</p>
              </div>
              {isSelected && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  className="w-6 h-6 rounded-full bg-[#00A896] flex items-center justify-center shadow-md"
                >
                  <Check className="w-4 h-4 text-white" strokeWidth={3} />
                </motion.div>
              )}
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
