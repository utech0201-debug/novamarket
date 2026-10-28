"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/products";
import { isStripePublishableConfigured } from "@/lib/stripe/config";

export default function CheckoutPage() {
  const { items, totalPrice } = useCart();
  const [loading, setLoading] = useState(false);

  if (items.length === 0) {
    return (
      <main className="container-x flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">YBG Garments</p>
        <h1 className="mt-4 font-serif text-4xl font-medium sm:text-5xl">Your bag is empty</h1>
        <p className="mt-3 text-sm text-ink/60">Add a piece from the collection before checking out.</p>
        <Link href="/products" className="btn-primary mt-7">Explore the collection</Link>
      </main>
    );
  }

  const shipping = totalPrice > 150 ? 0 : 9.99;

  async function handleCheckout() {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ id: i.id, quantity: i.quantity })),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error || "Checkout failed.");
      }
      window.location.href = data.url;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Checkout failed.");
      setLoading(false);
    }
  }

  return (
    <main className="container-x py-10 sm:py-14">
      <div className="border-b border-ink/10 pb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold">One last step</p>
        <h1 className="mt-3 font-serif text-4xl font-medium tracking-tight sm:text-5xl">Checkout</h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-ink/60">Review your selection before continuing to our secure payment page.</p>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-14">
        <section className="border border-ink/10 p-5 sm:p-7" aria-labelledby="checkout-items-heading">
          <div className="flex items-center justify-between gap-3 border-b border-ink/10 pb-5">
            <h2 id="checkout-items-heading" className="font-serif text-2xl">Your selection</h2>
            <Link href="/cart" className="text-xs underline decoration-gold/70 underline-offset-4 hover:text-gold">Edit bag</Link>
          </div>
          <ul className="divide-y divide-ink/10">
            {items.map((item) => (
              <li key={item.id} className="flex items-start justify-between gap-4 py-4">
                <div className="min-w-0">
                  <p className="font-medium leading-6">{item.name}</p>
                  <p className="mt-1 text-xs text-ink/55">Quantity: {item.quantity}</p>
                </div>
                <p className="whitespace-nowrap text-sm">{formatPrice(item.price * item.quantity)}</p>
              </li>
            ))}
          </ul>
          <div className="mt-5 border-t border-ink/10 pt-5">
            <p className="text-xs leading-5 text-ink/55">Your payment details are entered on the secure payment page. Shipping and return terms are confirmed during checkout.</p>
          </div>
        </section>

        <aside className="h-fit border border-ink/10 bg-white p-5 sm:p-7 lg:sticky lg:top-28">
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-gold">YBG Garments</p>
          <h2 className="mt-2 font-serif text-2xl">Order summary</h2>
          <div className="mt-6 space-y-4 text-sm">
            <div className="flex justify-between gap-4"><span className="text-ink/60">Subtotal</span><span>{formatPrice(totalPrice)}</span></div>
            <div className="flex justify-between gap-4"><span className="text-ink/60">Shipping</span><span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span></div>
            <div className="border-t border-ink/15 pt-4"><div className="flex justify-between gap-4 text-base font-semibold"><span>Total</span><span>{formatPrice(totalPrice + shipping)}</span></div></div>
          </div>

          {isStripePublishableConfigured ? (
            <>
              <button type="button" onClick={handleCheckout} disabled={loading} className="btn-primary mt-7 w-full disabled:cursor-not-allowed disabled:opacity-60">
                {loading ? "Redirecting to Stripe…" : "Continue to secure payment"}
              </button>
              <p className="mt-3 text-center text-xs text-ink/50">Test mode — use card 4242 4242 4242 4242, any future date &amp; CVC.</p>
            </>
          ) : (
            <p className="mt-6 border border-gold/30 bg-cream p-4 text-sm leading-6 text-ink/70">
              Payments aren&apos;t connected yet. Add your Stripe test keys to{" "}
              <code className="bg-ink/5 px-1 py-0.5">.env.local</code> to enable checkout.
            </p>
          )}
          <Link href="/products" className="mt-5 block text-center text-xs text-ink/55 underline decoration-ink/20 underline-offset-4 hover:text-gold">Continue shopping</Link>
        </aside>
      </div>
    </main>
  );
}
