import { describe, expect, it } from "vitest";
import {
  type CounterConfig,
  getDefaultBySize,
  getCounterRowCount,
  getExactSizeFromConfig,
  getSizeFromConfig,
  Size,
} from "./domain";

describe("responsive counter sizes", () => {
  it.each<[Size, number, number, number]>([
    ["XS", 2, 3, 4],
    ["S", 2, 2, 4],
    ["M", 1, 2, 2],
    ["L", 1, 1, 1],
  ])("maps %s to a mobile, tablet, and desktop layout", (size, xs, md, lg) => {
    expect(getDefaultBySize(size)).toEqual({
      xsElementsPerRow: xs,
      mdElementsPerRow: md,
      lgElementsPerRow: lg,
    });
  });

  it("finds the closest preset for layouts supplied by a game template", () => {
    expect(
      getSizeFromConfig({
        xsElementsPerRow: 1,
        mdElementsPerRow: 2,
        lgElementsPerRow: 3,
      }),
    ).toBe("M");
    expect(
      getExactSizeFromConfig({
        xsElementsPerRow: 1,
        mdElementsPerRow: 2,
        lgElementsPerRow: 3,
      }),
    ).toBeNull();
  });

  it("counts the actual grid rows used at each breakpoint", () => {
    const counter = (id: string, xsElementsPerRow: number): CounterConfig => ({
      id,
      name: id,
      initialValue: 0,
      backgroundColor: "#000000",
      icon: "heart",
      xsElementsPerRow,
    });

    expect(getCounterRowCount([
      counter("half-1", 2),
      counter("half-2", 2),
      counter("full-1", 1),
      counter("full-2", 1),
    ], "xs")).toBe(3);
    expect(getCounterRowCount([
      counter("full-1", 1),
      counter("full-2", 1),
      counter("full-3", 1),
      counter("full-4", 1),
    ], "xs")).toBe(4);
    expect(getCounterRowCount([
      counter("quarter-1", 4),
      counter("quarter-2", 4),
      counter("quarter-3", 4),
      counter("quarter-4", 4),
    ], "xs")).toBe(1);
  });
});
