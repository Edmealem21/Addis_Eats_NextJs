// src/lib/dishes.js
import fs from "fs";
import path from "path";

const FILE = path.join(process.cwd(), ".dishes.json");

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
    description: "Double beef patty, cheese, and special sauce.",
    image: "/dishes/tibs.jpg", featured: true, active: true },
  { id: "coffee", name: "Traditional Jebena Coffee", category: "Drinks", price: 80, rating: 5.0,
    description: "Buna brewed in a clay jebena, served in small cups.",
    image: "/dishes/shiro.jpg", featured: true, active: true },
];

function read() {
  try {
    if (!fs.existsSync(FILE)) {
      fs.writeFileSync(FILE, JSON.stringify(DEFAULTS, null, 2));
      return DEFAULTS;
    }
    return JSON.parse(fs.readFileSync(FILE, "utf8"));
  } catch {
    return DEFAULTS;
  }
}

function write(list) {
  try { fs.writeFileSync(FILE, JSON.stringify(list, null, 2)); } catch {}
}

export async function getDishes() { return read(); }
export async function getActiveDishes() { return read().filter((d) => d.active !== false); }
export async function getDish(id) { return read().find((d) => d.id === id) ?? null; }

export async function createDish(dish) {
  const list = read();
  if (list.some((d) => d.id === dish.id)) throw new Error(`A dish with id "${dish.id}" already exists.`);
  list.push(dish);
  write(list);
  return dish;
}

export async function updateDish(id, patch) {
  const list = read();
  const idx = list.findIndex((d) => d.id === id);
  if (idx === -1) throw new Error(`Dish "${id}" not found.`);
  list[idx] = { ...list[idx], ...patch, id };
  write(list);
  return list[idx];
}

export async function deleteDish(id) {
  const list = read();
  const next = list.filter((d) => d.id !== id);
  if (next.length === list.length) return false;
  write(next);
  return true;
}

export async function toggleDishActive(id) {
  const list = read();
  const idx = list.findIndex((d) => d.id === id);
  if (idx === -1) return null;
  list[idx].active = !list[idx].active;
  write(list);
  return list[idx];
}

export async function resetDishes() {
  write(DEFAULTS);
  return DEFAULTS;
}

// Backwards-compat export for pages that imported the array directly.
export const dishes = DEFAULTS;