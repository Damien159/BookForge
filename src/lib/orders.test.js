import { beforeEach, describe, expect, it } from "vitest";
import { addOrder, createOrderId, getOrders } from "./orders";

beforeEach(() => localStorage.clear());

describe("Bestellungen", () => {
  it("startet ohne Bestellungen", () => {
    expect(getOrders("anna")).toEqual([]);
  });

  it("speichert die neueste Bestellung zuerst", () => {
    addOrder("anna", { id: "BF-1" });
    addOrder("anna", { id: "BF-2" });
    expect(getOrders("anna").map((order) => order.id)).toEqual(["BF-2", "BF-1"]);
  });

  it("trennt Bestellungen pro Benutzer", () => {
    addOrder("anna", { id: "BF-1" });
    expect(getOrders("bernd")).toEqual([]);
  });

  it("nutzt für Gäste einen eigenen Speicher", () => {
    addOrder(null, { id: "BF-9" });
    expect(getOrders(undefined)).toHaveLength(1);
    expect(localStorage.getItem("bookforge_orders_guest")).not.toBeNull();
  });

  it("erzeugt Bestellnummern im Format BF-123456", () => {
    expect(createOrderId()).toMatch(/^BF-\d{6}$/);
  });
});