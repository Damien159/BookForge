import { describe, expect, it } from "vitest";
import {
  FREE_SHIPPING_FROM,
  SHIPPING_COST,
  formatPrice,
  getBookPrice,
  getShipping,
} from "./price";

describe("getBookPrice", () => {
  it("liefert für denselben Key immer denselben Preis", () => {
    expect(getBookPrice("OL123W")).toBe(getBookPrice("OL123W"));
  });

  it("liegt zwischen 9,99 und 20,99 Euro", () => {
    for (const key of ["OL1W", "OL27448W", "OL893415W", "OL5735363W", "abc"]) {
      const price = getBookPrice(key);
      expect(price).toBeGreaterThanOrEqual(9.99);
      expect(price).toBeLessThanOrEqual(20.99);
    }
  });
});

describe("formatPrice", () => {
  it("formatiert mit Komma und Eurozeichen", () => {
    expect(formatPrice(9.5)).toBe("9,50 €");
    expect(formatPrice(0)).toBe("0,00 €");
    
export const FREE_SHIPPING_FROM = 20;
export const SHIPPING_COST = 3.9;

export function getShipping(subtotal) {
  return subtotal === 0 || subtotal >= FREE_SHIPPING_FROM ? 0 : SHIPPING_COST;
}
  });
});

describe("getShipping", () => {
  it("kostet nichts bei leerem Warenkorb", () => {
    expect(getShipping(0)).toBe(0);
  });

  it("berechnet Versand unter der Grenze", () => {
    expect(getShipping(FREE_SHIPPING_FROM - 0.01)).toBe(SHIPPING_COST);
  });

  it("ist ab der Grenze kostenlos", () => {
    expect(getShipping(FREE_SHIPPING_FROM)).toBe(0);
    expect(getShipping(FREE_SHIPPING_FROM + 50)).toBe(0);
  });
});
