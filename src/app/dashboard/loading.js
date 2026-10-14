// src/app/dashboard/loading.js
export default function Loading() {
  return (
    <section className="space-y-10">
      <div className="space-y-2">
        <div className="h-3 w-16 animate-pulse rounded bg-stone-200" />
        <div className="h-8 w-48 animate-pulse rounded bg-stone-200" />
        <div className="h-4 w-72 animate-pulse rounded bg-stone-200" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-lg border bg-white p-5">
            <div className="h-3 w-24 animate-pulse rounded bg-stone-200" />
            <div className="mt-3 h-7 w-32 animate-pulse rounded bg-stone-200" />
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <div className="h-6 w-64 animate-pulse rounded bg-stone-200" />
        <div className="h-[240px] animate-pulse rounded-lg border bg-stone-100" />
      </div>

      <div className="space-y-4">
        <div className="h-6 w-48 animate-pulse rounded bg-stone-200" />
        <div className="h-[240px] animate-pulse rounded-lg border bg-stone-100" />
      </div>
    </section>
  );
}