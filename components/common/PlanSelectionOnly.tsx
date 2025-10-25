import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { type PackagePlan, apiClient } from '../../utils/api';
import { Check, TrendingDown, Sparkles, Calendar, Package } from 'lucide-react';

interface PlanSelectionOnlyProps {
  medication: string;
  selectedPlanId: string;
  onSelect: (planId: string, plan: PackagePlan | null) => void;
  state?: string;
  serviceType?: string;
  pharmacyName?: string;
}

// Helper to format currency values
const formatCurrency = (value?: number) => {
  if (typeof value !== 'number' || Number.isNaN(value)) return '—';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);
};

export default function PlanSelectionOnly({
  medication,
  selectedPlanId,
  onSelect,
  state = '',
  serviceType = 'Weight Loss',
  pharmacyName = '',
}: PlanSelectionOnlyProps) {
  const [plans, setPlans] = useState<PackagePlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPlans = async () => {
      if (!medication || !state) {
        setPlans([]);
        return;
      }

      setLoading(true);
      setError('');

      try {
        const packages = await apiClient.getPackages(state, serviceType, medication, pharmacyName);
        setPlans(packages || []);
      } catch (fetchError) {
        console.error('Error fetching plans:', fetchError);
        setError(fetchError instanceof Error ? fetchError.message : 'Failed to load plans');
        setPlans([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, [medication, state, serviceType, pharmacyName]);

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

  if (!medication) {
    return (
      <div className="text-center py-8 text-neutral-500">
        Please select a medication first
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
      {/* Image Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-xl"
      >
        <div className="relative h-48 sm:h-56 bg-gradient-to-br from-[#0D9488]/10 to-[#14B8A6]/10 flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_1px_1px,_#0D9488_1px,_transparent_1px)] bg-[length:20px_20px]" />
          <div className="relative z-10 text-center text-white px-6">
            <Package className="w-12 h-12 mx-auto mb-3 opacity-80" />
            <h3 className="text-xl font-semibold mb-1">Professional-Grade Medication</h3>
            <p className="text-sm text-white/90">Delivered directly to your door</p>
          </div>
        </div>
      </motion.div>

      <div className="space-y-4">
        {plans.map((plan, index) => {
          const isSelected = plan.id === selectedPlanId;
          const price = plan.invoice_amount ?? plan.invoiceAmount;
          const savingsPercent = (plan as any).savingsPercent || 0;
          const savings = (plan as any).savings || 0;

          return (
            <motion.button
              key={plan.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onSelect(plan.id, plan)}
              className={`relative w-full p-5 rounded-xl border-2 transition-all duration-300 text-left overflow-hidden focus:outline-none focus:ring-2 focus:ring-[#0D9488]/40 focus:ring-offset-2 ${
                isSelected
                  ? 'border-[#0D9488] bg-gradient-to-r from-[#0D9488]/5 via-white to-[#14B8A6]/5 shadow-lg'
                  : 'border-gray-200 bg-white hover:border-[#0D9488]/40 hover:shadow-md'
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute top-0 right-0 overflow-hidden">
                  <div className="relative">
                    <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-gradient-to-r from-[#0D9488] to-[#14B8A6] text-white text-xs flex items-center gap-1 shadow-md">
                      <Sparkles className="w-3 h-3 fill-current" />
                      <span>Most Popular</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-start justify-between gap-4 mt-1">
                <div className="flex-1">
                  <h4 className={`text-lg mb-1 transition-colors ${
                    isSelected ? 'text-[#0D9488]' : 'text-neutral-900'
                  }`}>
                    {plan.name || plan.plan}
                  </h4>
                  <p className="text-sm text-neutral-600 mb-3">
                    {(plan as any).description || plan.description || 'Quality medication plan'}
                  </p>

                  {/* Billing & Delivery Details */}
                  {((plan as any).billingFrequency || (plan as any).deliveryInfo) && (
                    <div className="space-y-1.5 mb-3">
                      {(plan as any).billingFrequency && (
                        <div className="flex items-center gap-2 text-xs text-neutral-600">
                          <Calendar className="w-3.5 h-3.5 text-[#0D9488]" />
                          <span>{(plan as any).billingFrequency}</span>
                        </div>
                      )}
                      {(plan as any).deliveryInfo && (
                        <div className="flex items-center gap-2 text-xs text-neutral-600">
                          <Package className="w-3.5 h-3.5 text-[#0D9488]" />
                          <span>{(plan as any).deliveryInfo}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Savings Badge */}
                  {savings > 0 && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#FF7A59]/10 to-[#FF9A7F]/10 border border-[#FF7A59]/20">
                      <TrendingDown className="w-4 h-4 text-[#FF7A59]" />
                      <span className="text-sm text-[#FF7A59]">
                        Save {formatCurrency(savings)} ({savingsPercent}%)
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <div className="text-right">
                    <div className={`text-2xl font-bold transition-colors ${
                      isSelected ? 'text-[#0D9488]' : 'text-neutral-900'
                    }`}>
                      {formatCurrency(price)}
                    </div>
                    <div className="text-xs text-neutral-500">/month</div>
                  </div>

                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                      className="w-7 h-7 rounded-full bg-gradient-to-br from-[#0D9488] to-[#14B8A6] flex items-center justify-center shadow-md flex-shrink-0"
                    >
                      <Check className="w-5 h-5 text-white" strokeWidth={3} />
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Features List - Expanded when selected */}
              {isSelected && Array.isArray(plan.features) && plan.features.length > 0 && (
                <AnimatePresence>
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden mt-4 pt-4 border-t border-[#0D9488]/10"
                  >
                    <div className="space-y-2">
                      {plan.features.map((feature, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="flex items-start gap-2 text-sm text-neutral-700"
                        >
                          <div className="w-4 h-4 rounded-full bg-gradient-to-br from-[#0D9488] to-[#14B8A6] flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                          </div>
                          <span>{feature}</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
