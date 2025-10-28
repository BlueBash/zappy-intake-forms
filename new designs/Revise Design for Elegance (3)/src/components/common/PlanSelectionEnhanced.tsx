import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { type PackagePlan } from '../../utils/api';
import { Check, Star, TrendingDown, Sparkles, Calendar, Package } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface PlanSelectionEnhancedProps {
  serviceType: string;
  state: string;
  medication: string;
  pharmacyName?: string;
  selectedPlanId: string;
  onSelect: (planId: string, plan: PackagePlan | null) => void;
}

// Available medications
const MEDICATIONS = [
  {
    id: 'semaglutide',
    name: 'Semaglutide',
    description: 'GLP-1 receptor agonist',
    popular: true,
  },
  {
    id: 'tirzepatide',
    name: 'Tirzepatide',
    description: 'Dual GLP-1/GIP receptor agonist',
    popular: false,
  },
];

// Mock plans with savings data
const getPlansByMedication = (medicationId: string): PackagePlan[] => {
  const basePlans = [
    {
      id: `${medicationId}-monthly`,
      name: 'Monthly Plan',
      plan: 'month',
      invoice_amount: 297,
      invoiceAmount: 297,
      medication: medicationId === 'semaglutide' ? 'Semaglutide (Compounded)' : 'Tirzepatide (Compounded)',
      pharmacy: 'Partner Pharmacy Network',
      description: 'Flexible month-to-month option',
      popular: false,
      savings: null,
      savingsPercent: 0,
      billingFrequency: 'Billed every 4 weeks',
      deliveryInfo: 'One vial delivered every month',
    },
    {
      id: `${medicationId}-quarterly`,
      name: '3-Month Plan',
      plan: '3-month',
      invoice_amount: 267,
      invoiceAmount: 267,
      medication: medicationId === 'semaglutide' ? 'Semaglutide (Compounded)' : 'Tirzepatide (Compounded)',
      pharmacy: 'Partner Pharmacy Network',
      description: 'Best balance of value and commitment',
      popular: true,
      savings: 90,
      savingsPercent: 10,
      billingFrequency: 'Billed every 12 weeks',
      deliveryInfo: 'All vials delivered at the same time',
    },
    {
      id: `${medicationId}-annual`,
      name: '12-Month Plan',
      plan: '12-month',
      invoice_amount: 247,
      invoiceAmount: 247,
      medication: medicationId === 'semaglutide' ? 'Semaglutide (Compounded)' : 'Tirzepatide (Compounded)',
      pharmacy: 'Partner Pharmacy Network',
      description: 'Maximum savings with annual commitment',
      popular: false,
      savings: 600,
      savingsPercent: 17,
      billingFrequency: 'Billed annually (every 52 weeks)',
      deliveryInfo: 'All vials delivered at the same time',
    },
  ];

  // Adjust prices for tirzepatide (typically more expensive)
  if (medicationId === 'tirzepatide') {
    return basePlans.map(plan => ({
      ...plan,
      invoice_amount: Math.round((plan.invoice_amount || 0) * 1.3),
      invoiceAmount: Math.round((plan.invoiceAmount || 0) * 1.3),
    }));
  }

  return basePlans;
};

