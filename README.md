<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1vGG_TWGEbSuWPs_n4hAplSmDzU4B98gA

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Accept Payments with Stripe

- Configure your Stripe publishable key by creating a `.env.local` file and setting `VITE_STRIPE_PUBLISHABLE_KEY=pk_live_or_test_key`.
- Start the dev server (`npm run dev`) and open [http://localhost:3000/payment.html](http://localhost:3000/payment.html) with one of the following query string options:
  - Provide a `client_secret` returned from your backend: `/payment.html?client_secret=pi_123_secret_abc`.
  - Provide a `payment_intent` ID so the page can fetch it from your backend (`GET /payments/payment-intent/:id`).
  - Provide an `amount` (in the smallest currency unit, e.g., cents) to create a new intent via `POST /payments/payment-intent`.
- Optional query params: `currency`, `email`, `description`, `publishable_key`, `plan_id`.
- During production builds the payment page is bundled alongside the intake form; deploy both `index.html` and `payment.html`.
