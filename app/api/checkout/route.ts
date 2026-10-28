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

  if (!Array.isArray(body.items) || body.items.length === 0) {
    return NextResponse.json({ error: "Cart is empty or invalid." }, { status: 400 });
  }

  // Stripe Checkout supports up to 100 line items in payment mode.
  if (body.items.length > 100) {
    return NextResponse.json({ error: "Cart has too many items." }, { status: 400 });
  }

  // Re-fetch real prices server-side so the client can't tamper with amounts.
  const catalog = await getProducts();
  const byId = new Map(catalog.map((product) => [product.id, product]));

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
  let subtotalCents = 0;

  for (const item of body.items) {
    if (
      !item ||
      typeof item.id !== "string" ||
      !item.id.trim() ||
      !Number.isInteger(item.quantity) ||
      item.quantity < 1 ||
      item.quantity > 99
    ) {
      return NextResponse.json(
        { error: "Each cart item needs a valid product and quantity (1–99)." },
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

    const unitAmount = Math.round(product.price * 100);
    subtotalCents += unitAmount * item.quantity;

    lineItems.push({
      quantity: item.quantity,
      price_data: {
        currency: "usd",
        unit_amount: unitAmount,
        product_data: {
          name: product.name,
          images: product.image ? [product.image] : undefined,
        },
      },
    });
  }

  const freeShipping = subtotalCents > 15000;
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? request.nextUrl.origin;

  // Link the order to the signed-in user (if any) so it shows in their account.
  const supabase = await createClient();
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
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: freeShipping ? 0 : 999,
              currency: "usd",
            },
            display_name: freeShipping ? "Free shipping" : "Standard shipping",
          },
        },
      ],
    };
    if (userId) params.client_reference_id = userId;

    const session = await stripe.checkout.sessions.create(params);

    if (!session.url) {
      return NextResponse.json(
        { error: "Stripe did not return a checkout URL." },
        { status: 502 }
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe Checkout session creation failed", err);
    return NextResponse.json(
      { error: "Unable to start checkout. Please try again." },
      { status: 502 }
    );
  }
}
