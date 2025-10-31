import React, { useState } from "react";
import { motion } from "framer-motion";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  AddressElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import NavigationButtons from "../common/NavigationButtons";
import {
  Eye,
  EyeOff,
  CreditCard,
  Lock,
  Package,
  TrendingDown,
  Check,
  Shield,
  Camera,
  Upload,
} from "lucide-react";
import { ScreenProps } from "./common";
import RegionDropdown, { US_STATES } from "../common/RegionDropdown";
import { apiClient, type Discount } from "@/utils/api";

// Initialize Stripe - Replace with your actual publishable key to enable real payments
const STRIPE_PUBLISHABLE_KEY: string | null = import.meta.env
  .VITE_STRIPE_PUBLISHABLE_KEY;
const stripePromise = STRIPE_PUBLISHABLE_KEY
  ? loadStripe(STRIPE_PUBLISHABLE_KEY)
  : null;

const normalizeStateCode = (raw: unknown): string => {
  if (typeof raw !== "string") return "";
  const trimmed = raw.trim();
  if (!trimmed) return "";
  if (/^[A-Za-z]{2}$/.test(trimmed)) {
    return trimmed.toUpperCase();
  }
  const normalized = trimmed.toLowerCase();
  const match = US_STATES.find(
    (state) =>
      state.code.toLowerCase() === normalized ||
      state.name.toLowerCase() === normalized
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
  updateAnswer,
}: {
  selectedPlan: any;
  answers: Record<string, any>;
  onComplete: (accountData: any) => void;
  onBack: () => void;
  updateAnswer: (id: string, value: any) => void;
}) {
  const getString = (value: unknown, fallback: string = ""): string =>
    typeof value === "string" ? value : fallback;

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
  const [phone, setPhone] = useState(() =>
    getString(answers.account_phone ?? answers.phone)
  );
  const [address, setAddress] = useState(() =>
    getString(
      answers.account_address ??
        answers.address_line1 ??
        answers.shipping_address
    )
  );
  const [address2, setAddress2] = useState(() =>
    getString(
      answers.account_address2 ??
        answers.address_line2 ??
        answers.shipping_address2
    )
  );
  const [city, setCity] = useState(() =>
    getString(answers.account_city ?? answers.city ?? answers.shipping_city)
  );
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
  const [zipCode, setZipCode] = useState(() =>
    getString(
      answers.account_zipCode ??
        answers.account_zipcode ??
        answers.zip_code ??
        answers.shipping_zip
    )
  );
  const [cardNumber, setCardNumber] = useState("");
  const [cvv, setCvv] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  // Optional: when provided, we render a real Stripe Payment Element
  const [setupIntentClientSecret, setSetupIntentClientSecret] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [discountCode, setDiscountCode] = useState(() => 
    getString(answers['discount_code_entered'])
  );
  const [discountError, setDiscountError] = useState("");
  const [loading, setLoading] = useState(false);
  const [appliedDiscount, setAppliedDiscount] = useState<Discount | null>(() => 
    (answers['discount_data'] as Discount | null) || null
  );
  const [idPhoto, setIdPhoto] = useState<File | null>(null);
  const [idPhotoPreview, setIdPhotoPreview] = useState<string>(() =>
    getString(answers.id_photo_url)
  );

  // Get user info for display
  const userEmail = getString(answers.email || answers.account_email);
  const userName = getString(answers.first_name || answers.account_firstName);

  const handleIdPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIdPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setIdPhotoPreview(result);
        updateAnswer('id_photo_url', result);
        updateAnswer('id_photo_name', file.name);
      };
      reader.readAsDataURL(file);
      // Clear error if there was one
      if (errors.idPhoto) {
        setErrors(prev => {
          const { idPhoto: _, ...rest } = prev;
          return rest;
        });
      }
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    const trimmedPhone = phone.trim();
    const phoneDigits = trimmedPhone.replace(/[^0-9]/g, "");

    // Simplified validation - only for fields we're actually collecting
    if (!trimmedPhone) newErrors.phone = "Phone number is required";
    else if (phoneDigits.length < 10 || phoneDigits.length > 15)
      newErrors.phone = "Enter a valid phone number";

    if (!address.trim()) newErrors.address = "Address is required";
    if (!city.trim()) newErrors.city = "City is required";
    if (!state.trim()) newErrors.state = "State is required";
    if (!zipCode.trim()) newErrors.zipCode = "ZIP code is required";
    // Only require demo card number when not using Stripe Payment Element
    if (!setupIntentClientSecret.trim()) {
      if (!cardNumber.trim()) newErrors.cardNumber = "Card number is required";
      if (!cvv.trim()) newErrors.cvv = "CVV is required";
      else if (!/^\d{3,4}$/.test(cvv.trim())) newErrors.cvv = "CVV must be 3 or 4 digits";
      if (!expiryDate.trim()) newErrors.expiryDate = "Expiration date is required";
      else {
        const expiryRegex = /^(0[1-9]|1[0-2])\/(\d{2})$/;
        if (!expiryRegex.test(expiryDate.trim())) {
          newErrors.expiryDate = "Please enter a valid date (MM/YY)";
        } else {
          // Validate that the date is not in the past
          const [month, year] = expiryDate.split('/');
          const expiryYearFull = 2000 + parseInt(year, 10);
          const expiryMonthNum = parseInt(month, 10) - 1;
          const expiryDateObj = new Date(expiryYearFull, expiryMonthNum + 1, 0); // Last day of the month
          const now = new Date();
          if (expiryDateObj < now) {
            newErrors.expiryDate = "Expiration date cannot be in the past";
          }
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsProcessing(true);

    try {
      // If we have card details and a customer ID, add the card to Stripe
      const customerId = answers['stripe_customer_id'] || answers['customer_id'] || "156ca3307961ed745af2563f";
      const hasCardDetails = cardNumber.trim() && cvv.trim() && expiryDate.trim();

      if (customerId && hasCardDetails && !setupIntentClientSecret && stripePromise) {
        try {
          // Parse MM/YY format
          const [month, year] = expiryDate.split('/');
          const expiryYearFull = 2000 + parseInt(year, 10);
          
          const cardNumberDigits = cardNumber.replace(/\s/g, '');
          
          // Note: This requires your Stripe secret key - ideally this should be done on your backend
          // For now, we'll need to pass the secret key (NOT RECOMMENDED for production)
          const stripeSecretKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
          
          if (!stripeSecretKey) {
            throw new Error('Stripe secret key is not configured. Please set VITE_STRIPE_PUBLISHABLE_KEY in your environment variables.');
          }

          // Create card source directly via Stripe Sources API
          // Reference: https://docs.stripe.com/api/cards/create
          // The source parameter accepts card details as an object
          const sourceParams = new URLSearchParams({
            'source[object]': 'card',
            'source[number]': cardNumberDigits,
            'source[exp_month]': parseInt(month, 10).toString(),
            'source[exp_year]': expiryYearFull.toString(),
            'source[cvc]': cvv.trim(),
          });

          const cardResponse = await fetch(
            `https://api.stripe.com/v1/customers/${customerId}/sources`,
            {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${stripeSecretKey}`,
                'Content-Type': 'application/x-www-form-urlencoded',
              },
              body: sourceParams.toString(),
            }
          );

          const cardData = await cardResponse.json();

          if (!cardResponse.ok) {
            throw new Error(cardData.error?.message || 'Failed to add card to customer');
          }

          // // Store card information in answers
          // if (cardData.id) {
          //   updateAnswer('stripe_card_id', cardData.id);
          //   updateAnswer('stripe_card_last4', cardData.last4 || '');
          //   updateAnswer('stripe_card_brand', cardData.brand || '');
          // }
        } catch (cardError: any) {
          console.error('Error adding card to customer:', cardError);
          setErrors({
            general: cardError?.message || "Failed to add card. Please check your card details and try again.",
          });
          setIsProcessing(false);
        }
      }

      await new Promise((resolve) => setTimeout(resolve, 1500));

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
      setErrors({ general: "An error occurred. Please try again." });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApplyDiscount = async () => {
    const trimmedCode = discountCode.trim().toUpperCase();
    if (!trimmedCode) {
      setDiscountError("Please enter a discount code");
      return;
    }

    setLoading(true);
    setDiscountError("");

    try {
      const response = await apiClient.applyDiscount(trimmedCode);

      if (
        response.message === "Invalid Discount Coupon Code" ||
        !response.discount
      ) {
        setAppliedDiscount(null);
        setDiscountError("Invalid discount code");
        // Clear discount data from answers
        updateAnswer('discount_code_entered', '');
        updateAnswer('discount_id', '');
        updateAnswer('discount_code', '');
        updateAnswer('discount_amount', 0);
        updateAnswer('discount_description', '');
        updateAnswer('discount_data', null);
        return;
      }

      const discount = response.discount;
      setAppliedDiscount(discount);
      
      // Save discount data to answers
      updateAnswer('discount_code_entered', trimmedCode);
      updateAnswer('discount_id', discount.id);
      updateAnswer('discount_code', discount.code);
      updateAnswer('discount_amount', discount.amount);
      updateAnswer('discount_description', discount.description || '');
      updateAnswer('discount_data', discount);
    } catch (applyError) {
      console.error(applyError);
      setAppliedDiscount(null);
      setDiscountError(
        applyError instanceof Error
          ? applyError.message
          : "Failed to apply discount"
      );
      // Clear discount data from answers on error
      updateAnswer('discount_code_entered', '');
      updateAnswer('discount_id', '');
      updateAnswer('discount_code', '');
      updateAnswer('discount_amount', 0);
      updateAnswer('discount_description', '');
      updateAnswer('discount_data', null);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveDiscount = () => {
    setDiscountCode("");
    setDiscountError("");
    setAppliedDiscount(null);
    // Clear discount data from answers
    updateAnswer('discount_code_entered', '');
    updateAnswer('discount_id', '');
    updateAnswer('discount_code', '');
    updateAnswer('discount_amount', 0);
    updateAnswer('discount_description', '');
    updateAnswer('discount_data', null);
  };

  const selectedMedication = answers["selected_medication"] || "Medication";
  const planName =
    selectedPlan?.name || answers["selected_plan_name"] || "Selected Plan";
  const planPrice =
    selectedPlan?.invoice_amount || answers["selected_plan_price"] || 299;

  // Determine CTA text and title based on user state
  const ctaText = isExistingCustomer
    ? "Update & Continue"
    : "Complete Purchase";

  const formTitle = isExistingCustomer
    ? `Welcome back, ${userName}!`
    : hasJustCreatedAccount
    ? "Complete Your Profile"
    : "Create Your Account";

  const formSubtitle = isExistingCustomer
    ? "Please confirm your delivery information"
    : "Just a few more details for delivery and payment";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl p-6 shadow-sm border border-[#E8E8E8]"
      >
        {/* Plan Summary */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#E0F5F3] flex items-center justify-center">
              <Package className="w-5 h-5 text-[#00A896]" />
            </div>
            <div>
              <h3 className="text-[#2D3436] font-medium">{planName}</h3>
              <p className="text-sm text-[#666666]">{selectedMedication}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-[#00A896]">${planPrice}</div>
            <div className="text-xs text-[#666666]">/month</div>
          </div>
        </div>

        {/* Payment Info */}
        <div className="pt-4 border-t border-[#E8E8E8]">
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-sm text-[#666666]">Due today</span>
            <span className="text-xl font-bold text-[#00A896]">$0</span>
          </div>
          <p className="text-xs text-[#666666] leading-relaxed">
            You'll be charged ${planPrice}/month once prescribed. No charge if not approved.
          </p>
        </div>

        {/* Discount Code Section */}
        <details className="group pt-5 border-t border-[#E8E8E8]">
          <summary className="flex items-center justify-between cursor-pointer list-none">
            <span className="text-sm text-[#2D3436]">
              Have a discount code?
            </span>
            <svg
              className="w-5 h-5 text-[#666666] transition-transform group-open:rotate-180"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </summary>
          <div className="pt-4">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter code"
                className="flex-1 px-4 py-2.5 rounded-xl border-2 border-[#E8E8E8] focus:border-[#00A896] focus:outline-none transition-colors text-sm text-[#2D3436] placeholder:text-[#666666]"
                value={discountCode}
                onChange={(event) => {
                  setDiscountCode(event.target.value.toUpperCase());
                  setDiscountError("");
                }}
              />
              <button
                type="button"
                onClick={handleApplyDiscount}
                disabled={loading || !discountCode.trim()}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${
                  loading || !discountCode.trim()
                    ? "bg-stone-200 text-stone-500 cursor-not-allowed"
                    : "bg-primary text-white hover:bg-primary/90"
                }`}
              >
                {loading ? "Applying…" : "Apply"}
              </button>
            </div>
          </div>

          {appliedDiscount && (
            <div className="mt-3 p-4 bg-emerald-50 border-2 border-emerald-500 rounded-lg">
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
                    <span className="font-semibold text-emerald-800">
                      Discount applied!
                    </span>
                  </div>
                  <p className="text-stone-700">
                    <span className="font-medium">Code:</span>{" "}
                    {appliedDiscount.code}
                  </p>
                  <p className="text-stone-700">
                    <span className="font-medium">Discount:</span>{" "}
                    {appliedDiscount.percentage > 0
                      ? `${appliedDiscount.percentage}% off`
                      : `$${appliedDiscount.amount} off`}
                  </p>
                  {appliedDiscount.description && (
                    <p className="text-stone-600 text-sm">
                      {appliedDiscount.description}
                    </p>
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
        </details>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl p-6 shadow-sm border border-[#E8E8E8] space-y-5"
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#E0F5F3] flex items-center justify-center">
            <Package className="w-4 h-4 text-[#00A896]" />
          </div>
          <h3 className="text-[#2D3436]">Delivery Information</h3>
        </div>

        <div>
          <label className="block text-sm text-[#2D3436] mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border-2 ${
              errors.phone ? "border-[#FF6B6B]" : "border-[#E8E8E8]"
            } focus:border-[#00A896] focus:outline-none transition-colors text-[#2D3436] placeholder:text-[#666666]`}
            placeholder="(555) 123-4567"
            autoComplete="tel"
          />
          {errors.phone && (
            <p className="text-sm text-[#FF6B6B] mt-1.5">{errors.phone}</p>
          )}
        </div>

        <div>
          <label className="block text-sm text-[#2D3436] mb-2">
            Street Address
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border-2 ${
              errors.address ? "border-[#FF6B6B]" : "border-[#E8E8E8]"
            } focus:border-[#00A896] focus:outline-none transition-colors text-[#2D3436] placeholder:text-[#666666]`}
            placeholder="123 Main St"
          />
          {errors.address && (
            <p className="text-sm text-[#FF6B6B] mt-1.5">{errors.address}</p>
          )}
        </div>

        <div>
          <label className="block text-sm text-[#2D3436] mb-2">
            Apartment, Suite, etc.{" "}
            <span className="text-[#666666]">(Optional)</span>
          </label>
          <input
            type="text"
            value={address2}
            onChange={(e) => setAddress2(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border-2 border-[#E8E8E8] focus:border-[#00A896] focus:outline-none transition-colors text-[#2D3436] placeholder:text-[#666666]"
            placeholder="Apt 4B"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-1">
            <label className="block text-sm text-[#2D3436] mb-2">City</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border-2 ${
                errors.city ? "border-[#FF6B6B]" : "border-[#E8E8E8]"
              } focus:border-[#00A896] focus:outline-none transition-colors text-[#2D3436] placeholder:text-[#666666]`}
              placeholder="New York"
            />
            {errors.city && (
              <p className="text-sm text-[#FF6B6B] mt-1.5">{errors.city}</p>
            )}
          </div>

          <div className="col-span-1">
            <label className="block text-sm text-[#2D3436] mb-2">State</label>
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
              placeholder="Select"
            />
            {errors.state && (
              <p className="text-sm text-[#FF6B6B] mt-1.5">{errors.state}</p>
            )}
          </div>

          <div className="col-span-1">
            <label className="block text-sm text-[#2D3436] mb-2">
              ZIP Code
            </label>
            <input
              type="text"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border-2 ${
                errors.zipCode ? "border-[#FF6B6B]" : "border-[#E8E8E8]"
              } focus:border-[#00A896] focus:outline-none transition-colors text-[#2D3436] placeholder:text-[#666666]`}
              placeholder="10001"
              maxLength={5}
            />
            {errors.zipCode && (
              <p className="text-sm text-[#FF6B6B] mt-1.5">{errors.zipCode}</p>
            )}
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="bg-white rounded-2xl p-6 shadow-sm border border-[#E8E8E8] space-y-5"
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#E0F5F3] flex items-center justify-center">
            <Camera className="w-4 h-4 text-[#00A896]" />
          </div>
          <h3 className="text-[#2D3436]">ID Verification</h3>
        </div>

        <div>
          <label className="block text-sm text-[#2D3436] mb-2 font-medium">
            Upload a photo of your ID
          </label>
          <p className="text-xs text-[#666666] mb-3">
            We need a clear photo of your driver's license or government-issued ID for verification
          </p>
          
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleIdPhotoChange}
              className="hidden"
              id="id-photo-upload"
            />
            <label
              htmlFor="id-photo-upload"
              className={`flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                errors.idPhoto 
                  ? 'border-[#FF6B6B] bg-red-50' 
                  : idPhotoPreview
                  ? 'border-[#00A896] bg-[#E0F5F3]/30'
                  : 'border-[#E8E8E8] hover:border-[#00A896] hover:bg-[#E0F5F3]/10'
              }`}
            >
              {idPhotoPreview ? (
                <div className="w-full space-y-3">
                  <img
                    src={idPhotoPreview}
                    alt="ID preview"
                    className="w-full h-48 object-contain rounded-lg"
                  />
                  <div className="flex items-center justify-center gap-2 text-[#00A896]">
                    <Check className="w-5 h-5" />
                    <span className="text-sm font-medium">ID uploaded</span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById('id-photo-upload')?.click();
                    }}
                    className="w-full px-4 py-2 text-sm text-[#00A896] hover:text-[#008577] transition-colors"
                  >
                    Change photo
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <Camera className="w-12 h-12 mx-auto mb-3 text-[#00A896]" />
                  <p className="text-sm text-[#2D3436] mb-1 font-medium">
                    Take or upload a photo
                  </p>
                  <p className="text-xs text-[#666666]">
                    PNG, JPG up to 10MB
                  </p>
                </div>
              )}
            </label>
          </div>
          {errors.idPhoto && (
            <p className="text-sm text-[#FF6B6B] mt-1.5">{errors.idPhoto}</p>
          )}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl p-6 shadow-sm border border-[#E8E8E8] space-y-5"
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#E0F5F3] flex items-center justify-center">
            <CreditCard className="w-4 h-4 text-[#00A896]" />
          </div>
          <h3 className="text-[#2D3436]">Payment Method</h3>
        </div>

        {stripePromise && setupIntentClientSecret ? (
          <Elements
            stripe={stripePromise}
            options={{ clientSecret: setupIntentClientSecret }}
          >
            <div className="rounded-xl border-2 border-neutral-200 p-3">
              <PaymentElement options={{ layout: "tabs" }} />
            </div>
          </Elements>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-[#2D3436] mb-2">
                Card Number{" "}
                <span className="text-[#666666] text-xs">(Demo Mode)</span>
              </label>
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => {
                  const value = e.target.value.replace(/\s/g, '').replace(/\D/g, '');
                  const formatted = value.match(/.{1,4}/g)?.join(' ') || value;
                  setCardNumber(formatted);
                  if (errors.cardNumber) {
                    setErrors(prev => {
                      const { cardNumber: _, ...rest } = prev;
                      return rest;
                    });
                  }
                }}
                className={`w-full px-4 py-3 rounded-xl border-2 ${
                  errors.cardNumber ? "border-[#FF6B6B]" : "border-[#E8E8E8]"
                } focus:border-[#00A896] focus:outline-none transition-colors text-[#2D3436] placeholder:text-[#666666]`}
                placeholder="4242 4242 4242 4242"
                maxLength={19}
              />
              {errors.cardNumber && (
                <p className="text-sm text-[#FF6B6B] mt-1.5">
                  {errors.cardNumber}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-[#2D3436] mb-2">
                  Expiry Date
                </label>
                <input
                  type="text"
                  value={expiryDate}
                  onChange={(e) => {
                    let value = e.target.value.replace(/\D/g, '');
                    
                    // Limit to 4 digits
                    if (value.length > 4) {
                      value = value.slice(0, 4);
                    }
                    
                    // Auto-format as MM/YY
                    if (value.length >= 2) {
                      value = value.slice(0, 2) + '/' + value.slice(2);
                    }
                    
                    setExpiryDate(value);
                    if (errors.expiryDate) {
                      setErrors(prev => {
                        const { expiryDate: _, ...rest } = prev;
                        return rest;
                      });
                    }
                  }}
                  className={`w-full px-4 py-3 rounded-xl border-2 ${
                    errors.expiryDate ? "border-[#FF6B6B]" : "border-[#E8E8E8]"
                  } focus:border-[#00A896] focus:outline-none transition-colors text-[#2D3436] placeholder:text-[#666666]`}
                  placeholder="MM/YY"
                  maxLength={5}
                />
                {errors.expiryDate && (
                  <p className="text-sm text-[#FF6B6B] mt-1.5">
                    {errors.expiryDate}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm text-[#2D3436] mb-2">
                  CVV
                </label>
                <input
                  type="text"
                  value={cvv}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                    setCvv(value);
                    if (errors.cvv) {
                      setErrors(prev => {
                        const { cvv: _, ...rest } = prev;
                        return rest;
                      });
                    }
                  }}
                  className={`w-full px-4 py-3 rounded-xl border-2 ${
                    errors.cvv ? "border-[#FF6B6B]" : "border-[#E8E8E8]"
                  } focus:border-[#00A896] focus:outline-none transition-colors text-[#2D3436] placeholder:text-[#666666]`}
                  placeholder="123"
                  maxLength={4}
                />
                {errors.cvv && (
                  <p className="text-sm text-[#FF6B6B] mt-1.5">
                    {errors.cvv}
                  </p>
                )}
              </div>
            </div>

            <p className="text-xs text-[#666666]">
              Use any test card number for demo purposes
            </p>
          </div>
        )}

        {/* Security Badge */}
        <div className="flex items-center justify-center gap-2 pt-4 border-t border-[#E8E8E8]">
          <Shield className="w-4 h-4 text-[#00A896]" />
          <p className="text-xs text-[#666666]">
            256-bit SSL encryption • Your information is secure
          </p>
        </div>
      </motion.div>

      {errors.general && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-sm text-red-700">{errors.general}</p>
        </div>
      )}

      <NavigationButtons
        showBack={true}
        onBack={onBack}
        onNext={() => {
          const fakeEvent = {
            preventDefault: () => {},
          } as React.FormEvent<HTMLFormElement>;
          handleSubmit(fakeEvent);
        }}
        isNextDisabled={isProcessing}
        isNextLoading={isProcessing}
        nextLabel={isProcessing ? "Processing..." : ctaText}
        layout="grouped"
      />

      <p className="text-xs text-center text-neutral-500 mt-4">
        🔒 This is a demo form - no actual payment will be processed
      </p>
    </form>
  );
}

export default function AccountCreationScreen({
  screen,
  answers,
  updateAnswer,
  onSubmit,
  showBack,
  onBack,
  defaultCondition,
  showLoginLink,
}: ScreenProps & { key?: string }) {
  const selectedPlan = answers["selected_plan_details"] || {};
  const selectedMedication = answers["selected_medication"] || "Medication";

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
              style={{ letterSpacing: "-0.02em" }}
            >
              You made it! 🎉
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-base sm:text-lg text-neutral-600 leading-relaxed"
            >
              We just need your shipping address and ID to complete your order.
            </motion.p>
          </div>

          {/* Form */}
          <MockPaymentForm
            selectedPlan={selectedPlan}
            answers={answers}
            updateAnswer={updateAnswer}
            onComplete={(accountData) => {
              // Save account data to answers
              Object.entries(accountData).forEach(([key, value]) => {
                updateAnswer(`account_${key}`, value);
                if (key === "email" || key === "phone") {
                  updateAnswer(key, value);
                }
                if (key === "state") {
                  const stateCode = normalizeStateCode(value);
                  updateAnswer("state", stateCode);
                  updateAnswer("home_state", stateCode);
                  updateAnswer("shipping_state", stateCode);
                }
                if (key === "city") {
                  updateAnswer("city", value);
                  updateAnswer("shipping_city", value);
                }
                if (key === "address") {
                  updateAnswer("address_line1", value);
                  updateAnswer("shipping_address", value);
                }
                if (key === "address2") {
                  updateAnswer("address_line2", value);
                  updateAnswer("shipping_address2", value);
                }
                if (key === "zipCode") {
                  updateAnswer("zip_code", value);
                  updateAnswer("shipping_zip", value);
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
