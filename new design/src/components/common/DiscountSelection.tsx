import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { apiClient, type Discount } from '../../utils/api';
import { Loader2, CheckCircle, XCircle, Tag } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';

interface DiscountSelectionProps {
  selectedDiscountId: string;
  storedDiscount: Discount | null;
  storedCode: string;
  onSelect: (discount: Discount | null, code: string) => void;
}

export default function DiscountSelection({ selectedDiscountId, storedDiscount, storedCode, onSelect }: DiscountSelectionProps) {
  const [code, setCode] = useState(storedCode);
  const [loading, setLoading] = useState(false);
  const [validationState, setValidationState] = useState<'idle' | 'valid' | 'invalid'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleValidate = async () => {
    if (!code.trim()) {
      setErrorMessage('Please enter a discount code');
      return;
    }

    setLoading(true);
    setValidationState('idle');
    setErrorMessage('');

    try {
      const discount = await apiClient.validateDiscount(code.trim());
      
      if (discount) {
        setValidationState('valid');
        onSelect(discount, code.trim());
      } else {
        setValidationState('invalid');
        setErrorMessage('This code is not valid');
        onSelect(null, code.trim());
      }
    } catch (error) {
      setValidationState('invalid');
      setErrorMessage('Unable to validate code. Please try again.');
      onSelect(null, code.trim());
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = () => {
    setCode('');
    setValidationState('idle');
    setErrorMessage('');
    onSelect(null, '');
  };

  return (
    <div className="space-y-4 mb-8">
      <div className="flex gap-3">
        <div className="flex-1">
          <Input
            id="discount-code"
            placeholder="Enter discount code"
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setValidationState('idle');
              setErrorMessage('');
            }}
            disabled={loading || validationState === 'valid'}
          />
        </div>
        {validationState !== 'valid' ? (
          <Button
            onClick={handleValidate}
            disabled={!code.trim() || loading}
            isLoading={loading}
            variant="secondary"
          >
            Apply
          </Button>
        ) : (
          <Button onClick={handleRemove} variant="ghost">
            Remove
          </Button>
        )}
      </div>

      <AnimatePresence>
        {validationState === 'valid' && storedDiscount && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 rounded-xl border-2 border-[#1a7f72] bg-[#e6f3f2]"
          >
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-[#1a7f72] flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-[#1a7f72] font-medium flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Discount Applied: {storedDiscount.code}
                </p>
                {storedDiscount.description && (
                  <p className="text-sm text-neutral-600 mt-1">{storedDiscount.description}</p>
                )}
                {storedDiscount.percentage > 0 && (
                  <p className="text-sm text-neutral-700 mt-1">
                    {storedDiscount.percentage}% off
                  </p>
                )}
                {storedDiscount.amount > 0 && (
                  <p className="text-sm text-neutral-700 mt-1">
                    ${storedDiscount.amount} off
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {validationState === 'invalid' && errorMessage && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 rounded-xl border-2 border-red-200 bg-red-50"
          >
            <div className="flex items-start gap-3">
              <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-600">{errorMessage}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
