import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Check, Plus, X, ChevronUp } from 'lucide-react';
import { TouchButton } from './TouchButton';
import { InfoTooltip } from './InfoTooltip';

export interface MedicationOption {
  id: string;
  name: string;
  subtitle: string;
  category: string;
  doseOptions?: { value: string; label: string }[];
}

interface MedicationDetails {
  currentlyTaking?: string;
  duration: string;
  lastTaken: string;
  highestDose: string;
  sideEffects?: string;
}

interface MedicationDropdownProps {
  medications: MedicationOption[];
  selectedMedications: string[];
  medicationDetails: Record<string, MedicationDetails>;
  onToggleMedication: (medId: string) => void;
  onUpdateDetail: (medId: string, field: keyof MedicationDetails, value: string) => void;
  categoryLabels?: Record<string, string>;
  maxSelections?: number;
}

/**
 * MedicationDropdown - Redesigned GLP-1 medication selector
 * 
 * Design Features:
 * - Dropdown selector with search/filter
 * - Selected medication cards with expand/collapse
 * - Proper 48px+ touch targets
 * - "Add Another Medication" button
 * - Mobile-optimized with responsive breakpoints
 * - Info tooltips for medical terms
 * 
 * Interaction Flow:
 * 1. Click dropdown → Menu opens
 * 2. Select medication → Card appears below
 * 3. Card shows name + expand icon
 * 4. Click expand → Details slide down
 * 5. Complete details → Can add another
 */
