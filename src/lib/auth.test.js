// @vitest-environment node
import { describe, expect, it } from "vitest";
import { hashPassword } from "./auth";

describe("hashPassword", () => {
  it("liefert einen SHA-256-Hash mit 64 Hex-Zeichen", async () => {
    expect(await hashPassword("anna", "geheim")).toMatch(/^[0-9a-f]{64}$/);
  });

  it("liefert für gleiche Eingaben denselben Hash", async () => {
    expect(await hashPassword("anna", "geheim")).toBe(
      await hashPassword("anna", "geheim"),
    );
  });

  it("unterscheidet verschiedene Passwörter", async () => {
    expect(await hashPassword("anna", "geheim")).not.toBe(
      await hashPassword("anna", "anders"),
    );
  });

  it("nutzt den Benutzernamen als Salz", async () => {
    expect(await hashPassword("anna", "geheim")).not.toBe(
      await hashPassword("bernd", "geheim"),
    );
  });

  it("ignoriert Groß- und Kleinschreibung beim Benutzernamen", async () => {
    expect(await hashPassword("Anna", "geheim")).toBe(
      await hashPassword("anna", "geheim"),
    );
  });
});