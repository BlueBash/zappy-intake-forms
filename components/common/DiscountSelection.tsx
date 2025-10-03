import React, { useState, useEffect } from 'react';
import { apiClient, type Discount } from '../../utils/api';

interface DiscountSelectionProps {
  selectedDiscountId?: string;
  storedDiscount?: Discount | null;
  storedCode?: string;
  onSelect: (discount: Discount | null, code: string) => void;
}

const DiscountSelection: React.FC<DiscountSelectionProps> = ({
  selectedDiscountId = '',
  storedDiscount = null,
  storedCode = '',
  onSelect,
}) => {
  const [discountCode, setDiscountCode] = useState(storedCode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<Discount | null>(storedDiscount);

  useEffect(() => {
    setDiscountCode(storedCode);
    setAppliedDiscount(storedDiscount);
  }, [storedCode, storedDiscount]);

  const handleApplyDiscount = async () => {
    const trimmedCode = discountCode.trim().toUpperCase();
    if (!trimmedCode) {
      setError('Please enter a discount code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await apiClient.applyDiscount(trimmedCode);

      if (response.message === 'Invalid Discount Coupon Code' || !response.discount) {
        setError('Invalid discount code');
        setAppliedDiscount(null);
        onSelect(null, trimmedCode);
        return;
      }

      setAppliedDiscount(response.discount);
      onSelect(response.discount, trimmedCode);
    } catch (applyError) {
      console.error(applyError);
      setError(applyError instanceof Error ? applyError.message : 'Failed to apply discount');
      setAppliedDiscount(null);
      onSelect(null, trimmedCode);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveDiscount = () => {
    setDiscountCode('');
    setAppliedDiscount(null);
    setError('');
    onSelect(null, '');
  };

  return (
    <div className="space-y-6 mt-12">
      <h2 className="text-2xl font-bold text-stone-900 text-center">Apply Discount Code</h2>

      <div className="max-w-lg mx-auto space-y-4">
        {!appliedDiscount && (
          <div className="space-y-2">
            <label htmlFor="discount-code" className="block text-sm font-medium text-stone-700">
              Enter discount code
            </label>
            <div className="flex gap-2">
              <input
                id="discount-code"
                type="text"
                value={discountCode}
                onChange={(event) => {
                  setDiscountCode(event.target.value.toUpperCase());
                  setError('');
                }}
                placeholder="Enter code"
                className="flex-1 px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                disabled={loading}
              />
              <button
                type="button"
                onClick={handleApplyDiscount}
                disabled={loading || !discountCode.trim()}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${
                  loading || !discountCode.trim()
                    ? 'bg-stone-200 text-stone-500 cursor-not-allowed'
                    : 'bg-primary text-white hover:bg-primary/90'
                }`}
              >
                {loading ? 'Applying…' : 'Apply'}
              </button>
            </div>
            {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
          </div>
        )}

        {appliedDiscount && (
          <div className="p-4 bg-emerald-50 border-2 border-emerald-500 rounded-lg">
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2 mb-2">
                  <svg
                    className="w-5 h-5 text-emerald-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-semibold text-emerald-800">Discount applied!</span>
                </div>
                <p className="text-stone-700"><span className="font-medium">Code:</span> {appliedDiscount.code}</p>
                <p className="text-stone-700">
                  <span className="font-medium">Discount:</span>{' '}
                  {appliedDiscount.percentage > 0
                    ? `${appliedDiscount.percentage}% off`
                    : `$${appliedDiscount.amount} off`}
                </p>
                {appliedDiscount.description && (
                  <p className="text-stone-600 text-sm">{appliedDiscount.description}</p>
                )}
              </div>
              <button
                type="button"
                onClick={handleRemoveDiscount}
                className="ml-4 text-red-600 hover:text-red-800 font-medium text-sm"
              >
                Remove
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscountSelection;
