import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronUp, Check, CheckCircle2, Sparkles } from 'lucide-react';
import { type PackagePlan } from '../../utils/api';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface PlanSelectionProps {
  serviceType: string;
  state: string;
  medication?: string;
  pharmacyName?: string;
  selectedPlanId: string;
  onSelect: (planId: string, plan: PackagePlan | null) => void;
  requiresDoseStrategy: boolean;
  doseStrategy: string;
  onDoseStrategyChange: (value: string) => void;
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
    features: [
      'Monthly medication supply',
      'Virtual provider consultations',
      'Personalized treatment plan',
      'Ongoing support & monitoring',
      'Free shipping',
    ],
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
    features: [
      '3-month medication supply',
      'Save $90 vs monthly',
      'Virtual provider consultations',
      'Personalized treatment plan',
      'Priority customer support',
      'Ongoing support & monitoring',
      'Free shipping',
    ],
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
    features: [
      '12-month medication supply',
      'Save $600 vs monthly',
      'Best value - lowest price',
      'Virtual provider consultations',
      'Personalized treatment plan',
      'VIP priority support',
      'Quarterly health check-ins',
      'Ongoing support & monitoring',
      'Free expedited shipping',
    ],
    popular: false,
  },
];

const formatCurrency = (value?: number) => {
  if (typeof value !== 'number' || Number.isNaN(value)) return '—';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);
};

