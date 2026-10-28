// Stripe env vars + a guard so the app degrades gracefully until test keys
// are pasted into .env.local.

export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY ?? "";
export const STRIPE_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "";

export const isStripeConfigured =
  STRIPE_SECRET_KEY.startsWith("sk_") &&
  STRIPE_PUBLISHABLE_KEY.startsWith("pk_");

// Client-only check (publishable key is the only one exposed to the browser).
export const isStripePublishableConfigured =
  STRIPE_PUBLISHABLE_KEY.startsWith("pk_");
