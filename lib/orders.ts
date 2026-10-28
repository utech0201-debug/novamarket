import "server-only";
import { stripe } from "@/lib/stripe/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getProducts } from "@/lib/data";

export type RecordResult = { ok: boolean; reason?: string };

// Records a paid Stripe Checkout Session as an order. Idempotent: re-running
// with the same session id won't create duplicates (stripe_session_id is
// unique + we ignore conflicts). Called by both the webhook and the success
// page so orders are captured reliably with or without the Stripe CLI running.
export async function recordOrderFromSession(
  sessionId: string
): Promise<RecordResult> {
  if (!stripe) return { ok: false, reason: "stripe-not-configured" };

  const admin = createAdminClient();
  if (!admin) return { ok: false, reason: "service-role-not-configured" };

  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["line_items"],
  });

  if (session.payment_status !== "paid") {
    return { ok: false, reason: "not-paid" };
  }

  const items = (session.line_items?.data ?? []).map((li) => ({
    name: li.description,
    quantity: li.quantity ?? 1,
    amount_total: (li.amount_total ?? 0) / 100,
  }));

  const { error } = await admin.from("orders").upsert(
    {
      stripe_session_id: session.id,
      user_id: session.client_reference_id || null,
      email: session.customer_details?.email ?? null,
      amount_total: (session.amount_total ?? 0) / 100,
      currency: session.currency ?? "usd",
      status: "paid",
      items,
    },
    { onConflict: "stripe_session_id", ignoreDuplicates: true }
  );

  if (error) return { ok: false, reason: error.message };
  return { ok: true };
}

// Records a paid order from a Stripe PaymentIntent. Used by the mobile app's
// native PaymentSheet flow (which uses PaymentIntents, not Checkout Sessions).
// The cart is stored compactly in the PaymentIntent metadata; product names and
// prices are re-derived server-side from the catalog. Idempotent on the PI id.
export async function recordOrderFromPaymentIntent(
  paymentIntentId: string
): Promise<RecordResult> {
  if (!stripe) return { ok: false, reason: "stripe-not-configured" };

  const admin = createAdminClient();
  if (!admin) return { ok: false, reason: "service-role-not-configured" };

  const pi = await stripe.paymentIntents.retrieve(paymentIntentId);
  if (pi.status !== "succeeded") return { ok: false, reason: "not-paid" };

  let cart: { id: string; q: number }[] = [];
  try {
    cart = JSON.parse(pi.metadata.cart || "[]");
  } catch {
    cart = [];
  }

  const catalog = await getProducts();
  const byId = new Map(catalog.map((p) => [p.id, p]));
  const items = cart.map((c) => {
    const product = byId.get(c.id);
    return {
      name: product?.name ?? "Item",
      quantity: c.q,
      amount_total: product ? product.price * c.q : 0,
    };
  });

  const { error } = await admin.from("orders").upsert(
    {
      stripe_session_id: pi.id,
      user_id: pi.metadata.user_id || null,
      email: pi.receipt_email ?? null,
      amount_total: (pi.amount ?? 0) / 100,
      currency: pi.currency ?? "usd",
      status: "paid",
      items,
    },
    { onConflict: "stripe_session_id", ignoreDuplicates: true }
  );

  if (error) return { ok: false, reason: error.message };
  return { ok: true };
}
