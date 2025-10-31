import { useState } from 'react';
import { motion } from 'motion/react';
import { type PackagePlan } from '../../utils/api';
import { Check } from 'lucide-react';
import { Label } from '../ui/label';

interface PlanSelectionProps {
  serviceType: string;
  state: string;
  medication: string;
  pharmacyName?: string;
  selectedPlanId: string;
  onSelect: (planId: string, plan: PackagePlan | null) => void;
  requiresDoseStrategy?: boolean;
  doseStrategy?: string;
  onDoseStrategyChange?: (value: string) => void;
}

// 🎭 MOCK DATA - Replace API calls with static data for demo
const MOCK_PLANS: PackagePlan[] = [
  {
    id: 'monthly-plan',
    name: 'Monthly Plan',
    plan: 'month',
    invoice_amount: 297,
    invoiceAmount: 297,
    medication: 'Semaglutide (Compounded)',
    pharmacy: 'Partner Pharmacy Network',
    description: 'Pay monthly with flexibility to cancel anytime',
    popular: false,
  },
  {
    id: 'quarterly-plan',
    name: 'Quarterly Plan',
    plan: '3-month',
    invoice_amount: 267,
    invoiceAmount: 267,
    medication: 'Semaglutide (Compounded)',
    pharmacy: 'Partner Pharmacy Network',
    description: 'Save $90 over 3 months - Most Popular',
    popular: true,
  },
  {
    id: 'annual-plan',
    name: 'Annual Plan',
    plan: '12-month',
    invoice_amount: 247,
    invoiceAmount: 247,
    medication: 'Semaglutide (Compounded)',
    pharmacy: 'Partner Pharmacy Network',
    description: 'Best value - Save $600 annually',
    popular: false,
  },
];

export default function PlanSelection({
  serviceType,
  state,
  medication,
  pharmacyName,
  selectedPlanId,
  onSelect,
  requiresDoseStrategy,
  doseStrategy,
  onDoseStrategyChange,
}: PlanSelectionProps) {
  // 🎭 Using mock data instead of API
  const [plans] = useState<PackagePlan[]>(MOCK_PLANS);

  const formatCurrency = (value?: number) => {
    if (typeof value !== 'number' || Number.isNaN(value)) return '';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: value % 1 === 0 ? 0 : 2,
    }).format(value);
  };

  // 🎭 Mock data is always available, so no loading/error states needed

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        {plans.map((plan, index) => {
          const isSelected = plan.id === selectedPlanId;
          const price = plan.invoice_amount ?? plan.invoiceAmount;

          return (
            <motion.button
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onSelect(plan.id, plan)}
              className={`w-full p-5 rounded-xl border-2 transition-all duration-300 text-left ${
                isSelected
                  ? 'border-[#1a7f72] bg-[#e6f3f2] shadow-md'
                  : 'border-gray-200 bg-white hover:border-[#1a7f72]/40 hover:shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className={`text-lg mb-1 ${isSelected ? 'text-[#1a7f72]' : 'text-neutral-900'}`}>
                    {plan.name || plan.plan}
                  </h3>
                  <p className="text-sm text-neutral-600">{plan.medication}</p>
                  {plan.description && (
                    <p className="text-sm text-neutral-500 mt-2">{plan.description}</p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`text-2xl ${isSelected ? 'text-[#1a7f72]' : 'text-neutral-900'}`}>
                    {formatCurrency(price)}
                  </span>
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
              </div>
            </motion.button>
          );
        })}
      </div>

      {requiresDoseStrategy && selectedPlanId && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-6 p-5 bg-white border-2 border-[#0D9488]/20 rounded-xl"
        >
          <Label className="mb-3 text-neutral-900">Dose Strategy Preference</Label>
          <div className="space-y-2">
            {[
              { value: 'titration', label: 'Titration (gradual increase)', description: 'Start with lower doses and gradually increase' },
              { value: 'maintenance', label: 'Maintenance dose', description: 'Start at the target dose' },
            ].map((option) => {
              const isSelected = doseStrategy === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => onDoseStrategyChange?.(option.value)}
                  className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                    isSelected
                      ? 'border-[#0D9488] bg-gradient-to-r from-[#0D9488]/5 to-[#14B8A6]/5'
                      : 'border-gray-200 hover:border-[#0D9488]/30'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className={`font-medium mb-1 ${isSelected ? 'text-[#0D9488]' : 'text-neutral-900'}`}>
                        {option.label}
                      </p>
                      <p className="text-sm text-neutral-600">{option.description}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 transition-all ${
                      isSelected
                        ? 'border-[#0D9488] bg-gradient-to-br from-[#0D9488] to-[#14B8A6]'
                        : 'border-gray-300'
                    }`}>
                      {isSelected && <Check className="w-full h-full p-0.5 text-white" strokeWidth={3} />}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}
