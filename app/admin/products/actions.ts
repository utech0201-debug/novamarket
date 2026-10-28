"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type ActionState = { error?: string } | void;

function parseForm(formData: FormData) {
  return {
    name: String(formData.get("name") ?? "").trim(),
    price: Number(formData.get("price") ?? 0),
    category: String(formData.get("category") ?? "Men"),
    description: String(formData.get("description") ?? "").trim(),
    image: String(formData.get("image") ?? "").trim(),
    featured: formData.get("featured") === "on",
  };
}

export async function createProduct(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = createClient();
  if (!supabase) return { error: "Database not configured." };

  const values = parseForm(formData);
  if (!values.name || values.price <= 0) {
    return { error: "Name and a price greater than 0 are required." };
  }

  const { error } = await supabase.from("products").insert(values);
  if (error) return { error: error.message };

  revalidatePath("/admin/products");
  revalidatePath("/products");
  redirect("/admin/products");
}

export async function updateProduct(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = createClient();
  if (!supabase) return { error: "Database not configured." };

  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "Missing product id." };

  const values = parseForm(formData);
  if (!values.name || values.price <= 0) {
    return { error: "Name and a price greater than 0 are required." };
  }

  const { error } = await supabase.from("products").update(values).eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath(`/products/${id}`);
  redirect("/admin/products");
}

export async function deleteProduct(formData: FormData): Promise<void> {
  const supabase = createClient();
  if (!supabase) return;

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await supabase.from("products").delete().eq("id", id);
  revalidatePath("/admin/products");
  revalidatePath("/products");
}