const PlanSelectionExpanded: React.FC<PlanSelectionProps> = ({
  serviceType,
  state,
  medication,
  pharmacyName,
  selectedPlanId,
  onSelect,
  requiresDoseStrategy,
  doseStrategy,
  onDoseStrategyChange,
}) => {
  // 🎭 Using mock data instead of API
  const [plans] = useState<PackagePlan[]>(MOCK_PLANS);
  const [expandedPlanId, setExpandedPlanId] = useState<string | null>(null);

  const handlePlanClick = (planId: string) => {
    // Auto-expand when clicking a plan
    setExpandedPlanId(planId);
  };

  const handleSelectPlan = (planId: string, plan: PackagePlan) => {
    onSelect(planId, plan);
    // Keep expanded to show selection confirmation
  };

  // 🎭 Mock data is always available, so no loading/error states needed

  return (
    <div className="space-y-6">
      {/* Header */}
      {selectedPlanId ? (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#0D9488]/10 via-[#FF7A59]/10 to-[#0D9488]/10 border border-[#0D9488]/20">
            <CheckCircle2 className="w-4 h-4 text-[#0D9488]" />
            <span className="text-sm text-neutral-700">Plan selected</span>
          </div>
        </motion.div>
      ) : (
        <div className="text-sm text-neutral-500">Choose the best plan for you</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {plans.map((plan, index) => {
          const price = plan.invoice_amount ?? plan.invoiceAmount;
          const isSelected = selectedPlanId === plan.id;
          const isExpanded = expandedPlanId === plan.id;
          const showDoseStrategy = isSelected && requiresDoseStrategy;

          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08, duration: 0.4 }}
              layout
              className={`relative rounded-2xl border-2 transition-all duration-300 overflow-hidden ${
                isSelected
                  ? 'border-[#0D9488] bg-gradient-to-br from-[#0D9488]/5 via-white to-[#14B8A6]/5 shadow-xl'
                  : 'border-gray-200 bg-white hover:border-[#0D9488]/30 hover:shadow-lg'
              }`}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-[#FF7A59] to-[#FF6B4A] text-white px-4 py-1.5 rounded-bl-xl rounded-tr-xl text-xs font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Most Popular
                </div>
              )}

              {/* Collapsed Header */}
              <button
                onClick={() => handlePlanClick(plan.id)}
                className="w-full p-6 text-left focus:outline-none focus:ring-2 focus:ring-[#1a7f72]/40 focus:ring-offset-2 rounded-2xl transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className={`text-lg mb-2 transition-colors ${
                      isSelected ? 'text-[#0D9488]' : 'text-neutral-900'
                    }`}>
                      {plan.name || plan.plan || 'Plan'}
                    </h3>
                    <div className="flex items-baseline gap-2 mb-3">
                      <span className={`text-3xl transition-colors ${
                        isSelected ? 'text-[#0D9488]' : 'text-neutral-900'
                      }`}>
                        {formatCurrency(price)}
                      </span>
                      {plan.plan && (
                        <span className="text-sm text-neutral-500">/ {plan.plan}</span>
                      )}
                    </div>
                    {!isExpanded && plan.medication && (
                      <p className="text-sm text-neutral-600 truncate">{plan.medication}</p>
                    )}
                  </div>

                  {/* Status indicators */}
                  <div className="flex flex-col items-end gap-2">
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                        className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0D9488] to-[#14B8A6] flex items-center justify-center shadow-lg"
                      >
                        <Check className="w-5 h-5 text-white" strokeWidth={3} />
                      </motion.div>
                    )}
                    <div className={`p-2 rounded-lg transition-all ${
                      isExpanded 
                        ? 'bg-[#0D9488]/10 rotate-180' 
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}>
                      <ChevronDown className={`w-5 h-5 transition-colors ${
                        isExpanded ? 'text-[#0D9488]' : 'text-neutral-600'
                      }`} />
                    </div>
                  </div>
                </div>
              </button>

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
                    <div className="px-6 pb-6 pt-2 space-y-4 border-t border-[#0D9488]/10">
                      {/* Medication Image */}
                      <div className="rounded-xl overflow-hidden bg-gradient-to-br from-[#0D9488]/5 to-[#14B8A6]/5 p-4">
                        <ImageWithFallback 
                          src="https://images.unsplash.com/photo-1593491034932-844ab981ed7c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwdmlhbCUyMG1lZGljYXRpb258ZW58MXx8fHwxNzYxMzMxNTIxfDA&ixlib=rb-4.1.0&q=80&w=1080"
                          alt="Medication"
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      </div>

                      {/* Medication Info */}
                      {plan.medication && (
                        <div className="text-center py-2">
                          <p className="text-sm text-neutral-900">{plan.medication}</p>
                          {plan.pharmacy && (
                            <p className="text-xs text-neutral-500 mt-1">{plan.pharmacy}</p>
                          )}
                        </div>
                      )}

                      {/* Simple Features List */}
                      {Array.isArray(plan.features) && plan.features.length > 0 && (
                        <ul className="space-y-2">
                          {plan.features.slice(0, 4).map((feature, idx) => (
                            <li
                              key={`${plan.id}-feature-${idx}`}
                              className="flex items-center gap-2 text-sm text-neutral-700"
                            >
                              <Check className="w-4 h-4 text-[#0D9488] flex-shrink-0" strokeWidth={2.5} />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {/* Dose Strategy Selection */}
                      {showDoseStrategy && (
                        <div className="pt-4 border-t border-[#0D9488]/10">
                          <p className="text-sm text-neutral-900 mb-2">
                            How should we manage your dose?
                          </p>
                          <p className="text-xs text-neutral-600 mb-3">
                            Maintenance keeps your dose steady. Escalation increases when clinically appropriate.
                          </p>
                          <div className="space-y-2">
                            {[
                              { value: 'maintenance', label: 'Maintenance', desc: 'Keep my dose the same each month' },
                              { value: 'escalation', label: 'Escalation', desc: 'Increase my dose each month as appropriate' },
                            ].map((option) => {
                              const isStrategySelected = doseStrategy === option.value;
                              return (
                                <button
                                  key={option.value}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onDoseStrategyChange(option.value);
                                  }}
                                  className={`w-full flex items-start gap-3 p-3 rounded-xl border-2 transition-all duration-200 ${
                                    isStrategySelected
                                      ? 'border-[#0D9488] bg-gradient-to-r from-[#0D9488]/5 to-[#14B8A6]/5'
                                      : 'border-gray-200 hover:border-[#0D9488]/30'
                                  }`}
                                >
                                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                                    isStrategySelected
                                      ? 'border-[#0D9488] bg-gradient-to-br from-[#0D9488] to-[#14B8A6]'
                                      : 'border-gray-300'
                                  }`}>
                                    {isStrategySelected && (
                                      <Check className="w-3 h-3 text-white" strokeWidth={3} />
                                    )}
                                  </div>
                                  <div className="text-left flex-1">
                                    <span className={`text-sm block ${
                                      isStrategySelected ? 'text-[#0D9488]' : 'text-neutral-900'
                                    }`}>
                                      {option.label}
                                    </span>
                                    <span className="text-xs text-neutral-600">{option.desc}</span>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Select Button */}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectPlan(plan.id, plan);
                        }}
                        className={`w-full py-3 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg ${
                          isSelected
                            ? 'bg-gradient-to-r from-[#0D9488] to-[#14B8A6] text-white'
                            : 'bg-gradient-to-r from-gray-100 to-gray-200 text-neutral-700 hover:from-gray-200 hover:to-gray-300'
                        }`}
                      >
                        <span className="inline-flex items-center gap-2">
                          {isSelected && <Check className="w-4 h-4" strokeWidth={3} />}
                          {isSelected ? 'Selected' : 'Select this plan'}
                        </span>
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default PlanSelectionExpanded;
