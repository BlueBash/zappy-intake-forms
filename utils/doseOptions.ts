// Dose options for different medications
// These are standard dosing options that don't change based on state/pharmacy

export interface DoseOption {
  value: string;
  label: string;
  requiresScript?: boolean;
}

export const DOSE_OPTIONS_BY_MEDICATION: Record<string, DoseOption[]> = {
  'Semaglutide': [
    { value: '0.25mg', label: '0.25 mg' },
    { value: '0.5mg', label: '0.5 mg' },
    { value: '1mg', label: '1 mg', requiresScript: true },
    { value: '1.7mg', label: '1.7 mg', requiresScript: true },
    { value: '2.4mg', label: '2.4 mg', requiresScript: true },
  ],
  'Tirzepatide': [
    { value: '2.5mg', label: '2.5 mg' },
    { value: '5mg', label: '5 mg' },
    { value: '7.5mg', label: '7.5 mg', requiresScript: true },
    { value: '10mg', label: '10 mg', requiresScript: true },
    { value: '12.5mg', label: '12.5 mg', requiresScript: true },
    { value: '15mg', label: '15 mg', requiresScript: true },
  ],
  'Wegovy': [
    { value: '0.25mg', label: '0.25 mg' },
    { value: '0.5mg', label: '0.5 mg' },
    { value: '1mg', label: '1 mg', requiresScript: true },
    { value: '1.7mg', label: '1.7 mg', requiresScript: true },
    { value: '2.4mg', label: '2.4 mg', requiresScript: true },
  ],
  'Ozempic': [
    { value: '0.25mg', label: '0.25 mg' },
    { value: '0.5mg', label: '0.5 mg' },
    { value: '1mg', label: '1 mg', requiresScript: true },
    { value: '2mg', label: '2 mg', requiresScript: true },
  ],
  'Mounjaro': [
    { value: '2.5mg', label: '2.5 mg' },
    { value: '5mg', label: '5 mg' },
    { value: '7.5mg', label: '7.5 mg', requiresScript: true },
    { value: '10mg', label: '10 mg', requiresScript: true },
    { value: '12.5mg', label: '12.5 mg', requiresScript: true },
    { value: '15mg', label: '15 mg', requiresScript: true },
  ],
  'Zepbound': [
    { value: '2.5mg', label: '2.5 mg' },
    { value: '5mg', label: '5 mg' },
    { value: '7.5mg', label: '7.5 mg', requiresScript: true },
    { value: '10mg', label: '10 mg', requiresScript: true },
    { value: '12.5mg', label: '12.5 mg', requiresScript: true },
    { value: '15mg', label: '15 mg', requiresScript: true },
  ],
  'Saxenda': [
    { value: '0.6mg', label: '0.6 mg' },
    { value: '1.2mg', label: '1.2 mg' },
    { value: '1.8mg', label: '1.8 mg' },
    { value: '3mg', label: '3 mg' },
  ],
  'Victoza': [
    { value: '0.6mg', label: '0.6 mg' },
    { value: '1.2mg', label: '1.2 mg' },
    { value: '1.8mg', label: '1.8 mg' },
  ],
};

// Helper to get dose options for a medication
export function getDoseOptions(medicationName: string): DoseOption[] {
  return DOSE_OPTIONS_BY_MEDICATION[medicationName] || [];
}
