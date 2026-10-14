// src/app/admin/page.js
import { getDishes } from "@/lib/dishes";
import { listAllOrders } from "@/lib/orders";
import { etb } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [dishes, orders] = await Promise.all([getDishes(), listAllOrders()]);

  const revenue = orders.reduce((s, o) => s + (o.total ?? 0), 0);
  const avg = orders.length ? Math.round(revenue / orders.length) : 0;

  // Top selling dishes (by order count)
  const counts = new Map();
  for (const o of orders) {
    for (const i of o.items ?? []) {
      const key = i.id || i.name;
      counts.set(key, (counts.get(key) ?? 0) + i.quantity);
    }
  }
  const topDishes = Array.from(counts, ([id, count]) => {
    const dish = dishes.find((d) => d.id === id);
    return { name: dish?.name ?? id, count };
  })
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Order status breakdown
  const statuses = ["delivering", "pending", "preparing", "delivered"];
  const statusCounts = statuses.map((s) => ({
    status: s,
    label: s.charAt(0).toUpperCase() + s.slice(1),
    count: orders.filter((o) => o.status === s).length,
  }));

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-stone-900">Admin Dashboard</h1>
        <p className="text-sm text-stone-500">
          Welcome back. Here&apos;s what&apos;s happening today.
        </p>
      </header>

      {/* KPI row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Kpi label="Total Revenue" value={etb(revenue)} accent />
        <Kpi label="Orders" value={String(orders.length)} />
        <Kpi label="Avg Order Value" value={etb(avg)} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard
          title="🔥 Top Selling Dishes"
          data={topDishes.map((d) => ({ label: d.name, value: d.count }))}
          colors={["#1E3A8A", "#D97706", "#10B981", "#8B5CF6", "#EF4444"]}
        />
        <ChartCard
          title="📊 Order Status"
          data={statusCounts.map((s) => ({ label: s.label, value: s.count }))}
          colors={["#8B5CF6", "#D97706", "#3B82F6", "#10B981"]}
        />
      </div>
    </div>
  );
}

function Kpi({ label, value, accent = false }) {
  return (
    <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
      <p className="text-sm text-stone-500">{label}</p>
      <p className={`mt-2 text-3xl font-bold ${accent ? "text-[#A0522D]" : "text-stone-900"}`}>
        {value}
      </p>
    </div>
  );
}

function ChartCard({ title, data, colors }) {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
      <h2 className="mb-6 font-semibold text-stone-900">{title}</h2>
      {data.length === 0 ? (
        <p className="py-10 text-center text-sm text-stone-400">No data yet</p>
      ) : (
        <div className="flex h-56 items-end gap-4">
          {data.map((d, i) => (
            <div key={d.label} className="flex flex-1 flex-col items-center">
              <span className="mb-2 text-xs font-medium text-stone-700">{d.value}</span>
              <div
                className="w-full rounded-t-md transition-all"
                style={{
                  height: `${(d.value / max) * 180}px`,
                  minHeight: "4px",
                  background: colors[i % colors.length],
                }}
              />
              <span className="mt-3 line-clamp-2 text-center text-xs text-stone-500">
                {d.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}