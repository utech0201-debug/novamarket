"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { categories, type Product } from "@/lib/products";

export default function ProductsBrowser({ products }: { products: Product[] }) {
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
    <div className="min-h-[60vh]">
      <section className="bg-ink py-12 text-white sm:py-16">
        <div className="container-x">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-gold">The YBG edit</p>
          <h1 className="font-serif text-4xl font-medium sm:text-5xl">The collection</h1>
          <p className="mt-4 max-w-xl text-sm leading-6 text-white/65 sm:text-base">
            Discover considered essentials and finishing touches, selected to bring confidence to your everyday wardrobe.
          </p>
          <div className="mt-7 flex items-center gap-3 text-[10px] uppercase tracking-[0.18em] text-white/45">
            <span className="h-px w-8 bg-gold" />
            {products.length} {products.length === 1 ? "piece" : "pieces"} to explore
          </div>
        </div>
      </section>

      <section className="container-x py-9 sm:py-12">
        <div className="flex flex-col gap-5 border-b border-black/10 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-dark">Browse your way</p>
            <div className="flex flex-wrap gap-2" aria-label="Filter by category">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  aria-pressed={category === cat}
                  className={`border px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] transition-colors ${
                    category === cat
                      ? "border-ink bg-ink text-white"
                      : "border-black/15 bg-white text-ink hover:border-gold hover:text-gold-dark"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-[minmax(200px,1fr)_auto] lg:min-w-[400px]">
            <label className="flex items-center border border-black/15 bg-white px-3 focus-within:border-gold">
              <span className="sr-only">Search products</span>
              <svg aria-hidden="true" viewBox="0 0 24 24" className="mr-2 h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="10.8" cy="10.8" r="6.8" />
                <path d="m16 16 4 4" />
              </svg>
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search the collection"
                className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none placeholder:text-black/40"
              />
            </label>
            <label className="flex items-center gap-3 border border-black/15 bg-white px-3">
              <span className="whitespace-nowrap text-[9px] font-semibold uppercase tracking-[0.14em] text-black/50">Sort by</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as typeof sort)}
                className="min-w-0 flex-1 bg-transparent py-3 text-xs outline-none"
              >
                <option value="featured">Featured</option>
                <option value="low">Price: Low to High</option>
                <option value="high">Price: High to Low</option>
              </select>
            </label>
          </div>
        </div>

        <div className="flex items-center justify-between py-5 text-xs text-black/55">
          <p>{filtered.length} {filtered.length === 1 ? "item" : "items"} found</p>
          {(search || category !== "All" || sort !== "featured") && (
            <button
              type="button"
              onClick={() => { setSearch(""); setCategory("All"); setSort("featured"); }}
              className="border-b border-gold pb-1 font-medium text-ink transition-colors hover:text-gold-dark"
            >
              Clear filters
            </button>
          )}
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-9 sm:gap-x-6 sm:gap-y-12 md:grid-cols-3 lg:grid-cols-4">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex min-h-64 flex-col items-center justify-center border border-dashed border-black/15 px-6 text-center">
            <p className="font-serif text-2xl">Nothing found just yet.</p>
            <p className="mt-2 max-w-sm text-sm leading-6 text-black/55">Try another search or clear your filters to explore the full collection.</p>
            <button
              type="button"
              onClick={() => { setSearch(""); setCategory("All"); setSort("featured"); }}
              className="btn-primary mt-6"
            >
              View all pieces
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
