import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import type { StripeElementsOptions } from '@stripe/stripe-js';

import { apiClient, CreatePaymentIntentPayload, InvoiceResponse, PaymentIntentResponse } from '../utils/api';

const BrandHeader: React.FC = () => (
  <header className="relative z-10 flex w-full items-center justify-between border-b border-emerald-100/70 bg-white/85 px-5 py-3 shadow-sm shadow-emerald-100/40 backdrop-blur md:px-8">
    <a href="https://zappyhealth.com" className="inline-flex items-center gap-3" aria-label="ZappyHealth home">
      <img
        src="https://zappyhealth.com/wp-content/uploads/2022/09/Zappy-logo-2.webp"
        srcSet="https://zappyhealth.com/wp-content/uploads/2022/09/Zappy-logo-2.webp 352w, https://zappyhealth.com/wp-content/uploads/2022/09/Zappy-logo-2-300x109.webp 300w"
        sizes="(max-width: 180px) 100vw, 180px"
        width={180}
        height={72}
        alt="ZappyHealth"
        loading="lazy"
        className="h-7 w-auto sm:h-8"
      />
      <span className="hidden text-sm font-semibold uppercase tracking-[0.24em] text-emerald-500/90 sm:inline">
        Payments
      </span>
    </a>
    <p className="hidden text-xs font-medium uppercase tracking-[0.32em] text-emerald-500/70 md:inline">
      Secure checkout
    </p>
  </header>
);

const ZERO_DECIMAL_CURRENCIES = new Set(['bif', 'clp', 'djf', 'gnf', 'jpy', 'kmf', 'krw', 'mga', 'pyg', 'rwf', 'uha', 'vnd', 'vuv', 'xaf', 'xof', 'xpf']);
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const formatCurrency = (amount: number | null, currency: string): string | null => {
  if (amount === null || amount === undefined || Number.isNaN(amount)) {
    return null;
  }

  const normalizedCurrency = (currency || 'usd').toLowerCase();
  const divisor = ZERO_DECIMAL_CURRENCIES.has(normalizedCurrency) ? 1 : 100;
  const value = amount / divisor;

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: normalizedCurrency.toUpperCase(),
    minimumFractionDigits: ZERO_DECIMAL_CURRENCIES.has(normalizedCurrency) ? 0 : 2,
  }).format(value);
};

const normalizeClientSecret = (response: PaymentIntentResponse | null | undefined): string | null => {
  if (!response) return null;
  return (response.client_secret ?? (response as Record<string, unknown>)?.clientSecret ?? null) as string | null;
};

const normalizePublishableKey = (response: PaymentIntentResponse | null | undefined): string | null => {
  if (!response) return null;
  return (response.publishable_key ?? (response as Record<string, unknown>)?.publishableKey ?? null) as string | null;
};

const normalizeAmount = (response: PaymentIntentResponse | null | undefined): number | null => {
  if (!response) return null;
  const amount = response.amount ?? (response as Record<string, unknown>)?.amount;
  return typeof amount === 'number' && !Number.isNaN(amount) ? amount : null;
};

const normalizeCurrency = (response: PaymentIntentResponse | null | undefined): string | null => {
  if (!response) return null;
  const currency = response.currency ?? (response as Record<string, unknown>)?.currency;
  return typeof currency === 'string' && currency.length > 0 ? currency : null;
};

const normalizeStatus = (response: PaymentIntentResponse | null | undefined): string | null => {
  if (!response) return null;
  const status = response.status ?? (response as Record<string, unknown>)?.status;
  return typeof status === 'string' ? status : null;
};

const normalizeEmail = (response: PaymentIntentResponse | null | undefined): string | null => {
  if (!response) return null;
  const email = response.customer_email ?? (response as Record<string, unknown>)?.customerEmail;
  return typeof email === 'string' && email.length > 0 ? email : null;
};

const normalizeDescription = (response: PaymentIntentResponse | null | undefined): string | null => {
  if (!response) return null;
  const description = (response as Record<string, unknown>)?.description;
  return typeof description === 'string' && description.length > 0 ? description : null;
};

const statusCopy: Record<string, string> = {
  requires_payment_method: 'Awaiting payment method',
  requires_confirmation: 'Awaiting confirmation',
  requires_action: 'Additional actions required',
  processing: 'Processing',
  succeeded: 'Paid',
  canceled: 'Canceled',
};

const statusToneClasses: Record<string, string> = {
  requires_payment_method: 'bg-amber-100 text-amber-700 border-amber-200',
  requires_confirmation: 'bg-amber-100 text-amber-700 border-amber-200',
  requires_action: 'bg-amber-100 text-amber-700 border-amber-200',
  processing: 'bg-sky-100 text-sky-700 border-sky-200',
  succeeded: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  canceled: 'bg-rose-100 text-rose-700 border-rose-200',
};

