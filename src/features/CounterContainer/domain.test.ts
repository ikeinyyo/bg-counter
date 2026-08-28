import { describe, expect, it } from "vitest";
import {
  getDefaultBySize,
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
});
