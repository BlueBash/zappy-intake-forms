# 🎯 COMPREHENSIVE DESIGN ALIGNMENT PLAN
## Matching Current App to New Design - Complete Action List

---

## ✅ COLOR SYSTEM - DECISION MADE

**Use current app colors (already correct per COLOR_SYSTEM.md):**
- Teal: `#00A896`
- Coral: `#FF6B6B`  
- Teal Hover: `#008B7A`
- Coral Hover: `#E55555`
- Teal Light: `#E0F5F3`
- Background: `#fef8f2`
- Black: `#2D3436`
- Gray: `#666666`
- Light Gray: `#E8E8E8`

---

## 🔴 CRITICAL FIXES NEEDED

### 1. BOX WIDTH STANDARDIZATION
**Problem:** No standardized container widths
**Solution:** Add container width variables and enforce them

```css
:root {
  --container-lg: 32rem;    /* 512px */
  --container-xl: 36rem;    /* 576px */
  --container-2xl: 42rem;   /* 672px */
  --container-3xl: 48rem;   /* 768px */
}
```

**Impact:** Every screen component must use these standard widths

---

### 2. SPACING INCONSISTENCIES
**Problem:** No systematic spacing multiplier
**Current:** Direct Tailwind classes
**Target:** Add spacing variable for consistency

```css
:root {
  --spacing: 0.25rem; /* 4px base unit */
}
```

**Note:** Tailwind already uses 4px base, but new design explicitly defines it

---

### 3. BORDER RADIUS CONSISTENCY
**Current:** `--radius: 0.75rem` (12px) ✅ CORRECT
**Target:** Add `--radius-2xl: 1rem` (16px) for larger cards

```css
:root {
  --radius-2xl: 1rem;
}
```

---

### 4. SHADOW SYSTEM
**Need to verify:** All components use consistent shadow-sm, shadow-md, shadow-lg, shadow-xl
**Pattern from new design:**
- Cards: `shadow-lg`
- Buttons: `shadow-md` → `shadow-xl` on hover
- Selected items: `shadow-md`
- Dropdowns: `shadow-lg`

---

### 5. FOCUS STATES
**Current:** `outline: 2px solid var(--teal)`
**Target:** `focus:ring-4 focus:ring-[#00A896]/40` (4px ring at 40% opacity)

**Must update:** All interactive elements to use ring instead of outline

---

### 6. TRANSITION TIMING
**Current:**
```css
--timing-fast: 350ms
--timing-normal: 450ms  
--timing-slow: 650ms
--easing-elegant: cubic-bezier(0.25, 0.1, 0.25, 1)
```

**New design:**
```css
--default-transition-duration: .15s (150ms)
--ease-out: cubic-bezier(0, 0, .2, 1)
```

**DECISION NEEDED:** Keep current (smoother, more refined) or switch to new (snappier)?
**RECOMMENDATION:** Keep current - it's intentionally more elegant

---

## 📋 COMPONENT-BY-COMPONENT AUDIT NEEDED

### Components to Check:
1. ✅ **ScreenLayout.tsx** - Container width, padding
2. ✅ **NavigationButtons.tsx** - Shadow, hover states, transitions
3. ✅ **SingleSelectButtonGroup.tsx** - Border radius, shadows, selected state colors
4. ✅ **CheckboxGroup.tsx** - Focus rings, selected colors
5. ✅ **Input.tsx** - Focus rings, border colors
6. ✅ **Button.tsx** - Shadows, hover states, transitions
7. ✅ **ProgressBar.tsx** - Color consistency
8. ✅ **PlanSelection.tsx** - Card shadows, selected states, spacing
9. ✅ **MedicationSelection.tsx** - Dropdown styling, shadows
10. ✅ **RegionDropdown.tsx** - Focus states
11. ✅ **ScreenHeader.tsx** - Typography, spacing
12. ✅ **Checkbox.tsx** - Custom checkbox styling
13. ✅ **Select.tsx** - Focus rings, border colors
14. ✅ **TouchButton.tsx** - Pill button styling
15. ✅ **InfoTooltip.tsx** - Colors, animations

### Screens to Check:
1. ✅ **TextScreen.tsx** - Input styling, spacing
2. ✅ **NumberScreen.tsx** - Input styling
3. ✅ **DateScreen.tsx** - Input styling
4. ✅ **SingleSelectScreen.tsx** - Button styling, spacing
5. ✅ **MultiSelectScreen.tsx** - Checkbox styling, spacing
6. ✅ **StateSelectionScreen.tsx** - Dropdown, button styling
7. ✅ **ConsentScreen.tsx** - Checkbox styling, layout
8. ✅ **ReviewScreen.tsx** - Card styling, spacing
9. ✅ **TerminalScreen.tsx** - Success styling, colors
10. ✅ **MedicationOptionsScreen.tsx** - Card styling, selections
11. ✅ **PlanSelectionScreen.tsx** - Plan card styling
12. ✅ **DiscountCodeScreen.tsx** - Input validation colors
13. ✅ **AccountCreationScreen.tsx** - Form styling
14. ✅ **GLP1HistoryScreen.tsx** - Complex form, medication cards
15. ✅ **MedicationChoiceScreen.tsx** - Accordion styling, pills
16. ✅ **MedicationPreferenceScreen.tsx** - Card selections
17. ✅ **InterstitialScreen.tsx** - Content styling
18. ✅ **WeightLossGraphScreen.tsx** - Graph colors

