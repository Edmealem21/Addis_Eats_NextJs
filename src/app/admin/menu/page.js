// src/app/admin/menu/page.js
import { getDishes } from "@/lib/dishes";
import DishManager from "./DishManager";

export const dynamic = "force-dynamic";

export default async function AdminMenuPage() {
  const dishes = await getDishes();
  return <DishManager dishes={dishes} />;
}