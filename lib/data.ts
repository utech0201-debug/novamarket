import "server-only";
import { createClient } from "@/lib/supabase/server";
import { products as fallbackProducts, type Product } from "@/lib/products";

// Shape of a row in the Supabase `products` table.
type ProductRow = {
  id: string;
  name: string;
  price: number | string;
  category: Product["category"];
  description: string | null;
  image: string | null;
  featured: boolean | null;
};

function mapRow(row: ProductRow): Product {
  return {
    id: String(row.id),
    name: row.name,
    price: Number(row.price),
    category: row.category,
    description: row.description ?? "",
    image: row.image ?? "",
    featured: row.featured ?? false,
  };
}

// All products. Reads from Supabase when configured, otherwise the demo catalog.
export async function getProducts(): Promise<Product[]> {
  const supabase = createClient();
  if (!supabase) return fallbackProducts;

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: true });

  if (error || !data || data.length === 0) return fallbackProducts;
  return (data as ProductRow[]).map(mapRow);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const all = await getProducts();
  const featured = all.filter((p) => p.featured);
  return featured.length > 0 ? featured : all.slice(0, 6);
}

export async function getProductById(id: string): Promise<Product | null> {
  const supabase = createClient();
  if (!supabase) return fallbackProducts.find((p) => p.id === id) ?? null;

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return fallbackProducts.find((p) => p.id === id) ?? null;
  return mapRow(data as ProductRow);
}

export async function getRelatedProducts(
  product: Product,
  limit = 4
): Promise<Product[]> {
  const all = await getProducts();
  return all
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, limit);
}