---

## 🎨 SPECIFIC FIXES TO APPLY

### Fix #1: Add Missing CSS Variables
```css
:root {
  /* Container widths */
  --container-lg: 32rem;
  --container-xl: 36rem;
  --container-2xl: 42rem;
  --container-3xl: 48rem;
  
  /* Additional radius */
  --radius-2xl: 1rem;
  
  /* Spacing multiplier (informational) */
  --spacing: 0.25rem;
}
```

### Fix #2: Update Focus Ring Utility
```css
/* Replace outline-based focus with ring-based */
*:focus-visible {
  outline: none;
  box-shadow: 0 0 0 4px rgba(0, 168, 150, 0.4);
}
```

### Fix #3: Standardize Button Shadows
```tsx
// CTA Buttons
className="shadow-lg hover:shadow-xl"

// Secondary Buttons  
className="shadow-md hover:shadow-lg"

// Selected States
className="shadow-md"
```

### Fix #4: Standardize Container Widths
```tsx
// Small screens
className="max-w-lg"  // 32rem / 512px

// Medium screens
className="max-w-xl"  // 36rem / 576px

// Large screens
className="max-w-2xl" // 42rem / 672px

// Extra large screens
className="max-w-3xl" // 48rem / 768px
```

### Fix #5: Selected State Colors
```tsx
// Selected button/option
className="border-[#00A896] bg-[#E0F5F3] text-[#00A896]"

// Unselected with hover
className="border-[#E8E8E8] bg-white hover:border-[#00A896]/30"
```

### Fix #6: CTA Button Styling
```tsx
className="bg-[#FF6B6B] hover:bg-[#E55555] text-white shadow-lg hover:shadow-xl transition-all duration-300"
```

### Fix #7: Input Focus States
```tsx
className="border-2 border-[#E8E8E8] focus:border-[#00A896] focus:ring-4 focus:ring-[#00A896]/40 outline-none"
```

### Fix #8: Checkbox Checked State
```tsx
// When checked
className="bg-[#00A896] border-[#00A896]"
```

### Fix #9: Progress Bar
```tsx
className="bg-[#00A896]"  // Fill color
```

### Fix #10: Card Shadows
```tsx
// Regular cards
className="shadow-lg"

// Hover state
className="hover:shadow-xl"

// Selected cards
className="shadow-xl"
```

---

## 🔍 DETAILED AUDIT FINDINGS

### Spacing Issues Found:
- [ ] Inconsistent padding in screen containers
- [ ] Varying gaps between form elements
- [ ] Non-standard margins for sections
- [ ] Inconsistent button padding

### Box Width Issues Found:
- [ ] Some screens use `max-w-md` (28rem)
- [ ] Others use `max-w-lg` (32rem)
- [ ] Some use `max-w-xl` (36rem)
- [ ] No consistent standard per screen type

### Placement Issues Found:
- [ ] Logo placement varies
- [ ] Progress bar margin-bottom inconsistent
- [ ] Back button positioning varies
- [ ] Help text spacing inconsistent

### Color Consistency Issues:
- [ ] Some components hardcode old teal (#0D9488, #1a7f72)
- [ ] Inconsistent opacity values for hover states
- [ ] Missing teal-light background (#E0F5F3) in some selected states

---

## 📊 PRIORITY ORDER

### Phase 1: Critical Global CSS (DO FIRST)
1. Add missing CSS variables (container widths, radius-2xl)
2. Update focus ring system globally
3. Verify color variables are correct

### Phase 2: Common Components (HIGH IMPACT)
1. NavigationButtons - Used everywhere
2. ScreenLayout - Wraps all screens
3. Button - Core interaction
4. Input - Core form element
5. SingleSelectButtonGroup - Common pattern

### Phase 3: Specialized Components
1. PlanSelection
2. MedicationSelection
3. CheckboxGroup
4. RegionDropdown

### Phase 4: Screen Components  
1. Start with simple screens (TextScreen, NumberScreen, DateScreen)
2. Move to complex screens (GLP1HistoryScreen, MedicationChoiceScreen)
3. Finish with specialized screens (ReviewScreen, TerminalScreen)

---

## ✅ SUCCESS CRITERIA

After all fixes applied:
- [ ] All colors use the 6-color palette + derivatives only
- [ ] All containers use standard max-widths (lg, xl, 2xl, 3xl)
- [ ] All focus states use 4px rings at 40% opacity
- [ ] All shadows follow standard (sm/md/lg/xl)
- [ ] All selected states use teal border + teal-light background
- [ ] All CTA buttons use coral with proper hover
- [ ] All spacing follows 4px base unit multiples
- [ ] All border radius uses --radius (12px) or --radius-2xl (16px)
- [ ] All transitions use consistent timing
- [ ] Zero hardcoded color values outside of standard palette

---

## 📝 NEXT STEPS

1. **Get approval** on keeping current animation timing (slower/smoother)
2. **Apply Phase 1** global CSS fixes
3. **Audit each component** systematically
4. **Apply fixes** in priority order
5. **Test** visual consistency across all screens
6. **Document** any remaining differences

---

**READY TO BEGIN FIXES?**
