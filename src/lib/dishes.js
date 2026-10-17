// src/lib/dishes.js
import { kv } from "@vercel/kv";

const DEFAULTS = [
  { id: "doro-wat", name: "Doro Wat", category: "Ethiopian", price: 520, rating: 4.9,
    description: "Slow-simmered chicken in berbere and niter kibbeh, served with injera.",
    image: "/dishes/doro-wat.jpg", featured: true, active: true },
  { id: "kitfo", name: "Kitfo Special", category: "Ethiopian", price: 550, rating: 4.9,
    description: "Minced beef tossed in mitmita and niter kibbeh, warmed or raw.",
    image: "/dishes/kitfo.jpg", featured: true, active: false },
  { id: "shiro", name: "Shekla Tibs", category: "Ethiopian", price: 480, rating: 4.8,
    description: "Sizzling beef tibs served on a hot clay dish.",
    image: "/dishes/tibs.jpg", featured: true, active: true },
  { id: "tibs", name: "Beyaynetu (Fasting Platter)", category: "Ethiopian", price: 340, rating: 4.9,
    description: "A combination platter of vegetarian stews on injera.",
    image: "/dishes/beyaynet.jpg", featured: true, active: true },
  { id: "misir-wot", name: "Misir Wot", category: "Ethiopian", price: 320, rating: 4.6,
    description: "Red lentil stew simmered in berbere and onions.",
    image: "/dishes/misir-wat.jpg", featured: false, active: true },
  { id: "gomen", name: "Gomen", category: "Ethiopian", price: 300, rating: 4.5,
    description: "Collard greens cooked with garlic, ginger, and spices.",
    image: "/dishes/gomen.jpg", featured: false, active: true },
  { id: "firfir", name: "Firfir", category: "Ethiopian", price: 290, rating: 4.4,
    description: "Shredded injera tossed in spicy berbere sauce.",
    image: "/dishes/firfir.jpg", featured: false, active: true },
  { id: "burger", name: "Addis Tower Burger", category: "Burgers", price: 380, rating: 4.7,
    description: "Double beef patty, cheese, and our signature special sauce.",
    image: "/dishes/burger.jpg", featured: true, active: true },
  { id: "classic-burger", name: "Classic Beef Burger", category: "Burgers", price: 320, rating: 4.5,
    description: "Juicy beef patty, lettuce, tomato, and pickles on a soft bun.",
    image: "/dishes/classic-burger.jpg", featured: false, active: true },
  { id: "chicken-burger", name: "Crispy Chicken Burger", category: "Burgers", price: 350, rating: 4.6,
    description: "Breaded chicken fillet, coleslaw, and garlic aioli.",
    image: "/dishes/chicken-burger.jpg", featured: false, active: true },
  { id: "coffee", name: "Traditional Jebena Coffee", category: "Drinks", price: 80, rating: 5.0,
    description: "Buna brewed in a clay jebena, served in small cups.",
    image: "/dishes/coffee.jpg", featured: true, active: true },
  { id: "macchiato", name: "Ethiopian Macchiato", category: "Drinks", price: 90, rating: 4.8,
    description: "Rich espresso with a touch of steamed milk — a local favorite.",
    image: "/dishes/macchiato.jpg", featured: false, active: true },
  { id: "spris", name: "Fresh Spris Juice", category: "Drinks", price: 150, rating: 4.7,
    description: "Layered avocado and mango juice, blended fresh to order.",
    image: "/dishes/juice.jpg", featured: false, active: true },
];

// Helper to read dishes from KV, seeding with DEFAULTS if empty
async function readDishes() {
  let list = await kv.get("dishes:all");
  if (!list) {
    await kv.set("dishes:all", DEFAULTS);
    list = DEFAULTS;
  }
  return list;
}

export async function getDishes() {
  return await readDishes();
}

export async function getActiveDishes() {
  const list = await readDishes();
  return list.filter((d) => d.active !== false);
}

export async function getDish(id) {
  const list = await readDishes();
  return list.find((d) => d.id === id) ?? null;
}

export async function createDish(dish) {
  const list = await readDishes();
  if (list.some((d) => d.id === dish.id)) {
    throw new Error(`A dish with id "${dish.id}" already exists.`);
  }
  list.push(dish);
  await kv.set("dishes:all", list);
  return dish;
}

export async function updateDish(id, patch) {
  const list = await readDishes();
  const idx = list.findIndex((d) => d.id === id);
  if (idx === -1) throw new Error(`Dish "${id}" not found.`);
  list[idx] = { ...list[idx], ...patch, id };
  await kv.set("dishes:all", list);
  return list[idx];
}

export async function deleteDish(id) {
  const list = await readDishes();
  const next = list.filter((d) => d.id !== id);
  if (next.length === list.length) return false;
  await kv.set("dishes:all", next);
  return true;
}

export async function toggleDishActive(id) {
  const list = await readDishes();
  const idx = list.findIndex((d) => d.id === id);
  if (idx === -1) return null;
  list[idx].active = !list[idx].active;
  await kv.set("dishes:all", list);
  return list[idx];
}

export async function resetDishes() {
  await kv.set("dishes:all", DEFAULTS);
  return DEFAULTS;
}

export const dishes = DEFAULTS; // Backwards compat fallback