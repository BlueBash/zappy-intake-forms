import { motion } from 'motion/react';
import ScreenLayout from '../common/ScreenLayout';
import NavigationButtons from '../common/NavigationButtons';
import PlanSelectionOnly from '../common/PlanSelectionOnly';
import { ScreenProps } from './common';
import type { PackagePlan } from '../../utils/api';

const formatCurrency = (value?: number) => {
  if (typeof value !== 'number' || Number.isNaN(value)) return '';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);
};

export default function PlanSelectionScreen({ screen, answers, updateAnswer, onSubmit, showBack, onBack }: ScreenProps) {
  const title = 'headline' in screen ? screen.headline : (screen as any).title;
  const helpText = 'body' in screen ? screen.body : (screen as any).help_text;

  const selectedMedication = answers['selected_medication'] || answers['medication_choice'] || '';
  const selectedMedicationName = answers['selected_medication_name'] || '';
  const selectedPlanId = answers['selected_plan_id'] || '';

  const handlePlanSelect = (planId: string, plan: PackagePlan | null) => {
    updateAnswer('selected_plan_id', planId);
    updateAnswer('selected_plan', planId);
    if (plan) {
      const price = plan.invoice_amount ?? plan.invoiceAmount;
      updateAnswer('selected_plan_name', plan.name || plan.plan || '');
      updateAnswer('selected_plan_price', price ?? null);
      updateAnswer('selected_plan_price_display', formatCurrency(price));
      updateAnswer('selected_plan_medication', plan.medication || '');
      updateAnswer('selected_plan_pharmacy', plan.pharmacy || '');
      updateAnswer('selected_plan_details', plan);
    } else {
      updateAnswer('selected_plan', '');
      updateAnswer('selected_plan_name', '');
      updateAnswer('selected_plan_price', null);
      updateAnswer('selected_plan_price_display', '');
      updateAnswer('selected_plan_medication', '');
      updateAnswer('selected_plan_pharmacy', '');
      updateAnswer('selected_plan_details', null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <ScreenLayout title={title || 'Select Your Plan'} helpText={helpText}>
        {/* Encouraging message */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-6 p-4 bg-gradient-to-r from-[#0D9488]/5 to-[#14B8A6]/5 rounded-xl border border-[#0D9488]/20"
        >
          <p className="text-base text-neutral-700 text-center">
            🎉 You're almost there! Choose the plan that works best for you.
          </p>
        </motion.div>

        {selectedMedicationName && (
          <div className="mb-6 p-4 bg-white rounded-xl border border-neutral-200">
            <p className="text-sm text-neutral-600">
              Selected Medication: <span className="text-[#0D9488] font-medium">{selectedMedicationName}</span>
            </p>
          </div>
        )}

        <div className="mb-8">
          <PlanSelectionOnly
            medication={selectedMedication}
            selectedPlanId={selectedPlanId}
            onSelect={handlePlanSelect}
          />
        </div>

        <NavigationButtons
          showBack={showBack}
          onBack={onBack}
          onNext={onSubmit}
          isNextDisabled={!selectedPlanId}
        />
      </ScreenLayout>
    </motion.div>
  );
}
