import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Handles the link Supabase emails after sign up: exchanges the code in the URL
// for a real session, then sends the user to a safe same-origin destination.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const requestedNext = searchParams.get("next") ?? "/account";

  // Do not let an untrusted "next" query parameter redirect users off-site.
  let destination = new URL("/account", origin);
  try {
    const candidate = new URL(requestedNext, origin);
    if (candidate.origin === origin) destination = candidate;
  } catch {
    // Keep the safe /account fallback for malformed redirect values.
  }

  if (code) {
    const supabase = await createClient();
    if (supabase) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        return NextResponse.redirect(destination);
      }
    }
  }

  return NextResponse.redirect(new URL("/login", origin));
}
