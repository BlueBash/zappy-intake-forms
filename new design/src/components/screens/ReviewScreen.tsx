import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import ScreenLayout from '../common/ScreenLayout';
import { Screen, Option, ReviewScreen as ReviewScreenType } from '../../types';
import NavigationButtons from '../common/NavigationButtons';
import { buildMedicationHistorySummary } from '../../utils/medicationHistory';
import { Edit2, AlertCircle } from 'lucide-react';

const CUSTOM_LABELS: Record<string, string> = {
  selected_medication: 'Preferred medication',
  selected_plan_name: 'Selected plan',
  selected_plan_price_display: 'Plan price',
  discount_code: 'Discount code',
  notification_consent: 'SMS/email consent',
  dose_strategy: 'Dose strategy preference',
};

interface ReviewScreenProps {
  screen: ReviewScreenType;
  answers: Record<string, any>;
  onSubmit: () => void;
  allScreens: Screen[];
  providerFields: string[];
  goToScreen: (screenId: string) => void;
  showBack: boolean;
  onBack: () => void;
  isSubmitting?: boolean;
  submissionError?: string | null;
}

const getLabelForId = (id: string, allScreens: Screen[]): { screenId: string; label: string } | null => {
  for (const screen of allScreens) {
    if (screen.id === id) {
      if ('title' in screen && screen.title) {
        return { screenId: screen.id, label: screen.title };
      }
    }
    if ('fields' in screen && screen.fields) {
      for (const field of screen.fields.flat()) {
        if (field.id === id) {
          return { screenId: screen.id, label: field.label || id };
        }
      }
    }
  }
  if (CUSTOM_LABELS[id]) {
    return { screenId: 'treatment.plan_selection', label: CUSTOM_LABELS[id] };
  }
  return null;
};

const formatAnswer = (answer: any, id: string, allScreens: Screen[], answers: Record<string, any>): string => {
  if (answer === undefined || answer === null || answer === '' || (Array.isArray(answer) && answer.length === 0)) {
    return 'Not answered';
  }
  if (typeof answer === 'boolean') {
    return answer ? 'Yes' : 'No';
  }

  let options: Option[] | undefined;

  searchLoop: for (const screen of allScreens) {
    if (screen.id === id && 'options' in screen && screen.options) {
      options = screen.options;
      break;
    }
    if ('fields' in screen && screen.fields) {
      for (const field of screen.fields.flat()) {
        if (field.id === id && 'options' in field && field.options) {
          options = field.options;
          break searchLoop;
        }
      }
    }
  }

  if (Array.isArray(answer)) {
    if (options) {
      return answer.map((val) => options?.find((o) => o.value === val)?.label || val).join(', ');
    }
    return answer.join(', ');
  }

  if (options) {
    const option = options.find((o) => o.value === answer);
    return option?.label || String(answer);
  }

  if (id === 'height_ft' && answers['height_in'] !== undefined) {
    return `${answer}' ${answers['height_in']}"`;
  }
  if (id === 'height_in') return '';

  return String(answer);
};

const groupOrder = ['Your Details', 'Measurements', 'Medical History', 'Goals & Motivation', 'Medication'];

const getGroup = (id: string): string => {
  if (
    id.startsWith('demographics.') ||
    id.startsWith('contact.') ||
    id === 'email' ||
    id === 'password' ||
    id === 'notification_consent' ||
    ['address_line1', 'address_line2', 'city', 'state', 'zip_code'].includes(id)
  ) {
    return 'Your Details';
  }
  if (id.startsWith('anthro.') || id === 'goal.range' || ['weight', 'height_ft', 'highest_weight'].includes(id)) return 'Measurements';
  if (id.startsWith('safety.') || id.startsWith('medical.')) return 'Medical History';
  if (id.startsWith('goals.') || id.startsWith('motivation.')) return 'Goals & Motivation';
  if (id.startsWith('meds.') || id.startsWith('selected_plan') || id === 'selected_medication' || id.startsWith('discount_')) return 'Medication';
  if (id === 'dose_strategy') return 'Medication';
  return 'Other';
};

