import { useState } from 'react';
import { motion } from 'motion/react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, AddressElement, useStripe, useElements } from '@stripe/react-stripe-js';
import ScreenHeader from '../common/ScreenHeader';
import NavigationButtons from '../common/NavigationButtons';
import { Eye, EyeOff, CreditCard, Lock } from 'lucide-react';

// Initialize Stripe - Replace with your actual publishable key to enable real payments
// Set to null to use demo mode with mock payment form (current default)
const STRIPE_PUBLISHABLE_KEY: string | null = null; // Replace with 'pk_test_your_key_here' to enable Stripe
const stripePromise = STRIPE_PUBLISHABLE_KEY ? loadStripe(STRIPE_PUBLISHABLE_KEY) : null;

interface AccountCreationScreenProps {
  selectedPlan: any;
  selectedMedication: string;
  onComplete: (accountData: any) => void;
  onBack: () => void;
  currentStep?: number;
  totalSteps?: number;
}

// Mock payment form when Stripe is not configured
function MockPaymentForm({
  selectedPlan,
  selectedMedication,
  onComplete,
  onBack,
}: Omit<AccountCreationScreenProps, 'currentStep' | 'totalSteps'>) {
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

  const handleSubmit = async (e: React.FormEvent) => {
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
    } catch (err) {
      setErrors({ general: 'An error occurred. Please try again.' });
      setIsProcessing(false);
    }
  };

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
              To enable real payments, add your Stripe API key.
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
              onChange={(e) => setState(e.target.value)}
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
            <span className="text-sm text-neutral-900">{selectedPlan?.name || 'Selected Plan'}</span>
          </div>
          <div className="border-t border-neutral-200 my-3"></div>
          <div className="flex justify-between items-center">
            <span className="text-neutral-900">Total</span>
            <span className="text-xl text-[#1a7f72]">
              ${selectedPlan?.invoice_amount || selectedPlan?.price || '299'}/month
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
        onNext={handleSubmit}
        nextButtonType="submit"
        isNextDisabled={isProcessing}
        isNextLoading={isProcessing}
        nextLabel={isProcessing ? 'Processing...' : 'Complete Purchase'}
      />

      <p className="text-xs text-center text-neutral-500 mt-4">
        🔒 This is a demo form - no actual payment will be processed
      </p>
    </form>
  );
}

// Real Stripe payment form
function AccountCreationForm({
  selectedPlan,
  selectedMedication,
  onComplete,
  onBack,
}: Omit<AccountCreationScreenProps, 'currentStep' | 'totalSteps'>) {
  const stripe = useStripe();
  const elements = useElements();
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      // Submit the payment to Stripe
      const { error: submitError } = await elements.submit();
      
      if (submitError) {
        setErrors({ payment: submitError.message || 'Payment validation failed' });
        setIsProcessing(false);
        return;
      }

      // In a real app, you would:
      // 1. Create a payment intent on your server
      // 2. Confirm the payment with Stripe
      // 3. Create the user account on your server
      // For now, we'll simulate success

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Collect account data
      const accountData = {
        firstName,
        lastName,
        password,
        // In production, you'd get the actual address from AddressElement
        // and payment method from Stripe
      };

      onComplete(accountData);
    } catch (err) {
      setErrors({ payment: 'An error occurred. Please try again.' });
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name Fields */}
      <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="text-lg text-neutral-900 mb-4">Personal Information</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm text-neutral-700 mb-2">
              First Name *
            </label>
            <input
              id="firstName"
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
            <label htmlFor="lastName" className="block text-sm text-neutral-700 mb-2">
              Last Name *
            </label>
            <input
              id="lastName"
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
      </div>

      {/* Password Fields */}
      <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="text-lg text-neutral-900 mb-4">Create Password</h3>
        
        <div>
          <label htmlFor="password" className="block text-sm text-neutral-700 mb-2">
            Password *
          </label>
          <div className="relative">
            <input
              id="password"
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
          <label htmlFor="confirmPassword" className="block text-sm text-neutral-700 mb-2">
            Confirm Password *
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
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
        <AddressElement 
          options={{ 
            mode: 'shipping',
            allowedCountries: ['US'],
          }} 
        />
      </div>

      {/* Payment Information */}
      <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="text-lg text-neutral-900 mb-4">Payment Information</h3>
        
        {/* Order Summary */}
        <div className="bg-neutral-50 rounded-xl p-4 mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-neutral-600">Medication</span>
            <span className="text-sm text-neutral-900">{selectedMedication}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-neutral-600">Plan</span>
            <span className="text-sm text-neutral-900">{selectedPlan?.name || 'Selected Plan'}</span>
          </div>
          <div className="border-t border-neutral-200 my-3"></div>
          <div className="flex justify-between items-center">
            <span className="text-neutral-900">Total</span>
            <span className="text-xl text-[#1a7f72]">
              ${selectedPlan?.price || '299'}/month
            </span>
          </div>
        </div>

        <PaymentElement />
        
        {errors.payment && (
          <p className="text-sm text-red-500 mt-2">{errors.payment}</p>
        )}
      </div>

      {/* Submit Button - Using NavigationButtons for consistency */}
      <NavigationButtons
        onNext={handleSubmit}
        nextButtonType="submit"
        isNextDisabled={!stripe || isProcessing}
        isNextLoading={isProcessing}
        nextLabel={isProcessing ? 'Processing...' : 'Complete Purchase'}
      />

      {/* Security Note */}
      <p className="text-xs text-center text-neutral-500 mt-4">
        🔒 Your payment information is encrypted and secure
      </p>
    </form>
  );
}

export default function AccountCreationScreen(props: AccountCreationScreenProps) {
  const { currentStep, totalSteps, onBack } = props;

  // Stripe Elements options
  const options = {
    mode: 'subscription' as const,
    amount: (props.selectedPlan?.price || 299) * 100, // Convert to cents
    currency: 'usd',
    // You would get this from your server in production
    // setupFutureUsage: 'off_session',
  };

  // If Stripe is not configured, use mock form
  if (!stripePromise) {
    return (
      <div className="min-h-screen bg-[#fef8f2] flex justify-center p-4 sm:p-6 pt-5 sm:pt-7">
        <div className="w-full max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Progress Bar */}
            {currentStep !== undefined && totalSteps !== undefined && (
              <ScreenHeader
                onBack={onBack}
                sectionLabel="Account Setup"
                progressPercentage={(currentStep / totalSteps) * 100}
              />
            )}

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

            {/* Mock Form (No Stripe) */}
            <MockPaymentForm {...props} />
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fef8f2] flex justify-center p-4 sm:p-6 pt-5 sm:pt-7">
      <div className="w-full max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Progress Bar */}
          {currentStep !== undefined && totalSteps !== undefined && (
            <ScreenHeader
              onBack={onBack}
              sectionLabel="Account Setup"
              progressPercentage={(currentStep / totalSteps) * 100}
            />
          )}

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

          {/* Form with Stripe Elements */}
          <Elements stripe={stripePromise} options={options}>
            <AccountCreationForm {...props} />
          </Elements>
        </motion.div>
      </div>
    </div>
  );
}
