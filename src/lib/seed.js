// src/lib/seed.js
import { addOrder, newOrderId, listAllOrders } from "./orders";

const NEIGHBOURHOODS = [
  { name: "Bole", weight: 30 },
  { name: "Kirkos", weight: 20 },
  { name: "Yeka", weight: 15 },
  { name: "Arada", weight: 12 },
  { name: "Gullele", weight: 10 },
  { name: "Akaki", weight: 8 },
  { name: "Nifas Silk", weight: 5 },
];

const DISHES = [
  { name: "Doro Wat", price: 320 },
  { name: "Kitfo", price: 380 },
  { name: "Shiro", price: 180 },
  { name: "Tibs", price: 340 },
  { name: "Misir Wot", price: 200 },
  { name: "Gomen", price: 190 },
  { name: "Firfir", price: 250 },
  { name: "Beyaynetu", price: 260 },
];

const NAMES = ["Almaz", "Kebede", "Selam", "Tewodros", "Hanna", "Dawit", "Marta", "Yonas"];
const STATUSES = ["pending", "preparing", "out_for_delivery", "delivered"];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function weightedNeighbourhood() {
  const total = NEIGHBOURHOODS.reduce((sum, n) => sum + n.weight, 0);
  let r = Math.random() * total;
  for (const n of NEIGHBOURHOODS) {
    r -= n.weight;
    if (r <= 0) return n.name;
  }
  return NEIGHBOURHOODS[0].name;
}

function randomItems() {
  const count = 1 + Math.floor(Math.random() * 3);
  const items = [];
  for (let i = 0; i < count; i++) {
    const dish = pick(DISHES);
    items.push({ id: dish.name.toLowerCase().replace(/\s+/g, "-"), name: dish.name, price: dish.price, quantity: 1 + Math.floor(Math.random() * 2) });
  }
  return items;
}

// Generates ~120 demo orders spread over the last 30 days.
// Called once on module load — subsequent calls are no-ops if data exists.
export function seedOrders() {
  if (listAllOrders().length > 0) return;

  const now = Date.now();
  const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;

  for (let i = 0; i < 120; i++) {
    const items = randomItems();
    const total = items.reduce((s, it) => s + it.price * it.quantity, 0);
    const createdAt = new Date(now - Math.random() * thirtyDaysMs).toISOString();
    const daysAgo = (now - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24);

    let status;
    if (daysAgo > 3) status = "delivered";
    else if (daysAgo > 1) status = pick(["out_for_delivery", "delivered"]);
    else status = pick(STATUSES);

    addOrder({
      id: newOrderId(),
      userId: `user-${1 + Math.floor(Math.random() * 2)}`,
      name: pick(NAMES),
      email: "demo@example.com",
      phone: "0911000000",
      address: `${weightedNeighbourhood()}, Addis Ababa`,
      neighbourhood: weightedNeighbourhood(),
      notes: undefined,
      items,
      total,
      status,
      createdAt,
    });
  }
}