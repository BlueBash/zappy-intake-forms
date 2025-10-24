export interface Discount {
  id: string;
  name: string;
  code: string;
  amount: number;
  percentage: number;
  description?: string;
}

export interface MedicationOption {
  medication: string;
  pharmacies: string[];
}

export interface PackagePlan {
  id: string;
  name?: string;
  plan?: string;
  medication?: string;
  pharmacy?: string;
  invoice_amount?: number;
  invoiceAmount?: number;
  features?: string[];
  popular?: boolean;
}

interface PackagesResponse extends Array<PackagePlan> {}

interface MedicationsResponse {
  medications: MedicationOption[];
}

interface DiscountResponse {
  message: string;
  discount?: Discount;
}

export interface PaymentIntentResponse {
  client_secret?: string;
  clientSecret?: string;
  publishable_key?: string;
  publishableKey?: string;
  amount?: number;
  currency?: string;
  status?: string;
  payment_intent_id?: string;
  paymentIntentId?: string;
  customer_email?: string;
  customerEmail?: string;
  [key: string]: unknown;
}

export interface InvoiceResponse {
  id: string;
  number?: string | null;
  amount_due?: number | null;
  amountDue?: number | null;
  currency?: string | null;
  status?: string | null;
  description?: string | null;
  client_email?: string | null;
  clientEmail?: string | null;
  due_date?: string | null;
  dueDate?: string | null;
  payment_intent_payload?: PaymentIntentResponse | null;
  paymentIntentPayload?: PaymentIntentResponse | null;
  metadata?: Record<string, unknown> | null;
  [key: string]: unknown;
}

export interface InvoicePaymentIntentResponse {
  invoice: InvoiceResponse;
  payment_intent?: PaymentIntentResponse;
  paymentIntent?: PaymentIntentResponse;
}

export interface LeadPayload {
  email?: string;
  service?: string;
  status?: string;
  meta_data?: Record<string, unknown>;
  form_request_id?: string;
  id?: string;
}

export interface Lead {
  id: string;
  form_request_id?: string | null;
  email?: string | null;
  service?: string | null;
  status?: string | null;
  meta_data?: Record<string, unknown> | null;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
}

export interface LeadResponse {
  lead: Lead;
}

export interface SubmitConsultationResponse {
  message?: string;
  form_request_id?: string;
  [key: string]: unknown;
}

export interface CreatePaymentIntentPayload {
  amount?: number;
  currency?: string;
  email?: string;
  plan_id?: string;
  planId?: string;
  metadata?: Record<string, string | number>;
  payment_intent_id?: string;
  paymentIntentId?: string;
}

const BASE_URL = import.meta.env.VITE_BACKEND_API_BASE || 'http://localhost:3005';
const API_KEY = import.meta.env.VITE_BACKEND_API_KEY || '';

const defaultHeaders: HeadersInit = {
  'Content-Type': 'application/json',
  ...(API_KEY ? { 'x-api-key': API_KEY } : {}),
};

const get = async <T>(path: string, params?: Record<string, string | number | undefined>): Promise<T> => {
  const url = new URL(`${BASE_URL}${path}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.append(key, String(value));
      }
    });
  }

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: defaultHeaders,
  });

  const data = await response.json();
  if (!response.ok) {
    const errorMessage = data?.error || data?.message || 'Request failed';
    throw new Error(errorMessage);
  }

  return data as T;
};

const post = async <T>(path: string, body: unknown): Promise<T> => {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: defaultHeaders,
    body: JSON.stringify(body),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const errorMessage = data?.error || data?.message || 'Request failed';
    throw new Error(errorMessage);
  }

  return data as T;
};

export const apiClient = {
  getPackages: (
    state: string,
    serviceType: string,
    medication?: string,
    pharmacyName?: string
  ) =>
    get<PackagesResponse>('/consultations/packages', {
      state,
      service_type: serviceType,
      medication,
      pharmacy_name: pharmacyName,
    }),

  getMedications: (state: string, serviceType: string) =>
    get<MedicationsResponse>('/consultations/medications', {
      state,
      service_type: serviceType,
    }),

  applyDiscount: (discountCode: string) =>
    get<DiscountResponse>('/consultations/apply-discount', {
      discount_code: discountCode,
    }),

  submitConsultation: (payload: Record<string, unknown>) =>
    post<SubmitConsultationResponse>('/consultations', payload),

  createOrUpdateLead: (payload: LeadPayload) =>
    post<LeadResponse>('/consultations/leads', payload),

  createPaymentIntent: (payload: CreatePaymentIntentPayload) =>
    post<PaymentIntentResponse>('/payments/payment-intent', payload),

  getPaymentIntent: (paymentIntentId: string) =>
    get<PaymentIntentResponse>(`/payments/payment-intent/${paymentIntentId}`),

  getInvoicePaymentIntent: (invoiceId: string) =>
    post<InvoicePaymentIntentResponse>(`/stripe/invoices/${invoiceId}/payment-intent`, {}),
};

export type ApiClient = typeof apiClient;
