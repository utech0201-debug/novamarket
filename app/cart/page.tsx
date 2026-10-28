"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatPrice, products } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import { FiTrash2 } from "react-icons/fi";

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <main className="container-x flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">YBG Garments</p>
        <h1 className="mt-4 font-serif text-4xl font-medium tracking-tight text-ink sm:text-5xl">Your next favourite starts here.</h1>
        <p className="mt-4 max-w-sm text-sm leading-6 text-ink/60">Your bag is waiting for something special. Explore the collection and find your next piece.</p>
        <Link href="/products" className="btn-primary mt-8">Explore the collection</Link>
      </main>
    );
  }

  const shipping = totalPrice > 150 ? 0 : 9.99;
  const recommendedProducts = products
    .filter((product) => !items.some((item) => item.id === product.id))
    .slice(0, 4);

  return (
    <main className="container-x py-10 sm:py-14">
      <div className="border-b border-ink/10 pb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold">Your selection</p>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-serif text-4xl font-medium tracking-tight sm:text-5xl">Shopping bag</h1>
            <p className="mt-2 text-sm text-ink/55">{items.length} {items.length === 1 ? "piece" : "pieces"} selected</p>
          </div>
          <Link href="/products" className="text-sm underline decoration-gold/70 underline-offset-4 transition hover:text-gold">Continue exploring</Link>
        </div>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-14">
        <section aria-label="Items in your shopping bag" className="divide-y divide-ink/10">
          {items.map((item) => (
            <article key={item.id} className="flex gap-4 py-6 sm:gap-6">
              <div className="relative h-32 w-24 flex-shrink-0 overflow-hidden bg-cream sm:h-40 sm:w-32">
                <Image src={item.image} alt={item.name} fill sizes="(max-width: 640px) 96px, 128px" className="object-cover" quality={75} />
              </div>
              <div className="flex min-w-0 flex-1 flex-col justify-between gap-5 py-1">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold">{item.category}</p>
                    <h2 className="mt-1 font-serif text-lg leading-snug sm:text-xl">{item.name}</h2>
                  </div>
                  <p className="whitespace-nowrap text-sm font-medium sm:text-base">{formatPrice(item.price * item.quantity)}</p>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="inline-flex items-center border border-ink/15">
                    <button type="button" onClick={() => updateQuantity(item.id, item.quantity - 1)} className="h-9 w-9 transition hover:bg-cream focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold" aria-label={`Decrease quantity of ${item.name}`}>−</button>
                    <span className="w-8 text-center text-sm tabular-nums" aria-label="Quantity">{item.quantity}</span>
                    <button type="button" onClick={() => updateQuantity(item.id, item.quantity + 1)} className="h-9 w-9 transition hover:bg-cream focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold" aria-label={`Increase quantity of ${item.name}`}>+</button>
                  </div>
                  <button type="button" onClick={() => removeItem(item.id)} className="inline-flex items-center gap-2 text-xs text-ink/55 transition hover:text-red-700" aria-label={`Remove ${item.name} from bag`}>
                    <FiTrash2 size={14} /> Remove
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>

        <aside className="h-fit border border-ink/10 bg-white p-5 sm:p-7 lg:sticky lg:top-28">
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-gold">The details</p>
          <h2 className="mt-2 font-serif text-2xl">Order summary</h2>
          <div className="mt-6 space-y-4 text-sm">
            <div className="flex justify-between gap-4"><span className="text-ink/60">Subtotal</span><span>{formatPrice(totalPrice)}</span></div>
            <div className="flex justify-between gap-4"><span className="text-ink/60">Shipping</span><span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span></div>
            <div className="border-t border-ink/15 pt-4"><div className="flex justify-between gap-4 text-base font-semibold"><span>Total</span><span>{formatPrice(totalPrice + shipping)}</span></div></div>
          </div>
          <Link href="/checkout" className="btn-primary mt-7 flex w-full items-center justify-center">Continue to checkout <span aria-hidden="true" className="ml-2">→</span></Link>
          <p className="mt-4 text-center text-xs leading-5 text-ink/50">Shipping and return terms are confirmed during checkout.</p>
        </aside>
      </div>

      {recommendedProducts.length > 0 && (
        <section className="mt-20 border-t border-ink/10 pt-12 sm:mt-24 sm:pt-16" aria-labelledby="you-might-like-heading">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">Picked for you</p>
              <h2 id="you-might-like-heading" className="mt-3 font-serif text-3xl font-medium tracking-tight sm:text-4xl">You might also like</h2>
              <p className="mt-2 text-sm text-ink/60">A few more pieces worth discovering.</p>
            </div>
            <Link href="/products" className="text-xs font-semibold uppercase tracking-[0.15em] underline decoration-gold/70 underline-offset-4 transition hover:text-gold">Shop all</Link>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-9 sm:gap-x-6 lg:grid-cols-4">
            {recommendedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
