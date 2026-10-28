"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { categories, type Product } from "@/lib/products";

export default function ProductsBrowser({
  products,
}: {
  products: Product[];
}) {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";

  const [category, setCategory] = useState(initialCategory);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"featured" | "low" | "high">("featured");

  const filtered = useMemo(() => {
    let list = [...products];
    if (category !== "All") list = list.filter((p) => p.category === category);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q));
    }
    if (sort === "low") list.sort((a, b) => a.price - b.price);
    if (sort === "high") list.sort((a, b) => b.price - a.price);
    return list;
  }, [products, category, search, sort]);

  return (
    <div className="container-x py-12">
      <h1 className="font-serif text-4xl font-bold">Shop All</h1>

      <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`rounded-full px-4 py-2 text-sm transition-colors ${
                category === cat
                  ? "bg-ink text-cream"
                  : "border border-ink/20 hover:border-ink"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="rounded-full border border-ink/20 bg-cream px-4 py-2 text-sm outline-none focus:border-ink"
          />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
            className="rounded-full border border-ink/20 bg-cream px-4 py-2 text-sm outline-none focus:border-ink"
          >
            <option value="featured">Featured</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
          </select>
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="mt-16 text-center text-ink/50">
          No products match your search.
        </p>
      )}
    </div>
  );
}
