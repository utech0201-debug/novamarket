"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FiCheckCircle, FiClock, FiAlertCircle } from "react-icons/fi";
import { useCart } from "@/context/CartContext";

type VerificationState = "checking" | "confirmed" | "pending" | "missing";

function SuccessContent() {
  const { clearCart } = useCart();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const handled = useRef(false);
  const [verification, setVerification] = useState<VerificationState>(
    sessionId ? "checking" : "missing"
  );

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    if (!sessionId) {
      setVerification("missing");
      return;
    }

    let cancelled = false;

    async function confirmOrder() {
      try {
        const response = await fetch("/api/orders/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session_id: sessionId }),
        });
        const result: { ok?: boolean; reason?: string } = await response.json();

        if (cancelled) return;

        if (response.ok && result.ok) {
          clearCart();
          setVerification("confirmed");
        } else {
          setVerification("pending");
        }
      } catch {
        if (!cancelled) setVerification("pending");
      }
    }

    void confirmOrder();
    return () => {
      cancelled = true;
    };
    // clearCart is a context action; run verification once per success-page mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  const isConfirmed = verification === "confirmed";
  const isChecking = verification === "checking";

  return (
    <div className="container-x flex flex-col items-center py-32 text-center">
      {isConfirmed ? (
        <FiCheckCircle size={64} className="text-accent" />
      ) : isChecking ? (
        <FiClock size={64} className="text-ink/50" />
      ) : (
        <FiAlertCircle size={64} className="text-ink/50" />
      )}
      <h1 className="mt-6 font-serif text-4xl font-bold">
        {isConfirmed
          ? "Thank you for your order"
          : isChecking
          ? "Verifying your payment"
          : verification === "pending"
          ? "Payment verification pending"
          : "We couldn't verify this checkout"}
      </h1>
      <p className="mt-3 max-w-lg text-ink/60">
        {isConfirmed
          ? "Your payment is confirmed and your order details have been saved. Email receipts depend on your Stripe receipt settings."
          : isChecking
          ? "Please wait while we verify the payment with Stripe and save your order details."
          : verification === "pending"
          ? "We couldn't confirm the payment just yet. Please refresh this page in a moment or check your account before trying to pay again."
          : "This page is missing its checkout reference, so we can't confirm an order here. Check your account or return to the store."}
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
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
