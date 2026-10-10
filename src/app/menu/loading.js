// src/app/menu/loading.js
export default function Loading() {
  return (
    <section className="space-y-6">
      <div className="h-9 w-32 animate-pulse rounded bg-stone-200" />
      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <li key={i} className="overflow-hidden rounded-lg border bg-white">
            <div className="aspect-[4/3] w-full animate-pulse bg-stone-200" />
            <div className="space-y-2 p-4">
              <div className="h-4 w-32 animate-pulse rounded bg-stone-200" />
              <div className="h-3 w-full animate-pulse rounded bg-stone-200" />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}