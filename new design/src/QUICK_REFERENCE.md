# Quick Reference Guide

## 🚀 Import Statements

```tsx
// Import all screens at once
import * as Screens from './components/screens';

// Or import individually
import { TextScreen, SingleSelectScreen, ReviewScreen } from './components/screens';

// Use the router
import { renderScreen } from './utils/screenRouter';

// Import types
import { Screen, ScreenProps, Option } from './types';
```

## 📋 Screen Types Quick Reference

| Screen Type | Use For | Key Props |
|------------|---------|-----------|
| `TextScreen` | Text, email, password, masked input | `placeholder`, `validation`, `mask`, `multiline` |
| `NumberScreen` | Numeric input with validation | `min`, `max`, `suffix` |
| `DateScreen` | Date picker | `min_today` |
| `SingleSelectScreen` | Radio or dropdown selection | `options`, `auto_advance` |
| `MultiSelectScreen` | Multiple checkboxes | `options`, `other_text_id` |
| `ConsentScreen` | Terms, policies, consents | `items` (with links) |
| `MedicationSelectionScreen` | Simple medication picker | - |
| `MedicationOptionsScreen` | Medication + pharmacy | - |
| `PlanSelectionScreen` | Package/plan selection | - |
| `DiscountCodeScreen` | Discount validation | - |
| `ReviewScreen` | Summary with edit links | `allScreens`, `providerFields`, `goToScreen` |
| `TerminalScreen` | Success/completion | `status`, `resources`, `next_steps`, `cta_primary` |

## 🎨 Design Tokens

```tsx
// Colors
const colors = {
  primary: '#0D9488',      // Teal
  primaryLight: '#14B8A6', // Light Teal
  primaryDark: '#0F766E',  // Dark Teal
  accent: '#FF7A59',       // Coral
  background: '#FDFBF7',   // Warm off-white
};

// Border Radius
const radius = {
  base: '12px',    // rounded-xl
  full: '9999px',  // rounded-full
};

// Transitions
const transitions = {
  base: '300ms cubic-bezier(0.16, 1, 0.3, 1)',
  slow: '400ms cubic-bezier(0.16, 1, 0.3, 1)',
};
```

## 📝 Common Screen Configs

### Text Input
```tsx
{
  type: 'text',
  id: 'email',
  title: 'Your email address?',
  placeholder: 'you@example.com',
  required: true,
  validation: {
    pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
    error: 'Invalid email',
  },
}
```

### Date of Birth (with age validation)
```tsx
{
  type: 'text',
  id: 'demographics.dob',
  title: 'Date of birth?',
  placeholder: 'MM/DD/YYYY',
  mask: '##/##/####',
  required: true,
  validation: {
    min_age: 18,
    max_age: 100,
    pattern: '^\\d{2}/\\d{2}/\\d{4}$',
  },
}
```

### Number Input
```tsx
{
  type: 'number',
  id: 'weight',
  title: 'Current weight?',
  suffix: 'lbs',
  min: 50,
  max: 500,
  required: true,
}
```

### Single Select (Auto-advance)
```tsx
{
  type: 'single_select',
  id: 'activity',
  title: 'Activity level?',
  options: [
    { value: 'low', label: 'Sedentary' },
    { value: 'med', label: 'Moderate' },
    { value: 'high', label: 'Very Active' },
  ],
  auto_advance: true,
  required: true,
}
```

### Multi-Select with "Other"
```tsx
{
  type: 'multi_select',
  id: 'goals',
  title: 'Your goals?',
  options: [
    { value: 'weight', label: 'Weight Loss' },
    { value: 'energy', label: 'More Energy' },
    { value: 'other', label: 'Other' },
  ],
  other_text_id: 'goals_other',
  required: true,
}
```

### Consent
```tsx
{
  type: 'consent',
  id: 'consent',
  title: 'Please agree to continue',
  items: [
    {
      id: 'terms',
      label: 'I agree to the Terms of Service',
      required: true,
      links: [
        { label: 'Terms of Service', url: '/terms' }
      ],
    },
  ],
}
```

### Review
```tsx
{
  type: 'review',
  id: 'review',
  title: 'Review Your Answers',
  help_text: 'Check everything before submitting',
}
```

### Terminal (Success)
```tsx
{
  type: 'terminal',
  id: 'success',
  title: 'Welcome aboard!',
  body: 'Your assessment is complete.',
  status: 'success',
  next_steps: [
    { label: 'Check your email', icon_name: 'message' },
    { label: 'Review sent within 24hrs', icon_name: 'review' },
  ],
  cta_primary: {
    label: 'Go to Dashboard',
    url: '/dashboard',
  },
}
```

