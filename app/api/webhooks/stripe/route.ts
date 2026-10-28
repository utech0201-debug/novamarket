import { NextResponse, type NextRequest } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe/server";
import {
  recordOrderFromSession,
  recordOrderFromPaymentIntent,
} from "@/lib/orders";

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET ?? "";

// Stripe webhooks must fail closed: never process a payload without verifying
// its signature against the endpoint-specific signing secret.
export async function POST(request: NextRequest) {
  if (!stripe) {
    return NextResponse.json({ error: "Stripe not configured." }, { status: 503 });
  }

  if (
    !WEBHOOK_SECRET.startsWith("whsec_") ||
    WEBHOOK_SECRET === "whsec_xxx"
  ) {
    return NextResponse.json(
      { error: "Stripe webhook signing secret is not configured." },
      { status: 503 }
    );
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json(
      { error: "Missing Stripe signature." },
      { status: 400 }
    );
  }

  const body = await request.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, WEBHOOK_SECRET);
  } catch {
    return NextResponse.json(
      { error: "Invalid Stripe webhook signature." },
      { status: 400 }
    );
  }

  if (
    event.type === "checkout.session.completed" ||
    event.type === "checkout.session.async_payment_succeeded"
  ) {
    const session = event.data.object as Stripe.Checkout.Session;
    const result = await recordOrderFromSession(session.id);

    // Delayed payment methods can complete the Checkout flow before funds are
    // confirmed. A later async_payment_succeeded event will retry recording.
    if (!result.ok && result.reason !== "not-paid") {
      return NextResponse.json(
        { error: "Order recording failed; Stripe may retry this event." },
        { status: 500 }
      );
    }
  } else if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    if (paymentIntent.metadata?.cart) {
      const result = await recordOrderFromPaymentIntent(paymentIntent.id);
      if (!result.ok) {
        return NextResponse.json(
          { error: "Order recording failed; Stripe may retry this event." },
          { status: 500 }
        );
      }
    }
  }

  return NextResponse.json({ received: true });
}
