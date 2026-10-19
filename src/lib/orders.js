import { readJSON, writeJSON } from "./storage";

const ordersKey = (user) => `bookforge_orders_${user ?? "guest"}`;

export function getOrders(user) {
  return readJSON(ordersKey(user));
}

export function addOrder(user, order) {
  writeJSON(ordersKey(user), [order, ...getOrders(user)]);
  return order;
}

export function createOrderId() {
  return "BF-" + Math.floor(100000 + Math.random() * 900000);
}