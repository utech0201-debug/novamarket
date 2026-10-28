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
      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-sand">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        quality={70}
        />
        <button
          onClick={handleAdd}
          className="absolute bottom-3 left-1/2 -translate-x-1/2 translate-y-12 rounded-full bg-ink px-5 py-2 text-xs font-medium text-cream opacity-0 transition-all duration-300 hover:bg-accent group-hover:translate-y-0 group-hover:opacity-100"
        >
          Add to Cart
        </button>
      </div>
      <div className="mt-3">
        <p className="text-xs uppercase tracking-wide text-ink/50">
          {product.category}
        </p>
        <h3 className="mt-1 text-sm font-medium">{product.name}</h3>
        <p className="mt-1 text-sm text-ink/70">{formatPrice(product.price)}</p>
      </div>
    </Link>
  );
}