export default function PlanSelectionEnhanced({
  serviceType,
  state,
  medication,
  pharmacyName,
  selectedPlanId,
  onSelect,
}: PlanSelectionEnhancedProps) {
  const [selectedMedication, setSelectedMedication] = useState(medication || 'semaglutide');
  const plans = getPlansByMedication(selectedMedication);

  const formatCurrency = (value?: number) => {
    if (typeof value !== 'number' || Number.isNaN(value)) return '';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: value % 1 === 0 ? 0 : 2,
    }).format(value);
  };

  const handleMedicationChange = (medId: string) => {
    setSelectedMedication(medId);
    // Reset plan selection when medication changes
    onSelect('', null);
  };

  return (
    <div className="space-y-8">
      {/* Image Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-xl"
      >
        <div className="relative h-48 sm:h-56">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1618093970253-002eac767c04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwdmlhbHMlMjBoZWFsdGhjYXJlfGVufDF8fHx8MTc2MTM0Njk5MXww&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Medical vials"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h3 className="text-xl mb-1">Professional-Grade Medication</h3>
            <p className="text-sm text-white/90">Delivered directly to your door</p>
          </div>
        </div>
      </motion.div>

      {/* Step 1: Medication Selection */}
      <div>
        <div className="mb-4">
          <h3 className="text-lg text-neutral-900 mb-1">Step 1: Choose Your Medication</h3>
          <p className="text-sm text-neutral-600">Select the medication that's right for you</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {MEDICATIONS.map((med, index) => {
            const isSelected = selectedMedication === med.id;
            return (
              <motion.button
                key={med.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleMedicationChange(med.id)}
                className={`relative p-4 rounded-xl border-2 transition-all duration-300 text-left overflow-hidden ${
                  isSelected
                    ? 'border-[#0D9488] bg-gradient-to-br from-[#0D9488]/10 to-[#14B8A6]/5 shadow-lg'
                    : 'border-gray-200 bg-white hover:border-[#0D9488]/30 hover:shadow-md'
                }`}
              >
                {med.popular && (
                  <div className="absolute top-2 right-2">
                    <div className="px-2 py-1 rounded-full bg-gradient-to-r from-[#FF7A59] to-[#FF9A7F] text-white text-xs flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current" />
                      <span>Popular</span>
                    </div>
                  </div>
                )}

                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h4 className={`mb-1 ${isSelected ? 'text-[#0D9488]' : 'text-neutral-900'}`}>
                      {med.name}
                    </h4>
                    <p className="text-sm text-neutral-600">{med.description}</p>
                  </div>

                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                      className="w-6 h-6 rounded-full bg-gradient-to-br from-[#0D9488] to-[#14B8A6] flex items-center justify-center shadow-md flex-shrink-0"
                    >
                      <Check className="w-4 h-4 text-white" strokeWidth={3} />
                    </motion.div>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Step 2: Plan Selection */}
      <AnimatePresence mode="wait">
        {selectedMedication && (
          <motion.div
            key={selectedMedication}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-4">
              <h3 className="text-lg text-neutral-900 mb-1">Step 2: Select Your Plan</h3>
              <p className="text-sm text-neutral-600">Choose the plan duration that works best for you</p>
            </div>

            <div className="space-y-3">
              {plans.map((plan, index) => {
                const isSelected = plan.id === selectedPlanId;
                const price = plan.invoice_amount ?? plan.invoiceAmount;

                return (
                  <motion.button
                    key={plan.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => onSelect(plan.id, plan)}
                    className={`relative w-full p-5 rounded-xl border-2 transition-all duration-300 text-left overflow-hidden ${
                      isSelected
                        ? 'border-[#0D9488] bg-gradient-to-r from-[#0D9488]/5 to-[#14B8A6]/5 shadow-lg'
                        : 'border-gray-200 bg-white hover:border-[#0D9488]/40 hover:shadow-md'
                    }`}
                  >
                    {/* Popular Badge */}
                    {plan.popular && (
                      <div className="absolute top-0 right-0 overflow-hidden">
                        <div className="relative">
                          <div className="absolute top-2 right-2 px-3 py-1 rounded-full bg-gradient-to-r from-[#0D9488] to-[#14B8A6] text-white text-xs flex items-center gap-1 shadow-md">
                            <Sparkles className="w-3 h-3 fill-current" />
                            <span>Most Popular</span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-start justify-between gap-4 mt-1">
                      <div className="flex-1">
                        <h4 className={`text-lg mb-1 ${isSelected ? 'text-[#0D9488]' : 'text-neutral-900'}`}>
                          {plan.name}
                        </h4>
                        <p className="text-sm text-neutral-600 mb-3">{plan.description}</p>

                        {/* Billing & Delivery Details */}
                        <div className="space-y-1.5 mb-3">
                          <div className="flex items-center gap-2 text-xs text-neutral-600">
                            <Calendar className="w-3.5 h-3.5 text-[#0D9488]" />
                            <span>{plan.billingFrequency}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-neutral-600">
                            <Package className="w-3.5 h-3.5 text-[#0D9488]" />
                            <span>{plan.deliveryInfo}</span>
                          </div>
                        </div>

                        {/* Savings Badge */}
                        {plan.savings && plan.savings > 0 && (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#FF7A59]/10 to-[#FF9A7F]/10 border border-[#FF7A59]/20">
                            <TrendingDown className="w-4 h-4 text-[#FF7A59]" />
                            <span className="text-sm text-[#FF7A59]">
                              Save {formatCurrency(plan.savings)} ({plan.savingsPercent}%)
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <div className="text-right">
                          <div className={`text-2xl ${isSelected ? 'text-[#0D9488]' : 'text-neutral-900'}`}>
                            {formatCurrency(price)}
                          </div>
                          <div className="text-xs text-neutral-500">per month</div>
                        </div>

                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                            className="w-7 h-7 rounded-full bg-gradient-to-br from-[#0D9488] to-[#14B8A6] flex items-center justify-center shadow-md"
                          >
                            <Check className="w-5 h-5 text-white" strokeWidth={3} />
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
