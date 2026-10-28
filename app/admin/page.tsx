import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const supabase = await createClient();

  let productCount = 0;
  let orderCount = 0;
  let revenue = 0;

  if (supabase) {
    const { count: pc } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true });
    productCount = pc ?? 0;

    const { data: orders, count: oc } = await supabase
      .from("orders")
      .select("amount_total", { count: "exact" });
    orderCount = oc ?? 0;
    revenue = (orders ?? []).reduce(
      (sum, o) => sum + Number(o.amount_total ?? 0),
      0
    );
  }

  const stats = [
    { label: "Products", value: String(productCount), href: "/admin/products" },
    { label: "Orders", value: String(orderCount), href: "/admin/orders" },
    { label: "Revenue", value: formatPrice(revenue), href: "/admin/orders" },
  ];

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold">Dashboard</h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="rounded-2xl bg-sand p-6 transition-colors hover:bg-sand/70"
          >
            <p className="text-sm text-ink/50">{s.label}</p>
            <p className="mt-2 text-3xl font-bold">{s.value}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 flex gap-4">
        <Link href="/admin/products/new" className="btn-primary">
          Add product
        </Link>
        <Link href="/admin/products" className="btn-outline">
          Manage products
        </Link>
      </div>
    </div>
  );
}
