// src/lib/orders.js
import fs from "fs";
import path from "path";

const FILE = path.join(process.cwd(), ".orders.json");

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

export function addOrder(order) {
  const all = readOrders();
  all[order.id] = order;
  writeOrders(all);
  return order;
}

export function getOrder(id) {
  return readOrders()[id] ?? null;
}

export function deleteOrder(id) {
  const all = readOrders();
  const existed = id in all;
  delete all[id];
  writeOrders(all);
  return existed;
}

export function newOrderId() {
  return "ord_" + Math.random().toString(36).slice(2, 10);
}

export function listOrdersForUser(userId) {
  return Object.values(readOrders()).filter((o) => o.userId === userId);
}

export function listAllOrders() {
  return Object.values(readOrders());
}

export function updateOrderStatus(id, status) {
  const all = readOrders();
  if (!all[id]) return false;
  all[id].status = status;
  writeOrders(all);
  return true;
}

export function sumTotals(predicate = () => true) {
  return listAllOrders().filter(predicate).reduce((s, o) => s + (o.total ?? 0), 0);
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