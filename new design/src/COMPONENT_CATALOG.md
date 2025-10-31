# 🎨 Component Catalog

Visual reference for all screen components with code examples.

---

## 📝 TextScreen

**Use for:** Email, password, names, addresses, phone numbers, dates

### Basic Text Input
```tsx
{
  type: 'text',
  id: 'name',
  title: "What's your name?",
  placeholder: 'John Doe',
  required: true,
}
```

### Email Validation
```tsx
{
  type: 'text',
  id: 'email',
  title: "What's your email?",
  placeholder: 'you@example.com',
  required: true,
  validation: {
    pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
    error: 'Please enter a valid email address',
  },
}
```

### Date of Birth (with masking)
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
    error: 'Please enter a valid date',
  },
}
```

### Multiline Text
```tsx
{
  type: 'text',
  id: 'notes',
  title: 'Additional notes?',
  multiline: true,
  placeholder: 'Tell us more...',
}
```

**Features:**
- ✅ Auto-focus on mount
- ✅ Pattern validation
- ✅ Date masking (MM/DD/YYYY)
- ✅ Age validation
- ✅ Error states with icons
- ✅ Multiline support

---

## 🔢 NumberScreen

**Use for:** Weight, height, age, measurements

### Weight Input
```tsx
{
  type: 'number',
  id: 'weight',
  title: "What's your current weight?",
  placeholder: '150',
  suffix: 'lbs',
  required: true,
  min: 50,
  max: 500,
}
```

### Height (Feet)
```tsx
{
  type: 'number',
  id: 'height_ft',
  title: 'How tall are you?',
  placeholder: '5',
  suffix: 'ft',
  min: 3,
  max: 8,
  required: true,
}
```

### Age
```tsx
{
  type: 'number',
  id: 'age',
  title: 'How old are you?',
  placeholder: '30',
  suffix: 'years',
  min: 18,
  max: 100,
  required: true,
}
```

**Features:**
- ✅ Numeric keyboard on mobile
- ✅ Min/max validation
- ✅ Suffix display (lbs, ft, years)
- ✅ Real-time validation
- ✅ Error messages

---

## 📅 DateScreen

**Use for:** Appointments, event dates

### Future Date
```tsx
{
  type: 'date',
  id: 'appointment',
  title: 'Preferred appointment date?',
  help_text: 'Select a date that works for you',
  min_today: true,
  required: true,
}
```

### Any Date
```tsx
{
  type: 'date',
  id: 'event_date',
  title: 'When did this happen?',
  required: true,
}
```

**Features:**
- ✅ HTML5 date picker
- ✅ Min/max date constraints
- ✅ Future-only option
- ✅ Native calendar UI

---

## ⭕ SingleSelectScreen

**Use for:** Choosing one option from a list

### Button Style (< 15 options)
```tsx
{
  type: 'single_select',
  id: 'activity_level',
  title: 'How active are you?',
  options: [
    { value: 'sedentary', label: 'Sedentary - Little exercise' },
    { value: 'light', label: 'Light - Exercise 1-3 days/week' },
    { value: 'moderate', label: 'Moderate - Exercise 3-5 days/week' },
    { value: 'very', label: 'Very Active - Exercise 6-7 days/week' },
  ],
  required: true,
  auto_advance: true,
}
```

### Dropdown Style (15+ options)
```tsx
{
  type: 'single_select',
  id: 'country',
  title: 'Select your country',
  options: [
    { value: 'us', label: 'United States' },
    { value: 'ca', label: 'Canada' },
    // ... 50+ countries
  ],
  required: true,
}
```

### State Selection (Special Handling)
```tsx
{
  type: 'single_select',
  id: 'demographics.state',
  title: 'Which state do you live in?',
  help_text: 'This determines medication availability',
  options: [], // Auto-populated by RegionDropdown
  required: true,
}
```

**Features:**
- ✅ Auto-switches to dropdown at 15+ options
- ✅ Auto-advance option
- ✅ Spring animation on selection
- ✅ Gradient checkmark
- ✅ Hover scale effects
- ✅ State restriction handling (Alabama)

---

## ☑️ MultiSelectScreen

**Use for:** Selecting multiple items

### Basic Multi-Select
```tsx
{
  type: 'multi_select',
  id: 'goals',
  title: 'What are your health goals?',
  help_text: 'Select all that apply',
  options: [
    { value: 'weight_loss', label: 'Lose weight' },
    { value: 'energy', label: 'Increase energy' },
    { value: 'fitness', label: 'Improve fitness' },
    { value: 'health', label: 'Better overall health' },
  ],
  required: true,
}
```

### With "Other" Option
```tsx
{
  type: 'multi_select',
  id: 'dietary_restrictions',
  title: 'Any dietary restrictions?',
  options: [
    { value: 'vegetarian', label: 'Vegetarian' },
    { value: 'vegan', label: 'Vegan' },
    { value: 'gluten_free', label: 'Gluten-free' },
    { value: 'other', label: 'Other' },
  ],
  other_text_id: 'dietary_restrictions_other',
}
```

**Features:**
- ✅ Multiple selections
- ✅ "Other" text field support
- ✅ Exclusive "none" option handling
- ✅ Animated expand for "other" field
- ✅ Gradient selection states

---

## ✓ ConsentScreen

**Use for:** Terms, policies, HIPAA, consents

### Terms & Privacy
```tsx
{
  type: 'consent',
  id: 'legal_consent',
  title: 'Please review and agree',
  items: [
    {
      id: 'terms',
      label: 'I agree to the Terms of Service and Privacy Policy',
      required: true,
      links: [
        { label: 'Terms of Service', url: '/terms' },
        { label: 'Privacy Policy', url: '/privacy' },
      ],
    },
    {
      id: 'hipaa',
      label: 'I acknowledge the HIPAA Notice',
      required: true,
      links: [
        { label: 'HIPAA Notice', url: '/hipaa' },
      ],
    },
  ],
}
```

### SMS Consent (Optional)
```tsx
{
  type: 'consent',
  id: 'communications',
  title: 'Communication preferences',
  items: [
    {
      id: 'sms_consent',
      label: 'I agree to receive SMS notifications',
      required: false,
    },
    {
      id: 'email_consent',
      label: 'I agree to receive email updates',
      required: false,
    },
  ],
}
```

**Features:**
- ✅ Clickable cards
- ✅ Inline link rendering
- ✅ Required/optional items
- ✅ Click anywhere to toggle
- ✅ Gradient selected states

---

## 💊 MedicationSelectionScreen

**Use for:** Simple medication picker

```tsx
{
  type: 'medication_selection', // Or detected by screen ID
  id: 'treatment.medication',
  title: 'Select your preferred medication',
  help_text: 'Based on your state and goals',
}
```

**Features:**
- ✅ State-based filtering
- ✅ Service type support
- ✅ Loading states
- ✅ Error handling
- ✅ Pharmacy display

---

## 💊 MedicationOptionsScreen

**Use for:** Medication + pharmacy selection

```tsx
{
  type: 'medication_options', // Or detected by screen ID
  id: 'treatment.medication_options',
  title: 'Choose your medication and pharmacy',
  help_text: 'Select the option that works best for you',
}
```

**Features:**
- ✅ Expandable pharmacy options
- ✅ Radio button pharmacy picker
- ✅ Auto-select single pharmacy
- ✅ Interest indicator
- ✅ State-based availability

---

## 📦 PlanSelectionScreen

**Use for:** Package/subscription selection

```tsx
{
  type: 'plan_selection', // Or detected by screen ID
  id: 'treatment.plan_selection',
  title: 'Choose your plan',
  help_text: 'Select the plan that fits your needs',
}
```

**Features:**
- ✅ Pricing display
- ✅ Duration detection
- ✅ Dose strategy for multi-month
- ✅ Titration vs Maintenance options
- ✅ Pharmacy/medication filtering

---

## 🎟️ DiscountCodeScreen

**Use for:** Promo code validation

```tsx
{
  type: 'discount_code', // Or detected by screen ID
  id: 'payment.discount',
  title: 'Have a discount code?',
  help_text: 'Enter your code below (optional)',
}
```

**Features:**
- ✅ Real-time validation
- ✅ Success/error states
- ✅ Discount details display
- ✅ Remove discount option
- ✅ API integration

---

## 📋 ReviewScreen

**Use for:** Summary before submission

```tsx
{
  type: 'review',
  id: 'review',
  title: 'Review Your Information',
  help_text: 'Please check everything before submitting',
}