## 🔄 State Management Pattern

```tsx
const [answers, setAnswers] = useState<Record<string, any>>({});

const updateAnswer = (id: string, value: any) => {
  setAnswers(prev => ({ ...prev, [id]: value }));
  
  // Optional: Save to localStorage
  localStorage.setItem('formAnswers', JSON.stringify({
    ...answers,
    [id]: value,
  }));
};
```

## 🧭 Navigation Pattern

```tsx
const [currentIndex, setCurrentIndex] = useState(0);
const screens = [...]; // Your screen config

const handleNext = () => {
  if (currentIndex < screens.length - 1) {
    setCurrentIndex(prev => prev + 1);
  }
};

const handleBack = () => {
  if (currentIndex > 0) {
    setCurrentIndex(prev => prev - 1);
  }
};

const goToScreen = (screenId: string) => {
  const index = screens.findIndex(s => s.id === screenId);
  if (index !== -1) setCurrentIndex(index);
};
```

## 📊 Progress Bar

```tsx
const progressPercentage = ((currentIndex + 1) / screens.length) * 100;

<motion.div
  className="h-1 bg-gradient-to-r from-[#0D9488] to-[#14B8A6]"
  animate={{ width: `${progressPercentage}%` }}
/>
```

## ✅ Validation Helpers

```tsx
// Check if screen is complete
const isComplete = (screen: Screen, answers: Record<string, any>): boolean => {
  if (!screen.required) return true;
  
  const value = answers[screen.id];
  
  if (value === undefined || value === null || value === '') return false;
  if (Array.isArray(value) && value.length === 0) return false;
  
  return true;
};

// Get all incomplete screens
const getIncompleteScreens = (screens: Screen[], answers: Record<string, any>) => {
  return screens.filter(screen => !isComplete(screen, answers));
};
```

## 🎯 API Integration

```tsx
import { apiClient } from './utils/api';

// Medications
const { medications } = await apiClient.getMedications(
  stateCode,
  'Weight Loss'
);

// Plans
const { plans } = await apiClient.getPlans(
  stateCode,
  medication,
  pharmacy,
  'Weight Loss'
);

// Discount
const discount = await apiClient.validateDiscount(code);
```

## 🐛 Common Patterns

### Conditional Screen Display
```tsx
const shouldShowScreen = (screen: Screen, answers: Record<string, any>) => {
  if (!screen.conditional_display) return true;
  
  const { show_if } = screen.conditional_display;
  // Parse and evaluate condition
  return evaluateCondition(show_if, answers);
};
```

### Form Submission
```tsx
const handleSubmit = async () => {
  setIsSubmitting(true);
  setError(null);
  
  try {
    const response = await fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(answers),
    });
    
    if (!response.ok) throw new Error('Submission failed');
    
    // Navigate to success
    navigateToSuccess();
  } catch (err) {
    setError(err.message);
  } finally {
    setIsSubmitting(false);
  }
};
```

### Loading States
```tsx
{isLoading ? (
  <div className="flex items-center justify-center py-8">
    <Loader2 className="w-8 h-8 animate-spin text-[#0D9488]" />
  </div>
) : (
  <YourContent />
)}
```

## 💡 Pro Tips

1. **Always use Motion** for screen transitions
2. **Validate on blur**, not every keystroke
3. **Auto-focus inputs** for better UX
4. **Use auto_advance** for quick flows
5. **Persist to localStorage** for draft saves
6. **Add loading states** for all async operations
7. **Handle errors gracefully** with retry options
8. **Test on mobile** early and often

## 📱 Mobile Considerations

```tsx
// Use appropriate input types
<input type="email" />     // Email keyboard
<input type="tel" />       // Phone keyboard
<input inputMode="numeric" /> // Numeric keyboard

// Minimum touch targets
className="min-h-[44px] min-w-[44px]"

// Prevent zoom on input focus (iOS)
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
```

## 🎨 Custom Styling

```tsx
// Override default styles
<TextScreen
  screen={screen}
  className="custom-class"
  // ... other props
/>

// Add custom animations
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4 }}
>
  {content}
</motion.div>
```

---

**Need more details?** Check:
- `/IMPLEMENTATION_GUIDE.md` - Complete component docs
- `/INTEGRATION_SUMMARY.md` - Integration overview
- `/examples/ScreenFlowExample.tsx` - Working example
- `/types/index.ts` - TypeScript definitions
