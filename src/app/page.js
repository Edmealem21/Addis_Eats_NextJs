// src/app/page.js
import Link from "next/link";
import Image from "next/image";
import { dishes } from "@/lib/dishes";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata = {
  title: "Home",
  description:
    "Order authentic Ethiopian food online — injera, doro wat, kitfo, shiro and more, delivered hot from Bole to your door in 30–45 minutes.",
  alternates: { canonical: "/" },
  openGraph: {
    title: `${SITE_NAME} — Authentic Ethiopian Food, Delivered`,
    description: "Order authentic Ethiopian food online.",
    url: SITE_URL,
  },
};

export default function HomePage() {
  const special = dishes[0];

  return (
    <div className="space-y-12">
<section className="relative overflow-hidden rounded-2xl text-white">
  {/* Background image */}
  <Image
    src="/dishes/kitfo.jpg"
    alt=""
    fill
    sizes="100vw"
    priority
    className="object-cover"
    aria-hidden="true"
  />

  {/* Dark gradient overlay — keeps the text readable */}
  <div
    aria-hidden="true"
    className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/30"
  />

  {/* Content */}
  <div className="relative grid gap-6 p-6 sm:p-8 md:grid-cols-2 md:items-center md:p-12">
    <div className="space-y-4">
      <h1 className="text-3xl font-bold leading-tight sm:text-4xl">
        Authentic Ethiopian food, delivered hot.
      </h1>
      <p className="max-w-md text-sm text-white/90 sm:text-base">
        Injera, tibs, shiro and more — sent to your door.
      </p>
      <div className="flex flex-wrap gap-3">
        <Link
          href="/menu"
          className="inline-block min-h-[44px] rounded-lg bg-white px-5 py-3 text-sm font-medium text-amber-700 shadow hover:bg-amber-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/40"
        >
          Order now
        </Link>
        <Link
          href="/menu?category=veg"
          className="inline-block min-h-[44px] rounded-lg border border-white/60 px-5 py-3 text-sm font-medium text-white hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/40"
        >
          Vegetarian
        </Link>
      </div>
    </div>

    {/* Right side is now empty on desktop — the image is the background */}
    {/* Remove the old image column entirely */}
  </div>
</section>

      <section className="space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold">Today&apos;s special</h2>
            <p className="text-sm text-stone-600">Handpicked by our chef</p>
          </div>
          <Link href="/menu" className="text-sm text-amber-700 hover:underline">
            See full menu →
          </Link>
        </div>

        <Link href={`/menu/${special.id}`} className="group block max-w-xs overflow-hidden rounded-xl border bg-white transition hover:shadow-lg">
          <div className="relative aspect-[4/3] w-full bg-stone-100">
            <Image
              src={special.image}
              alt={`${special.name} — ${special.category}`}
              fill
              sizes="320px"
              className="object-cover transition duration-300 group-hover:scale-105"
            />
          </div>
          <div className="p-4">
            <p className="font-semibold">{special.name}</p>
            <p className="text-sm text-stone-500">{special.price} ETB</p>
          </div>
        </Link>
      </section>
    </div>
  );
}