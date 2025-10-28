// API client utilities for medication and plan selection

export interface MedicationOption {
  medication: string;
  pharmacies: string[];
}

export interface PackagePlan {
  id: string;
  plan: string;
  name: string;
  medication: string;
  pharmacy: string;
  invoice_amount?: number;
  invoiceAmount?: number;
  duration_in_months?: number;
  durationInMonths?: number;
  description?: string;
  popular?: boolean;
  savings?: number | null;
  savingsPercent?: number;
  billingFrequency?: string;
  deliveryInfo?: string;
  features?: string[];
}

export interface Discount {
  id: string;
  code: string;
  amount: number;
  percentage: number;
  description?: string;
}

class APIClient {
  private baseUrl = '/api';

  async getMedications(state: string, serviceType: string): Promise<{ medications: MedicationOption[] }> {
    // Return mock data for demo (no API call)
    // In production, this would make an actual API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          medications: [
            { medication: 'Semaglutide', pharmacies: ['Compounding Pharmacy', 'Local Pharmacy'] },
            { medication: 'Tirzepatide', pharmacies: ['Compounding Pharmacy'] },
            { medication: 'Metformin', pharmacies: ['Local Pharmacy', 'Chain Pharmacy'] },
          ]
        });
      }, 500); // Simulate network delay
    });
  }

  async getPlans(state: string, medication: string, pharmacy: string, serviceType: string): Promise<{ plans: PackagePlan[] }> {
    // Return mock data for demo (no API call)
    // In production, this would make an actual API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          plans: [
            {
              id: '1',
              plan: '1 Month',
              name: '1 Month Supply',
              medication,
              pharmacy,
              invoice_amount: 299,
              duration_in_months: 1,
              description: 'Monthly subscription',
            },
            {
              id: '3',
              plan: '3 Months',
              name: '3 Month Supply',
              medication,
              pharmacy,
              invoice_amount: 799,
              duration_in_months: 3,
              description: 'Save 10% with quarterly plan',
            },
            {
              id: '6',
              plan: '6 Months',
              name: '6 Month Supply',
              medication,
              pharmacy,
              invoice_amount: 1499,
              duration_in_months: 6,
              description: 'Best value - Save 15%',
            },
          ]
        });
      }, 500); // Simulate network delay
    });
  }

  async getPackages(state: string, serviceType: string, medication: string, pharmacyName: string): Promise<PackagePlan[]> {
    // Return mock data for demo (no API call)
    // In production, this would make an actual API call with:
    // const response = await fetch(`${this.baseUrl}/packages?state=${state}&serviceType=${serviceType}&medication=${medication}&pharmacy=${pharmacyName}`);
    // return await response.json();
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const basePlans = [
          {
            id: `${medication}-monthly`,
            name: 'Monthly Plan',
            plan: 'month',
            invoice_amount: 297,
            invoiceAmount: 297,
            medication: medication === 'semaglutide' ? 'Semaglutide (Compounded)' : 'Tirzepatide (Compounded)',
            pharmacy: pharmacyName || 'Partner Pharmacy Network',
            description: 'Flexible month-to-month option',
            popular: false,
            savings: null,
            savingsPercent: 0,
            billingFrequency: 'Billed every 4 weeks',
            deliveryInfo: 'One vial delivered every month',
            features: [
              'Cancel anytime',
              'Monthly delivery',
              'No long-term commitment',
            ],
          },
          {
            id: `${medication}-quarterly`,
            name: '3-Month Plan',
            plan: '3-month',
            invoice_amount: 267,
            invoiceAmount: 267,
            medication: medication === 'semaglutide' ? 'Semaglutide (Compounded)' : 'Tirzepatide (Compounded)',
            pharmacy: pharmacyName || 'Partner Pharmacy Network',
            description: 'Best balance of value and commitment',
            popular: true,
            savings: 90,
            savingsPercent: 10,
            billingFrequency: 'Billed every 12 weeks',
            deliveryInfo: 'All vials delivered at the same time',
            features: [
              'Save 10% vs monthly',
              '3-month supply at once',
              'Convenient quarterly billing',
            ],
          },
          {
            id: `${medication}-annual`,
            name: '12-Month Plan',
            plan: '12-month',
            invoice_amount: 247,
            invoiceAmount: 247,
            medication: medication === 'semaglutide' ? 'Semaglutide (Compounded)' : 'Tirzepatide (Compounded)',
            pharmacy: pharmacyName || 'Partner Pharmacy Network',
            description: 'Maximum savings with annual commitment',
            popular: false,
            savings: 600,
            savingsPercent: 17,
            billingFrequency: 'Billed annually (every 52 weeks)',
            deliveryInfo: 'All vials delivered at the same time',
            features: [
              'Save 17% vs monthly',
              'Full year supply',
              'Best value guarantee',
            ],
          },
        ];

        // Adjust prices for tirzepatide
        const adjustedPlans = medication === 'tirzepatide' 
          ? basePlans.map(plan => ({
              ...plan,
              invoice_amount: Math.round((plan.invoice_amount || 0) * 1.3),
              invoiceAmount: Math.round((plan.invoiceAmount || 0) * 1.3),
              savings: plan.savings ? Math.round(plan.savings * 1.3) : null,
            }))
          : basePlans;

        resolve(adjustedPlans);
      }, 300); // Simulate network delay
    });
  }

  async validateDiscount(code: string): Promise<Discount | null> {
    try {
      const response = await fetch(`${this.baseUrl}/discounts/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      if (!response.ok) {
        return null;
      }
      return await response.json();
    } catch (error) {
      console.error('Error validating discount:', error);
      return null;
    }
  }
}

export const apiClient = new APIClient();
