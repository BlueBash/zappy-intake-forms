import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, AddressElement, useStripe, useElements } from '@stripe/react-stripe-js';
import NavigationButtons from '../common/NavigationButtons';
import { Eye, EyeOff, CreditCard, Lock } from 'lucide-react';
import { ScreenProps } from './common';

// Initialize Stripe - Replace with your actual publishable key to enable real payments
const STRIPE_PUBLISHABLE_KEY: string | null = null;
const stripePromise = STRIPE_PUBLISHABLE_KEY ? loadStripe(STRIPE_PUBLISHABLE_KEY) : null;

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
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!firstName.trim()) newErrors.firstName = 'First name is required';
    if (!lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!email.trim()) newErrors.email = 'Email is required';
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

      const accountData = {
        firstName,
        lastName,
        email,
        password,
        address,
        city,
        state,
        zipCode,
      };

      onComplete(accountData);
      setIsProcessing(false);
    } catch (err) {
      setErrors({ general: 'An error occurred. Please try again.' });
      setIsProcessing(false);
    }
  };

  const selectedMedication = answers['selected_medication'] || 'Medication';
  const planName = selectedPlan?.name || answers['selected_plan_name'] || 'Selected Plan';
  const planPrice = selectedPlan?.invoice_amount || answers['selected_plan_price'] || 299;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Demo Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Lock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-blue-900 font-medium mb-1">Demo Mode</p>
            <p className="text-xs text-blue-700">
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
          <label className="block text-sm text-neutral-700 mb-2">
            Email *
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border-2 ${
              errors.email ? 'border-red-500' : 'border-neutral-200'
            } focus:border-[#1a7f72] focus:outline-none transition-colors`}
            placeholder="john.doe@example.com"
          />
          {errors.email && (
            <p className="text-sm text-red-500 mt-1">{errors.email}</p>
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
            <input
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value.toUpperCase())}
              className={`w-full px-4 py-3 rounded-xl border-2 ${
                errors.state ? 'border-red-500' : 'border-neutral-200'
              } focus:border-[#1a7f72] focus:outline-none transition-colors`}
              placeholder="NY"
              maxLength={2}
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

      {/* Payment Information */}
      <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="text-lg text-neutral-900 mb-4">Payment Information</h3>
        
        {/* Order Summary */}
        <div className="bg-neutral-50 rounded-xl p-4 mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-neutral-600">Medication</span>
            <span className="text-sm text-neutral-900 capitalize">{selectedMedication}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-neutral-600">Plan</span>
            <span className="text-sm text-neutral-900">{planName}</span>
          </div>
          <div className="border-t border-neutral-200 my-3"></div>
          <div className="flex justify-between items-center">
            <span className="text-neutral-900">Total</span>
            <span className="text-xl text-[#1a7f72]">
              ${planPrice}/month
            </span>
          </div>
        </div>

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
          <p className="text-xs text-neutral-500 mt-1">
            Use any test card number (e.g., 4242 4242 4242 4242)
          </p>
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
              });
              // Submit the form
              onSubmit();
            }}
            onBack={onBack}
          />
        </motion.div>
      </div>
    </div>
  );
}

