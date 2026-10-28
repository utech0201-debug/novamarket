import CartContent from "./CartContent";
import { getProducts } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function CartPage() {
  const products = await getProducts();
  return <CartContent products={products} />;
}
