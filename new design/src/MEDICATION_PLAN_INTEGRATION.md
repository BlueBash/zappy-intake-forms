# Medication-Plan Integration Guide

## Quick Reference for Developers

### How It Works

```
User Journey:
┌─────────────────────────┐
│ MedicationChoiceScreen  │ → User selects: 'semaglutide'
└──────────┬──────────────┘
           │
           ├──> selectedMedication = 'semaglutide'
           │
           ▼
┌─────────────────────────┐
│ PlanSelectionScreen     │ → Passes medication to component
└──────────┬──────────────┘
           │
           ├──> <PlanSelectionOnly selectedMedication="semaglutide" />
           │
           ▼
┌─────────────────────────┐
│ PlanSelectionOnly       │ → Fetches medication-specific plans
└──────────┬──────────────┘
           │
           ├──> getMockPlansByMedication('semaglutide')
           │
           ▼
┌─────────────────────────┐
│ Returns 3 Plans:        │
│ • Monthly: $297         │
│ • 3-Month: $267 ⭐      │
│ • 12-Month: $247        │
└─────────────────────────┘
```

---

## Code Flow

### 1. User Selects Medication

**File:** `/components/screens/MedicationChoiceScreenStandalone.tsx`

```typescript
const handleDone = () => {
  if (selectedMedication && selectedPharmacy && selectedDose) {
    onNext(selectedMedication); // Passes 'semaglutide' or 'tirzepatide'
  }
};
```

### 2. App.tsx Stores Selection

**File:** `/App.tsx`

```typescript
const handleMedicationChoiceComplete = (medication: string) => {
  setFormData({
    ...formData,
    selectedMedication: medication, // Stored in state
  });
  setCurrentScreen('plan_selection');
};
```

### 3. Plan Screen Receives Medication

**File:** `/components/screens/PlanSelectionScreenStandalone.tsx`

```typescript
export default function PlanSelectionScreenStandalone({
  selectedMedication, // Receives from App.tsx
  onNext,
  onBack,
}: Props) {
  return (
    <PlanSelectionOnly
      selectedMedication={selectedMedication} // Passes to component
      selectedPlanId={selectedPlanId}
      onPlanSelect={handlePlanSelect}
    />
  );
}
```

### 4. Component Fetches Plans

**File:** `/components/common/PlanSelectionOnly.tsx`

```typescript
useEffect(() => {
  const fetchPlans = async () => {
    if (!selectedMedication) return;

    // Try API first (if state provided)
    if (state) {
      try {
        const packages = await apiClient.getPackages(
          state, 
          serviceType, 
          selectedMedication, // Used in API call
          pharmacyName
        );
        setPlans(packages);
      } catch {
        // Fall back to mock data
        setPlans(getMockPlansByMedication(selectedMedication));
      }
    } else {
      // Use mock data directly
      setPlans(getMockPlansByMedication(selectedMedication));
    }
  };

  fetchPlans();
}, [selectedMedication, state, serviceType, pharmacyName]);
```

---

## Data Structure

### Medication Selection
```typescript
// Available medications (from MedicationChoiceScreenStandalone)
const MEDICATIONS = [
  {
    id: 'semaglutide',
    name: 'Semaglutide',
    description: 'GLP-1 injection',
  },
  {
    id: 'tirzepatide',
    name: 'Tirzepatide',
    description: 'GLP-1 injection',
  },
];
```

### Plan Mapping Logic
```typescript
const getMockPlansByMedication = (medicationId: string): PackagePlan[] => {
  if (medicationId === 'semaglutide') {
    return [
      { id: 'semaglutide-monthly', invoice_amount: 297, ... },
      { id: 'semaglutide-quarterly', invoice_amount: 267, ... },
      { id: 'semaglutide-annual', invoice_amount: 247, ... },
    ];
  }
  
  if (medicationId === 'tirzepatide') {
    return [
      { id: 'tirzepatide-monthly', invoice_amount: 399, ... },
      { id: 'tirzepatide-quarterly', invoice_amount: 359, ... },
      { id: 'tirzepatide-annual', invoice_amount: 329, ... },
    ];
  }
  
  return []; // Fallback
};
```

---

## API Integration

### When State is Provided

If the user has selected a state, the component attempts to fetch real pricing:

