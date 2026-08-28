import { describe, expect, it } from "vitest";
import { ICONS } from "./icons";

describe("counter icon catalog", () => {
  it("provides a large categorized catalog without duplicate keys", () => {
    expect(ICONS.length).toBeGreaterThanOrEqual(250);
    expect(new Set(ICONS.map(({ key }) => key)).size).toBe(ICONS.length);
    expect(ICONS.every(({ category }) => Boolean(category))).toBe(true);
  });
});
