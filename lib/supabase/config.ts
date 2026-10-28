// Central place to read Supabase env vars and decide whether Supabase is
// actually configured. Until the user pastes real keys into .env.local the
// whole app gracefully falls back to the static demo catalog.

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const isSupabaseConfigured =
  SUPABASE_URL.startsWith("http") &&
  SUPABASE_ANON_KEY.length > 20 &&
  !SUPABASE_URL.includes("your-project-url");
