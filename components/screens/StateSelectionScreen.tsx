import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Check } from 'lucide-react';
import ScreenHeader from '../common/ScreenHeader';

// US States data
const US_STATES = [
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' }
];

interface StateSelectionScreenProps {
  onSelect: (stateCode: string, stateName: string) => void;
  onBack?: () => void;
  selectedState?: string;
  currentStep?: number;
  totalSteps?: number;
}

// Simple debounce hook
function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useState(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function StateSelectionScreen({
  onSelect,
  onBack,
  selectedState,
  currentStep,
  totalSteps,
}: StateSelectionScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Debounce search query for better performance
  const debouncedSearch = useDebounce(searchQuery, 150);

  // Filter states based on debounced search
  const filteredStates = useMemo(() => 
    US_STATES.filter(
      (state) =>
        state.label.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        state.value.toLowerCase().includes(debouncedSearch.toLowerCase())
    ),
    [debouncedSearch]
  );

  return (
    <div className="min-h-screen bg-[#fef8f2] flex justify-center p-4 sm:p-6 pt-5 sm:pt-7">
      <div className="w-full max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Progress Bar */}
          {currentStep !== undefined && totalSteps !== undefined && (
            <ScreenHeader
              onBack={onBack}
              sectionLabel="Location"
              progressPercentage={(currentStep / totalSteps) * 100}
            />
          )}

          {/* Header */}
          <div className="mb-10 text-left">
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl sm:text-3xl md:text-4xl text-[#2D3436] mb-3 sm:mb-4 leading-snug tracking-tight"
              style={{ letterSpacing: '-0.02em' }}
            >
              Which state do you call home?
            </motion.h1>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666666]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for your state..."
                className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-[#E8E8E8] bg-white shadow-sm focus:border-[#00A896] focus:ring-4 focus:ring-[#00A896]/10 outline-none transition-all text-base"
                autoFocus
                aria-label="Search for your state"
              />
            </div>
          </div>

          {/* States List */}
          <div className="max-h-[400px] overflow-y-auto" role="listbox" aria-label="Select your state">
            {filteredStates.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
              >
                <Search className="w-12 h-12 text-[#E8E8E8] mx-auto mb-4" />
                <p className="text-[#666666] text-base">
                  No states found. Try a different search.
                </p>
              </motion.div>
            ) : (
            <div className="flex flex-col gap-3">
              <AnimatePresence mode="popLayout">
                {filteredStates.map((state, index) => {
                  const isSelected = selectedState === state.value;
                  return (
                    <motion.button
                      key={state.value}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2, delay: Math.min(index * 0.02, 0.3) }}
                      onClick={() => onSelect(state.value, state.label)}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      role="option"
                      aria-selected={isSelected}
                      className={`w-full py-4 px-5 rounded-xl border-2 transition-all duration-300 text-left flex items-center justify-between group focus:outline-none focus-visible:ring-4 focus-visible:ring-[#00A896]/20 ${
                        isSelected
                          ? 'border-[#00A896] bg-[#E0F5F3] shadow-md'
                          : 'border-[#E8E8E8] bg-white hover:border-gray-300'
                      }`}
                    >
                      <span className={`text-base ${isSelected ? 'text-[#00A896]' : 'text-[#2D3436]'}`}>
                        {state.label}
                      </span>
                      
                      {isSelected ? (
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                          className="w-6 h-6 rounded-full bg-[#00A896] flex items-center justify-center flex-shrink-0 shadow-md"
                        >
                          <Check className="w-4 h-4 text-white" strokeWidth={3} />
                        </motion.div>
                      ) : (
                        <span className="text-sm text-[#666666]">
                          {state.value}
                        </span>
                      )}
                    </motion.button>
                  );
                })}
              </AnimatePresence>
            </div>
            )}
          </div>


        </motion.div>
      </div>
    </div>
  );
}