// Requires additional props:
<ReviewScreen
  screen={screen}
  answers={answers}
  onSubmit={handleSubmit}
  allScreens={screens}
  providerFields={['email', 'weight', 'state', ...]}
  goToScreen={(screenId) => navigateToScreen(screenId)}
  showBack={true}
  onBack={handleBack}
  isSubmitting={loading}
  submissionError={error}
/>
```

**Features:**
- ✅ Grouped by category
- ✅ Edit navigation
- ✅ Address validation
- ✅ Medication history summary
- ✅ Formatted display values
- ✅ Loading state
- ✅ Error handling

---

## ✨ TerminalScreen

**Use for:** Success, completion, thank you pages

### Success
```tsx
{
  type: 'terminal',
  id: 'success',
  title: 'Welcome Aboard!',
  body: 'Your assessment is complete. We'll review your information and be in touch soon.',
  status: 'success',
  resources: [
    {
      label: 'Your Email',
      value: '{{email}}',
      icon_name: 'message',
    },
    {
      label: 'Selected Plan',
      value: '{{selected_plan_name}}',
      icon_name: 'plan',
    },
  ],
  next_steps: [
    {
      label: 'Check your email for next steps',
      icon_name: 'message',
    },
    {
      label: 'We'll review within 24 hours',
      icon_name: 'review',
    },
    {
      label: 'Begin your wellness journey',
      icon_name: 'journey',
    },
  ],
  cta_primary: {
    label: 'Go to Dashboard',
    url: '/dashboard',
    open_in_new_tab: false,
  },
  links: [
    { label: 'Learn More', url: '/about' },
    { label: 'FAQs', url: '/faq' },
  ],
}
```

### Warning/Error
```tsx
{
  type: 'terminal',
  id: 'not_available',
  title: 'Not Available in Your Area',
  body: 'Unfortunately, we're not able to service patients in your state yet.',
  status: 'warning',
  cta_primary: {
    label: 'Return Home',
    url: '/',
  },
}
```

**Features:**
- ✅ Success/warning status icons
- ✅ String interpolation ({{variable}})
- ✅ Resource display cards
- ✅ Next steps with icons
- ✅ Primary CTA button
- ✅ Secondary links
- ✅ Scale-up entrance animation

---

## 🎨 Design Patterns

### Gradient Selection States
```css
/* Unselected */
border-gray-200 bg-white

