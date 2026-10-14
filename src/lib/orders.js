// src/lib/orders.js
import fs from "fs";
import path from "path";

const FILE = path.join(process.cwd(), ".orders.json");

function read() {
  try {
    if (!fs.existsSync(FILE)) return {};
    return JSON.parse(fs.readFileSync(FILE, "utf8"));
  } catch {
    return {};
  }
}

function write(data) {
  try {
    fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
  } catch {}
}

export function addOrder(order) {
  const all = read();
  all[order.id] = order;
  write(all);
  return order;
}

export function getOrder(id) {
  return read()[id] ?? null;
}

export function deleteOrder(id) {
  const all = read();
  const existed = id in all;
  delete all[id];
  write(all);
  return existed;
}

export function newOrderId() {
  return "ord_" + Math.random().toString(36).slice(2, 10);
}

export function listOrdersForUser(userId) {
  return Object.values(read()).filter((o) => o.userId === userId);
}

export function listAllOrders() {
  return Object.values(read());
}

export function sumTotals(predicate = () => true) {
  return listAllOrders()
    .filter(predicate)
    .reduce((s, o) => s + (o.total ?? 0), 0);
}

export function revenueBy(keyFn) {
  const groups = new Map();
  for (const o of listAllOrders()) {
    const key = keyFn(o);
    groups.set(key, (groups.get(key) ?? 0) + (o.total ?? 0));
  }
  return Array.from(groups, ([key, value]) => ({ key, value }));
}

export function countBy(keyFn) {
  const groups = new Map();
  for (const o of listAllOrders()) {
    const key = keyFn(o);
    groups.set(key, (groups.get(key) ?? 0) + 1);
  }
  return Array.from(groups, ([key, value]) => ({ key, value }));
}



// src/lib/orders.js — append

// export async function updateOrderStatus(id, status) {
//   const all = read ? read() : {};
//   const order = all[id];
//   if (!order) return false;
//   order.status = status;
//   write ? write(all) : null;
//   return true;
// }


function readOrders() {
  try {
    if (!fs.existsSync(FILE)) return {};
    return JSON.parse(fs.readFileSync(FILE, "utf8"));
  } catch {
    return {};
  }
}

function writeOrders(data) {
  try {
    fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
  } catch {}
}

export async function updateOrderStatus(id, status) {
  const all = readOrders();
  if (!all[id]) return false;
  all[id].status = status;
  writeOrders(all);
  return true;
}