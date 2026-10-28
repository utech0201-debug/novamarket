"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/products";
import { FiTrash2 } from "react-icons/fi";

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="container-x flex flex-col items-center py-32 text-center">
        <h1 className="font-serif text-3xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-ink/60">
          Looks like you haven&apos;t added anything yet.
        </p>
        <Link href="/products" className="mt-6 btn-primary">
          Continue Shopping
        </Link>
      </div>
    );
  }

  const shipping = totalPrice > 150 ? 0 : 9.99;

  return (
    <div className="container-x py-12">
      <h1 className="font-serif text-4xl font-bold">Shopping Cart</h1>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
        <div className="divide-y divide-ink/10">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 py-6">
              <div className="relative h-28 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-sand">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="96px"
                  className="object-cover"
                  quality={70}
                />
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-ink/50">{item.category}</p>
                  </div>
                  <p className="font-medium">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center rounded-full border border-ink/20">
                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.quantity - 1)
                      }
                      className="px-3 py-1"
                      aria-label="Decrease"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-sm">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.quantity + 1)
                      }
                      className="px-3 py-1"
                      aria-label="Increase"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="flex items-center gap-1 text-sm text-ink/50 hover:text-accent"
                  >
                    <FiTrash2 size={16} /> Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="h-fit rounded-2xl bg-sand p-6">
          <h2 className="text-lg font-semibold">Order Summary</h2>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-ink/60">Subtotal</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink/60">Shipping</span>
              <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
            </div>
            <div className="border-t border-ink/10 pt-3">
              <div className="flex justify-between text-base font-semibold">
                <span>Total</span>
                <span>{formatPrice(totalPrice + shipping)}</span>
              </div>
            </div>
          </div>
          <Link href="/checkout" className="mt-6 btn-primary w-full">
            Proceed to Checkout
          </Link>
          <Link
            href="/products"
            className="mt-3 block text-center text-sm text-ink/60 hover:text-accent"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
