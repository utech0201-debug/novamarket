import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/products";
import SignOutButton from "./SignOutButton";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const supabase = createClient();

  if (!supabase) {
    return (
      <div className="container-x py-20 text-center">
        <h1 className="font-serif text-3xl font-bold">Accounts coming soon</h1>
        <p className="mx-auto mt-3 max-w-md text-ink/60">
          User accounts aren&apos;t connected yet. Once Supabase keys are added,
          sign up and sign in will work here.
        </p>
        <Link href="/products" className="mt-6 inline-block btn-primary">
          Browse products
        </Link>
      </div>
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, is_admin, created_at")
    .eq("id", user.id)
    .maybeSingle();

  const { data: orders } = await supabase
    .from("orders")
    .select("id, amount_total, status, items, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const memberSince = new Date(
    profile?.created_at ?? user.created_at
  ).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="container-x py-12">
      <h1 className="font-serif text-4xl font-bold">My Account</h1>

      <div className="mt-8 max-w-lg rounded-2xl bg-sand p-8">
        <dl className="space-y-4">
          <div>
            <dt className="text-sm text-ink/50">Name</dt>
            <dd className="text-lg font-medium">
              {profile?.full_name || "—"}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-ink/50">Email</dt>
            <dd className="text-lg font-medium">{user.email}</dd>
          </div>
          <div>
            <dt className="text-sm text-ink/50">Member since</dt>
            <dd className="text-lg font-medium">{memberSince}</dd>
          </div>
        </dl>

        <div className="mt-8 flex items-center gap-4">
          <SignOutButton />
          {profile?.is_admin && (
            <Link href="/admin" className="btn-primary">
              Admin panel
            </Link>
          )}
        </div>
      </div>

      <section className="mt-12">
        <h2 className="font-serif text-2xl font-bold">My Orders</h2>
        {!orders || orders.length === 0 ? (
          <p className="mt-4 text-ink/60">
            You haven&apos;t placed any orders yet.{" "}
            <Link href="/products" className="text-accent hover:underline">
              Start shopping
            </Link>
            .
          </p>
        ) : (
          <div className="mt-6 divide-y divide-ink/10">
            {orders.map((o) => {
              const items = (o.items ?? []) as {
                name?: string;
                quantity?: number;
              }[];
              return (
                <div
                  key={o.id}
                  className="flex flex-wrap items-center justify-between gap-2 py-4"
                >
                  <div>
                    <p className="font-medium">
                      {new Date(o.created_at).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                    <p className="text-sm text-ink/60">
                      {items
                        .map((i) => `${i.name} ×${i.quantity}`)
                        .join(", ") || "—"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      {formatPrice(Number(o.amount_total))}
                    </p>
                    <p className="text-xs uppercase tracking-wide text-ink/50">
                      {o.status}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
