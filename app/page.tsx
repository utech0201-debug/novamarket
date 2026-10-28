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
      <section className="relative min-h-[590px] h-[76svh] max-h-[850px] w-full overflow-hidden bg-ink sm:min-h-[640px]">
        <Image
          src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=2000&q=85"
          alt="Fashion editorial featuring contemporary everyday style"
          fill
          sizes="100vw"
          priority
          className="object-cover object-center"
          quality={80}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-black/10" />
        <div className="absolute inset-0 bg-black/10" />
        <div className="container-x relative flex h-full min-h-[590px] flex-col items-start justify-center text-white sm:min-h-[640px]">
          <p className="mb-5 flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.3em] text-gold-light sm:text-xs">
            <span className="h-px w-9 bg-gold" />
            The new season · 2026
          </p>
          <h1 className="max-w-3xl font-serif text-5xl font-medium leading-[1.04] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
            Style that speaks
            <span className="block italic text-gold-light">without saying a word.</span>
          </h1>
          <p className="mt-6 max-w-md text-sm leading-7 text-white/80 sm:text-base">
            Discover considered pieces for a wardrobe that feels distinctly yours.
            Modern essentials, selected with intention.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link href="/products" className="btn-primary border-gold bg-gold text-ink hover:border-white hover:bg-white">
              Explore the collection
            </Link>
            <Link href="/products?category=Women" className="inline-flex items-center gap-3 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:text-gold-light">
              Discover women <span aria-hidden="true">↗</span>
            </Link>
          </div>
          <div className="absolute bottom-7 right-8 hidden items-center gap-3 text-[10px] uppercase tracking-[0.22em] text-white/70 md:flex">
            <span className="h-px w-8 bg-gold" /> Curated for your everyday
          </div>
        </div>
      </section>

      <section className="container-x py-16 sm:py-20">
        <div className="mb-8 flex flex-col justify-between gap-3 sm:mb-10 sm:flex-row sm:items-end">
          <div>
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.26em] text-gold-dark">Find your look</p>
            <h2 className="font-serif text-3xl font-medium tracking-tight sm:text-4xl">Shop by category</h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-black/55">
            Easy-to-wear pieces and finishing touches for every part of your wardrobe.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {categories
            .filter((c) => c !== "All")
            .map((cat) => (
              <Link
                key={cat}
                href={`/products?category=${cat}`}
                className="group relative flex h-[300px] items-end overflow-hidden bg-sand sm:h-[360px]"
              >
                <Image
                  src={
                    cat === "Men"
                      ? "https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&w=900&q=80"
                      : cat === "Women"
                      ? "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80"
                      : "https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?auto=format&fit=crop&w=900&q=80"
                  }
                  alt={`${cat} fashion collection`}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  quality={75}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent transition-colors group-hover:from-black/80" />
                <div className="relative flex w-full items-end justify-between p-6 text-white sm:p-7">
                  <span className="font-serif text-3xl">{cat}</span>
                  <span className="flex h-10 w-10 items-center justify-center border border-white/50 text-lg transition-all group-hover:border-gold group-hover:bg-gold group-hover:text-ink" aria-hidden="true">↗</span>
                </div>
              </Link>
            ))}
        </div>
      </section>

      <section className="bg-[#f5f5f3] py-16 sm:py-20">
        <div className="container-x">
          <div className="mb-8 flex items-end justify-between sm:mb-10">
            <div>
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.26em] text-gold-dark">Selected for you</p>
              <h2 className="font-serif text-3xl font-medium tracking-tight sm:text-4xl">Featured pieces</h2>
            </div>
            <Link href="/products" className="border-b border-gold pb-2 text-[10px] font-semibold uppercase tracking-[0.15em] transition-colors hover:text-gold-dark sm:text-xs">
              View all <span aria-hidden="true">↗</span>
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-9 sm:gap-x-6 md:grid-cols-4">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ink py-14 text-white sm:py-16">
        <div className="container-x flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.26em] text-gold">YBG Garments</p>
            <h2 className="max-w-2xl font-serif text-3xl leading-tight sm:text-4xl">Make room for pieces you’ll reach for again and again.</h2>
          </div>
          <Link href="/products" className="btn-primary shrink-0 border-gold bg-gold text-ink hover:border-white hover:bg-white">
            Shop all styles
          </Link>
        </div>
      </section>
    </>
  );
}
