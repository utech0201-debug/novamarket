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
  params: { id: string };
}) {
  const product = await getProductById(params.id);
  if (!product) notFound();

  const related = await getRelatedProducts(product);

  return (
    <div className="container-x py-12">
      <Link href="/products" className="text-sm text-ink/60 hover:text-accent">
        ← Back to shop
      </Link>

      <div className="mt-6 grid gap-10 md:grid-cols-2">
        <div className="relative aspect-[3/4] overflow-hidden rounded-3xl bg-sand">
          <Image
            src={product.image}
            alt={product.name}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

        <div className="flex flex-col justify-center">
          <p className="text-sm uppercase tracking-wide text-ink/50">
            {product.category}
          </p>
          <h1 className="mt-2 font-serif text-4xl font-bold">{product.name}</h1>
          <p className="mt-4 text-2xl">{formatPrice(product.price)}</p>
          <p className="mt-6 leading-relaxed text-ink/70">
            {product.description}
          </p>

          <AddToCartButton product={product} />

          <ul className="mt-8 space-y-2 text-sm text-ink/60">
            <li>• Free shipping on orders over $150</li>
            <li>• 30-day easy returns</li>
            <li>• Secure checkout</li>
          </ul>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="mb-8 font-serif text-2xl font-bold">
            You may also like
          </h2>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
