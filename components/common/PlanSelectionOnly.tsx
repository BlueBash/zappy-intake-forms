import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check, CheckCircle2, Sparkles } from 'lucide-react';
import { apiClient, type PackagePlan } from '../../utils/api';

interface PlanSelectionOnlyProps {
  medication: string;
  selectedPlanId: string;
  onSelect: (planId: string, plan: PackagePlan | null) => void;
  state?: string;
  serviceType?: string;
  pharmacyName?: string;
}

const formatCurrency = (value?: number) => {
  if (typeof value !== 'number' || Number.isNaN(value)) return '—';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);
};

const PlanSelectionOnly: React.FC<PlanSelectionOnlyProps> = ({
  medication,
  selectedPlanId,
  onSelect,
  state = '',
  serviceType = 'Weight Loss',
  pharmacyName = '',
}) => {
  const [plans, setPlans] = useState<PackagePlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [expandedPlanId, setExpandedPlanId] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      if (!medication || !state) {
        setPlans([]);
        return;
      }

      setLoading(true);
      setError('');

      try {
        // Fetch plans from API
        const packages = await apiClient.getPackages(state, serviceType, medication, pharmacyName);
        
        if (packages && packages.length > 0) {
          setPlans(packages);
        } else {
          // Fallback to mock plans if API returns empty
          const mockPlans: PackagePlan[] = [
          {
            id: '1-month',
            name: '1 Month Supply',
            plan: '1 Month Supply',
            invoice_amount: 299,
            invoiceAmount: 299,
            medication: medication,
            pharmacy: 'Multiple Available',
            popular: false,
            features: [
              'Monthly medication supply',
              'Provider consultation included',
              'Ongoing support',
              'Cancel anytime'
            ]
          },
          {
            id: '3-month',
            name: '3 Month Supply',
            plan: '3 Month Supply',
            invoice_amount: 849,
            invoiceAmount: 849,
            medication: medication,
            pharmacy: 'Multiple Available',
            popular: true,
            features: [
              '3 months of medication',
              'Save 5% vs monthly',
              'Provider consultation included',
              'Priority support',
              'Free shipping'
            ]
          },
          {
            id: '6-month',
            name: '6 Month Supply',
            plan: '6 Month Supply',
            invoice_amount: 1599,
            invoiceAmount: 1599,
            medication: medication,
            pharmacy: 'Multiple Available',
            popular: false,
            features: [
              '6 months of medication',
              'Save 10% vs monthly',
              'Provider consultation included',
              'Premium support',
              'Free priority shipping',
              'Best value'
            ]
          }
          ];
          setPlans(mockPlans);
        }
      } catch (fetchError) {
        console.error(fetchError);
        setError(fetchError instanceof Error ? fetchError.message : 'Failed to load plans');
        setPlans([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, [medication, state, serviceType, pharmacyName]);

  const handlePlanClick = (planId: string) => {
    setExpandedPlanId(expandedPlanId === planId ? null : planId);
  };

  const handleSelectPlan = (planId: string, plan: PackagePlan) => {
    onSelect(planId, plan);
    setExpandedPlanId(null); // Collapse after selection
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#0D9488]"></div>
        <p className="mt-4 text-neutral-600">Loading plans...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 px-6">
        <div className="max-w-md mx-auto p-6 rounded-xl bg-red-50 border border-red-200">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-500">No plans available yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      {selectedPlanId && (
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
      )}

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((plan, index) => {
          const price = plan.invoice_amount ?? plan.invoiceAmount;
          const isSelected = selectedPlanId === plan.id;
          const isExpanded = expandedPlanId === plan.id;

          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08, duration: 0.4 }}
              className={`relative rounded-xl border-2 transition-all duration-300 overflow-hidden ${
                isSelected
                  ? 'border-[#0D9488] bg-gradient-to-br from-[#0D9488]/5 via-white to-[#14B8A6]/5 shadow-xl'
                  : 'border-gray-300 bg-white hover:border-[#0D9488]/50 hover:shadow-lg'
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-[#FF7A59] to-[#FF6B4A] text-white px-4 py-1.5 rounded-bl-xl rounded-tr-xl text-xs font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Most Popular
                </div>
              )}

              {/* Card Header */}
              <button
                onClick={() => handlePlanClick(plan.id)}
                className="w-full p-6 text-left focus:outline-none transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className={`text-lg font-medium mb-2 transition-colors ${
                      isSelected ? 'text-[#0D9488]' : 'text-neutral-900'
                    }`}>
                      {plan.name || plan.plan}
                    </h3>
                    <div className="flex items-baseline gap-1 mb-3">
                      <span className={`text-3xl font-bold transition-colors ${
                        isSelected ? 'text-[#0D9488]' : 'text-neutral-900'
                      }`}>
                        {formatCurrency(price)}
                      </span>
                      <span className="text-sm text-neutral-500">/total</span>
                    </div>
                    {!isExpanded && (
                      <p className="text-sm text-neutral-600">{plan.medication}</p>
                    )}
                  </div>

                  {/* Status Icons */}
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
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className={`p-2 rounded-lg transition-all ${
                        isExpanded 
                          ? 'bg-[#0D9488]/10' 
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      <ChevronDown className={`w-5 h-5 transition-colors ${
                        isExpanded ? 'text-[#0D9488]' : 'text-neutral-600'
                      }`} />
                    </motion.div>
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
                      {/* Details */}
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <span className="text-sm text-neutral-500 min-w-[80px]">Medication:</span>
                          <span className="text-sm text-neutral-900">{plan.medication}</span>
                        </div>
                        {plan.pharmacy && (
                          <div className="flex items-start gap-2">
                            <span className="text-sm text-neutral-500 min-w-[80px]">Pharmacy:</span>
                            <span className="text-sm text-neutral-900">{plan.pharmacy}</span>
                          </div>
                        )}
                      </div>

                      {/* Features */}
                      {Array.isArray(plan.features) && plan.features.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-neutral-900 mb-3">What's included:</p>
                          <ul className="space-y-2">
                            {plan.features.map((feature, idx) => (
                              <motion.li
                                key={idx}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="flex items-start gap-2 text-sm text-neutral-700"
                              >
                                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#0D9488] to-[#14B8A6] flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <Check className="w-3 h-3 text-white" strokeWidth={3} />
                                </div>
                                <span>{feature}</span>
                              </motion.li>
                            ))}
                          </ul>
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
                        className={`w-full py-3 rounded-xl font-medium transition-all duration-300 shadow-md hover:shadow-lg ${
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

export default PlanSelectionOnly;