export default function ReviewScreen({
  screen,
  answers,
  onSubmit,
  allScreens,
  providerFields,
  goToScreen,
  showBack,
  onBack,
  isSubmitting = false,
  submissionError = null,
}: ReviewScreenProps) {
  const { title, help_text } = screen;
  const [addressWarning, setAddressWarning] = useState<string | null>(null);

  const displayAnswers = useMemo(() => {
    const next = { ...answers };
    const { selectedMedications, currentlyTaking } = buildMedicationHistorySummary(answers);

    if (selectedMedications.length > 0) {
      next.medications_used = selectedMedications;
    } else {
      next.medications_used = 'None';
    }

    next.currently_taking = currentlyTaking.length > 0 ? currentlyTaking : 'None';

    return next;
  }, [answers]);

  const fullAddressMissing = useMemo(() => {
    const address = answers.address || {};
    const street = address.street || address.line1 || answers.address_line1 || answers.shipping_address || '';
    const city = address.locality || address.city || answers.city || answers.shipping_city || '';
    const state = address.region || address.state || answers.state || answers.shipping_state || '';
    const postal = address.postalCode || address.postal_code || answers.zip_code || answers.shipping_zip || '';

    const missingLabels: string[] = [];
    if (!street || (typeof street === 'string' && street.trim().length === 0)) missingLabels.push('Street address');
    if (!city || (typeof city === 'string' && city.trim().length === 0)) missingLabels.push('City');
    if (!state || (typeof state === 'string' && state.trim().length === 0)) missingLabels.push('State');
    if (!postal || (typeof postal === 'string' && postal.trim().length === 0)) missingLabels.push('ZIP code');

    return {
      isMissing: missingLabels.length > 0,
      missingLabels,
    };
  }, [
    answers.address,
    answers.address_line1,
    answers.city,
    answers.state,
    answers.zip_code,
    answers.shipping_address,
    answers.shipping_city,
    answers.shipping_state,
    answers.shipping_zip,
  ]);

  const handleSubmit = () => {
    if (fullAddressMissing.isMissing) {
      setAddressWarning(
        `Please complete your address before submitting: ${fullAddressMissing.missingLabels.join(', ')}.`
      );
      goToScreen('logistics.shipping_address');
      return;
    }

    setAddressWarning(null);
    onSubmit();
  };

  const summaryItemsByGroup = useMemo(() => {
    const items: { id: string; label: string; answer: string; screenId: string }[] = [];

    for (const id of providerFields) {
      if (displayAnswers[id] === undefined) continue;

      const details = getLabelForId(id, allScreens);
      if (!details) continue;

      const answer = formatAnswer(displayAnswers[id], id, allScreens, displayAnswers);
      if (answer === '') continue;

      items.push({
        id,
        label: details.label,
        answer,
        screenId: details.screenId,
      });
    }

    const grouped: Record<string, typeof items> = {};
    for (const item of items) {
      const groupName = getGroup(item.id);
      if (!grouped[groupName]) {
        grouped[groupName] = [];
      }
      grouped[groupName].push(item);
    }

    return grouped;
  }, [providerFields, allScreens, displayAnswers]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <ScreenLayout title={title || ''} helpText={help_text}>
        <div className="w-full text-left space-y-10 mb-8">
          {groupOrder.map((groupName) => {
            const items = summaryItemsByGroup[groupName];
            if (!items || items.length === 0) return null;
            return (
              <motion.div
                key={groupName}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h3 className="text-sm mb-4 pb-3 text-neutral-600 border-b border-gray-200 tracking-wider uppercase">
                  {groupName}
                </h3>
                <div className="space-y-3">
                  {items.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 + index * 0.05 }}
                      className="bg-white rounded-xl p-4 flex justify-between items-center gap-4 transition-all duration-200 border-2 border-gray-200 hover:border-[#0D9488]/30 hover:shadow-sm"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm mb-1 text-neutral-500">{item.label}</p>
                        <p className="text-base break-words text-neutral-900">{item.answer}</p>
                      </div>
                      <button
                        onClick={() => goToScreen(item.screenId)}
                        className="flex items-center gap-1 text-sm text-[#0D9488] hover:text-[#0F766E] transition-colors flex-shrink-0"
                        aria-label={`Edit ${item.label}`}
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {submissionError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 rounded-xl border-2 border-red-200 bg-red-50 text-sm text-red-600 flex items-start gap-2"
            role="alert"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{submissionError}</span>
          </motion.div>
        )}

        <NavigationButtons
          showBack={showBack}
          onBack={onBack}
          onNext={handleSubmit}
          nextLabel="Looks Good, Submit"
          isNextLoading={isSubmitting}
        />

        {addressWarning && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 rounded-xl border-2 border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-700 flex items-start gap-2"
            role="alert"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{addressWarning}</span>
          </motion.div>
        )}
      </ScreenLayout>
    </motion.div>
  );
}