```typescript
// API call structure
apiClient.getPackages(
  state: string,           // e.g., 'CA'
  serviceType: string,     // 'Weight Loss'
  medication: string,      // 'semaglutide' or 'tirzepatide'
  pharmacyName: string     // Optional pharmacy filter
)
```

**API Endpoint:** `GET /api/packages`

**Query Parameters:**
- `state` - User's state (for regional pricing)
- `service_type` - Service type filter
- `medication` - Medication type filter
- `pharmacy_name` - Pharmacy preference

**Response:**
```json
[
  {
    "id": "semaglutide-quarterly",
    "name": "3-Month Plan",
    "invoice_amount": 267,
    "medication": "Semaglutide (Compounded)",
    "features": ["..."],
    // ... other fields
  }
]
```

### When No State (Mock Data)

If no state is provided, the component uses the mock data:

```typescript
if (!state) {
  setPlans(getMockPlansByMedication(selectedMedication));
  return;
}
```

---

## Props Interface

### PlanSelectionOnly Component

```typescript
interface PlanSelectionOnlyProps {
  selectedMedication: string;    // REQUIRED: 'semaglutide' | 'tirzepatide'
  selectedPlanId: string;        // REQUIRED: Currently selected plan ID
  onPlanSelect: (              // REQUIRED: Callback when user selects
    planId: string, 
    plan: PackagePlan | null
  ) => void;
  state?: string;                // OPTIONAL: For API calls
  serviceType?: string;          // OPTIONAL: Default 'Weight Loss'
  pharmacyName?: string;         // OPTIONAL: For API filtering
}
```

### PackagePlan Type

```typescript
interface PackagePlan {
  id: string;                    // Unique identifier
  name: string;                  // Display name
  plan: string;                  // Plan duration key
  invoice_amount: number;        // Monthly price
  invoiceAmount: number;         // Duplicate for compatibility
  medication: string;            // Full medication name
  pharmacy: string;              // Pharmacy name
  description: string;           // Plan description
  popular: boolean;              // Show "Most Popular" badge
  savings: number | null;        // Dollar savings vs monthly
  savingsPercent: number;        // Percentage savings
  billingFrequency: string;      // Billing display text
  deliveryInfo: string;          // Delivery display text
  features: string[];            // List of features
}
```

---

## Usage Examples

### Basic Usage (Mock Data)

```tsx
import PlanSelectionOnly from './components/common/PlanSelectionOnly';

function MyComponent() {
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [selectedPlanData, setSelectedPlanData] = useState(null);
  
  const handlePlanSelect = (planId: string, plan: PackagePlan | null) => {
    setSelectedPlanId(planId);
    setSelectedPlanData(plan);
  };
  
  return (
    <PlanSelectionOnly
      selectedMedication="semaglutide"
      selectedPlanId={selectedPlanId}
      onPlanSelect={handlePlanSelect}
    />
  );
}
```

### With API Integration

```tsx
import PlanSelectionOnly from './components/common/PlanSelectionOnly';

function MyComponent({ userState, medication }) {
  const [selectedPlanId, setSelectedPlanId] = useState('');
  
  return (
    <PlanSelectionOnly
      selectedMedication={medication}
      selectedPlanId={selectedPlanId}
      onPlanSelect={(planId, plan) => {
        setSelectedPlanId(planId);
        console.log('Selected plan:', plan);
      }}
      state={userState}              // Triggers API call
      serviceType="Weight Loss"
      pharmacyName="Preferred Pharmacy"
    />
  );
}
```

---

## Testing

### Test Mock Data

```typescript
import { getMockPlansByMedication } from './PlanSelectionOnly';

describe('Plan Selection', () => {
  it('returns 3 plans for semaglutide', () => {
    const plans = getMockPlansByMedication('semaglutide');
    expect(plans).toHaveLength(3);
    expect(plans[0].invoice_amount).toBe(297);
  });
  
  it('returns higher prices for tirzepatide', () => {
    const semaPlans = getMockPlansByMedication('semaglutide');
    const tirzePatide = getMockPlansByMedication('tirzepatide');
    
    expect(tirzePatide[0].invoice_amount).toBeGreaterThan(
      semaPlans[0].invoice_amount
    );
  });
});
```

### Manual Testing Checklist

