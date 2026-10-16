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