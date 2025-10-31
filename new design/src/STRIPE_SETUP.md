# Stripe Integration Setup

## 🚀 Quick Start (Demo Mode)

**Good news!** The app works out of the box in **demo mode** without any Stripe setup. A mock payment form is shown when no Stripe key is configured.

### Demo Mode Features
- ✅ Fully functional checkout flow
- ✅ Form validation
- ✅ No real payment processing
- ✅ Perfect for development and testing
- ✅ No Stripe account needed

---

## 🔧 Enable Real Payments (Optional)

To accept actual payments, follow these steps:

### 1. Get Your Stripe API Keys

1. **Sign up** for a Stripe account at [stripe.com](https://stripe.com)
2. Go to **Dashboard → Developers → API keys**
3. Copy your **Publishable key** (starts with `pk_test_` for test mode)

### 2. Configure Your API Key

Update `/components/screens/AccountCreationScreen.tsx`:

```typescript
// Find this line:
const STRIPE_PUBLISHABLE_KEY: string | null = null;

// Replace with your actual Stripe key:
const STRIPE_PUBLISHABLE_KEY: string | null = 'pk_test_51ABC123...';
```

That's it! The app will automatically switch to real Stripe Elements.

### 3. Backend Setup (Required for Production)

⚠️ **Important:** The current implementation is frontend-only for demo purposes.

For production, you **must** create a backend to:
1. Create Payment Intents securely
2. Store customer data
3. Handle webhooks
4. Process subscriptions

---

## 📋 Current Implementation

### How It Works

```
┌─────────────────────────────┐
│  No Stripe Key Configured?  │
└──────────┬──────────────────┘
           │
     ┌─────┴─────┐
     │    YES    │           NO
     │           │
     ▼           ▼
┌─────────┐  ┌─────────────┐
│  Mock   │  │   Stripe    │
│  Form   │  │  Elements   │
└─────────┘  └─────────────┘
```

### Mock Form (Default)
- Clean, simple payment form
- No external dependencies
- Instant setup
- Perfect for demos

### Stripe Elements (When Configured)
- Real payment processing
- PCI compliant
- Production-ready
- Requires backend

---

## 🧪 Testing

### Demo Mode Testing

Simply use the app! The mock form accepts any input:
- Any card number
- Any address
- Any name

### Stripe Test Mode

Once you add a Stripe key, use these test cards:

| Card Number | Scenario |
|-------------|----------|
| `4242 4242 4242 4242` | Success |
| `4000 0000 0000 0002` | Card declined |
| `4000 0025 0000 3155` | Requires authentication |

**Expiration:** Any future date  
**CVC:** Any 3 digits  
**ZIP:** Any 5 digits

---

## 📁 Files Modified

### AccountCreationScreen.tsx

**Key Changes:**
```typescript
// Graceful fallback when no key
const STRIPE_PUBLISHABLE_KEY = process.env.STRIPE_PUBLISHABLE_KEY || null;
const stripePromise = STRIPE_PUBLISHABLE_KEY ? loadStripe(STRIPE_PUBLISHABLE_KEY) : null;

// Conditional rendering
if (!stripePromise) {
  return <MockPaymentForm {...props} />;
}

return <StripeForm {...props} />;
```

---

## 🏗️ Production Setup (Backend Required)

### 1. Create Payment Intent Endpoint

```typescript
// POST /api/create-payment-intent
app.post('/api/create-payment-intent', async (req, res) => {
  const { amount, customerId } = req.body;
  
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100, // Convert to cents
    currency: 'usd',
    customer: customerId,
    automatic_payment_methods: {
      enabled: true,
    },
  });
  
  res.json({ clientSecret: paymentIntent.client_secret });
});
```

### 2. Update Frontend

```typescript
// In AccountCreationForm
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // Get client secret from your backend
  const response = await fetch('/api/create-payment-intent', {
    method: 'POST',
    body: JSON.stringify({
      amount: selectedPlan.price,
    }),
  });
  
  const { clientSecret } = await response.json();
  
  // Confirm payment
  const { error } = await stripe.confirmPayment({
    elements,
    clientSecret,
    confirmParams: {
      return_url: 'https://yoursite.com/success',
    },
  });
  
  if (!error) {
    onComplete(accountData);
  }
};
```

### 3. Set Up Webhooks

Listen for these events:
- `payment_intent.succeeded`
- `payment_intent.payment_failed`
- `customer.subscription.created`
- `customer.subscription.updated`

---

## 🔒 Security Best Practices

### ✅ DO
- Store API keys in environment variables
- Use Stripe's test mode during development
- Validate all inputs on the backend
- Use Payment Intents (not Charges)
- Implement webhook signature verification

### ❌ DON'T
- Commit API keys to git
- Trust client-side data
- Skip backend validation
- Use deprecated APIs
- Ignore webhook security

---

## 🚦 Deployment Checklist

Before going live:

- [ ] Replace test key with live key
- [ ] Backend endpoint deployed
- [ ] Webhooks configured
- [ ] SSL certificate installed
- [ ] Error handling implemented
- [ ] Test all payment scenarios
- [ ] Set up monitoring/alerts
- [ ] Review Stripe Dashboard settings

---

## 📊 Features

### Current Implementation

| Feature | Demo Mode | With Stripe |
|---------|-----------|-------------|
| Form validation | ✅ | ✅ |
| Address collection | ✅ | ✅ |
| Payment validation | ❌ | ✅ |
| Real processing | ❌ | ✅ (needs backend) |
| PCI compliance | N/A | ✅ |

### Stripe Elements Used

- **PaymentElement** - Unified payment input
- **AddressElement** - Address collection
- **Elements Provider** - Stripe context

---

## 🐛 Troubleshooting

### Error: "Invalid API Key"

**Solution:** Either remove the key to use demo mode, or add a valid Stripe key.

### Error: "No stripePromise"

**Solution:** This is expected in demo mode. The app will use MockPaymentForm.

### Stripe Elements Not Loading

**Check:**
1. Is STRIPE_PUBLISHABLE_KEY set correctly?
2. Does key start with `pk_test_` or `pk_live_`?
3. Check browser console for errors
4. Verify internet connection

### Form Validation Failing

**Check:**
1. All required fields filled
2. Password meets requirements
3. Addresses are complete
4. Card details valid (if using Stripe)

---

## 📚 Resources

### Stripe Documentation
- [Stripe Elements](https://stripe.com/docs/stripe-js)
- [Payment Intents API](https://stripe.com/docs/payments/payment-intents)
- [React Stripe.js](https://stripe.com/docs/stripe-js/react)
- [Webhooks](https://stripe.com/docs/webhooks)

### Code Examples
- [Accept a payment](https://stripe.com/docs/payments/accept-a-payment)
- [Subscriptions](https://stripe.com/docs/billing/subscriptions/overview)
- [Test cards](https://stripe.com/docs/testing)

---

## 🎯 Next Steps

Choose your path:

### Path 1: Demo/Development
✅ **You're all set!** The app works in demo mode.

### Path 2: Accept Real Payments
1. Get Stripe account
2. Add publishable key
3. Build backend endpoints
4. Test with test cards
5. Deploy and go live

---

## 💡 Tips

### Development
- Use demo mode for frontend development
- Switch to Stripe test mode for integration testing
- Use test cards extensively

### Production
- Always use HTTPS
- Implement proper error handling
- Set up monitoring and alerts
- Test subscription billing cycles
- Have a cancellation flow

---

## ✨ Summary

**Demo Mode (Current):**
- Works out of the box
- No Stripe account needed
- Perfect for development
- Shows complete flow

**Stripe Mode (Optional):**
- Requires Stripe account
- Needs backend setup
- Production-ready
- PCI compliant

The choice is yours! 🚀
