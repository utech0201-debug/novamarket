import ProductForm from "../ProductForm";
import { createProduct } from "../actions";

export const dynamic = "force-dynamic";

export default function NewProductPage() {
  return (
    <div>
      <h1 className="font-serif text-3xl font-bold">Add product</h1>
      <div className="mt-8">
        <ProductForm action={createProduct} submitLabel="Create product" />
      </div>
    </div>
  );
}
