import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  if (!supabase) redirect("/account");

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile?.is_admin) redirect("/account");

  return (
    <div className="container-x py-10">
      <div className="flex flex-wrap items-center gap-6 border-b border-ink/10 pb-4">
        <span className="font-serif text-2xl font-bold">Admin</span>
        <nav className="flex gap-5 text-sm">
          <Link href="/admin" className="hover:text-accent">
            Dashboard
          </Link>
          <Link href="/admin/products" className="hover:text-accent">
            Products
          </Link>
          <Link href="/admin/orders" className="hover:text-accent">
            Orders
          </Link>
          <Link href="/" className="text-ink/50 hover:text-accent">
            View store →
          </Link>
        </nav>
      </div>
      <div className="pt-8">{children}</div>
    </div>
  );
}
