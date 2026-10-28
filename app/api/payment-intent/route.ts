import { NextResponse, type NextRequest } from "next/server";
import { stripe } from "@/lib/stripe/server";
import { STRIPE_PUBLISHABLE_KEY } from "@/lib/stripe/config";
import { getProducts } from "@/lib/data";
import { createAdminClient } from "@/lib/supabase/admin";

type IncomingItem = { id: string; quantity: number };

// Creates a Stripe PaymentIntent for the native (mobile) PaymentSheet flow.
// Mirrors /api/checkout but returns a client secret instead of a hosted URL.
// Prices are re-validated server-side so the client can't tamper with amounts.
export async function POST(request: NextRequest) {
  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe isn't configured yet." },
      { status: 503 }
    );
  }

  let body: { items?: IncomingItem[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const items = body.items ?? [];
  if (items.length === 0) {
    return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
  }

  // Identify the signed-in user from the bearer token (sent by the app), so the
  // order links to their account. Never trust a client-supplied user id.
  let userId = "";
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const admin = createAdminClient();
    if (admin) {
      const { data } = await admin.auth.getUser(authHeader.slice(7));
      userId = data.user?.id ?? "";
    }
  }

  // Validate against real catalog prices and compute the authoritative total.
  const catalog = await getProducts();
  const byId = new Map(catalog.map((p) => [p.id, p]));

  let amount = 0;
  const compactCart: { id: string; q: number }[] = [];
  for (const item of items) {
    const product = byId.get(item.id);
    if (!product) continue;
    const quantity = Math.max(1, Math.min(99, Math.floor(item.quantity)));
    amount += Math.round(product.price * 100) * quantity;
    compactCart.push({ id: product.id, q: quantity });
  }

  if (amount <= 0 || compactCart.length === 0) {
    return NextResponse.json(
      { error: "No valid items to checkout." },
      { status: 400 }
    );
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      metadata: {
        user_id: userId,
        cart: JSON.stringify(compactCart),
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      publishableKey: STRIPE_PUBLISHABLE_KEY,
      amount,
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to create payment intent.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
