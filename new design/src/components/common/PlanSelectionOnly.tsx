import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { type PackagePlan, apiClient } from '../../utils/api';
import { Check, TrendingDown, Sparkles, Calendar, Package } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface PlanSelectionOnlyProps {
  selectedMedication: string;
  selectedPlanId: string;
  onPlanSelect: (planId: string, plan: PackagePlan | null) => void;
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

// Mock plans with savings data (fallback if API fails)
const getMockPlansByMedication = (medicationId: string): PackagePlan[] => {
  // Semaglutide Plans - Lower price point
  if (medicationId === 'semaglutide') {
    return [
      {
        id: 'semaglutide-monthly',
        name: 'Monthly Plan',
        plan: 'month',
        invoice_amount: 297,
        invoiceAmount: 297,
        medication: 'Semaglutide (Compounded)',
        pharmacy: 'Partner Pharmacy Network',
        description: 'Flexible month-to-month option',
        popular: false,
        savings: null,
        savingsPercent: 0,
        billingFrequency: 'Billed every 4 weeks',
        deliveryInfo: 'One vial delivered monthly',
        features: [
          'Cancel anytime',
          'Monthly delivery',
          'No long-term commitment',
          'Full clinical support',
        ],
      },
      {
        id: 'semaglutide-quarterly',
        name: '3-Month Plan',
        plan: '3-month',
        invoice_amount: 267,
        invoiceAmount: 267,
        medication: 'Semaglutide (Compounded)',
        pharmacy: 'Partner Pharmacy Network',
        description: 'Best balance of value and commitment',
        popular: true,
        savings: 90,
        savingsPercent: 10,
        billingFrequency: 'Billed every 12 weeks ($801 per quarter)',
        deliveryInfo: 'Monthly deliveries for 3 months',
        features: [
          'Save $90 vs monthly ($30/mo)',
          'Guaranteed pricing for 3 months',
          'Priority support',
          'Free shipping on all deliveries',
        ],
      },
      {
        id: 'semaglutide-annual',
        name: '12-Month Plan',
        plan: '12-month',
        invoice_amount: 247,
        invoiceAmount: 247,
        medication: 'Semaglutide (Compounded)',
        pharmacy: 'Partner Pharmacy Network',
        description: 'Maximum savings with annual commitment',
        popular: false,
        savings: 600,
        savingsPercent: 17,
        billingFrequency: 'Billed annually ($2,964 per year)',
        deliveryInfo: 'Monthly deliveries for 12 months',
        features: [
          'Save $600 vs monthly ($50/mo)',
          'Locked-in pricing for full year',
          'VIP support & concierge service',
          'Free express shipping',
        ],
      },
    ];
  }

  // Tirzepatide Plans - Higher price point (dual agonist, more potent)
  if (medicationId === 'tirzepatide') {
    return [
      {
        id: 'tirzepatide-monthly',
        name: 'Monthly Plan',
        plan: 'month',
        invoice_amount: 399,
        invoiceAmount: 399,
        medication: 'Tirzepatide (Compounded)',
        pharmacy: 'Partner Pharmacy Network',
        description: 'Flexible month-to-month option',
        popular: false,
        savings: null,
        savingsPercent: 0,
        billingFrequency: 'Billed every 4 weeks',
        deliveryInfo: 'One vial delivered monthly',
        features: [
          'Cancel anytime',
          'Monthly delivery',
          'No long-term commitment',
          'Full clinical support',
        ],
      },
      {
        id: 'tirzepatide-quarterly',
        name: '3-Month Plan',
        plan: '3-month',
        invoice_amount: 359,
        invoiceAmount: 359,
        medication: 'Tirzepatide (Compounded)',
        pharmacy: 'Partner Pharmacy Network',
        description: 'Best balance of value and commitment',
        popular: true,
        savings: 120,
        savingsPercent: 10,
        billingFrequency: 'Billed every 12 weeks ($1,077 per quarter)',
        deliveryInfo: 'Monthly deliveries for 3 months',
        features: [
          'Save $120 vs monthly ($40/mo)',
          'Guaranteed pricing for 3 months',
          'Priority support',
          'Free shipping on all deliveries',
        ],
      },
      {
        id: 'tirzepatide-annual',
        name: '12-Month Plan',
        plan: '12-month',
        invoice_amount: 329,
        invoiceAmount: 329,
        medication: 'Tirzepatide (Compounded)',
        pharmacy: 'Partner Pharmacy Network',
        description: 'Maximum savings with annual commitment',
        popular: false,
        savings: 840,
        savingsPercent: 18,
        billingFrequency: 'Billed annually ($3,948 per year)',
        deliveryInfo: 'Monthly deliveries for 12 months',
        features: [
          'Save $840 vs monthly ($70/mo)',
          'Locked-in pricing for full year',
          'VIP support & concierge service',
          'Free express shipping',
        ],
      },
    ];
  }

  // Default fallback (should not happen with current medications)
  return [
    {
      id: `${medicationId}-monthly`,
      name: 'Monthly Plan',
      plan: 'month',
      invoice_amount: 297,
      invoiceAmount: 297,
      medication: 'Weight Loss Medication',
      pharmacy: 'Partner Pharmacy Network',
      description: 'Flexible month-to-month option',
      popular: false,
      savings: null,
      savingsPercent: 0,
      billingFrequency: 'Billed every 4 weeks',
      deliveryInfo: 'One vial delivered monthly',
      features: [
        'Cancel anytime',
        'Monthly delivery',
        'No long-term commitment',
      ],
    },
  ];
};

export default function PlanSelectionOnly({
  selectedMedication,
  selectedPlanId,
  onPlanSelect,
  state = '',
  serviceType = 'Weight Loss',
  pharmacyName = '',
}: PlanSelectionOnlyProps) {
  const [plans, setPlans] = useState<PackagePlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPlans = async () => {
      if (!selectedMedication) {
        setPlans([]);
        return;
      }

      // If no state provided, use mock data
      if (!state) {
        setPlans(getMockPlansByMedication(selectedMedication));
        return;
      }

      setLoading(true);
      setError('');

      try {
        // Try to fetch plans from API
        const packages = await apiClient.getPackages(state, serviceType, selectedMedication, pharmacyName);
        setPlans(packages || []);
      } catch (fetchError) {
        console.error('Error fetching plans:', fetchError);
        // Fall back to mock data on error
        setPlans(getMockPlansByMedication(selectedMedication));
        setError('');
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, [selectedMedication, state, serviceType, pharmacyName]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#0D9488]"></div>
        <p className="mt-4 text-neutral-600">Loading plans...</p>
      </div>
    );
  }

  if (!selectedMedication) {
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
      {/* Medication Info Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-[#0D9488]/5 to-[#14B8A6]/5 rounded-xl p-5 border border-[#0D9488]/20"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg text-neutral-900 mb-1">
              {selectedMedication === 'semaglutide' ? 'Semaglutide' : 'Tirzepatide'} (Compounded)
            </h3>
            <p className="text-sm text-neutral-600">
              {selectedMedication === 'semaglutide' 
                ? 'Single agonist GLP-1 medication for weight loss'
                : 'Dual agonist GLP-1 + GIP medication for enhanced weight loss'
              }
            </p>
          </div>
          {selectedMedication === 'tirzepatide' && (
            <div className="flex-shrink-0 px-2.5 py-1 rounded-full bg-[#0D9488] text-white text-xs">
              Most Potent
            </div>
          )}
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
              onClick={() => onPlanSelect(plan.id, plan)}
              className={`relative w-full p-5 rounded-xl border-2 transition-all duration-300 text-left overflow-hidden focus:outline-none focus:ring-2 focus:ring-[#1a7f72]/40 focus:ring-offset-2 ${
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
                  <h4 className={`text-xl mb-2 transition-colors ${
                    isSelected ? 'text-[#0D9488]' : 'text-neutral-900'
                  }`}>
                    {plan.name || plan.plan}
                  </h4>
                  <p className="text-base text-neutral-600 mb-3">
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
                    <div className={`text-2xl transition-colors ${
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