const StatusBadge: React.FC<{ status?: string | null }> = ({ status }) => {
  if (!status) return null;
  const normalized = status.toLowerCase();
  const label = statusCopy[normalized] ?? normalized.replace(/_/g, ' ');
  const tone = statusToneClasses[normalized] ?? 'bg-slate-100 text-slate-700 border-slate-200';

  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${tone}`}>
      {label}
    </span>
  );
};

type PrimitiveRecord = Record<string, unknown>;

interface PackageMetadataSummary {
  plan?: string | null;
  medication?: string | null;
  serviceType?: string | null;
  pharmacyId?: string | null;
}

interface DiscountMetadataSummary {
  code?: string | null;
  amount?: number | null;
  percentage?: number | null;
  description?: string | null;
}

interface InvoiceMetadataSummary {
  baseAmount?: number | null;
  finalAmount?: number | null;
  medication?: string | null;
  service?: string | null;
  pharmacy?: string | null;
  preferredPlan?: string | null;
  starterPack?: boolean | null;
  packageInfo?: PackageMetadataSummary | null;
  discountInfo?: DiscountMetadataSummary | null;
}

const parseRecord = (value: unknown): PrimitiveRecord | null => {
  if (!value) return null;

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        return parsed as PrimitiveRecord;
      }
    } catch {
      return null;
    }
    return null;
  }

  if (typeof value === 'object' && !Array.isArray(value)) {
    return value as PrimitiveRecord;
  }

  return null;
};

const coerceNumber = (value: unknown): number | null => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const cleaned = value.replace(/[$,\s]/g, '');
    const parsed = Number(cleaned);
    if (!Number.isNaN(parsed)) {
      return parsed;
    }
  }

  return null;
};

const coerceString = (value: unknown): string | null => {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  }

  return null;
};

const coerceBoolean = (value: unknown): boolean | null => {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (['true', 'yes', '1'].includes(normalized)) return true;
    if (['false', 'no', '0'].includes(normalized)) return false;
  }

  if (typeof value === 'number') {
    if (value === 0) return false;
    if (!Number.isNaN(value)) return true;
  }

  return null;
};

const getFirstValue = (sources: PrimitiveRecord[], keys: string[]): unknown => {
  for (const source of sources) {
    for (const key of keys) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        const value = source[key];
        if (value !== undefined && value !== null) {
          return value;
        }
      }
    }
  }
  return null;
};

const getFirstCoercedValue = <T,>(
  sources: PrimitiveRecord[],
  keys: string[],
  resolver: (value: unknown) => T | null
): T | null => {
  for (const source of sources) {
    for (const key of keys) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        const resolved = resolver(source[key]);
        if (resolved !== null && resolved !== undefined) {
          return resolved;
        }
      }
    }
  }
  return null;
};

const extractPackageSummary = (value: unknown): PackageMetadataSummary | null => {
  const record = parseRecord(value);
  if (!record) return null;

  const resolve = (keys: string[]) => getFirstCoercedValue([record], keys, coerceString);

  const summary: PackageMetadataSummary = {
    plan: resolve(['plan', 'name']),
    medication: resolve(['medication']),
    serviceType: resolve(['service_type', 'serviceType']),
    pharmacyId: resolve(['pharmacy', 'pharmacy_name', 'pharmacyName', 'pharmacy_id', 'pharmacyId']),
  };

  if (summary.plan || summary.medication || summary.serviceType || summary.pharmacyId) {
    return summary;
  }

  return null;
};

const extractDiscountSummary = (value: unknown): DiscountMetadataSummary | null => {
  const record = parseRecord(value);
  if (!record) return null;

  const summary: DiscountMetadataSummary = {
    code: getFirstCoercedValue([record], ['code', 'name'], coerceString),
    amount: getFirstCoercedValue([record], ['amount', 'value', 'discount_amount', 'discountAmount'], coerceNumber),
    percentage: getFirstCoercedValue([record], ['percentage', 'percent', 'discount_percentage', 'discountPercentage'], coerceNumber),
    description: getFirstCoercedValue([record], ['description'], coerceString),
  };

  if (summary.code || summary.amount || summary.percentage || summary.description) {
    return summary;
  }

  return null;
};

const extractInvoiceMetadataSummary = (
  invoice: InvoiceResponse | null,
  paymentIntent: PaymentIntentResponse | null
): InvoiceMetadataSummary | null => {
  const metadataSources: PrimitiveRecord[] = [];

  const invoiceMetadata = parseRecord(invoice?.metadata ?? null);
  if (invoiceMetadata) {
    metadataSources.push(invoiceMetadata);
  }

  const paymentIntentMetadata = parseRecord(paymentIntent?.metadata ?? null);
  if (paymentIntentMetadata) {
    metadataSources.push(paymentIntentMetadata);
  }

  if (metadataSources.length === 0) {
    return null;
  }

  const discountValue = getFirstValue(metadataSources, ['discount', 'discount_details', 'discountDetails']);
  let discountInfo = extractDiscountSummary(discountValue);
  if (!discountInfo) {
    const fallbackDiscount: DiscountMetadataSummary = {
      code: getFirstCoercedValue(metadataSources, ['discount_code', 'discountCode'], coerceString),
      amount: getFirstCoercedValue(metadataSources, ['discount_amount', 'discountAmount'], coerceNumber),
      percentage: getFirstCoercedValue(metadataSources, ['discount_percentage', 'discountPercentage'], coerceNumber),
      description: getFirstCoercedValue(
        metadataSources,
        ['discount_description', 'discountDescription'],
        coerceString
      ),
    };
    if (
      fallbackDiscount.code ||
      fallbackDiscount.amount ||
      fallbackDiscount.percentage ||
      fallbackDiscount.description
    ) {
      discountInfo = fallbackDiscount;
    }
  }

  const summary: InvoiceMetadataSummary = {
    baseAmount: getFirstCoercedValue(metadataSources, ['base_amount', 'baseAmount'], coerceNumber),
    finalAmount:
      getFirstCoercedValue(metadataSources, ['final_amount', 'finalAmount'], coerceNumber) ??
      coerceNumber(invoice?.amount_due ?? invoice?.amountDue),
    medication: getFirstCoercedValue(metadataSources, ['medication'], coerceString),
    service: getFirstCoercedValue(metadataSources, ['service', 'service_type', 'serviceType'], coerceString),
    pharmacy: getFirstCoercedValue(metadataSources, ['pharmacy', 'pharmacy_name', 'pharmacyName'], coerceString),
    preferredPlan: getFirstCoercedValue(
      metadataSources,
      ['preferred_plan', 'preferredPlan', 'package_plan', 'packagePlan'],
      coerceString
    ),
    starterPack: getFirstCoercedValue(metadataSources, ['starter_pack', 'starterPack'], coerceBoolean),
    discountInfo: discountInfo ?? null,
  };

  const packageValue = getFirstValue(metadataSources, ['package', 'package_details', 'packageDetails']);
  let packageInfo = extractPackageSummary(packageValue);
  if (!packageInfo) {
    const fallbackPackage: PackageMetadataSummary = {
      plan: getFirstCoercedValue(metadataSources, ['package_plan', 'packagePlan'], coerceString),
      medication: getFirstCoercedValue(metadataSources, ['package_medication', 'packageMedication'], coerceString),
      serviceType: getFirstCoercedValue(metadataSources, ['package_service_type', 'packageServiceType'], coerceString),
      pharmacyId: getFirstCoercedValue(
        metadataSources,
        ['package_pharmacy_id', 'packagePharmacyId', 'package_pharmacy_name', 'packagePharmacyName'],
        coerceString
      ),
    };

    if (fallbackPackage.plan || fallbackPackage.medication || fallbackPackage.serviceType || fallbackPackage.pharmacyId) {
      packageInfo = fallbackPackage;
    }
  }

  summary.packageInfo = packageInfo ?? null;

  if (
    summary.baseAmount === null &&
    summary.finalAmount === null &&
    !summary.medication &&
    !summary.service &&
    !summary.pharmacy &&
    !summary.preferredPlan &&
    summary.starterPack === null &&
    !summary.packageInfo &&
    !summary.discountInfo
  ) {
    return null;
  }

  return summary;
};

const formatCurrencyFromMajorUnits = (amount: number | null | undefined, currency: string): string | null => {
  if (amount === null || amount === undefined || Number.isNaN(amount)) {
    return null;
  }

  const normalizedCurrency = (currency || 'usd').toLowerCase();
  const multiplier = ZERO_DECIMAL_CURRENCIES.has(normalizedCurrency) ? 1 : 100;
  return formatCurrency(Math.round(amount * multiplier), currency);
};

interface FeedbackMessage {
  type: 'success' | 'error' | 'info';
  text: string;
}

interface CheckoutFormProps {
  clientSecret: string;
  amountLabel?: string;
  onStatusChange: (status: string) => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({
  clientSecret,
  amountLabel,
  onStatusChange,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackMessage | null>(null);
  const redirectTimerRef = React.useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (redirectTimerRef.current) {
        window.clearTimeout(redirectTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    let isActive = true;
    const loadStatus = async () => {
      if (!stripe || !clientSecret) return;
      const result = await stripe.retrievePaymentIntent(clientSecret);
      if (!isActive) return;

      if (result.error) {
        setFeedback({
          type: 'error',
          text: result.error.message ?? 'Unable to retrieve payment status.',
        });
        return;
      }

      if (result.paymentIntent) {
        onStatusChange(result.paymentIntent.status);
      }
    };

    loadStatus();
    return () => {
      isActive = false;
    };
  }, [stripe, clientSecret, onStatusChange]);

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!stripe || !elements) return;

      setIsProcessing(true);
      setFeedback(null);

      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
      });

      if (error) {
        setFeedback({
          type: 'error',
          text: error.message ?? 'Your payment could not be processed. Please try again.',
        });
        setIsProcessing(false);
        return;
      }

      if (paymentIntent) {
        onStatusChange(paymentIntent.status);

        const isSuccess = paymentIntent.status === 'succeeded';
        setFeedback({
          type: isSuccess ? 'success' : 'info',
          text: isSuccess
            ? 'Payment complete! Redirecting you to ZappyHealth…'
            : `Payment status: ${paymentIntent.status}`,
        });

        if (isSuccess) {
          redirectTimerRef.current = window.setTimeout(() => {
            window.location.href = 'https://zappyhealth.com';
          }, 3000);
        } else {
          setIsProcessing(false);
        }
      } else {
        setFeedback({
          type: 'info',
          text: 'Payment confirmation in progress. Please check back soon.',
        });
        setIsProcessing(false);
      }
    },
    [stripe, elements, onStatusChange]
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-2xl border border-primary/20 bg-white/95 p-5 shadow-sm shadow-primary/10">
        <PaymentElement options={{ layout: 'tabs' }} />
      </div>

      {feedback && (
        <div
          className={`rounded-md border px-4 py-3 text-sm ${
            feedback.type === 'success'
              ? 'border-primary/30 bg-primary/10 text-primary'
              : feedback.type === 'error'
                ? 'border-rose-200 bg-rose-50 text-rose-700'
                : 'border-emerald-200 bg-emerald-50 text-emerald-800'
          }`}
        >
          {feedback.text}
        </div>
      )}

      <button
        type="submit"
        disabled={isProcessing || !stripe || !elements}
        className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-primary via-emerald-500 to-emerald-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition duration-200 hover:shadow-primary/40 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:shadow-primary/30"
      >
        {isProcessing
          ? 'Paying...'
          : amountLabel
            ? `Pay ${amountLabel}`
            : 'Pay now'}
      </button>

      <div className="text-xs text-slate-500">
        Your payment details are securely processed by Stripe.
      </div>
    </form>
  );
};

const LoadingState: React.FC = () => (
    <div className="min-h-screen bg-gradient-to-br from-background via-white to-primary/10 flex flex-col overflow-hidden">
      <div className="w-full px-4 pt-6 sm:px-6">
        <BrandHeader />
      </div>
      <div className="flex flex-1 items-center justify-center px-4 pb-10 sm:px-6">
      <div className="w-full max-w-sm rounded-[28px] border border-primary/20 bg-white px-10 py-12 text-center shadow-xl shadow-primary/15">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-primary/30 bg-primary/10">
          <div className="h-9 w-9 animate-spin rounded-full border-3 border-primary/40 border-t-primary" />
        </div>
        <h2 className="mt-6 text-lg font-semibold text-slate-800">Preparing your payment session…</h2>
        <p className="mt-3 text-sm text-slate-500">
          Securely loading Stripe checkout. This should only take a moment.
        </p>
      </div>
    </div>
  </div>
);

const ErrorState: React.FC<{ message: string }> = ({ message }) => (
    <div className="min-h-screen bg-gradient-to-br from-background via-white to-primary/10 flex flex-col overflow-hidden">
      <div className="w-full px-4 pt-6 sm:px-6">
        <BrandHeader />
      </div>
      <div className="flex flex-1 items-center justify-center px-4 pb-10">
      <div className="w-full max-w-xl overflow-hidden rounded-[32px] border border-primary/15 bg-white shadow-xl shadow-primary/15">
        <div className="relative bg-gradient-to-b from-primary/10 via-white to-white px-10 pb-16 pt-20 text-center">
          <div className="absolute -top-12 left-1/2 h-24 w-24 -translate-x-1/2 rounded-full bg-gradient-to-b from-primary to-emerald-500 shadow-lg shadow-primary/30">
            <div className="absolute inset-0 animate-ping rounded-full bg-primary/40 blur-md" />
            <div className="relative flex h-full w-full items-center justify-center text-white">
              <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              className="h-10 w-10"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4.25m9.303 1.077-8.315-11.1a1.125 1.125 0 0 0-1.837 0l-8.315 11.1A1.125 1.125 0 0 0 3.685 16.5h16.63a1.125 1.125 0 0 0 .988-1.173zM12 16.5h.007v.007H12z" />
            </svg>
          </div>
        </div>
        <h1 className="text-3xl font-semibold text-slate-900">We couldn&apos;t start the payment</h1>
        <p className="mt-3 text-sm font-medium text-slate-600">
          Something stopped this checkout from loading. Let&apos;s get you back on track.
        </p>
      </div>
      <div className="space-y-9 px-10 pb-12 pt-2 sm:px-14">
        <div className="rounded-3xl border border-primary/20 bg-gradient-to-r from-primary/10 via-white to-primary/10 px-6 py-5 text-sm text-slate-700 shadow-inner shadow-primary/10">
          <span className="font-semibold text-primary">Details:</span> {message}
        </div>
        <div className="grid gap-8 text-left text-sm text-slate-600 sm:grid-cols-2">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-primary/80">Try these steps</p>
            <ul className="space-y-2 rounded-2xl border border-primary/20 bg-white px-5 py-4 shadow-inner shadow-primary/10">
              <li className="text-slate-600">• Refresh this page</li>
              <li className="text-slate-600">• Reopen the link from your email</li>
              <li className="text-slate-600">• Use the device you originally requested with</li>
            </ul>
          </div>
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-primary/80">Need help?</p>
            <div className="rounded-2xl border border-primary/20 bg-white px-5 py-4 text-sm leading-relaxed text-slate-600 shadow-inner shadow-primary/10">
              Reach out to <span className="font-semibold text-primary">support@zappyhealth.com</span> and share this
              message. We&apos;ll get you squared away right away.
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  </div>
);


const PaidInvoiceView: React.FC<{
  amountLabel?: string | null;
  invoiceReference?: string | null;
  customerEmail?: string | null;
  description?: string | null;
}> = ({ amountLabel, invoiceReference, customerEmail, description }) => {
  useEffect(() => {
    const timer = window.setTimeout(() => {
      window.location.href = 'https://zappyhealth.com';
    }, 3000);
    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-white to-emerald-50 flex flex-col overflow-hidden">
      <div className="w-full px-4 pt-6 sm:px-6">
        <BrandHeader />
      </div>
      <div className="flex flex-1 flex-col items-center justify-center px-4 pb-10">
        <div className="w-full max-w-xl rounded-[32px] border border-emerald-100 bg-white p-10 text-center shadow-xl shadow-emerald-100">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-9 w-9"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h1 className="mt-6 text-2xl font-semibold text-slate-900">Invoice already paid</h1>
          <p className="mt-3 text-sm text-slate-600">
            Thanks for taking care of this invoice. We&apos;re redirecting you back to ZappyHealth—feel free to close
            this tab if you&apos;re not automatically redirected.
          </p>
          <div className="mt-8 space-y-4 rounded-3xl border border-emerald-100 bg-emerald-50/60 p-6 text-left shadow-inner shadow-emerald-100/60">
            {amountLabel && (
              <div className="flex items-center justify-between text-sm font-medium text-slate-900">
                <span>Paid amount</span>
                <span>{amountLabel}</span>
              </div>
            )}
            {invoiceReference && (
              <div className="text-sm text-slate-600">
                <span className="font-semibold text-slate-800">Invoice</span> {invoiceReference}
              </div>
            )}
            {customerEmail && (
              <div className="text-sm text-slate-600">
                <span className="font-semibold text-slate-800">Receipt sent to</span> {customerEmail}
              </div>
            )}
            {description && (
              <div className="text-sm text-slate-600">
                <span className="font-semibold text-slate-800">Description</span> {description}
              </div>
            )}
          </div>
          <div className="mt-10 flex items-center justify-center gap-2 text-xs uppercase tracking-wide text-emerald-600">
            <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
            Redirecting you in&nbsp;<span className="font-semibold">3 seconds</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const PaymentApp: React.FC = () => {
  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [intentStatus, setIntentStatus] = useState<string | null>(null);
  const [amount, setAmount] = useState<number | null>(null);
  const [currency, setCurrency] = useState<string>('usd');
  const [customerEmail, setCustomerEmail] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  const [invoiceDetails, setInvoiceDetails] = useState<InvoiceResponse | null>(null);
  const [paymentIntentDetails, setPaymentIntentDetails] = useState<PaymentIntentResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const setStripeFromKey = useCallback((key: string | null | undefined) => {
    if (!key) return false;
    setStripePromise(loadStripe(key));
    return true;
  }, []);

  const initializeFromResponse = useCallback(
    (response: PaymentIntentResponse, fallbackCurrency?: string | null, fallbackAmount?: number | null) => {
      const clientSecretFromResponse = normalizeClientSecret(response);
      if (!clientSecretFromResponse) {
        throw new Error('The payment intent response did not include a client secret.');
      }
      setClientSecret(clientSecretFromResponse);
      setIntentStatus(normalizeStatus(response));
      const amountFromResponse = normalizeAmount(response);
      if (amountFromResponse !== null) {
        setAmount(amountFromResponse);
      } else if (fallbackAmount !== null && fallbackAmount !== undefined) {
        setAmount(fallbackAmount);
      }
      const currencyFromResponse = normalizeCurrency(response) ?? fallbackCurrency ?? 'usd';
      setCurrency(currencyFromResponse);
      const emailFromResponse = normalizeEmail(response);
      if (emailFromResponse) {
        setCustomerEmail(emailFromResponse);
      }
      const descriptionFromResponse = normalizeDescription(response);
      if (descriptionFromResponse) {
        setDescription(descriptionFromResponse);
      }
    },
    []
  );


  useEffect(() => {
    let isActive = true;
    const initialize = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const queryClientSecret = params.get('client_secret');
        const queryIntentId = params.get('payment_intent') ?? params.get('intent_id');
        const amountParam = params.get('amount');
        const parsedAmountParam = amountParam !== null ? Number(amountParam) : null;
        if (amountParam !== null && Number.isNaN(parsedAmountParam)) {
          throw new Error('Amount must be a numeric value in the currency\'s smallest unit (for USD, that\'s cents).');
        }
        const currencyParam = params.get('currency');
        const emailParam = params.get('email');
        const descriptionParam = params.get('description');
        const suppliedPublishableKey = params.get('publishable_key') ?? params.get('pk_test');
        const invoiceParam = params.get('invoice_id') ?? params.get('invoiceId');
        const pathSegments = window.location.pathname.split('/').filter(Boolean);
        const pathInvoiceId = [...pathSegments].reverse().find((segment) => UUID_REGEX.test(segment)) ?? null;
        const invoiceId = invoiceParam ?? pathInvoiceId ?? null;

        const publishableKey = suppliedPublishableKey ?? import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
        if (!setStripeFromKey(publishableKey)) {
          throw new Error('Stripe publishable key is not configured. Provide VITE_STRIPE_PUBLISHABLE_KEY or pass publishable_key in the URL.');
        }

        if (descriptionParam) {
          setDescription(descriptionParam);
        }
        if (emailParam) {
          setCustomerEmail(emailParam);
        }
        if (currencyParam) {
          setCurrency(currencyParam);
        }

        setPaymentIntentDetails(null);
        setInvoiceDetails(null);

        if (invoiceId) {
          const response = await apiClient.getInvoicePaymentIntent(invoiceId);
          if (!isActive) return;

          const invoiceData = response?.invoice ?? null;
          setInvoiceDetails(invoiceData ?? null);

          const invoiceCurrency = (invoiceData?.currency ?? undefined) as string | undefined;
          const amountDueRaw = (invoiceData?.amount_due ?? invoiceData?.amountDue) as number | null | undefined;
          let fallbackAmountFromInvoice: number | null = null;
          if (typeof amountDueRaw === 'number' && !Number.isNaN(amountDueRaw)) {
            const currencyForAmount = (invoiceCurrency ?? currencyParam ?? 'usd').toLowerCase();
            const multiplier = ZERO_DECIMAL_CURRENCIES.has(currencyForAmount) ? 1 : 100;
            fallbackAmountFromInvoice = Math.round(amountDueRaw * multiplier);
          }

          const paymentIntentData =
            response?.payment_intent ??
            response?.paymentIntent ??
            (invoiceData?.payment_intent_payload as PaymentIntentResponse | undefined) ??
            (invoiceData?.paymentIntentPayload as PaymentIntentResponse | undefined);

          if (!paymentIntentData) {
            throw new Error('Payment intent is not available for this invoice yet.');
          }

          const keyFromResponse = normalizePublishableKey(paymentIntentData);
          if (keyFromResponse) {
            setStripeFromKey(keyFromResponse);
          }

          setPaymentIntentDetails(paymentIntentData ?? null);

          initializeFromResponse(
            paymentIntentData,
            invoiceCurrency ?? currencyParam,
            fallbackAmountFromInvoice
          );

          const invoiceDescription =
            typeof invoiceData?.description === 'string' && invoiceData.description.trim().length > 0
              ? invoiceData.description
              : null;
          if (invoiceDescription) {
            setDescription(invoiceDescription);
          }

          let derivedInvoiceEmail: string | null = null;
          if (invoiceData) {
            const potentialEmail = invoiceData.client_email ?? invoiceData.clientEmail;
            if (typeof potentialEmail === 'string' && potentialEmail.length > 0) {
              derivedInvoiceEmail = potentialEmail;
            }
          }
          if (derivedInvoiceEmail) {
            setCustomerEmail(derivedInvoiceEmail);
          }

          const statusFromIntent = normalizeStatus(paymentIntentData);
          const invoiceStatus =
            typeof invoiceData?.status === 'string' && invoiceData.status.length > 0 ? invoiceData.status : null;
          if (!statusFromIntent && invoiceStatus) {
            setIntentStatus(invoiceStatus);
          }

          setIsLoading(false);
          return;
        }

        if (queryClientSecret) {
          setClientSecret(queryClientSecret);
          if (parsedAmountParam !== null) {
            setAmount(parsedAmountParam);
          }
          setPaymentIntentDetails(null);
          setIsLoading(false);
          return;
        }

        if (queryIntentId) {
          const response = await apiClient.getPaymentIntent(queryIntentId);
          if (!isActive) return;

          const keyFromResponse = normalizePublishableKey(response);
          if (keyFromResponse) {
            setStripeFromKey(keyFromResponse);
          }

          setPaymentIntentDetails(response ?? null);
          initializeFromResponse(response, currencyParam, parsedAmountParam);
          setIsLoading(false);
          return;
        }

        if (parsedAmountParam !== null) {
          const payload: CreatePaymentIntentPayload = {
            currency: currencyParam ?? undefined,
            email: emailParam ?? undefined,
            plan_id: params.get('plan_id') ?? undefined,
            planId: params.get('planId') ?? undefined,
          };
          payload.amount = parsedAmountParam;

          const response = await apiClient.createPaymentIntent(payload);
          if (!isActive) return;

          const keyFromResponse = normalizePublishableKey(response);
          if (keyFromResponse) {
            setStripeFromKey(keyFromResponse);
          }

          setPaymentIntentDetails(response ?? null);
          initializeFromResponse(response, currencyParam, parsedAmountParam);
          setIsLoading(false);
          return;
        }

        throw new Error('Missing payment intent data. Include client_secret, payment_intent, or amount in the URL.');
      } catch (err) {
        if (!isActive) return;
        console.error('[PaymentApp] Failed to initialize payment intent', err);
        setError(err instanceof Error ? err.message : 'Unable to initialize payment intent.');
        setIsLoading(false);
      }
    };

    initialize();
    return () => {
      isActive = false;
    };
  }, [initializeFromResponse, setStripeFromKey]);

  const formattedAmount = useMemo(() => formatCurrency(amount, currency), [amount, currency]);

  const metadataSummary = useMemo(
    () => extractInvoiceMetadataSummary(invoiceDetails, paymentIntentDetails),
    [invoiceDetails, paymentIntentDetails]
  );

  const metadataBaseAmount = metadataSummary?.baseAmount ?? null;
  const metadataFinalAmount = metadataSummary?.finalAmount ?? null;
  const packageSummary = metadataSummary?.packageInfo ?? null;
  const discountSummary = metadataSummary?.discountInfo ?? null;

  const baseAmountLabel = useMemo(
    () => formatCurrencyFromMajorUnits(metadataBaseAmount, currency),
    [metadataBaseAmount, currency]
  );
  const discountAmountValue = discountSummary?.amount ?? null;
  const discountAmountLabel = useMemo(
    () => formatCurrencyFromMajorUnits(discountAmountValue, currency),
    [discountAmountValue, currency]
  );
  const amountDueLabel = formattedAmount ?? formatCurrencyFromMajorUnits(metadataFinalAmount, currency);

  const packagePlanLabel = metadataSummary?.preferredPlan ?? packageSummary?.plan ?? null;
  const serviceLabel = metadataSummary?.service ?? packageSummary?.serviceType ?? null;
  const medicationLabel = metadataSummary?.medication ?? packageSummary?.medication ?? null;
  const pharmacyLabel =
    metadataSummary?.pharmacy ?? packageSummary?.pharmacyId ?? null;
  const starterPackValue = metadataSummary?.starterPack;
  const starterPackLabel =
    typeof starterPackValue === 'boolean' ? (starterPackValue ? 'Yes' : 'No') : null;

  const discountPercentageLabel =
    discountSummary && typeof discountSummary.percentage === 'number' && discountSummary.percentage > 0
      ? `${discountSummary.percentage}%`
      : null;

  const shouldShowPackageCard = Boolean(
    packagePlanLabel || serviceLabel || medicationLabel || pharmacyLabel || starterPackLabel
  );

  const shouldShowDiscountCard = Boolean(
    discountSummary &&
      (discountSummary.code || discountAmountLabel || discountPercentageLabel || discountSummary.description)
  );

  const shouldShowAmountBreakdown = Boolean(baseAmountLabel || discountAmountLabel);

  const invoiceReference = useMemo(() => {
    if (!invoiceDetails) return null;
    if (typeof invoiceDetails.number === 'string' && invoiceDetails.number.trim().length > 0) {
      return invoiceDetails.number.trim();
    }
    if (typeof invoiceDetails.id === 'string' && invoiceDetails.id.length > 0) {
      return `${invoiceDetails.id.slice(0, 8)}…`;
    }
    return null;
  }, [invoiceDetails]);

  const dueDateLabel = useMemo(() => {
    const rawDueDate = invoiceDetails?.due_date ?? invoiceDetails?.dueDate;
    if (!rawDueDate || typeof rawDueDate !== 'string') return null;
    const parsed = new Date(rawDueDate);
    if (Number.isNaN(parsed.getTime())) return null;
    return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(parsed);
  }, [invoiceDetails]);

  const elementsOptions = useMemo<StripeElementsOptions | undefined>(() => {
    if (!clientSecret) return undefined;
    return {
      clientSecret,
      appearance: {
        theme: 'stripe',
        variables: {
          colorPrimary: '#10b981',
          fontFamily: '"Nunito Sans", sans-serif',
        },
      },
    };
  }, [clientSecret]);

  const statusToDisplay = intentStatus ?? invoiceDetails?.status ?? null;

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  const normalizedStatus = statusToDisplay?.toLowerCase();
  const isPaid =
    normalizedStatus === 'succeeded' ||
    normalizedStatus === 'paid' ||
    normalizedStatus === 'completed';

  if (isPaid) {
    return (
      <PaidInvoiceView
        amountLabel={amountDueLabel ?? undefined}
        invoiceReference={invoiceReference}
        customerEmail={customerEmail}
        description={description}
      />
    );
  }

  if (!clientSecret || !stripePromise || !elementsOptions) {
    return <ErrorState message="Payment could not be initialized. Please refresh and try again." />;
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-gradient-to-br from-emerald-50 via-white to-sky-50">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 right-[-120px] h-72 w-72 rounded-full bg-emerald-200/40 blur-3xl" />
        <div className="absolute bottom-[-140px] left-[-80px] h-64 w-64 rounded-full bg-teal-200/35 blur-3xl" />
      </div>
      <div className="relative flex h-full flex-col">
        <BrandHeader />
        <div className="relative flex flex-1 flex-col px-0 pb-0 pt-4">
          <div className="relative flex h-full w-full flex-col overflow-hidden rounded-none border-t border-emerald-100/60 bg-white/85 px-4 pb-5 pt-3.5 shadow-[0_30px_60px_-24px_rgba(15,118,110,0.45)] backdrop-blur-xl sm:px-6 lg:px-9">
            <div className="relative grid flex-1 min-h-0 w-full gap-5 overflow-hidden lg:grid-cols-[minmax(0,1.1fr),minmax(0,0.9fr)]">
              <section className="flex h-full min-w-0 flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto pr-1">
                  <div className="space-y-4">
                    <div className="rounded-[24px] border border-slate-200/70 bg-white/94 px-4 py-3 shadow-sm shadow-slate-200/40">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-[0.625rem] font-semibold uppercase tracking-[0.32em] text-emerald-500/80">Checkout</p>
                          <h2 className="mt-1 text-lg font-semibold text-slate-900">Payment method</h2>
                          <p className="mt-1 text-xs text-slate-600">
                            Enter your card information below to finalize this payment securely.
                          </p>
                        </div>
                        {amountDueLabel && (
                          <span className="hidden rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600 shadow-sm shadow-emerald-100 sm:inline">
                            Due {amountDueLabel}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="rounded-[28px] border border-slate-200/80 bg-white/92 shadow-lg shadow-slate-200/60">
                      <div className="overflow-hidden p-4">
                        <Elements stripe={stripePromise} options={elementsOptions}>
                          <CheckoutForm
                            clientSecret={clientSecret}
                            amountLabel={formattedAmount ?? undefined}
                            onStatusChange={setIntentStatus}
                          />
                        </Elements>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <aside className="flex h-full min-w-0 flex-col overflow-hidden rounded-[32px] border border-emerald-100/80 bg-emerald-50/80 p-4 shadow-inner shadow-emerald-100">
                <div className="flex-1 overflow-y-auto pr-1">
                  <div className="space-y-4">
                    <div className="overflow-hidden rounded-[28px] border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-emerald-50 p-4 shadow-inner">
                      <div className="flex flex-col gap-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <StatusBadge status={statusToDisplay} />
                          {description && (
                            <span className="inline-flex items-center rounded-full bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-500/80 shadow-sm shadow-emerald-100">
                              Preview
                            </span>
                          )}
                        </div>
                        <div>
                          <h2 className="text-xl font-semibold text-slate-900">Complete your payment</h2>
                          <p className="mt-1 text-sm text-slate-600">
                            Securely enter your details below. You&apos;ll receive a receipt as soon as the payment goes through.
                          </p>
                        </div>
                        {(invoiceReference || customerEmail) && (
                          <div className="grid gap-3 sm:grid-cols-2">
                            {invoiceReference && (
                              <div className="rounded-xl border border-emerald-100/80 bg-white/90 px-3 py-2 text-sm shadow-sm shadow-emerald-100/40">
                                <p className="text-[0.625rem] font-semibold uppercase tracking-[0.28em] text-emerald-500/80">Invoice</p>
                                <p className="mt-1 truncate font-medium text-slate-900" title={invoiceReference}>
                                  {invoiceReference}
                                </p>
                              </div>
                            )}
                            {customerEmail && (
                              <div className="rounded-xl border border-emerald-100/80 bg-white/90 px-3 py-2 text-sm shadow-sm shadow-emerald-100/40">
                                <p className="text-[0.625rem] font-semibold uppercase tracking-[0.28em] text-emerald-500/80">
                                  Receipt email
                                </p>
                                <p className="mt-1 truncate font-medium text-slate-900" title={customerEmail}>
                                  {customerEmail}
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="rounded-[28px] border border-emerald-100 bg-white/92 p-5 shadow-sm shadow-emerald-100/60">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-500 shadow-sm shadow-emerald-100">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            className="h-6 w-6"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-3-3v6m-7.5 7.5h15A2.25 2.25 0 0 0 21.75 19.5v-15A2.25 2.25 0 0 0 19.5 2.25h-15A2.25 2.25 0 0 0 2.25 4.5v15A2.25 2.25 0 0 0 4.5 21.75z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-[0.32em] text-emerald-500/80">Invoice overview</p>
                          <h3 className="text-lg font-semibold text-slate-900">Summary</h3>
                        </div>
                      </div>
                      <p className="mt-2 text-xs leading-relaxed text-emerald-600/90">
                        Review your invoice details before submitting. Everything updates in real time as your payment proceeds.
                      </p>
                      <div className="mt-4 space-y-4">
                        <div className="rounded-2xl border border-emerald-100 bg-white/95 p-4 shadow-sm shadow-emerald-100/60">
                          <p className="text-xs uppercase tracking-wide text-emerald-500/80">Amount due</p>
                          <p className="mt-1.5 text-2xl font-semibold text-slate-900">
                            {amountDueLabel ?? 'Pending'}
                          </p>
                          {shouldShowAmountBreakdown && (
                            <div className="mt-3 space-y-2 border-t border-emerald-100 pt-3 text-sm text-slate-600">
                              {baseAmountLabel && (
                                <div className="flex items-center justify-between">
                                  <span>Base amount</span>
                                  <span className="font-medium text-slate-900">{baseAmountLabel}</span>
                                </div>
                              )}
                              {discountAmountLabel && (
                                <div className="flex items-center justify-between text-emerald-600">
                                  <span>
                                    Discount{discountSummary?.code ? ` (${discountSummary.code})` : ''}
                                  </span>
                                  <span className="font-medium">-{discountAmountLabel}</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        {shouldShowPackageCard && (
                          <div className="rounded-2xl border border-emerald-100 bg-white/95 p-4 shadow-sm shadow-emerald-100/60">
                            <p className="text-xs uppercase tracking-wide text-emerald-500/80">Package details</p>
                            <div className="mt-2.5 space-y-2 text-sm text-slate-600">
                              {packagePlanLabel && (
                                <div className="flex items-center justify-between text-slate-900">
                                  <span>Plan</span>
                                  <span className="font-medium">{packagePlanLabel}</span>
                                </div>
                              )}
                              {serviceLabel && (
                                <div className="flex items-center justify-between">
                                  <span>Service</span>
                                  <span className="font-medium text-slate-900">{serviceLabel}</span>
                                </div>
                              )}
                              {medicationLabel && (
                                <div className="flex items-center justify-between">
                                  <span>Medication</span>
                                  <span className="font-medium text-slate-900">{medicationLabel}</span>
                                </div>
                              )}
                              {pharmacyLabel && (
                                <div className="flex items-center justify-between">
                                  <span>Pharmacy</span>
                                  <span className="font-medium text-slate-900">{pharmacyLabel}</span>
                                </div>
                              )}
                              {starterPackLabel && (
                                <div className="flex items-center justify-between">
                                  <span>Starter pack</span>
                                  <span className="font-medium text-slate-900">{starterPackLabel}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
            <footer className="mt-4 flex items-center justify-center rounded-[24px] border border-emerald-100/70 bg-emerald-50/70 px-4 py-2.5 text-xs font-medium text-emerald-600 shadow-inner shadow-emerald-100">
              <div className="flex items-center gap-2.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-emerald-500 shadow-sm shadow-emerald-100">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
                  </svg>
                </span>
                <p className="leading-tight">
                  You&apos;re all set—there&apos;s no additional information below this point.
                </p>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentApp;
