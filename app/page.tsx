import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { categories } from "@/lib/products";
import { getFeaturedProducts } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const featured = await getFeaturedProducts();

  return (
    <>
      {/* Hero */}
      <section className="relative h-[70vh] min-h-[460px] w-full overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1600&q=80"
          alt="Fashion editorial"
          fill
          sizes="100vw"
          priority
          className="object-cover"
        quality={70}
        />
        <div className="absolute inset-0 bg-ink/40" />
        <div className="container-x relative flex h-full flex-col items-start justify-center text-cream">
          <p className="mb-3 text-sm uppercase tracking-[0.2em]">
            New Season 2026
          </p>
          <h1 className="max-w-2xl font-serif text-5xl font-bold leading-tight md:text-7xl">
            Timeless style, thoughtfully made.
          </h1>
          <p className="mt-4 max-w-md text-cream/80">
            Discover our curated collection of modern essentials for every
            wardrobe.
          </p>
          <Link href="/products" className="mt-8 btn-primary bg-cream text-ink hover:bg-accent hover:text-cream">
            Shop the Collection
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="container-x py-16">
        <div className="grid gap-4 md:grid-cols-3">
          {categories
            .filter((c) => c !== "All")
            .map((cat) => (
              <Link
                key={cat}
                href={`/products?category=${cat}`}
                className="group relative flex h-56 items-end overflow-hidden rounded-2xl bg-sand p-6"
              >
                <Image
                  src={
                    cat === "Men"
                      ? "https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&w=800&q=80"
                      : cat === "Women"
                      ? "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80"
                      : "https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?auto=format&fit=crop&w=800&q=80"
                  }
                  alt={cat}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                quality={70}
                />
                <div className="absolute inset-0 bg-ink/30" />
                <span className="relative font-serif text-2xl font-bold text-cream">
                  {cat}
                </span>
              </Link>
            ))}
        </div>
      </section>

      {/* Featured */}
      <section className="container-x pb-20">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="font-serif text-3xl font-bold">Featured</h2>
          <Link href="/products" className="text-sm hover:text-accent">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </>
  );
}
