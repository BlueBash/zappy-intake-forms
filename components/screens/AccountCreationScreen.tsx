import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, AddressElement, useStripe, useElements } from '@stripe/react-stripe-js';
import NavigationButtons from '../common/NavigationButtons';
import { Eye, EyeOff, CreditCard, Lock } from 'lucide-react';
import { ScreenProps } from './common';
import RegionDropdown, { US_STATES } from '../common/RegionDropdown';

// Initialize Stripe - Replace with your actual publishable key to enable real payments
const STRIPE_PUBLISHABLE_KEY: string | null = null;
const stripePromise = STRIPE_PUBLISHABLE_KEY ? loadStripe(STRIPE_PUBLISHABLE_KEY) : null;

const normalizeStateCode = (raw: unknown): string => {
  if (typeof raw !== 'string') return '';
  const trimmed = raw.trim();
  if (!trimmed) return '';
  if (/^[A-Za-z]{2}$/.test(trimmed)) {
    return trimmed.toUpperCase();
  }
  const normalized = trimmed.toLowerCase();
  const match = US_STATES.find(
    (state) =>
      state.code.toLowerCase() === normalized || state.name.toLowerCase() === normalized
  );
  if (match) {
    return match.code;
  }
  return trimmed.slice(0, 2).toUpperCase();
};

