import { motion } from 'framer-motion';
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

export default function PlanSelectionScreen({ screen, answers, updateAnswer, onSubmit, showBack, onBack, defaultCondition }: ScreenProps) {
  const title = 'headline' in screen ? screen.headline : (screen as any).title;
  const helpText = 'body' in screen ? screen.body : (screen as any).help_text;

  const selectedMedication = answers['selected_medication'] || answers['medication_choice'] || '';
  const selectedMedicationName = answers['selected_medication_name'] || selectedMedication || '';
  const selectedPlanId = answers['selected_plan_id'] || '';
  const stateCode = answers['demographics.state'] || answers['shipping_state'] || answers['state'] || '';
  const serviceType = typeof (screen as any)?.service_type === 'string' 
    ? (screen as any).service_type 
    : defaultCondition || 'Weight Loss';
  const pharmacyPreferences = (answers['medication_pharmacy_preferences'] as Record<string, string[]>) || {};
  const selectedPharmacy = pharmacyPreferences[selectedMedication]?.[0] || '';

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
        {selectedMedicationName && (
          <div className="mb-6 p-4 bg-gradient-to-r from-[#0D9488]/5 to-[#14B8A6]/5 rounded-xl border border-[#0D9488]/20">
            <p className="text-sm text-neutral-600">
              Selected Medication: <span className="font-medium text-[#0D9488]">{selectedMedicationName}</span>
            </p>
          </div>
        )}

        <div className="mb-8">
          <PlanSelectionOnly
            medication={selectedMedication}
            selectedPlanId={selectedPlanId}
            onSelect={handlePlanSelect}
            state={stateCode}
            serviceType={serviceType}
            pharmacyName={selectedPharmacy}
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