export function MedicationDropdown({
  medications,
  selectedMedications,
  medicationDetails,
  onToggleMedication,
  onUpdateDetail,
  categoryLabels = {},
  maxSelections = 5,
}: MedicationDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedMedId, setExpandedMedId] = useState<string | null>(null);

  // Group medications by category
  const groupedMedications = medications.reduce((acc, med) => {
    if (!acc[med.category]) acc[med.category] = [];
    acc[med.category].push(med);
    return acc;
  }, {} as Record<string, MedicationOption[]>);

  // Filter by search
  const filteredMedications = medications.filter(
    (med) =>
      med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const availableMedications = filteredMedications.filter(
    (med) => !selectedMedications.includes(med.id)
  );

  const canAddMore = selectedMedications.length < maxSelections;

  const handleSelectMedication = (medId: string) => {
    onToggleMedication(medId);
    setIsOpen(false);
    setSearchQuery('');
    setExpandedMedId(medId); // Auto-expand the new selection
  };

  const handleRemoveMedication = (medId: string) => {
    onToggleMedication(medId);
    if (expandedMedId === medId) {
      setExpandedMedId(null);
    }
  };

  const isMedicationComplete = (medId: string): boolean => {
    const details = medicationDetails[medId];
    if (!details) return false;
    return !!(details.duration && details.lastTaken && details.highestDose);
  };

  return (
    <div className="space-y-4">
      {/* Dropdown Selector */}
      {canAddMore && (
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full min-h-[48px] px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-left flex items-center justify-between hover:border-[#1a7f72]/30 focus:outline-none focus:ring-2 focus:ring-[#1a7f72]/40 focus:border-[#1a7f72] transition-all duration-200"
          >
            <span className={selectedMedications.length === 0 ? 'text-neutral-400' : 'text-neutral-700'}>
              {selectedMedications.length === 0
                ? 'Select medication...'
                : `${selectedMedications.length} selected - Add another`}
            </span>
            <ChevronDown
              className={`w-5 h-5 text-neutral-500 transition-transform duration-200 ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-2xl overflow-hidden"
              >
                {/* Search Input */}
                <div className="p-3 border-b border-gray-200">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search medications..."
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a7f72]/40 focus:border-[#1a7f72] transition-all"
                    autoFocus
                  />
                </div>

                {/* Medication List */}
                <div className="max-h-[320px] overflow-y-auto">
                  {availableMedications.length === 0 ? (
                    <div className="p-6 text-center text-neutral-500 text-sm">
                      {searchQuery ? 'No medications found' : 'All medications selected'}
                    </div>
                  ) : (
                    availableMedications.map((med) => (
                      <button
                        key={med.id}
                        onClick={() => handleSelectMedication(med.id)}
                        className="w-full min-h-[56px] px-4 py-3 text-left hover:bg-[#0D9488]/5 border-b border-gray-100 last:border-b-0 transition-colors focus:outline-none focus:bg-[#0D9488]/10"
                      >
                        <div className="font-medium text-neutral-900">{med.name}</div>
                        <div className="text-sm text-neutral-600">{med.subtitle}</div>
                      </button>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Selected Medication Cards */}
      <div className="space-y-3">
        {selectedMedications.map((medId, index) => {
          const medication = medications.find((m) => m.id === medId);
          if (!medication) return null;

          const isExpanded = expandedMedId === medId;
          const isComplete = isMedicationComplete(medId);
          const details = medicationDetails[medId] || {};

          return (
            <motion.div
              key={medId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ delay: index * 0.05 }}
              className={`rounded-xl border-2 transition-all duration-200 ${
                isComplete
                  ? 'border-[#1a7f72] bg-[#e6f3f2]'
                  : 'border-gray-200 bg-white'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-center gap-3 p-4">
                <button
                  onClick={() => setExpandedMedId(isExpanded ? null : medId)}
                  className="flex-1 text-left min-h-[40px] focus:outline-none focus:ring-2 focus:ring-[#1a7f72]/40 rounded-lg px-2 -mx-2"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className={`font-medium ${isComplete ? 'text-[#1a7f72]' : 'text-neutral-900'}`}>
                        {medication.name}
                      </div>
                      <div className="text-sm text-neutral-600">{medication.subtitle}</div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {isComplete && (
                        <Check className="w-5 h-5 text-[#0D9488]" strokeWidth={2.5} />
                      )}
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-[#0D9488]" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-neutral-500" />
                      )}
                    </div>
                  </div>
                </button>

                {/* Remove Button - 48x48px touch target */}
                <button
                  onClick={() => handleRemoveMedication(medId)}
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-red-50 text-neutral-400 hover:text-red-500 transition-all focus:outline-none focus:ring-2 focus:ring-red-500/40"
                  aria-label={`Remove ${medication.name}`}
                >
                  <X className="w-5 h-5" strokeWidth={2.5} />
                </button>
              </div>

              {/* Expanded Details */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 pt-2 space-y-4 border-t border-[#0D9488]/10">
                      {/* Currently Taking */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <label className="text-sm text-neutral-700">
                            Are you currently taking {medication.name}? <span className="text-[#FF7A59]">*</span>
                          </label>
                          <InfoTooltip content="This helps us understand if you're actively using this medication or if you've stopped." />
                        </div>
                        <div className="flex gap-3">
                          <TouchButton
                            onClick={() => onUpdateDetail(medId, 'currentlyTaking', 'yes')}
                            selected={details.currentlyTaking === 'yes'}
                            size="md"
                            fullWidth
                          >
                            Yes
                          </TouchButton>
                          <TouchButton
                            onClick={() => onUpdateDetail(medId, 'currentlyTaking', 'no')}
                            selected={details.currentlyTaking === 'no'}
                            size="md"
                            fullWidth
                          >
                            No
                          </TouchButton>
                        </div>
                      </div>

                      {/* Duration */}
                      {details.currentlyTaking && (
                        <div>
                          <label className="block text-sm text-neutral-700 mb-2">
                            {details.currentlyTaking === 'yes'
                              ? 'How long have you been on it?'
                              : 'How long were you on it?'}{' '}
                            <span className="text-[#FF7A59]">*</span>
                          </label>
                          <input
                            type="text"
                            value={details.duration || ''}
                            onChange={(e) => onUpdateDetail(medId, 'duration', e.target.value)}
                            placeholder="e.g., 6 months, 1 year"
                            className="w-full min-h-[48px] px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a7f72]/40 focus:border-[#1a7f72] transition-all"
                          />
                        </div>
                      )}

                      {/* Last Taken */}
                      {details.currentlyTaking && (
                        <div>
                          <label className="block text-sm text-neutral-700 mb-2">
                            {details.currentlyTaking === 'yes'
                              ? 'When did you last take it?'
                              : 'When did you stop?'}{' '}
                            <span className="text-[#FF7A59]">*</span>
                          </label>
                          <input
                            type="text"
                            value={details.lastTaken || ''}
                            onChange={(e) => onUpdateDetail(medId, 'lastTaken', e.target.value)}
                            placeholder="e.g., Last week, 3 months ago"
                            className="w-full min-h-[48px] px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a7f72]/40 focus:border-[#1a7f72] transition-all"
                          />
                        </div>
                      )}

                      {/* Highest Dose */}
                      {details.currentlyTaking && medication.doseOptions && (
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <label className="text-sm text-neutral-700">
                              Highest dose taken? <span className="text-[#FF7A59]">*</span>
                            </label>
                            <InfoTooltip content="A copy of the prescription will be required to continue doses higher than 0.5 mg." />
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            {medication.doseOptions.map((option) => (
                              <TouchButton
                                key={option.value}
                                onClick={() => onUpdateDetail(medId, 'highestDose', option.value)}
                                selected={details.highestDose === option.value}
                                size="sm"
                                className="text-sm"
                              >
                                {option.label}
                              </TouchButton>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Side Effects (Optional) */}
                      {details.currentlyTaking && (
                        <div>
                          <label className="block text-sm text-neutral-700 mb-2">
                            Any side effects? <span className="text-neutral-500">(optional)</span>
                          </label>
                          <textarea
                            value={details.sideEffects || ''}
                            onChange={(e) => onUpdateDetail(medId, 'sideEffects', e.target.value)}
                            placeholder="e.g., Nausea, constipation, fatigue"
                            rows={3}
                            className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a7f72]/40 focus:border-[#1a7f72] transition-all resize-none"
                          />
                        </div>
                      )}

                      {/* Done Button */}
                      {isComplete && (
                        <div className="flex justify-end pt-2">
                          <TouchButton
                            onClick={() => setExpandedMedId(null)}
                            variant="primary"
                            size="md"
                            className="px-8"
                          >
                            Done
                          </TouchButton>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Add Another Medication Button */}
      {selectedMedications.length > 0 && canAddMore && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => setIsOpen(true)}
          className="w-full min-h-[48px] px-4 py-3 border-2 border-dashed border-[#00A896]/30 bg-[#00A896]/5 hover:bg-[#00A896]/10 text-[#00A896] rounded-xl flex items-center justify-center gap-2 transition-all focus:outline-none focus:ring-2 focus:ring-[#00A896]/40"
        >
          <Plus className="w-5 h-5" strokeWidth={2.5} />
          <span className="font-medium">Add another medication</span>
        </motion.button>
      )}
    </div>
  );
}