// Mock payment form when Stripe is not configured
function MockPaymentForm({
  selectedPlan,
  answers,
  onComplete,
  onBack,
}: {
  selectedPlan: any;
  answers: Record<string, any>;
  onComplete: (accountData: any) => void;
  onBack: () => void;
}) {
  const getString = (value: unknown, fallback: string = ''): string => (typeof value === 'string' ? value : fallback);
  
  // Determine user state: new user who just created account vs existing customer
  const hasJustCreatedAccount = Boolean(
    answers.email && 
    answers.password &&
    (answers.first_name || answers.account_firstName)
  );
  
  const isExistingCustomer = Boolean(
    answers.email && 
    !answers.password && // They signed in, not created new account
    (answers.first_name || answers.account_firstName)
  );

  // State management - simplified based on what we actually need
  const [phone, setPhone] = useState(() => getString(answers.account_phone ?? answers.phone));
  const [address, setAddress] = useState(() => getString(answers.account_address ?? answers.address_line1 ?? answers.shipping_address));
  const [address2, setAddress2] = useState(() => getString(answers.account_address2 ?? answers.address_line2 ?? answers.shipping_address2));
  const [city, setCity] = useState(() => getString(answers.account_city ?? answers.city ?? answers.shipping_city));
  const [state, setState] = useState(() =>
    normalizeStateCode(
      getString(
        answers.account_state ??
          answers.state ??
          answers.shipping_state ??
          answers.home_state
      )
    )
  );
  const [zipCode, setZipCode] = useState(() => getString(answers.account_zipCode ?? answers.account_zipcode ?? answers.zip_code ?? answers.shipping_zip));
  const [cardNumber, setCardNumber] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);

  // Get user info for display
  const userEmail = getString(answers.email || answers.account_email);
  const userName = getString(answers.first_name || answers.account_firstName);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    const trimmedPhone = phone.trim();
    const phoneDigits = trimmedPhone.replace(/[^0-9]/g, '');

    // Simplified validation - only for fields we're actually collecting
    if (!trimmedPhone) newErrors.phone = 'Phone number is required';
    else if (phoneDigits.length < 10 || phoneDigits.length > 15) newErrors.phone = 'Enter a valid phone number';
    
    if (!address.trim()) newErrors.address = 'Address is required';
    if (!city.trim()) newErrors.city = 'City is required';
    if (!state.trim()) newErrors.state = 'State is required';
    if (!zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
    if (!cardNumber.trim()) newErrors.cardNumber = 'Card number is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsProcessing(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      const accountData = {
        phone: phone.trim(),
        address: address.trim(),
        address2: address2.trim(),
        city: city.trim(),
        state: normalizeStateCode(state),
        zipCode: zipCode.trim(),
      };

      onComplete(accountData);
    } catch (err) {
      setErrors({ general: 'An error occurred. Please try again.' });
    } finally {
      setIsProcessing(false);
    }
  };

  const selectedMedication = answers['selected_medication'] || 'Medication';
  const planName = selectedPlan?.name || answers['selected_plan_name'] || 'Selected Plan';
  const planPrice = selectedPlan?.invoice_amount || answers['selected_plan_price'] || 299;
  
  // Determine CTA text and title based on user state
  const ctaText = isExistingCustomer 
    ? 'Update & Continue' 
    : 'Complete Purchase';
    
  const formTitle = isExistingCustomer 
    ? `Welcome back, ${userName}!`
    : hasJustCreatedAccount 
      ? 'Complete Your Profile'
      : 'Create Your Account';
      
  const formSubtitle = isExistingCustomer
    ? 'Please confirm your delivery information'
    : 'Just a few more details for delivery and payment';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Contact & Delivery */}
      <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="text-lg text-neutral-900 mb-4">Contact & Delivery</h3>
        
        <div>
          <label className="block text-sm text-neutral-700 mb-2">
            Phone Number *
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border-2 ${
              errors.phone ? 'border-red-500' : 'border-neutral-200'
            } focus:border-[#1a7f72] focus:outline-none transition-colors`}
            placeholder="(555) 123-4567"
            autoComplete="tel"
          />
          {errors.phone && (
            <p className="text-sm text-red-500 mt-1">{errors.phone}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm text-neutral-700 mb-2">
            Street Address *
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border-2 ${
              errors.address ? 'border-red-500' : 'border-neutral-200'
            } focus:border-[#1a7f72] focus:outline-none transition-colors`}
            placeholder="123 Main St"
          />
          {errors.address && (
            <p className="text-sm text-red-500 mt-1">{errors.address}</p>
          )}
        </div>

        <div>
          <label className="block text-sm text-neutral-700 mb-2">
            Apartment, Suite, etc. (Optional)
          </label>
          <input
            type="text"
            value={address2}
            onChange={(e) => setAddress2(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border-2 border-neutral-200 focus:border-[#1a7f72] focus:outline-none transition-colors"
            placeholder="Apt 4B"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-1">
            <label className="block text-sm text-neutral-700 mb-2">
              City *
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border-2 ${
                errors.city ? 'border-red-500' : 'border-neutral-200'
              } focus:border-[#1a7f72] focus:outline-none transition-colors`}
              placeholder="New York"
            />
            {errors.city && (
              <p className="text-sm text-red-500 mt-1">{errors.city}</p>
            )}
          </div>

          <div className="col-span-1">
            <label className="block text-sm text-neutral-700 mb-2">
              State *
            </label>
            <RegionDropdown
              value={state}
              onChange={(nextState) => {
                setState(nextState);
                setErrors((prev) => {
                  if (!prev.state) return prev;
                  const { state: _stateError, ...rest } = prev;
                  return rest;
                });
              }}
              placeholder="Select your state"
            />
            {errors.state && (
              <p className="text-sm text-red-500 mt-1">{errors.state}</p>
            )}
          </div>

          <div className="col-span-1">
            <label className="block text-sm text-neutral-700 mb-2">
              ZIP Code *
            </label>
            <input
              type="text"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border-2 ${
                errors.zipCode ? 'border-red-500' : 'border-neutral-200'
              } focus:border-[#1a7f72] focus:outline-none transition-colors`}
              placeholder="10001"
              maxLength={5}
            />
            {errors.zipCode && (
              <p className="text-sm text-red-500 mt-1">{errors.zipCode}</p>
            )}
          </div>
        </div>
      </div>

      {/* Pricing Summary & Payment */}
      <div className="bg-white rounded-2xl p-6 shadow-sm space-y-5">
        {/* Plan Features */}
        <div className="space-y-3 pb-4 border-b border-neutral-200">
          <div className="flex items-center gap-2 text-sm text-neutral-700">
            <svg className="w-5 h-5 text-[#1a7f72]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
            </svg>
            No insurance required
          </div>
          <div className="flex items-center gap-2 text-sm text-neutral-700">
            <svg className="w-5 h-5 text-[#1a7f72]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
            </svg>
            Adjust medication anytime with a provider
          </div>
        </div>

        {/* Pricing Summary */}
        <div className="space-y-2">
          <div className="flex justify-between items-baseline">
            <span className="text-base text-neutral-700">Total if prescribed (per month)</span>
            <div className="flex items-center gap-2">
              <span className="text-base text-neutral-400 line-through">${(planPrice * 1.67).toFixed(0)}</span>
              <span className="text-2xl text-neutral-900">${planPrice}<span className="text-sm text-neutral-500">/mo</span></span>
            </div>
          </div>
          <div className="flex justify-between items-baseline">
            <span className="text-base text-neutral-700">Due today:</span>
            <span className="text-2xl text-neutral-900">$0</span>
          </div>
        </div>

        {/* Discount Code Section */}
        <details className="group">
          <summary className="flex items-center justify-between cursor-pointer list-none py-3 border-t border-neutral-200">
            <span className="text-base text-neutral-900">Discounts</span>
            <svg className="w-5 h-5 text-neutral-500 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </summary>
          <div className="pt-3 pb-2">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Discount code"
                className="flex-1 px-4 py-2.5 rounded-xl border-2 border-neutral-200 focus:border-[#1a7f72] focus:outline-none transition-colors text-sm"
              />
              <button
                type="button"
                className="px-6 py-2.5 bg-neutral-200 text-neutral-700 rounded-xl text-sm font-medium hover:bg-neutral-300 transition-colors"
              >
                Apply
              </button>
            </div>
          </div>
        </details>

        {/* Payment Method Section */}
        <div className="pt-4 border-t border-neutral-200">
          <h3 className="text-base text-neutral-900 mb-4">Select payment method</h3>
          <p className="text-sm text-neutral-600 mb-4">
            You'll be charged once prescribed. You won't be charged if a provider determines that Amble's weight loss program isn't right for you.
          </p>
          
          <div>
            <label className="block text-sm text-neutral-700 mb-2">
              <CreditCard className="inline w-4 h-4 mr-1" />
              Card Number * (Demo)
            </label>
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border-2 ${
                errors.cardNumber ? 'border-red-500' : 'border-neutral-200'
              } focus:border-[#1a7f72] focus:outline-none transition-colors`}
              placeholder="4242 4242 4242 4242"
              maxLength={19}
            />
            {errors.cardNumber && (
              <p className="text-sm text-red-500 mt-1">{errors.cardNumber}</p>
            )}
            <p className="text-xs text-neutral-500 mt-2">
              Use any test card number (e.g., 4242 4242 4242 4242)
            </p>
            
            <div className="mt-4 text-xs text-neutral-500 text-center">
              🔒 256-BIT TLS SECURITY
            </div>
          </div>
        </div>
      </div>

      {errors.general && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-sm text-red-700">{errors.general}</p>
        </div>
      )}

      <NavigationButtons
        showBack={true}
        onBack={onBack}
        onNext={() => {
          const fakeEvent = { preventDefault: () => {} } as React.FormEvent<HTMLFormElement>;
          handleSubmit(fakeEvent);
        }}
        isNextDisabled={isProcessing}
        isNextLoading={isProcessing}
        nextLabel={isProcessing ? 'Processing...' : ctaText}
        layout="grouped"
      />

      <p className="text-xs text-center text-neutral-500 mt-4">
        🔒 This is a demo form - no actual payment will be processed
      </p>
    </form>
  );
}

export default function AccountCreationScreen({ screen, answers, updateAnswer, onSubmit, showBack, onBack, defaultCondition, showLoginLink }: ScreenProps & { key?: string }) {
  const selectedPlan = answers['selected_plan_details'] || {};
  const selectedMedication = answers['selected_medication'] || 'Medication';

  return (
    <div className="min-h-screen bg-[#fef8f2] flex justify-center p-4 sm:p-6 pt-5 sm:pt-7">
      <div className="w-full max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Title */}
          <div className="mb-10 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl sm:text-3xl md:text-4xl text-neutral-900 mb-3 sm:mb-4 leading-snug tracking-tight"
              style={{ letterSpacing: '-0.02em' }}
            >
              Create your account
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-base sm:text-lg text-neutral-600 leading-relaxed"
            >
              You're almost there! Just a few more details to get started.
            </motion.p>
          </div>

          {/* Form */}
          <MockPaymentForm 
            selectedPlan={selectedPlan}
            answers={answers}
            onComplete={(accountData) => {
              // Save account data to answers
              Object.entries(accountData).forEach(([key, value]) => {
                updateAnswer(`account_${key}`, value);
                if (key === 'email' || key === 'phone') {
                  updateAnswer(key, value);
                }
                if (key === 'state') {
                  const stateCode = normalizeStateCode(value);
                  updateAnswer('state', stateCode);
                  updateAnswer('home_state', stateCode);
                  updateAnswer('shipping_state', stateCode);
                }
                if (key === 'city') {
                  updateAnswer('city', value);
                  updateAnswer('shipping_city', value);
                }
                if (key === 'address') {
                  updateAnswer('address_line1', value);
                  updateAnswer('shipping_address', value);
                }
                if (key === 'address2') {
                  updateAnswer('address_line2', value);
                  updateAnswer('shipping_address2', value);
                }
                if (key === 'zipCode') {
                  updateAnswer('zip_code', value);
                  updateAnswer('shipping_zip', value);
                }
              });
              // Submit the form
              onSubmit(accountData);
            }}
            onBack={onBack}
          />
        </motion.div>
      </div>
    </div>
  );
}
