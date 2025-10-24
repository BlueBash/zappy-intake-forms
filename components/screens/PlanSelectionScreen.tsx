import React from 'react';
import { motion } from 'framer-motion';
import ScreenLayout from '../common/ScreenLayout';
import NavigationButtons from '../common/NavigationButtons';
import PlanSelection from '../common/PlanSelection';
import { ScreenProps } from './common';
import type { PackagePlan } from '../../utils/api';

const DEFAULT_SERVICE_TYPE = 'Weight Loss';

const formatCurrency = (value?: number) => {
  if (typeof value !== 'number' || Number.isNaN(value)) return '';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);
};

const MULTI_MONTH_THRESHOLD = 2;

const requiresDoseStrategyForPlan = (plan: PackagePlan | null): boolean => {
  if (!plan) return false;

  // Prefer explicit duration fields if provided by the API.
  const durationFields = [
    (plan as any)?.duration_in_months,
    (plan as any)?.durationInMonths,
    (plan as any)?.durationMonths,
    (plan as any)?.months,
  ];

  const explicitDuration = durationFields.find((value) => value !== undefined && value !== null);
  if (explicitDuration !== undefined) {
    const parsedDuration = Number(explicitDuration);
    if (!Number.isNaN(parsedDuration)) {
      return parsedDuration >= MULTI_MONTH_THRESHOLD;
    }
  }

  const textSources = [plan.plan, plan.name, (plan as any)?.term, (plan as any)?.description]
    .filter((value): value is string => typeof value === 'string' && value.trim().length > 0)
    .map((value) => value.toLowerCase());

  if (textSources.length === 0) return false;

  const includesMonthToMonth = textSources.some((value) => {
    const normalized = value.replace(/[-\u2010-\u2015]/g, ' ');
    return normalized.includes('month to month');
  });

  if (includesMonthToMonth) {
    return false;
  }

  for (const value of textSources) {
    const normalized = value.replace(/[\u2010-\u2015]/g, '-');
    const match = normalized.match(/\b(\d+)\s*(?:-|\s)?\s*month(s)?\b/);
    if (match) {
      const months = Number(match[1]);
      if (!Number.isNaN(months) && months >= MULTI_MONTH_THRESHOLD) {
        return true;
      }
    }
  }

  return false;
};

const PlanSelectionScreen: React.FC<ScreenProps> = ({
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

  const stateCode = answers['shipping_state'] || answers['demographics.state'] || answers['state'] || '';
  const serviceType =
    (screen as any)?.service_type && typeof (screen as any).service_type === 'string'
      ? (screen as any).service_type
      : defaultCondition || DEFAULT_SERVICE_TYPE;
  const selectedMedication = answers['selected_medication'] || '';
  const preferredMedication = answers['preferred_medication'] || '';
  const selectedPlanId = answers['selected_plan_id'] || '';
  const pharmacyPreferences = (answers['medication_pharmacy_preferences'] as Record<string, string[]>) || {};
  const selectedPharmacy = pharmacyPreferences[selectedMedication]?.[0];
  const requiresDoseStrategy = Boolean(answers['plan_requires_dose_strategy']);
  const doseStrategy = answers['dose_strategy'] || '';

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
      const needsDoseStrategy = requiresDoseStrategyForPlan(plan);
      updateAnswer('plan_requires_dose_strategy', needsDoseStrategy);
      updateAnswer('dose_strategy', needsDoseStrategy ? '' : 'maintenance');
    } else {
      updateAnswer('selected_plan', '');
      updateAnswer('selected_plan_name', '');
      updateAnswer('selected_plan_price', null);
      updateAnswer('selected_plan_price_display', '');
      updateAnswer('selected_plan_medication', '');
      updateAnswer('selected_plan_pharmacy', '');
      updateAnswer('selected_plan_details', null);
      updateAnswer('plan_requires_dose_strategy', false);
      updateAnswer('dose_strategy', 'maintenance');
    }
  };

  const handleDoseStrategyChange = (value: string) => {
    updateAnswer('dose_strategy', value);
  };

  const discountCode = answers['discount_code'] || '';

  const handleDiscountCodeChange = (value: string) => {
    updateAnswer('discount_code', value);
  };

  return (
    <ScreenLayout title={title} helpText={helpText}>
      <PlanSelection
        serviceType={serviceType}
        state={stateCode}
        medication={selectedMedication}
        pharmacyName={selectedPharmacy}
        preferredMedication={preferredMedication}
        selectedPlanId={selectedPlanId}
        onSelect={handlePlanSelect}
        requiresDoseStrategy={requiresDoseStrategy}
        doseStrategy={doseStrategy}
        onDoseStrategyChange={handleDoseStrategyChange}
      />

      {/* Inline Discount Code Input - Shows after plan selection */}
      {selectedPlanId && (!requiresDoseStrategy || doseStrategy) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 p-6 rounded-xl bg-gradient-to-r from-gray-50 to-white border border-gray-200"
        >
          <label className="block text-sm font-medium text-neutral-900 mb-2">
            Have a discount code?
          </label>
          <input
            type="text"
            value={discountCode}
            onChange={(e) => handleDiscountCodeChange(e.target.value)}
            placeholder="Enter code (optional)"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
          />
        </motion.div>
      )}

      <NavigationButtons
        showBack={showBack}
        onBack={onBack}
        onNext={onSubmit}
        isNextDisabled={!selectedPlanId || (requiresDoseStrategy && !doseStrategy)}
      />
    </ScreenLayout>
  );
};

export default PlanSelectionScreen;
