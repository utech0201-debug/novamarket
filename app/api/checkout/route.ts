import { NextResponse, type NextRequest } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe/server";
import { getProducts } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";

type IncomingItem = { id: string; quantity: number };

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

  // Re-fetch real prices server-side so the client can't tamper with amounts.
  const catalog = await getProducts();
  const byId = new Map(catalog.map((p) => [p.id, p]));

  const lineItems: Array<{
    quantity: number;
    price_data: {
      currency: string;
      unit_amount: number;
      product_data: { name: string; images?: string[] };
    };
  }> = [];

  for (const item of items) {
    const product = byId.get(item.id);
    const quantity = Math.max(1, Math.min(99, Math.floor(item.quantity)));
    if (!product) continue;

    lineItems.push({
      quantity,
      price_data: {
        currency: "usd",
        unit_amount: Math.round(product.price * 100),
        product_data: {
          name: product.name,
          images: product.image ? [product.image] : undefined,
        },
      },
    });
  }

  if (lineItems.length === 0) {
    return NextResponse.json(
      { error: "No valid items to checkout." },
      { status: 400 }
    );
  }

  const origin =
    process.env.NEXT_PUBLIC_SITE_URL ?? request.nextUrl.origin;

  // Link the order to the signed-in user (if any) so it shows in their account.
  const supabase = createClient();
  let userId: string | undefined;
  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    userId = user?.id;
  }

  try {
    const params: Stripe.Checkout.SessionCreateParams = {
      mode: "payment",
      line_items: lineItems,
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cart`,
      shipping_address_collection: {
        allowed_countries: ["US", "GB", "PK", "CA", "AU"],
      },
    };
    if (userId) params.client_reference_id = userId;

    const session = await stripe.checkout.sessions.create(params);

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to create checkout session.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
