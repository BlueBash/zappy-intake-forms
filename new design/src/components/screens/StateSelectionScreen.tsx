import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, MapPin, Check } from 'lucide-react';
import { US_STATES } from '../../utils/statesData';
import { useDebounce } from '../hooks/useDebounce';
import ScreenHeader from '../common/ScreenHeader';

interface StateSelectionScreenProps {
  onSelect: (stateCode: string, stateName: string) => void;
  onBack?: () => void;
  selectedState?: string;
  currentStep?: number;
  totalSteps?: number;
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
      <div className="w-full max-w-2xl">
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
          <div className="mb-10 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl sm:text-3xl md:text-4xl text-neutral-900 mb-3 sm:mb-4 leading-snug tracking-tight"
              style={{ letterSpacing: '-0.02em' }}
            >
              Which state do you call home?
            </motion.h1>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for your state..."
                className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-300 bg-white shadow-sm focus:border-[#1a7f72] focus:ring-4 focus:ring-[#1a7f72]/10 outline-none transition-all text-base"
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
                <Search className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                <p className="text-neutral-600 text-base">
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
                      className={`w-full py-4 px-5 rounded-xl border-2 transition-all duration-300 text-left flex items-center justify-between group focus:outline-none focus-visible:ring-4 focus-visible:ring-[#1a7f72]/20 ${
                        isSelected
                          ? 'border-[#1a7f72] bg-[#e6f3f2] shadow-md'
                          : 'border-neutral-200/60 bg-white/40 backdrop-blur-sm hover:border-[#1a7f72]/30 hover:bg-white/60'
                      }`}
                    >
                      <span className={`text-base ${isSelected ? 'text-[#1a7f72]' : 'text-neutral-700'}`}>
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
                        <span className="text-sm text-neutral-400 group-hover:text-[#1a7f72] transition-colors">
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
