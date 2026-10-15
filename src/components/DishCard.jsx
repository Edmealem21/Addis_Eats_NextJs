// src/components/DishCard.jsx
import Link from "next/link";
import Image from "next/image";
import AddToCartIconButton from "@/components/AddToCartIconButton";
import FavoriteButton from "@/components/FavoriteButton";

export default function DishCard({ dish, priority = false }) {
  return (
    <li className="group/card relative overflow-hidden rounded-lg bg-white shadow-sm transition hover:shadow-md">
      {/* Favorite heart — top-right corner over the image */}
      <div className="absolute right-2 top-2 z-10">
        <FavoriteButton dishId={dish.id} dishName={dish.name} />
      </div>

      {/* Whole-image + text block is one link to the detail page */}
      <Link
        href={`/menu/${dish.id}`}
        data-dish-card
        className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 rounded-lg"
      >
        <div className="relative aspect-[4/3] w-full bg-stone-100">
            <Image
              src={dish.image}
              alt={`${dish.name} — ${dish.category}`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              priority={priority}
              className="object-cover transition duration-300 group-hover/card:scale-105"
            />
        </div>

        <div className="space-y-1 p-3 pb-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-stone-900">{dish.name}</h3>
            <span className="shrink-0 font-medium text-amber-700">
              {dish.price} ETB
            </span>
          </div>
          <p className="text-xs uppercase tracking-wide text-stone-500">
            {dish.category}
          </p>
          <p className="line-clamp-2 text-sm text-stone-600">
            {dish.description}
          </p>
        </div>
      </Link>

      {/* Action row — outside the Link so the buttons are clickable */}
        <div className="flex items-center gap-2 px-3 pb-3">
          <AddToCartIconButton dish={dish} />
          <Link
            href={`/menu/${dish.id}`}
            className="inline-flex min-h-[36px] flex-1 items-center justify-center rounded-lg border border-stone-300 px-3 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
          >
            View details →
          </Link>
        </div>
    </li>
  );
}