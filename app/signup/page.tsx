"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [sentEmail, setSentEmail] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase) {
      toast.error("Auth isn't configured yet — add your Supabase keys.");
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    // If email confirmation is disabled, a session is returned immediately.
    if (data.session) {
      toast.success("Account created!");
      router.push("/account");
      router.refresh();
    } else {
      setSentEmail(true);
    }
  }

  if (sentEmail) {
    return (
      <div className="container-x flex justify-center py-20">
        <div className="w-full max-w-md text-center">
          <h1 className="font-serif text-3xl font-bold">Check your inbox</h1>
          <p className="mt-3 text-ink/60">
            We sent a confirmation link to{" "}
            <span className="font-medium text-ink">{email}</span>. Click it to
            activate your account, then sign in.
          </p>
          <Link href="/login" className="mt-6 inline-block btn-primary">
            Go to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-x flex justify-center py-20">
      <div className="w-full max-w-md">
        <h1 className="font-serif text-4xl font-bold">Create account</h1>
        <p className="mt-2 text-ink/60">Join Atelier in seconds.</p>

        {!supabase && (
          <p className="mt-6 rounded-xl bg-sand p-4 text-sm text-ink/70">
            Authentication isn&apos;t connected yet. Add your Supabase keys to
            <code className="mx-1 rounded bg-ink/10 px-1">.env.local</code>
            to enable sign up.
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Full name</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-xl border border-ink/20 bg-cream px-4 py-3 outline-none focus:border-ink"
              placeholder="Jane Doe"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-ink/20 bg-cream px-4 py-3 outline-none focus:border-ink"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-ink/20 bg-cream px-4 py-3 outline-none focus:border-ink"
              placeholder="At least 6 characters"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-ink/60">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-accent hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
