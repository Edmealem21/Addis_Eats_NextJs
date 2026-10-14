// src/app/orders/loading.js
export default function Loading() {
  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <div className="h-7 w-40 animate-pulse rounded bg-stone-200" />
        <div className="h-4 w-24 animate-pulse rounded bg-stone-200" />
      </div>

      <div className="overflow-hidden rounded-lg border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-stone-50">
            <tr>
              {["Order", "Customer", "Neighbourhood", "Total", "Status", "Date"].map((h) => (
                <th key={h} scope="col" className="px-4 py-3">
                  <div className="h-4 w-20 animate-pulse rounded bg-stone-200" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4, 5].map((i) => (
              <tr key={i} className="border-t">
                {[1, 2, 3, 4, 5, 6].map((j) => (
                  <td key={j} className="px-4 py-3">
                    <div className="h-4 w-full animate-pulse rounded bg-stone-200" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}