"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type ActionState = { error?: string } | void;
type ProductCategory = "Men" | "Women" | "Accessories";

const CATEGORIES: ProductCategory[] = ["Men", "Women", "Accessories"];

async function getAuthorizedAdmin() {
  const supabase = await createClient();
  if (!supabase) return null;

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) return null;

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError || !profile?.is_admin) return null;
  return supabase;
}

function parseForm(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const rawPrice = Number(formData.get("price"));
  const category = String(formData.get("category") ?? "");
  const description = String(formData.get("description") ?? "").trim();
  const image = String(formData.get("image") ?? "").trim();

  if (!name || name.length > 160) {
    return { error: "Product name is required and must be 160 characters or fewer." } as const;
  }
  if (!Number.isFinite(rawPrice) || rawPrice <= 0 || rawPrice > 99_999_999.99) {
    return { error: "Enter a valid price greater than 0." } as const;
  }
  if (!CATEGORIES.includes(category as ProductCategory)) {
    return { error: "Choose a valid product category." } as const;
  }
  if (description.length > 5000) {
    return { error: "Description must be 5,000 characters or fewer." } as const;
  }
  if (image) {
    try {
      const imageUrl = new URL(image);
      if (imageUrl.protocol !== "https:") throw new Error("HTTPS required");
    } catch {
      return { error: "Product image must be a valid HTTPS URL." } as const;
    }
  }

  return {
    values: {
      name,
      price: Math.round(rawPrice * 100) / 100,
      category: category as ProductCategory,
      description,
      image,
      featured: formData.get("featured") === "on",
    },
  } as const;
}

export async function createProduct(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await getAuthorizedAdmin();
  if (!supabase) return { error: "You are not authorized to manage products." };

  const parsed = parseForm(formData);
  if ("error" in parsed) return { error: parsed.error };

  const { error } = await supabase.from("products").insert(parsed.values);
  if (error) {
    console.error("Admin product creation failed", error);
    return { error: "Could not create the product. Check the details and try again." };
  }

  revalidatePath("/admin/products");
  revalidatePath("/products");
  redirect("/admin/products");
}

export async function updateProduct(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await getAuthorizedAdmin();
  if (!supabase) return { error: "You are not authorized to manage products." };

  const id = String(formData.get("id") ?? "").trim();
  if (!id) return { error: "Missing product id." };

  const parsed = parseForm(formData);
  if ("error" in parsed) return { error: parsed.error };

  const { error } = await supabase
    .from("products")
    .update(parsed.values)
    .eq("id", id);
  if (error) {
    console.error("Admin product update failed", error);
    return { error: "Could not update the product. Check the details and try again." };
  }

  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath(`/products/${id}`);
  redirect("/admin/products");
}

export async function deleteProduct(formData: FormData): Promise<void> {
  const supabase = await getAuthorizedAdmin();
  if (!supabase) return;

  const id = String(formData.get("id") ?? "").trim();
  if (!id) return;

  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) {
    console.error("Admin product deletion failed", error);
    return;
  }

  revalidatePath("/admin/products");
  revalidatePath("/products");
}
