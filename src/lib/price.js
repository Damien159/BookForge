// Gleicher Key ergibt immer den gleichen Preis (Liste, Detail, Warenkorb)
export function getBookPrice(key) {
  let hash = 0;
  for (const char of String(key)) {
    hash = (hash * 31 + char.charCodeAt(0)) % 1000;
  }
  return Math.round((9.99 + (hash % 12)) * 100) / 100;
}

export function formatPrice(value) {
  return Number(value).toFixed(2).replace(".", ",") + " €";
}

export const FREE_SHIPPING_FROM = 20;
export const SHIPPING_COST = 3.9;

export function getShipping(subtotal) {
  return subtotal === 0 || subtotal >= FREE_SHIPPING_FROM ? 0 : SHIPPING_COST;
}