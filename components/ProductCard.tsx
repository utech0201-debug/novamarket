"use client";

import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { Product, formatPrice } from "@/lib/products";
import { useCart } from "@/context/CartContext";

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    addItem(product);
    toast.success(`${product.name} added to cart`);
  }

  return (
    <Link href={`/products/${product.id}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden bg-[#f0f0ed]">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            quality={75}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#f0f0ed] text-black/40">
            <span className="font-serif text-4xl" aria-hidden="true">YBG</span>
            <span className="text-[9px] font-semibold uppercase tracking-[0.2em]">Image coming soon</span>
          </div>
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/20 to-transparent opacity-70" />
        <button
          onClick={handleAdd}
          className="absolute bottom-3 left-3 right-3 border border-white/70 bg-white/95 px-3 py-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink transition-colors hover:border-gold hover:bg-gold sm:bottom-4 sm:left-4 sm:right-4 sm:translate-y-3 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100"
        >
          Add to Cart <span aria-hidden="true">+</span>
        </button>
      </div>
      <div className="mt-4">
        <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-gold-dark">
          {product.category}
        </p>
        <h3 className="mt-1.5 text-sm font-medium leading-5 text-ink">{product.name}</h3>
        <p className="mt-2 text-sm font-semibold text-ink">{formatPrice(product.price)}</p>
      </div>
    </Link>
  );
}
