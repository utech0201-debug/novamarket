"use client";

import { Suspense, useEffect, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FiCheckCircle } from "react-icons/fi";
import { useCart } from "@/context/CartContext";

function SuccessContent() {
  const { clearCart } = useCart();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    clearCart();

    // Record the order (idempotent server-side). Works even without the
    // Stripe webhook running locally.
    if (sessionId) {
      fetch("/api/orders/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId }),
      }).catch(() => {
        // Non-blocking: the webhook is the backstop in production.
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  return (
    <div className="container-x flex flex-col items-center py-32 text-center">
      <FiCheckCircle size={64} className="text-accent" />
      <h1 className="mt-6 font-serif text-4xl font-bold">Thank you!</h1>
      <p className="mt-3 max-w-md text-ink/60">
        Your order has been placed successfully. A confirmation has been sent to
        your email. (This is a test-mode order — no real charge was made.)
      </p>
      <div className="mt-8 flex gap-4">
        <Link href="/products" className="btn-primary">
          Continue shopping
        </Link>
        <Link href="/account" className="btn-outline">
          View my orders
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={<div className="container-x py-32 text-center">Loading…</div>}
    >
      <SuccessContent />
    </Suspense>
  );
}
