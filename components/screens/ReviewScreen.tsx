import React, { useMemo, useState } from 'react';
import ScreenLayout from '../common/ScreenLayout';
// FIX: Import the specific ReviewScreen type and alias it.
import { Screen, Option, Field, ReviewScreen as ReviewScreenType } from '../../types';
import NavigationButtons from '../common/NavigationButtons';
import { buildMedicationHistorySummary } from '../../utils/medicationHistory';

const CUSTOM_LABELS: Record<string, string> = {
  selected_medication: 'Preferred medication',
  selected_plan_name: 'Selected plan',
  selected_plan_price_display: 'Plan price',
  discount_code: 'Discount code',
  notification_consent: 'SMS/email consent',
  dose_strategy: 'Dose strategy preference',
};

interface ReviewScreenProps {
  // FIX: Use the specific ReviewScreenType for the screen prop.
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

const getLabelForId = (id: string, allScreens: Screen[]): { screenId: string, label: string } | null => {
    for (const screen of allScreens) {
        if (screen.id === id) {
            // This case might be for screens that are also fields, like a text screen.
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
}

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
            return answer.map(val => options?.find(o => o.value === val)?.label || val).join(', ');
        }
        return answer.join(', ');
    }
    
    if (options) {
        const option = options.find(o => o.value === answer);
        return option?.label || String(answer);
    }
    
    // special formatting for height
    if (id === 'height_ft' && answers['height_in'] !== undefined) {
      return `${answer}' ${answers['height_in']}"`;
    }
    if (id === 'height_in') return ''; // Handled by height_ft
    
    return String(answer);
}

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
    if (id.startsWith('anthro.') || id === 'goal.range' || ['weight', 'height_ft', 'highest_weight'].includes(id) ) return 'Measurements';
    if (id.startsWith('safety.') || id.startsWith('medical.')) return 'Medical History';
    if (id.startsWith('goals.') || id.startsWith('motivation.')) return 'Goals & Motivation';
    if (id.startsWith('meds.') || id.startsWith('selected_plan') || id === 'selected_medication' || id.startsWith('discount_')) return 'Medication';
    if (id === 'dose_strategy') return 'Medication';
    return 'Other';
};


const ReviewScreen: React.FC<ReviewScreenProps> = ({
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
}) => {
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
    const street =
      address.street ||
      address.line1 ||
      answers.address_line1 ||
      answers.shipping_address ||
      '';
    const city =
      address.locality ||
      address.city ||
      answers.city ||
      answers.shipping_city ||
      '';
    const state =
      address.region ||
      address.state ||
      answers.state ||
      answers.shipping_state ||
      '';
    const postal =
      address.postalCode ||
      address.postal_code ||
      answers.zip_code ||
      answers.shipping_zip ||
      '';

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
    const items: { id: string; label: string; answer: string; screenId: string; }[] = [];
    
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
            screenId: details.screenId
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
    <ScreenLayout title={title} helpText={help_text}>
      <div className="w-full text-left space-y-10 mb-8">
        {groupOrder.map(groupName => {
          const items = summaryItemsByGroup[groupName];
          if (!items || items.length === 0) return null;
          return (
            <div key={groupName}>
              <h3 className="text-sm font-semibold mb-4 pb-3 text-stone-900 border-b border-stone-200 tracking-wider uppercase">
                {groupName}
              </h3>
              <div className="space-y-3">
                {items.map(item => (
                  <div 
                    key={item.id} 
                    className="bg-white rounded-lg p-4 flex justify-between items-center gap-4 transition-all duration-200 border-2 border-stone-200"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium mb-1 text-stone-500">
                        {item.label}
                      </p>
                      <p className="text-base font-semibold break-words text-stone-900">
                        {item.answer}
                      </p>
                    </div>
                    <button
                      onClick={() => goToScreen(item.screenId)}
                      className="text-sm font-semibold hover:underline flex-shrink-0 transition-colors text-primary"
                      aria-label={`Edit ${item.label}`}
                    >
                      Edit
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      {submissionError && (
        <div className="mt-6 text-red-600 text-sm text-center">{submissionError}</div>
      )}
      <NavigationButtons
        showBack={showBack}
        onBack={onBack}
        onNext={handleSubmit}
        nextLabel="Looks Good, Submit"
        isNextLoading={isSubmitting}
      />
      {addressWarning && (
        <div className="mt-4 rounded-2xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-700" role="alert">
          {addressWarning}
        </div>
      )}
    </ScreenLayout>
  );
};

export default ReviewScreen;
