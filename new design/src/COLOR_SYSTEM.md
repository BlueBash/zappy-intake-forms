# Zappy Color System

## 🎨 Essential 6-Color Palette

This is the **complete** color system. Everything else derives from these 6 colors.

### Core Colors

```css
--teal: #00A896        /* Brand, links, selected states */
--coral: #FF6B6B       /* CTAs only */
--black: #2D3436       /* Primary text */
--gray: #666666        /* Secondary text */
--light-gray: #E8E8E8  /* Borders */
--background: #fef8f2  /* Page background - warm orangish */
```

### Derived Colors (Automatic)

**Hover States** - Just darken by 10%:
```css
--teal-hover: #008B7A   /* Teal darkened 10% */
--coral-hover: #E55555  /* Coral darkened 10% */
```

**Light Backgrounds** - For selected states:
```css
--teal-light: #E0F5F3   /* Light teal for selected items */
--coral-light: #FFE8E8  /* Light coral (rarely used) */
```

**Disabled States**:
- Use `var(--gray)` for disabled text/icons
- Use opacity-50 for disabled buttons

**Success/Error**:
- Success: Use teal
- Error: Use coral

**White**:
- Use `#ffffff` or `white` directly (no variable needed)

---

## 📝 Usage Guide

### Using Colors in Components

#### Tailwind Classes (Recommended)
```tsx
// ✅ Good - Using CSS variables
<div className="bg-[var(--teal)]">Brand element</div>
<div className="text-[var(--black)]">Primary text</div>
<button className="bg-[var(--coral)] hover:bg-[var(--coral-hover)]">CTA</button>

// ✅ Also Good - Direct hex values for essential colors
<div className="bg-[#00A896]">Brand element</div>
<div className="text-[#2D3436]">Primary text</div>
```

#### Common Patterns

**CTA Buttons** (Coral):
```tsx
className="bg-[#FF6B6B] hover:bg-[#E55555] text-white"
```

**Selected States** (Teal):
```tsx
className="border-[#00A896] bg-[#E0F5F3] text-[#00A896]"
```

**Progress Bars** (Teal):
```tsx
className="bg-[#00A896]"
```

**Borders**:
```tsx
className="border-[#E8E8E8]"
```

**Primary Text**:
```tsx
className="text-[#2D3436]"
```

**Secondary Text**:
```tsx
className="text-[#666666]"
```

**Page Background**:
```tsx
className="bg-[#fef8f2]"
```

**Disabled State**:
```tsx
className="bg-[#666666] opacity-50 cursor-not-allowed"
```

---

## 🎯 Color Decision Matrix

| Element | Color | Example |
|---------|-------|---------|
| CTA Buttons | Coral (#FF6B6B) | Continue, Submit, Start |
| CTA Buttons (Hover) | Coral Hover (#E55555) | 10% darker |
| Progress Bars | Teal (#00A896) | All progress indicators |
| Selected Items | Teal (#00A896) | Border/text color |
| Selected Backgrounds | Teal Light (#E0F5F3) | Fill for selected |
| Links | Teal (#00A896) | Clickable text |
| Link Hover | Teal Hover (#008B7A) | 10% darker |
| Primary Text | Black (#2D3436) | Headlines, body text |
| Secondary Text | Gray (#666666) | Helper text, labels |
| Borders | Light Gray (#E8E8E8) | All borders |
| Page Background | Background (#fef8f2) | Main canvas |
| Card Background | White (#ffffff) | Content cards |
| Disabled | Gray (#666666) | + opacity-50 |
| Checkmarks | Teal (#00A896) | On white circles |
| Success Icons | Teal (#00A896) | Completion states |
| Error States | Coral (#FF6B6B) | Validation errors |

---

## 🚫 What NOT to Do

❌ Don't create new color variations  
❌ Don't use old colors (#1a7f72, #FF7A59)  
❌ Don't use neutral-700, neutral-600, etc.  
❌ Don't use complex gradients  
❌ Don't override hover states with custom colors  

✅ DO use the 6 core colors  
✅ DO derive hovers by darkening 10%  
✅ DO use gray for disabled states  
✅ DO use teal/coral for success/error  

---

## 🔄 Migration from Old Colors

| Old Color | New Color | Usage |
|-----------|-----------|-------|
| #1a7f72 | #00A896 | Old teal → New teal |
| #FF7A59 | #FF6B6B | Old coral → New coral |
| #156b60 | #008B7A | Old teal hover → New teal hover |
| #FF5252 | #E55555 | Old coral hover → New coral hover |
| #e6f3f2 | #E0F5F3 | Old teal light → New teal light |
| neutral-700 | #2D3436 | Old text → New black |
| neutral-600 | #666666 | Old secondary → New gray |
| Various grays | #E8E8E8 | All borders → Light gray |

---

## 📦 Quick Reference

Copy-paste these common combinations:

```tsx
// CTA Button
className="bg-[#FF6B6B] hover:bg-[#E55555] text-white shadow-lg hover:shadow-xl"

// Selected Item (Button/Pill)
className="border-[#00A896] bg-[#E0F5F3] text-[#00A896]"

// Unselected Item
className="border-[#E8E8E8] bg-white text-[#2D3436] hover:border-[#00A896]/30"

// Progress Bar Container
className="bg-[#E8E8E8] rounded-full"

// Progress Bar Fill
className="bg-[#00A896] h-full rounded-full"

// Checkmark Circle
className="bg-[#00A896] rounded-full flex items-center justify-center"

// Page Container
className="min-h-screen bg-[#fef8f2]"

// Primary Heading
className="text-[#2D3436]"

// Secondary Text
className="text-[#666666]"

// Link
className="text-[#00A896] hover:text-[#008B7A]"

// Disabled Button
className="bg-[#666666] opacity-50 cursor-not-allowed text-white"
```

---

## ✅ Checklist

When creating a new component, ask:

1. [ ] Am I using only the 6 core colors?
2. [ ] Are hover states 10% darker than base?
3. [ ] Are disabled states using gray?
4. [ ] Is my CTA button using coral?
5. [ ] Are selected states using teal?
6. [ ] Are borders using light gray?
7. [ ] Is text using black or gray only?

---

That's it! **6 colors + derived states = complete design system**
