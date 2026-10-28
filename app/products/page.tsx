import { Suspense } from "react";
import ProductsBrowser from "./ProductsBrowser";
import { getProducts } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <Suspense fallback={<div className="container-x py-12">Loading…</div>}>
      <ProductsBrowser products={products} />
    </Suspense>
  );
}
