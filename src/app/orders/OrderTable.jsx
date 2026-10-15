// src/app/orders/OrderTable.jsx
import Link from "next/link";

const SORTABLE = ["id", "name", "neighbourhood", "total", "status", "createdAt"];

export default function OrderTable({
  orders,
  sort,
  dir,
  page,
  totalPages,
}) {
  if (!orders || orders.length === 0) {
    return (
      <div className="rounded-lg border border-dashed bg-stone-50 p-8 text-center">
        <p className="text-stone-600">No orders match.</p>
        <p className="mt-1 text-sm text-stone-500">
          Place an order from the menu to see it here.
        </p>
      </div>
    );
  }

return (
  <div className="space-y-4">
    <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
      <table className="w-full text-left text-sm">
          <caption className="sr-only">
            All orders, sorted by {sort} {dir === "asc" ? "ascending" : "descending"}
          </caption>

          <thead className="bg-white ">
            <tr>
              <Th field="id" sort={sort} dir={dir}>Order</Th>
              <Th field="name" sort={sort} dir={dir}>Customer</Th>
              <Th field="neighbourhood" sort={sort} dir={dir}>Neighbourhood</Th>
              <Th field="total" sort={sort} dir={dir} align="right">Total (ETB)</Th>
              <Th field="status" sort={sort} dir={dir}>Status</Th>
              <Th field="createdAt" sort={sort} dir={dir}>Date</Th>
            </tr>
          </thead>

          <tbody>
            {orders.map((o) => (
              <tr
                key={o.id}
                className="border-t border-stone-200/70 transition hover:bg-white/70"
              >
                <td className="px-4 py-3 font-mono text-xs">
                  <Link href={`/track/${o.id}`} className="hover:text-amber-700">
                    {o.id}
                  </Link>
                </td>
                <td className="px-4 py-3">{o.name}</td>
                <td className="px-4 py-3">{o.neighbourhood ?? "—"}</td>
                <td className="px-4 py-3 text-right tabular-nums">
                  {o.total.toLocaleString("en-US")}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={o.status} />
                </td>
                <td className="px-4 py-3 text-stone-500">
                  {o.createdAt.slice(0, 10)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pager page={page} totalPages={totalPages} sort={sort} dir={dir} />
    </div>
  );
}

function Th({ field, sort, dir, align = "left", children }) {
  const isActive = sort === field;
  const nextDir = isActive && dir === "asc" ? "desc" : "asc";
  const ariaSort = isActive ? (dir === "asc" ? "ascending" : "descending") : "none";
  const className =
    "px-4 py-3 font-medium text-stone-700 " +
    (align === "right" ? "text-right" : "");
  return (
    <th scope="col" aria-sort={ariaSort} className={className}>
      <Link
        href={`/orders?sort=${field}&dir=${nextDir}`}
        className="inline-flex items-center gap-1 hover:text-amber-700"
      >
        {children}
        {isActive && <span aria-hidden>{dir === "asc" ? "▲" : "▼"}</span>}
      </Link>
    </th>
  );
}

function StatusBadge({ status }) {
  const map = {
    pending: "bg-amber-100 text-amber-800",
    preparing: "bg-blue-100 text-blue-800",
    out_for_delivery: "bg-violet-100 text-violet-800",
    delivered: "bg-green-100 text-green-800",
  };
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${map[status] ?? "bg-stone-100 text-stone-700"}`}>
      {status}
    </span>
  );
}

function Pager({ page, totalPages, sort, dir }) {
  if (totalPages <= 1) return null;
  const prevDisabled = page <= 1;
  const nextDisabled = page >= totalPages;

  function href(p) {
    return `/orders?sort=${sort}&dir=${dir}&page=${p}`;
  }

  return (
    <nav className="flex items-center justify-between text-sm">
      {prevDisabled ? (
        <span className="rounded border px-3 py-1 text-stone-400">← Prev</span>
      ) : (
        <Link href={href(page - 1)} className="rounded border px-3 py-1 hover:bg-stone-50">
          ← Prev
        </Link>
      )}

      <span className="text-stone-600">
        Page {page} of {totalPages}
      </span>

      {nextDisabled ? (
        <span className="rounded border px-3 py-1 text-stone-400">Next →</span>
      ) : (
        <Link href={href(page + 1)} className="rounded border px-3 py-1 hover:bg-stone-50">
          Next →
        </Link>
      )}
    </nav>
  );
}