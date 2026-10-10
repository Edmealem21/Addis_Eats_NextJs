// src/app/menu/layout.js
import Link from "next/link";

const CATEGORIES = [
  { slug: "mains", label: "Mains" },
  { slug: "veg", label: "Vegetarian" },
  { slug: "drinks", label: "Drinks" },
];

export default function MenuLayout({ children }) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-[200px_1fr]">
      <aside className="h-fit rounded-lg border bg-white p-4">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-stone-500">
          Categories
        </h2>
        <ul className="space-y-2">
          {CATEGORIES.map((c) => (
            <li key={c.slug}>
              <Link href={`/menu?category=${c.slug}`}
                className="block rounded px-2 py-1 text-sm hover:bg-amber-50 hover:text-amber-700">
                {c.label}
              </Link>
            </li>
          ))}
        </ul>
      </aside>

      <div>{children}</div>
    </div>
  );
}