/* Selected */
border-[#0D9488] bg-gradient-to-r from-[#0D9488]/5 to-[#14B8A6]/5
```

### Checkmark Animation
```tsx
<motion.div
  initial={{ scale: 0, rotate: -180 }}
  animate={{ scale: 1, rotate: 0 }}
  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
  className="bg-gradient-to-br from-[#0D9488] to-[#14B8A6]"
>
  <Check className="text-white" />
</motion.div>
```

### Staggered List Entrance
```tsx
{items.map((item, index) => (
  <motion.div
    key={item.id}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
  >
    {item.content}
  </motion.div>
))}
```

### Loading State
```tsx
<div className="text-center py-8">
  <Loader2 className="w-8 h-8 mx-auto mb-3 text-[#0D9488] animate-spin" />
  <p className="text-neutral-600">Loading...</p>
</div>
```

### Error State
```tsx
<div className="text-center py-8">
  <AlertCircle className="w-12 h-12 mx-auto mb-3 text-red-400" />
  <p className="text-red-500">{error}</p>
</div>
```

---

## 🔧 Common Modifications

### Change Button Text
```tsx
<NavigationButtons
  nextLabel="Continue to Next Step" // Default: "Continue"
  showBack={true}
  onBack={handleBack}
  onNext={handleNext}
/>
```

### Custom Help Text Icon
```tsx
// Automatically shows info icon with help text
help_text: "This helps us personalize your plan"
```

### Disable Auto-Advance
```tsx
{
  type: 'single_select',
  id: 'choice',
  title: 'Make your selection',
  options: [...],
  auto_advance: false, // Show Continue button
}
```

### Make Field Optional
```tsx
{
  type: 'text',
  id: 'middle_name',
  title: 'Middle name?',
  required: false, // Optional field
}
```

---

## 📱 Mobile Considerations

All components automatically:
- Use appropriate input types (`email`, `tel`, `numeric`)
- Scale text responsively
- Ensure 44px minimum touch targets
- Hide/show elements based on screen size
- Optimize animations for mobile performance

---

## ♿ Accessibility Features

Every component includes:
- Semantic HTML (`<button>`, `<label>`, `<input>`)
- ARIA labels where needed
- Keyboard navigation support
- Focus visible indicators
- Screen reader compatible
- High contrast support
- Reduced motion support

---

**Complete component reference!** Use this catalog to quickly find the right screen type for your needs. 🎨
