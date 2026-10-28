import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/products";

export const dynamic = "force-dynamic";

type OrderItem = { name?: string; quantity?: number; amount_total?: number };
type Order = {
  id: string;
  email: string | null;
  amount_total: number;
  status: string;
  items: OrderItem[];
  created_at: string;
};

export default async function AdminOrdersPage() {
  const supabase = createClient();
  let orders: Order[] = [];

  if (supabase) {
    const { data } = await supabase
      .from("orders")
      .select("id, email, amount_total, status, items, created_at")
      .order("created_at", { ascending: false });
    orders = (data as Order[]) ?? [];
  }

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold">Orders</h1>

      {orders.length === 0 ? (
        <p className="mt-8 text-ink/50">
          No orders yet. Completed test checkouts will appear here.
        </p>
      ) : (
        <div className="mt-8 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink/10 text-left text-ink/50">
                <th className="py-3 pr-4 font-medium">Date</th>
                <th className="py-3 pr-4 font-medium">Customer</th>
                <th className="py-3 pr-4 font-medium">Items</th>
                <th className="py-3 pr-4 font-medium">Total</th>
                <th className="py-3 pr-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-ink/5 align-top">
                  <td className="py-3 pr-4 whitespace-nowrap text-ink/70">
                    {new Date(o.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td className="py-3 pr-4">{o.email ?? "—"}</td>
                  <td className="py-3 pr-4 text-ink/70">
                    {(o.items ?? [])
                      .map((i) => `${i.name} ×${i.quantity}`)
                      .join(", ") || "—"}
                  </td>
                  <td className="py-3 pr-4 font-medium">
                    {formatPrice(Number(o.amount_total))}
                  </td>
                  <td className="py-3 pr-4">
                    <span className="rounded-full bg-accent/10 px-2 py-1 text-xs font-medium text-accent-dark">
                      {o.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
