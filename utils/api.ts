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

const BASE_URL = import.meta.env.VITE_BACKEND_API_BASE || 'http://localhost:3005';
const API_KEY = import.meta.env.VITE_BACKEND_API_KEY || '';

const defaultHeaders: HeadersInit = {
  'Content-Type': 'application/json',
  ...(API_KEY ? { 'X-API-KEY': API_KEY } : {}),
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
  getPackages: (region: string, condition: string, medication?: string) =>
    get<PackagesResponse>('/consultations/packages', {
      region,
      condition,
      medication,
    }),

  getMedications: (region: string, condition: string) =>
    get<MedicationsResponse>('/consultations/medications', {
      region,
      condition,
    }),

  applyDiscount: (discountCode: string) =>
    get<DiscountResponse>('/consultations/apply-discount', {
      discount_code: discountCode,
    }),

  submitConsultation: (payload: Record<string, unknown>) =>
    post<{ message?: string }>('/consultations', payload),
};

export type ApiClient = typeof apiClient;
