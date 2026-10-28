"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Product } from "@/lib/products";
import { useCart } from "@/context/CartContext";

export default function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);

  function handleAdd() {
    for (let i = 0; i < qty; i++) addItem(product);
    toast.success(`${product.name} added to cart`);
  }

  return (
    <div className="mt-8 flex items-center gap-4">
      <div className="flex items-center rounded-full border border-ink/20">
        <button
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          className="px-4 py-2 text-lg"
          aria-label="Decrease quantity"
        >
          −
        </button>
        <span className="w-10 text-center">{qty}</span>
        <button
          onClick={() => setQty((q) => q + 1)}
          className="px-4 py-2 text-lg"
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>
      <button onClick={handleAdd} className="btn-primary flex-1">
        Add to Cart
      </button>
    </div>
  );
}
