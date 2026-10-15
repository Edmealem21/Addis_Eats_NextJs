// src/app/menu/DishList.js
import DishCard from "@/components/DishCard";

export default function DishList({ dishes }) {
  if (!dishes || dishes.length === 0) {
    return <p className="text-stone-500">No dishes match.</p>;
  }

  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {dishes.map((dish, index) => (
        <DishCard key={dish.id} dish={dish} priority={index === 0} />
      ))}
    </ul>
  );
}