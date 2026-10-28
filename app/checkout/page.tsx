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
      <div className="container-x py-32 text-center">
        <h1 className="font-serif text-3xl font-bold">Nothing to checkout</h1>
        <Link href="/products" className="mt-6 inline-block btn-primary">
          Shop now
        </Link>
      </div>
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
    <div className="container-x py-12">
      <h1 className="font-serif text-4xl font-bold">Checkout</h1>

      <div className="mt-8 max-w-md rounded-2xl bg-sand p-6">
        <h2 className="text-lg font-semibold">Order Summary</h2>
        <div className="mt-4 space-y-2 text-sm">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between">
              <span className="text-ink/70">
                {item.name} × {item.quantity}
              </span>
              <span>{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
          <div className="flex justify-between border-t border-ink/10 pt-2">
            <span className="text-ink/60">Shipping</span>
            <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
          </div>
          <div className="flex justify-between border-t border-ink/10 pt-2 text-base font-semibold">
            <span>Total</span>
            <span>{formatPrice(totalPrice + shipping)}</span>
          </div>
        </div>

        {isStripePublishableConfigured ? (
          <>
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="btn-primary mt-6 w-full"
            >
              {loading ? "Redirecting to Stripe…" : "Pay with Stripe"}
            </button>
            <p className="mt-3 text-center text-xs text-ink/50">
              Test mode — use card 4242 4242 4242 4242, any future date & CVC.
            </p>
          </>
        ) : (
          <p className="mt-6 rounded-xl bg-cream p-4 text-sm text-ink/70">
            Payments aren&apos;t connected yet. Add your Stripe test keys to{" "}
            <code className="rounded bg-ink/10 px-1">.env.local</code> to enable
            checkout.
          </p>
        )}
      </div>
    </div>
  );
}
