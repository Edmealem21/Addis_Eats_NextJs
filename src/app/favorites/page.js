// src/app/favorites/page.js
import { getActiveDishes } from "@/lib/dishes";
import FavoritesList from "./FavoritesList";

export const metadata = {
  title: "Favorites",
  robots: { index: false, follow: true },
};

export default async function FavoritesPage() {
  const allDishes = await getActiveDishes();

  return (
    <section className="space-y-6">
      <header className="space-y-2 text-center">
        <h1 className="text-3xl font-bold text-stone-900">Your Favorites</h1>
        <p className="text-sm text-stone-500">
          Dishes you&apos;ve saved. Click the heart on any dish to add or remove it.
        </p>
      </header>

      <FavoritesList dishes={allDishes} />
    </section>
  );
}