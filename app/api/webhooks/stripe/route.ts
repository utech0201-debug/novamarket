import { NextResponse, type NextRequest } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe/server";
import {
  recordOrderFromSession,
  recordOrderFromPaymentIntent,
} from "@/lib/orders";

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET ?? "";

// Stripe -> here. The production-grade path for recording orders.
export async function POST(request: NextRequest) {
  if (!stripe) {
    return NextResponse.json({ error: "Stripe not configured." }, { status: 503 });
  }

  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  let event: Stripe.Event;
  try {
    if (!WEBHOOK_SECRET || WEBHOOK_SECRET.includes("whsec_xxx") || !signature) {
      // No verified secret available (e.g. local dev without Stripe CLI):
      // accept the unverified payload so flows can still be exercised.
      event = JSON.parse(body) as Stripe.Event;
    } else {
      event = stripe.webhooks.constructEvent(body, signature, WEBHOOK_SECRET);
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    // Web (hosted Checkout) flow.
    const session = event.data.object as Stripe.Checkout.Session;
    await recordOrderFromSession(session.id);
  } else if (event.type === "payment_intent.succeeded") {
    // Mobile (native PaymentSheet) flow.
    const pi = event.data.object as Stripe.PaymentIntent;
    if (pi.metadata?.cart) {
      await recordOrderFromPaymentIntent(pi.id);
    }
  }

  return NextResponse.json({ received: true });
}
