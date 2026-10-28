import Image from "next/image";
import Link from "next/link";
import { getProducts } from "@/lib/data";
import { formatPrice } from "@/lib/products";
import { deleteProduct } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await getProducts();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl font-bold">Products</h1>
        <Link href="/admin/products/new" className="btn-primary">
          Add product
        </Link>
      </div>

      <div className="mt-8 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ink/10 text-left text-ink/50">
              <th className="py-3 pr-4 font-medium">Product</th>
              <th className="py-3 pr-4 font-medium">Category</th>
              <th className="py-3 pr-4 font-medium">Price</th>
              <th className="py-3 pr-4 font-medium">Featured</th>
              <th className="py-3 pr-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-ink/5">
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-sand">
                      {p.image && (
                        <Image
                          src={p.image}
                          alt={p.name}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      )}
                    </div>
                    <span className="font-medium">{p.name}</span>
                  </div>
                </td>
                <td className="py-3 pr-4 text-ink/70">{p.category}</td>
                <td className="py-3 pr-4">{formatPrice(p.price)}</td>
                <td className="py-3 pr-4 text-ink/70">
                  {p.featured ? "Yes" : "—"}
                </td>
                <td className="py-3 pr-4">
                  <div className="flex items-center justify-end gap-3">
                    <Link
                      href={`/admin/products/${p.id}/edit`}
                      className="text-accent hover:underline"
                    >
                      Edit
                    </Link>
                    <form action={deleteProduct}>
                      <input type="hidden" name="id" value={p.id} />
                      <button
                        type="submit"
                        className="text-ink/50 hover:text-accent"
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
