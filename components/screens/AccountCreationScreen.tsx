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
  const [firstName, setFirstName] = useState(() => getString(answers.account_firstName ?? answers.first_name));
  const [lastName, setLastName] = useState(() => getString(answers.account_lastName ?? answers.last_name));
  const [email, setEmail] = useState(() => getString(answers.account_email ?? answers.email));
  const [isEmailEditable, setIsEmailEditable] = useState(false);
  const [phone, setPhone] = useState(() => getString(answers.account_phone ?? answers.phone));
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [address, setAddress] = useState(() => getString(answers.account_address ?? answers.address_line1 ?? answers.shipping_address));
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!firstName.trim()) newErrors.firstName = 'First name is required';
    if (!lastName.trim()) newErrors.lastName = 'Last name is required';
    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();
    const phoneDigits = trimmedPhone.replace(/[^0-9]/g, '');

    if (!trimmedEmail) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) newErrors.email = 'Enter a valid email';
    if (!trimmedPhone) newErrors.phone = 'Phone number is required';
    else if (phoneDigits.length < 10 || phoneDigits.length > 15) newErrors.phone = 'Enter a valid phone number';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
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

      const sanitizedEmail = email.trim();
      const sanitizedPhone = phone.trim();

      const accountData = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: sanitizedEmail,
        phone: sanitizedPhone,
        password,
        address: address.trim(),
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Demo Notice */}
      <div className="bg-[var(--warm-background)] border border-[var(--light-gray)] rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Lock className="w-5 h-5 text-[var(--teal)] flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-[var(--black)] font-medium mb-1">Demo Mode</p>
            <p className="text-xs text-[var(--gray)]">
              This is a demo payment form. No actual payment will be processed.
            </p>
          </div>
        </div>
      </div>

      {/* Name & Email */}
      <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="text-lg text-neutral-900 mb-4">Personal Information</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-neutral-700 mb-2">
              First Name *
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border-2 ${
                errors.firstName ? 'border-red-500' : 'border-neutral-200'
              } focus:border-[#1a7f72] focus:outline-none transition-colors`}
              placeholder="John"
            />
            {errors.firstName && (
              <p className="text-sm text-red-500 mt-1">{errors.firstName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm text-neutral-700 mb-2">
              Last Name *
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border-2 ${
                errors.lastName ? 'border-red-500' : 'border-neutral-200'
              } focus:border-[#1a7f72] focus:outline-none transition-colors`}
              placeholder="Doe"
            />
            {errors.lastName && (
              <p className="text-sm text-red-500 mt-1">{errors.lastName}</p>
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm text-neutral-700">
              Email *
            </label>
            {!isEmailEditable && (
              <button
                type="button"
                onClick={() => setIsEmailEditable(true)}
                className="text-xs font-medium text-[#1a7f72] hover:text-[#145b50]"
              >
                Edit
              </button>
            )}
          </div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={!isEmailEditable}
            className={`w-full px-4 py-3 rounded-xl border-2 ${
              errors.email ? 'border-red-500' : 'border-neutral-200'
            } focus:border-[#1a7f72] focus:outline-none transition-colors disabled:bg-neutral-100 disabled:text-neutral-500 disabled:cursor-not-allowed`}
            placeholder="john.doe@example.com"
            autoComplete="email"
          />
          {errors.email && (
            <p className="text-sm text-red-500 mt-1">{errors.email}</p>
          )}
          {!isEmailEditable && (
            <p className="text-xs text-neutral-500 mt-1">
              We prefilled the email you shared earlier. Tap edit if you need to update it.
            </p>
          )}
        </div>

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
            Password *
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-4 py-3 pr-12 rounded-xl border-2 ${
                errors.password ? 'border-red-500' : 'border-neutral-200'
              } focus:border-[#1a7f72] focus:outline-none transition-colors`}
              placeholder="At least 8 characters"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-red-500 mt-1">{errors.password}</p>
          )}
        </div>

        <div>
          <label className="block text-sm text-neutral-700 mb-2">
            Confirm Password *
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full px-4 py-3 pr-12 rounded-xl border-2 ${
                errors.confirmPassword ? 'border-red-500' : 'border-neutral-200'
              } focus:border-[#1a7f72] focus:outline-none transition-colors`}
              placeholder="Re-enter password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-sm text-red-500 mt-1">{errors.confirmPassword}</p>
          )}
        </div>
      </div>

      {/* Shipping Address */}
      <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="text-lg text-neutral-900 mb-4">Shipping Address</h3>
        
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
            <span className="text-base text-neutral-700">Total if prescribed</span>
            <div className="flex items-center gap-2">
              <span className="text-base text-neutral-400 line-through">${(planPrice * 1.67).toFixed(0)}</span>
              <span className="text-2xl text-neutral-900">${planPrice}</span>
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
        onNext={handleSubmit}
        isNextDisabled={isProcessing}
        isNextLoading={isProcessing}
        nextLabel={isProcessing ? 'Processing...' : 'Complete Purchase'}
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
