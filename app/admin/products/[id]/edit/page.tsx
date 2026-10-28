import { notFound } from "next/navigation";
import ProductForm from "../../ProductForm";
import { updateProduct } from "../../actions";
import { getProductById } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await getProductById(params.id);
  if (!product) notFound();

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold">Edit product</h1>
      <div className="mt-8">
        <ProductForm
          action={updateProduct}
          product={product}
          submitLabel="Save changes"
        />
      </div>
    </div>
  );
}
