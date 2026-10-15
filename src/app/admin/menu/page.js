// src/app/admin/menu/page.js
import { getDishes } from "@/lib/dishes";
import DishManager from "./DishManager";

export const metadata = {
  title: "Admin · Dishes",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

// NOTE: this page deliberately uses `getDishes()` — not `getActiveDishes()`.
// Staff must see disabled dishes so they can toggle them back on.
// Every customer-facing page (`/menu`, `/favorites`, `/api/dishes`) uses
// `getActiveDishes()` instead.
export default async function AdminMenuPage() {
  const dishes = await getDishes();
  return <DishManager dishes={dishes} />;
}