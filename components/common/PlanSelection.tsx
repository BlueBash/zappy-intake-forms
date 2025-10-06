import React, { useEffect, useState } from 'react';
import { apiClient, type PackagePlan } from '../../utils/api';

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

const formatCurrency = (value?: number) => {
  if (typeof value !== 'number' || Number.isNaN(value)) return '—';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);
};

const PlanSelection: React.FC<PlanSelectionProps> = ({
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
  const [plans, setPlans] = useState<PackagePlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPlans = async () => {
      if (!state || !serviceType) {
        setPlans([]);
        return;
      }

      setLoading(true);
      setError('');

      try {
        const packages = await apiClient.getPackages(state, serviceType, medication, pharmacyName);
        setPlans(packages || []);
      } catch (fetchError) {
        console.error(fetchError);
        setError(fetchError instanceof Error ? fetchError.message : 'Failed to load plans');
        setPlans([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, [serviceType, state, medication, pharmacyName]);

  if (!state) {
    return <p className="text-center text-stone-500">Select your state to view available plans.</p>;
  }

  if (loading) {
    return <p className="text-center text-stone-500">Loading plans…</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  if (plans.length === 0) {
    return <p className="text-center text-stone-500">No plans available for your state yet.</p>;
  }

  return (
    <div className="space-y-6">
      {/*<h2 className="text-2xl font-bold text-stone-900 text-center mb-2">Choose your treatment plan</h2>
      <p className="text-stone-600 text-center mb-6">
        Select the plan that best fits your goals and budget.
      </p>
*/}
      <div className="flex gap-6 overflow-x-auto pb-4 px-2">
        {plans.map((plan) => {
          const price = plan.invoice_amount ?? plan.invoiceAmount;
          const isSelected = selectedPlanId === plan.id;
          const showDoseStrategy = isSelected && requiresDoseStrategy;

          return (
            <div
              role="button"
              tabIndex={0}
              key={plan.id}
              onClick={() => onSelect(plan.id, plan)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  onSelect(plan.id, plan);
                }
              }}
              className={`relative rounded-2xl p-6 text-left transition-all min-w-[280px] max-w-[320px] flex-1 border-2 cursor-pointer select-none ${
                isSelected
                  ? 'bg-primary/5 border-primary shadow-lg'
                  : 'bg-white border-stone-200 hover:border-primary hover:shadow'
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white px-3 py-1 rounded-full text-xs font-semibold">
                  Most popular
                </span>
              )}
              <div className="text-center mb-4">
                <h3 className="text-xl font-bold text-stone-900 mb-2">{plan.name || plan.plan || 'Plan'}</h3>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-3xl font-bold text-primary">{formatCurrency(price)}</span>
                  {plan.plan && <span className="text-stone-500 text-sm">{plan.plan}</span>}
                </div>
                {plan.medication && (
                  <p className="text-stone-600 text-sm mt-2">Medication: {plan.medication}</p>
                )}
                {plan.pharmacy && (
                  <p className="text-stone-600 text-sm">Pharmacy: {plan.pharmacy}</p>
                )}
              </div>

              {Array.isArray(plan.features) && plan.features.length > 0 && (
                <ul className="space-y-1 text-sm text-stone-600 mb-4">
                  {plan.features.map((feature, index) => (
                    <li key={`${plan.id}-feature-${index}`} className="flex items-start gap-2">
                      <svg
                        className="w-4 h-4 text-emerald-500 mt-1 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              )}

              {showDoseStrategy && (
                <div className="mt-4 space-y-2 text-left">
                  <p className="text-sm font-medium text-stone-700">
                    How should we manage your dose during this program?
                  </p>
                  <p className="text-xs text-stone-500">
                    Maintenance keeps your dose steady each month. Escalation increases the dose each month when clinically appropriate.
                  </p>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="dose-strategy"
                      value="maintenance"
                      checked={doseStrategy === 'maintenance'}
                      onChange={() => onDoseStrategyChange('maintenance')}
                      className="w-4 h-4 text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-stone-700">Maintenance – keep my dose the same each month</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="dose-strategy"
                      value="escalation"
                      checked={doseStrategy === 'escalation'}
                      onChange={() => onDoseStrategyChange('escalation')}
                      className="w-4 h-4 text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-stone-700">Escalation – increase my dose each month as appropriate</span>
                  </label>
                </div>
              )}

              <div className="mt-6">
                <span
                  className={`block w-full text-center py-3 rounded-full font-semibold transition-colors ${
                    isSelected ? 'bg-primary text-white' : 'bg-stone-100 text-stone-700'
                  }`}
                >
                  {isSelected ? 'Selected ✓' : 'Select plan'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlanSelection;
