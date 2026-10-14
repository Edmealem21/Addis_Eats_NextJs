// src/app/orders/page.js
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { listOrdersForUser } from "@/lib/orders";
import OrderTable from "./OrderTable";
import ExportButton from "@/components/ExportButton";

export const metadata = {
  title: "My Orders",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const PAGE_SIZE = 10;
const SORTABLE = ["id", "name", "neighbourhood", "total", "status", "createdAt"];

export default async function OrdersPage({ searchParams }) {
  const session = await getSession();
  if (!session) redirect("/signin?next=/orders");

  const sp = await searchParams;
  const sort = SORTABLE.includes(sp?.sort) ? sp.sort : "createdAt";
  const dir = sp?.dir === "asc" ? "asc" : "desc";
  const page = Math.max(1, Number(sp?.page ?? 1));

  const all = await listOrdersForUser(session.userId);

  const sorted = [...all].sort((a, b) => {
    const av = a[sort];
    const bv = b[sort];
    if (av == null && bv == null) return 0;
    if (av == null) return 1;
    if (bv == null) return -1;
    if (typeof av === "number" && typeof bv === "number") {
      return dir === "asc" ? av - bv : bv - av;
    }
    const cmp = String(av).localeCompare(String(bv));
    return dir === "asc" ? cmp : -cmp;
  });

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const rows = sorted.slice(start, start + PAGE_SIZE);

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">My Orders</h1>
          <p className="text-sm text-stone-500">
            {sorted.length} order{sorted.length === 1 ? "" : "s"}
          </p>
        </div>
        <ExportButton />
      </header>

      <OrderTable
        orders={rows}
        sort={sort}
        dir={dir}
        page={safePage}
        totalPages={totalPages}
      />

      <Link href="/menu" className="text-amber-700 underline">
        ← Back to menu
      </Link>
    </section>
  );
}