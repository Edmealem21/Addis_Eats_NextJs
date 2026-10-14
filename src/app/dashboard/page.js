// src/app/dashboard/page.js
import Link from "next/link";
import { seedOrders } from "@/lib/seed";
import {
  listAllOrders,
  revenueBy,
  countBy,
  sumTotals,
} from "@/lib/orders";
import RevenueChart from "./RevenueChart";
import OrdersLineChart from "./OrdersLineChart";
import ChartDataTable from "./ChartDataTable";

export const metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

// Format a date as YYYY-MM-DD in UTC — stable across server and client.
function ymd(date) {
  return date.toISOString().slice(0, 10);
}

export default async function DashboardPage() {
  seedOrders();
  const orders = listAllOrders();

  // ── Revenue by neighbourhood ────────────────────────────────
  const revenueRows = revenueBy((o) => o.neighbourhood ?? "Unknown")
    .sort((a, b) => b.value - a.value)
    .map((r) => ({ neighbourhood: r.key, revenue: r.value }));

  // ── Orders per day (last 14 days) ───────────────────────────
  const days = 14;
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const dailyCounts = new Map();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setUTCDate(d.getUTCDate() - i);
    dailyCounts.set(ymd(d), 0);
  }
  for (const o of orders) {
    const day = o.createdAt.slice(0, 10);
    if (dailyCounts.has(day)) {
      dailyCounts.set(day, dailyCounts.get(day) + 1);
    }
  }
  const dailyRows = Array.from(dailyCounts, ([date, count]) => ({ date, count }));

  // ── KPIs ────────────────────────────────────────────────────
  const totalRevenue = sumTotals();
  const totalOrders = orders.length;
  const avgOrder = totalOrders ? Math.round(totalRevenue / totalOrders) : 0;

  return (
    <section className="space-y-10">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-wide text-stone-500">Staff</p>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-stone-600">
          Revenue and order trends across Addis Ababa.
        </p>
      </header>

      {/* KPI cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Kpi label="Total revenue" value={`${totalRevenue.toLocaleString("en-US")} ETB`} />
        <Kpi label="Orders" value={totalOrders.toString()} />
        <Kpi label="Avg order" value={`${avgOrder.toLocaleString("en-US")} ETB`} />
      </div>

      {/* Revenue by neighbourhood */}
      <section className="space-y-4">
        <header className="space-y-1">
          <h2 className="text-xl font-semibold">Revenue by neighbourhood</h2>
          <p className="text-sm text-stone-500">
            Total revenue in ETB, all time
          </p>
        </header>

        <RevenueChart data={revenueRows} />

        <ChartDataTable
          caption="Revenue by neighbourhood in ETB"
          columns={["Neighbourhood", "Revenue (ETB)"]}
          rows={revenueRows.map((r) => [r.neighbourhood, r.revenue.toLocaleString("en-US")])}
        />
      </section>

      {/* Orders per day */}
      <section className="space-y-4">
        <header className="space-y-1">
          <h2 className="text-xl font-semibold">Orders per day</h2>
          <p className="text-sm text-stone-500">
            Last {days} days · unit: orders
          </p>
        </header>

        <OrdersLineChart data={dailyRows} />

        <ChartDataTable
          caption={`Orders per day for the last ${days} days`}
          columns={["Date", "Orders"]}
          rows={dailyRows.map((r) => [r.date, r.count.toString()])}
        />
      </section>

      <div>
        <Link href="/orders" className="text-amber-700 underline">
          View order table →
        </Link>
      </div>
    </section>
  );
}

function Kpi({ label, value }) {
  return (
    <div className="rounded-lg border bg-white p-5">
      <p className="text-xs uppercase tracking-wide text-stone-500">{label}</p>
      <p className="mt-2 text-2xl font-bold">{value}</p>
    </div>
  );
}