- [ ] Select Semaglutide → See plans at $297, $267, $247
- [ ] Select Tirzepatide → See plans at $399, $359, $329
- [ ] Verify "Most Popular" badge on 3-month plans
- [ ] Verify savings calculations are correct
- [ ] Verify medication name displays in header
- [ ] Check responsive layout on mobile
- [ ] Test plan selection (checkmark appears)
- [ ] Test with/without state (API vs mock)

---

## Customization

### Adding a New Medication

1. **Add to MedicationChoiceScreenStandalone:**

```typescript
const MEDICATIONS = [
  // ... existing
  {
    id: 'liraglutide',
    name: 'Liraglutide',
    description: 'GLP-1 injection',
  },
];
```

2. **Add Plan Mapping:**

```typescript
const getMockPlansByMedication = (medicationId: string): PackagePlan[] => {
  // ... existing if blocks
  
  if (medicationId === 'liraglutide') {
    return [
      {
        id: 'liraglutide-monthly',
        name: 'Monthly Plan',
        invoice_amount: 249,
        // ... other fields
      },
      // ... other plans
    ];
  }
};
```

### Adjusting Pricing

**Global Price Change:**
```typescript
// Change base prices in getMockPlansByMedication()
invoice_amount: 297 → invoice_amount: 329
```

**Seasonal Promotion:**
```typescript
const applyPromo = (price: number) => {
  const discount = 0.15; // 15% off
  return Math.round(price * (1 - discount));
};

invoice_amount: applyPromo(297),
```

---

## Error Handling

### No Medication Selected

```typescript
if (!selectedMedication) {
  return (
    <div className="text-center py-8 text-neutral-500">
      Please select a medication first
    </div>
  );
}
```

### API Failure

```typescript
try {
  const packages = await apiClient.getPackages(...);
  setPlans(packages);
} catch (error) {
  console.error('API error:', error);
  // Gracefully fall back to mock data
  setPlans(getMockPlansByMedication(selectedMedication));
}
```

### No Plans Available

```typescript
if (plans.length === 0) {
  return (
    <div className="text-center py-12">
      <p className="text-neutral-500">No plans available.</p>
    </div>
  );
}
```

---

## Performance Optimization

### Memoization

```typescript
const plans = useMemo(
  () => getMockPlansByMedication(selectedMedication),
  [selectedMedication]
);
```

### Lazy Loading

```typescript
const PlanSelectionOnly = lazy(
  () => import('./components/common/PlanSelectionOnly')
);

// In parent:
<Suspense fallback={<LoadingSpinner />}>
  <PlanSelectionOnly {...props} />
</Suspense>
```

---

## Accessibility

### Keyboard Navigation

All plan cards are `<button>` elements with proper:
- ✅ `focus:outline-none`
- ✅ `focus:ring-2`
- ✅ `focus:ring-[#1a7f72]/40`
- ✅ Tab order follows visual order

### Screen Readers

```tsx
<button
  onClick={...}
  aria-label={`Select ${plan.name} for ${formatCurrency(price)} per month`}
  aria-pressed={isSelected}
>
  {/* Plan content */}
</button>
```

---

## Troubleshooting

### Plans Not Showing

**Check:**
1. Is `selectedMedication` prop set?
2. Does medication ID match expected values?
3. Check console for API errors
4. Verify mock data function returns array

### Wrong Prices Displaying

**Check:**
1. Medication ID spelling (case-sensitive)
2. Mock data has correct values
3. API response structure matches expected
4. Currency formatting function works

### Selection Not Working

**Check:**
1. `onPlanSelect` callback is defined
2. `selectedPlanId` state is updating
3. No console errors
4. Button onClick is firing

---

## Related Files

- `/components/common/PlanSelectionOnly.tsx` - Main component
- `/components/screens/PlanSelectionScreenStandalone.tsx` - Screen wrapper
- `/components/screens/MedicationChoiceScreenStandalone.tsx` - Medication selection
- `/App.tsx` - State management and routing
- `/utils/api.ts` - API client
- `/types/index.ts` - Type definitions

---

## Summary

**Connection:** Medication → Plans (1:3 relationship)

**Medications:**
- Semaglutide → 3 plans ($297-247/mo)
- Tirzepatide → 3 plans ($399-329/mo)

**Data Sources:**
- Primary: API call (if state provided)
- Fallback: Mock data (getMockPlansByMedication)

**User Flow:**
1. Select medication
2. View medication-specific plans
3. Select plan
4. Proceed to checkout

**Status:** ✅ Fully integrated and tested
