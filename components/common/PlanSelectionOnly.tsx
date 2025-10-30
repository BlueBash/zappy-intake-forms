import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { type PackagePlan, apiClient } from '../../utils/api';
import { Check, TrendingDown, Sparkles, Calendar, Package, Tag } from 'lucide-react';

interface PlanSelectionOnlyProps {
  medication: string;
  selectedPlanId: string;
  onSelect: (planId: string, plan: PackagePlan | null) => void;
  state?: string;
  serviceType?: string;
  pharmacyName?: string;
  selectedPlanGoal?: string;
  onPlanGoalChange?: (value: string) => void;
  shouldShowGoalForPlan?: (plan: PackagePlan) => boolean;
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

const FALLBACK_IMAGE =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="320" height="240"%3E%3Crect width="320" height="240" fill="%23f0f4f8"/%3E%3Cpath d="M40 170h240M70 140l40-56 34 40 44-60 62 76" stroke="%230D9488" stroke-width="12" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="0.35"/%3E%3C/svg%3E';

const uniqueNonEmpty = (values?: Array<string | null | undefined>): string[] => {
  if (!Array.isArray(values)) return [];
  const seen = new Set<string>();
  const result: string[] = [];
  for (const value of values) {
    if (typeof value !== 'string') continue;
    const trimmed = value.trim();
    if (!trimmed) continue;
    if (seen.has(trimmed)) continue;
    seen.add(trimmed);
    result.push(trimmed);
  }
  return result;
};

const PlanImage = ({ src, alt }: { src?: string | null; alt: string }) => (
  <div className="relative w-28 h-28 rounded-xl overflow-hidden border border-white/60 shadow-sm flex-shrink-0 bg-white">
    <img
      src={src || FALLBACK_IMAGE}
      alt={alt}
      className="w-full h-full object-cover"
      loading="lazy"
      onError={(event) => {
        const element = event.target as HTMLImageElement;
        element.src = FALLBACK_IMAGE;
      }}
    />
  </div>
);

export default function PlanSelectionOnly({
  medication,
  selectedPlanId,
  onSelect,
  state = '',
  serviceType = 'Weight Loss',
  pharmacyName = '',
  selectedPlanGoal = '',
  onPlanGoalChange,
  shouldShowGoalForPlan,
}: PlanSelectionOnlyProps) {
  const [plans, setPlans] = useState<PackagePlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPlans = async () => {
      // if (!medication || !state) {
      //   setPlans([]);
      //   return;
      // }

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
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#00A896]"></div>
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

  // if (!medication) {
  //   return (
  //     <div className="text-center py-8 text-neutral-500">
  //       Please select a medication first
  //     </div>
  //   );
  // }

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
        <div className="relative h-48 sm:h-56 bg-gradient-to-br from-[#00A896]/10 to-[#E0F5F3]/10 flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_1px_1px,_#00A896_1px,_transparent_1px)] bg-[length:20px_20px]" />
          <div className="relative z-10 text-center text-white px-6">
            <Package className="w-12 h-12 mx-auto mb-3 opacity-80" />
            <h3 className="text-xl font-semibold mb-1">Professional-Grade Medication</h3>
            <p className="text-sm text-white/90">Delivered directly to your door</p>
          </div>
        </div>
      </motion.div>

      <div className="space-y-4">
        {plans
          .filter((plan) => plan.is_active === true)
          .map((plan, index) => {
            const isSelected = plan.id === selectedPlanId;
            const price = plan.invoice_amount ?? plan.invoiceAmount;
            const planName = plan.name || plan.plan || 'Medication Plan';
            const billingFrequency = plan.plan ? plan.plan : 'Monthly';
            const pharmacy = plan.pharmacy || '';
            const subtitle = plan.medication_subtitle || plan.medication_description || '';
            const imageUrl = plan.image_url;
            const tags = uniqueNonEmpty(plan.tags);
            const primaryTags = tags.slice(0, isSelected ? 3 : 2);
            const extraTags = isSelected ? tags.slice(primaryTags.length) : [];
            const features = uniqueNonEmpty(plan.features);
            const offers = uniqueNonEmpty(plan.offers);
            const displayFeatures = features.slice(0, isSelected ? features.length : 2);
            const monthlyPrice = plan.per_month_price ?? null;
            const discountAmount = typeof plan.discount_amount === 'number' ? plan.discount_amount : null;
            const requiresGoal = typeof shouldShowGoalForPlan === 'function' ? shouldShowGoalForPlan(plan) : false;
            const currentGoal = selectedPlanGoal;

            return (
              <motion.button
                key={plan.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => onSelect(plan.id, plan)}
                className={`relative w-full p-5 rounded-xl border-2 transition-all duration-300 text-left overflow-hidden focus:outline-none focus:ring-2 focus:ring-[#00A896]/40 focus:ring-offset-2 ${
                  isSelected
                    ? 'border-[#00A896] bg-gradient-to-r from-[#00A896]/5 via-white to-[#E0F5F3]/5 shadow-lg'
                    : 'border-gray-200 bg-white hover:border-[#00A896]/40 hover:shadow-md'
                }`}
              >
                {/* Discount Badges */}
                {plan.discount_tag && (
                  <div className="absolute top-0 right-0 overflow-hidden">
                    <div className="relative">
                      <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-gradient-to-r from-[#FF6B6B] to-[#FF9A7F] text-white text-xs flex items-center gap-1 shadow-md">
                        <Sparkles className="w-3 h-3 fill-current" />
                        <span>{plan.discount_tag}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-4 mt-1">
                  <div className="relative">
                    <PlanImage src={imageUrl} alt={planName} />
                    {primaryTags.length > 0 && (
                      <div className="absolute flex flex-wrap gap-1">
                        {primaryTags.map((tagLabel, tagIndex) => (
                          <span
                            key={`${plan.id}-tag-${tagIndex}`}
                            className="mt-3 inline-flex items-center rounded-full bg-[#00A896]/10 border border-[#00A896]/30 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[#00A896] shadow-sm backdrop-blur"
                          >
                            <Tag className="w-3 h-3 mr-1" />
                            {tagLabel}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <h4 className={`text-lg mb-1 transition-colors ${
                      isSelected ? 'text-[#00A896]' : 'text-neutral-900'
                    }`}>
                      {planName}
                    </h4>
                    {subtitle && <p className="text-sm text-neutral-500 mb-1">{subtitle}</p>}
                    <p className="text-sm text-neutral-600 mb-3">
                      {plan.medication && `Professional ${plan.medication} medication`}
                    </p>

                    {/* Billing & Pharmacy Details */}
                    <div className="space-y-1.5 mb-3">
                      <div className="flex items-center gap-2 text-xs text-neutral-600">
                        <Calendar className="w-3.5 h-3.5 text-[#00A896]" />
                        <span>{billingFrequency}</span>
                      </div>
                      {pharmacy && (
                        <div className="flex items-center gap-2 text-xs text-neutral-600">
                          <Package className="w-3.5 h-3.5 text-[#00A896]" />
                          <span>Pharmacy: {pharmacy}</span>
                        </div>
                      )}
                    </div>

                    {/* Discount Badge */}
                    {plan.discount && plan.discount > 0 && (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#FF6B6B]/10 to-[#FF9A7F]/10 border border-[#FF6B6B]/20">
                        <TrendingDown className="w-4 h-4 text-[#FF6B6B]" />
                        <span className="text-sm text-[#FF6B6B]">
                          {plan.discount > 0 && plan.discount < 1 
                            ? `${Math.round(plan.discount * 100)}% off`
                            : formatCurrency(plan.discount)}
                        </span>
                      </div>
                    )}

                    {discountAmount && discountAmount > 0 && (
                      <div className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-[#FF6B6B]/10 px-3 py-1.5 text-xs text-[#FF6B6B] border border-[#FF6B6B]/20">
                        <TrendingDown className="w-3.5 h-3.5" />
                        <span>Save {formatCurrency(discountAmount)}</span>
                      </div>
                    )}

                    {isSelected && requiresGoal && (
                      <div className="mt-4 pt-4 border-t border-[#00A896]/10">
                        <p className="text-sm text-neutral-900 mb-2">Choose your program goal</p>
                        <p className="text-xs text-neutral-600 mb-3">
                          Maintenance keeps your dose steady. Escalation increases it over the program when clinically appropriate.
                        </p>
                        <div className="space-y-2">
                          {[
                            { value: 'maintenance', label: 'Maintenance', desc: 'Keep my dose the same throughout the program' },
                            { value: 'escalation', label: 'Escalation', desc: 'Gradually increase my dose with clinical guidance' },
                          ].map((option) => {
                            const optionSelected = currentGoal === option.value;
                            return (
                              <button
                                key={`${plan.id}-${option.value}`}
                                type="button"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  onPlanGoalChange?.(option.value);
                                }}
                                className={`w-full flex items-start gap-3 p-3 rounded-xl border-2 transition-all duration-200 ${
                                  optionSelected
                                    ? 'border-[#00A896] bg-gradient-to-r from-[#00A896]/5 to-[#E0F5F3]/5'
                                    : 'border-stone-300 hover:border-[#00A896]/50'
                                }`}
                              >
                                <div
                                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                                    optionSelected
                                      ? 'border-[#00A896] bg-gradient-to-br from-[#00A896] to-[#E0F5F3]'
                                      : 'border-stone-300'
                                  }`}
                                >
                                  {optionSelected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                                </div>
                                <div className="text-left flex-1">
                                  <span
                                    className={`text-sm block ${
                                      optionSelected ? 'text-[#00A896]' : 'text-neutral-900'
                                    }`}
                                  >
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

                    {!isSelected && displayFeatures.length > 0 && (
                      <div className="mt-4 space-y-1.5">
                        {displayFeatures.map((feature, idx) => (
                          <div key={`${plan.id}-feature-preview-${idx}`} className="flex items-start gap-2 text-sm text-neutral-600">
                            <div className="w-4 h-4 rounded-full bg-[#00A896]/10 flex items-center justify-center mt-0.5">
                              <Check className="w-2.5 h-2.5 text-[#00A896]" strokeWidth={3} />
                            </div>
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-2 flex-shrink-0 min-w-[120px]">
                    <div className="text-right">
                      <div className={`text-2xl font-bold transition-colors ${
                        isSelected ? 'text-[#00A896]' : 'text-neutral-900'
                      }`}>
                        {formatCurrency(price)}
                      </div>
                      <div className="text-xs text-neutral-500">
                        /month
                        {monthlyPrice && (
                          <span className="ml-1 text-[11px] text-neutral-400">
                            Starter {formatCurrency(monthlyPrice)}
                          </span>
                        )}
                      </div>
                    </div>

                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                        className="w-7 h-7 rounded-full bg-gradient-to-br from-[#00A896] to-[#E0F5F3] flex items-center justify-center shadow-md flex-shrink-0"
                      >
                        <Check className="w-5 h-5 text-white" strokeWidth={3} />
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Features List - Expanded when selected */}
                {isSelected && (features.length > 0 || offers.length > 0) && (
                  <AnimatePresence>
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden mt-4 pt-4 border-t border-[#00A896]/10"
                    >
                      <div className="space-y-4">
                        {extraTags.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-neutral-500 uppercase tracking-wide">Highlights</p>
                            <div className="flex flex-wrap gap-2">
                              {extraTags.map((tagLabel, tagIndex) => (
                                <span
                                  key={`${plan.id}-tag-extra-${tagIndex}`}
                                  className="inline-flex items-center gap-1 rounded-full bg-[#00A896]/10 border border-[#00A896]/20 px-2.5 py-1 text-xs font-medium text-[#00A896]"
                                >
                                  <Tag className="w-3.5 h-3.5" />
                                  {tagLabel}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {features.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-[#00A896] uppercase tracking-wide">What&apos;s included</p>
                            {features.map((feature, idx) => (
                              <motion.div
                                key={`${plan.id}-feature-${idx}`}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="flex items-start gap-2 text-sm text-neutral-700"
                              >
                                <div className="w-4 h-4 rounded-full bg-gradient-to-br from-[#00A896] to-[#E0F5F3] flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                                </div>
                                <span>{feature}</span>
                              </motion.div>
                            ))}
                          </div>
                        )}

                        {offers.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-[#FF6B6B] uppercase tracking-wide">Special perks</p>
                            {offers.map((offer, idx) => (
                              <motion.div
                                key={`${plan.id}-offer-${idx}`}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 + 0.1 }}
                                className="flex items-start gap-2 text-sm text-neutral-700"
                              >
                                <div className="w-4 h-4 rounded-full bg-gradient-to-br from-[#FF6B6B] to-[#FF9A7F] flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <Sparkles className="w-2.5 h-2.5 text-white" />
                                </div>
                                <span>{offer}</span>
                              </motion.div>
                            ))}
                          </div>
                        )}
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
