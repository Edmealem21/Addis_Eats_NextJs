// src/app/menu/[id]/page.js
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { dishes, getDish } from "@/lib/dishes";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import AddToCartButton from "@/components/AddToCartButton";

export function generateStaticParams() {
  return dishes.map((d) => ({ id: d.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const dish = await getDish(id);

  if (!dish) {
    return {
      title: "Dish not found",
      description: "That dish is not on the menu.",
    };
  }

  const url = `${SITE_URL}/menu/${dish.id}`;
  const description = `${dish.name} — ${dish.description} ${dish.price} ETB at Addis Eats.`;

  return {
    title: dish.name,
    description,
    alternates: { canonical: `/menu/${dish.id}` },
    openGraph: {
      type: "website",
      title: `${dish.name} — ${SITE_NAME}`,
      description,
      url,
    },
    twitter: {
      card: "summary_large_image",
      title: `${dish.name} — ${SITE_NAME}`,
      description,
    },
  };
}

export default async function DishPage({ params }) {
  const { id } = await params;
  const dish = await getDish(id);
  if (!dish) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MenuItem",
    name: dish.name,
    description: dish.description,
    url: `${SITE_URL}/menu/${dish.id}`,
    image: `${SITE_URL}${dish.image}`,
    category: dish.category,
    offers: {
      "@type": "Offer",
      price: dish.price,
      priceCurrency: "ETB",
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}/menu/${dish.id}`,
    },
  };

  return (
    <article className="mx-auto max-w-2xl space-y-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero image — smaller, centered */}
      <div className="relative mx-auto aspect-[16/9] max-w-md overflow-hidden rounded-lg bg-stone-100">
        <Image
          src={dish.image}
          alt={`${dish.name} served with injera`}
          fill
          sizes="(max-width: 768px) 100vw, 448px"
          className="object-cover"
          quality={75}
          priority
        />
      </div>

      {/* Header — centered text */}
      <header className="space-y-1 text-center">
        <p className="text-xs uppercase tracking-wide text-stone-500">{dish.category}</p>
        <h1 className="text-3xl font-bold">{dish.name}</h1>
        <p className="text-xl font-medium text-amber-700">{dish.price} ETB</p>
      </header>

      {/* Description — centered text */}
      <p className="text-center text-stone-700">{dish.description}</p>

      {/* Buttons — centered row */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        <AddToCartButton dish={dish} />
        <Link href="/menu" className="text-amber-700 underline focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2">
          ← Back to menu
        </Link>
      </div>
    </article>
  );
}