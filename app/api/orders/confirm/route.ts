import { NextResponse, type NextRequest } from "next/server";
import {
  recordOrderFromSession,
  recordOrderFromPaymentIntent,
} from "@/lib/orders";

// Called by the web success page (session_id) and by the mobile app after the
// PaymentSheet succeeds (payment_intent_id), so an order is recorded even when
// the Stripe webhook isn't running locally. Safe because the order is built
// entirely from data Stripe returns (the client can't forge a paid payment).
export async function POST(request: NextRequest) {
  let body: { session_id?: string; payment_intent_id?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body." }, { status: 400 });
  }

  if (body.session_id) {
    const result = await recordOrderFromSession(body.session_id);
    return NextResponse.json(result, { status: result.ok ? 200 : 202 });
  }

  if (body.payment_intent_id) {
    const result = await recordOrderFromPaymentIntent(body.payment_intent_id);
    return NextResponse.json(result, { status: result.ok ? 200 : 202 });
  }

  return NextResponse.json(
    { error: "Missing session_id or payment_intent_id." },
    { status: 400 }
  );
}
