import { beforeEach, describe, expect, it } from "vitest";
import { readJSON, writeJSON } from "./storage";

beforeEach(() => localStorage.clear());

describe("readJSON", () => {
  it("liefert die leere Liste, wenn nichts gespeichert ist", () => {
    expect(readJSON("fehlt")).toEqual([]);
  });

  it("liefert den angegebenen Fallback", () => {
    expect(readJSON("fehlt", { a: 1 })).toEqual({ a: 1 });
  });

  it("überlebt kaputtes JSON im Speicher", () => {
    localStorage.setItem("kaputt", "{nicht json");
    expect(readJSON("kaputt")).toEqual([]);
  });
});

describe("writeJSON", () => {
  it("speichert Daten so, dass readJSON sie wieder liest", () => {
    writeJSON("buecher", [{ key: "OL1W", title: "Test" }]);
    expect(readJSON("buecher")).toEqual([{ key: "OL1W", title: "Test" }]);
  });
});