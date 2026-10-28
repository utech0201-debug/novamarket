import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatPrice } from "@/lib/products";
import { getProductById, getRelatedProducts } from "@/lib/data";
import ProductCard from "@/components/ProductCard";
import AddToCartButton from "./AddToCartButton";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();

  const related = await getRelatedProducts(product);

  return (
    <div className="container-x py-8 sm:py-12">
      <Link href="/products" className="inline-flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.17em] text-black/55 transition-colors hover:text-gold-dark">
        <span aria-hidden="true">←</span> Back to collection
      </Link>

      <div className="mt-6 grid gap-8 md:mt-9 md:grid-cols-2 md:gap-12 lg:gap-16">
        <div className="relative aspect-[4/5] overflow-hidden bg-[#f0f0ed]">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              quality={80}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[#f0f0ed] text-black/40">
              <span className="font-serif text-6xl" aria-hidden="true">YBG</span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em]">Product image coming soon</span>
            </div>
          )}
          <div className="pointer-events-none absolute left-4 top-4 border border-white/70 bg-white/90 px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-ink">
            YBG selection
          </div>
        </div>

        <div className="flex flex-col justify-center py-2 md:py-8">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-gold-dark">{product.category}</p>
          <h1 className="mt-3 font-serif text-4xl font-medium leading-tight tracking-tight sm:text-5xl">{product.name}</h1>
          <p className="mt-5 text-xl font-medium tracking-wide">{formatPrice(product.price)}</p>
          <div className="mt-5 h-px w-14 bg-gold" />
          <p className="mt-5 max-w-xl text-sm leading-7 text-black/65 sm:text-base">{product.description}</p>

          <AddToCartButton product={product} />

          <div className="mt-8 border-y border-black/10 py-5">
            <div className="flex items-start gap-3 py-2">
              <span className="mt-0.5 text-gold" aria-hidden="true">✦</span>
              <div>
                <p className="text-xs font-semibold">Thoughtfully selected</p>
                <p className="mt-1 text-xs leading-5 text-black/55">A considered addition to your everyday wardrobe.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 py-2">
              <span className="mt-0.5 text-gold" aria-hidden="true">✦</span>
              <div>
                <p className="text-xs font-semibold">Secure checkout</p>
                <p className="mt-1 text-xs leading-5 text-black/55">Your order continues through our secure checkout flow.</p>
              </div>
            </div>
          </div>
          <p className="mt-4 text-[10px] leading-5 text-black/45">Shipping options and return terms are confirmed during checkout.</p>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16 border-t border-black/10 pt-12 sm:mt-24 sm:pt-16">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-gold-dark">Complete the look</p>
              <h2 className="font-serif text-3xl font-medium sm:text-4xl">You may also like</h2>
            </div>
            <Link href="/products" className="border-b border-gold pb-2 text-[10px] font-semibold uppercase tracking-[0.12em] hover:text-gold-dark">Explore all</Link>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-9 sm:gap-x-6 md:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
