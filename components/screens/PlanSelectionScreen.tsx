import React, { useMemo } from 'react';
import ScreenLayout from '../common/ScreenLayout';
import NavigationButtons from '../common/NavigationButtons';
import PlanSelection from '../common/PlanSelection';
import DiscountSelection from '../common/DiscountSelection';
import { ScreenProps } from './common';
import type { Discount, PackagePlan } from '../../utils/api';

const DEFAULT_CONDITION = 'weight_loss';

const formatCurrency = (value?: number) => {
  if (typeof value !== 'number' || Number.isNaN(value)) return '';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);
};

const PlanSelectionScreen: React.FC<ScreenProps> = ({
  screen,
  answers,
  updateAnswer,
  onSubmit,
  showBack,
  onBack,
}) => {
  const title = 'headline' in screen ? screen.headline : (screen as any).title;
  const helpText = 'body' in screen ? screen.body : (screen as any).help_text;

  const region = answers['shipping_state'] || answers['demographics.state'] || '';
  const condition = answers['condition'] || DEFAULT_CONDITION;
  const selectedMedication = answers['selected_medication'] || '';
  const selectedPlanId = answers['selected_plan_id'] || '';
  const discountData = (answers['discount_data'] as Discount | null) || null;
  const discountCode = answers['discount_code_entered'] || '';

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

  const handleDiscountSelect = (discount: Discount | null, code: string) => {
    updateAnswer('discount_code_entered', code);

    if (discount) {
      updateAnswer('discount_id', discount.id);
      updateAnswer('discount_code', discount.code);
      updateAnswer('discount_amount', discount.amount);
      updateAnswer('discount_percentage', discount.percentage);
      updateAnswer('discount_description', discount.description || '');
      updateAnswer('discount_data', discount);
    } else {
      updateAnswer('discount_id', '');
      updateAnswer('discount_code', '');
      updateAnswer('discount_amount', 0);
      updateAnswer('discount_percentage', 0);
      updateAnswer('discount_description', '');
      updateAnswer('discount_data', null);
    }
  };

  const appliedDiscount = useMemo<Discount | null>(() => {
    if (!discountData) return null;
    return discountData;
  }, [discountData]);

  return (
    <ScreenLayout title={title} helpText={helpText}>
      <PlanSelection
        condition={condition}
        region={region}
        medication={selectedMedication}
        selectedPlanId={selectedPlanId}
        onSelect={handlePlanSelect}
      />

      <DiscountSelection
        selectedDiscountId={answers['discount_id']}
        storedDiscount={appliedDiscount}
        storedCode={discountCode}
        onSelect={handleDiscountSelect}
      />

      <NavigationButtons
        showBack={showBack}
        onBack={onBack}
        onNext={onSubmit}
        isNextDisabled={!selectedPlanId}
      />
    </ScreenLayout>
  );
};

export default PlanSelectionScreen;
