import { NextResponse, type NextRequest } from "next/server";
import { stripe } from "@/lib/stripe/server";
import { STRIPE_PUBLISHABLE_KEY } from "@/lib/stripe/config";
import { getProducts } from "@/lib/data";
import { createAdminClient } from "@/lib/supabase/admin";

type IncomingItem = { id: string; quantity: number };

// Creates a Stripe PaymentIntent for the native (mobile) PaymentSheet flow.
// Prices are re-validated server-side so the client can't tamper with amounts.
export async function POST(request: NextRequest) {
  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe isn't configured yet." },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (
    !body ||
    typeof body !== "object" ||
    !Array.isArray((body as { items?: unknown }).items)
  ) {
    return NextResponse.json({ error: "Cart is empty or invalid." }, { status: 400 });
  }

  const items = (body as { items: unknown[] }).items;
  if (items.length === 0 || items.length > 100) {
    return NextResponse.json(
      { error: "Cart must contain between 1 and 100 items." },
      { status: 400 }
    );
  }

  // Identify the signed-in user from the bearer token; never trust a client ID.
  let userId = "";
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const admin = createAdminClient();
    if (admin) {
      const { data } = await admin.auth.getUser(authHeader.slice(7));
      userId = data.user?.id ?? "";
    }
  }

  const catalog = await getProducts();
  const byId = new Map(catalog.map((product) => [product.id, product]));
  let amount = 0;
  const compactCart: { id: string; q: number }[] = [];

  for (const rawItem of items) {
    if (!rawItem || typeof rawItem !== "object") {
      return NextResponse.json({ error: "Invalid cart item." }, { status: 400 });
    }

    const item = rawItem as Partial<IncomingItem>;
    if (
      typeof item.id !== "string" ||
      !item.id.trim() ||
      !Number.isInteger(item.quantity) ||
      (item.quantity as number) < 1 ||
      (item.quantity as number) > 99
    ) {
      return NextResponse.json(
        { error: "Each item needs a valid product and quantity (1–99)." },
        { status: 400 }
      );
    }

    const product = byId.get(item.id);
    if (!product) {
      return NextResponse.json(
        { error: "One or more products are no longer available." },
        { status: 400 }
      );
    }

    const quantity = item.quantity as number;
    const unitAmount = Math.round(product.price * 100);
    if (!Number.isSafeInteger(unitAmount) || unitAmount <= 0) {
      return NextResponse.json(
        { error: "A product has an invalid price." },
        { status: 400 }
      );
    }

    amount += unitAmount * quantity;
    // Stripe's supported maximum for a USD PaymentIntent is 99,999,999 cents.
    if (!Number.isSafeInteger(amount) || amount > 99_999_999) {
      return NextResponse.json(
        { error: "Cart total exceeds the payment limit." },
        { status: 400 }
      );
    }

    compactCart.push({ id: product.id, q: quantity });
  }

  if (amount <= 0 || compactCart.length === 0) {
    return NextResponse.json({ error: "No valid items to checkout." }, { status: 400 });
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
    console.error("Stripe PaymentIntent creation failed", err);
    return NextResponse.json(
      { error: "Unable to start payment. Please try again." },
      { status: 502 }
    );
  }
}
