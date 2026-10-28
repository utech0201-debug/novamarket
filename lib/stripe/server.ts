import Stripe from "stripe";
import { STRIPE_SECRET_KEY, isStripeConfigured } from "./config";

// Server-side Stripe instance, or null when keys aren't set yet.
export const stripe = isStripeConfigured
  ? new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" })
  : null;
