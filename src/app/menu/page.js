// src/app/menu/page.js
import MenuBrowser from "./MenuBrowser";
import { getActiveDishes } from "@/lib/dishes";
import { SITE_URL } from "@/lib/site";

const PAGE_SIZE = 8;

export const metadata = {
  title: "Menu",
  description:
    "Browse the full Addis Eats menu — mains, vegetarian dishes, and drinks. Search, filter, and order in minutes.",
  alternates: { canonical: "/menu" },
  openGraph: {
    title: "Menu — Addis Eats",
    description: "Browse the full Addis Eats menu.",
    url: `${SITE_URL}/menu`,
  },
};

export default async function MenuPage({ searchParams }) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp?.page ?? 1));

  const all = await getActiveDishes();
  const total = all.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const dishes = all.slice(start, start + PAGE_SIZE);

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Menu",
    url: `${SITE_URL}/menu`,
    description: "The full Addis Eats menu — mains, vegetarian dishes, and drinks.",
    hasPart: dishes.map((d) => ({
      "@type": "MenuItem",
      name: d.name,
      url: `${SITE_URL}/menu/${d.id}`,
    })),
  };

  return (
    <section className="space-y-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />

      <header className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Menu</h1>
        {/* <p className="text-stone-600">Search, filter, and page through.</p> */}
      </header>

      <MenuBrowser
        fallbackData={{ dishes, total, page: safePage, pageSize: PAGE_SIZE, totalPages }}
        page={safePage}
      />
    </section>
  );
}