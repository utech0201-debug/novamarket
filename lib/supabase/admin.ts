import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_URL } from "./config";

const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

export const isAdminConfigured =
  SUPABASE_URL.startsWith("http") &&
  SERVICE_ROLE_KEY.length > 20 &&
  !SERVICE_ROLE_KEY.includes("your-service-role-key");

// Server-only client that bypasses RLS. Used exclusively for writing orders
// after Stripe confirms payment. Never import this into client code.
export function createAdminClient() {
  if (!isAdminConfigured) return null;
  return createSupabaseClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
