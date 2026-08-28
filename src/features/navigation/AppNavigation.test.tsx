import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AppNavigationProvider, useAppNavigation } from "./AppNavigation";

vi.mock("next/navigation", () => ({ usePathname: () => "/" }));
vi.mock("@/hooks/useWakeLock", () => ({
  useWakeLock: () => ({
    isSupported: true,
    isEnabled: true,
    isActive: true,
    setIsEnabled: vi.fn(),
    requestWakeLock: vi.fn(),
    releaseWakeLock: vi.fn(),
  }),
}));

function FavoritesHarness() {
  const { favorites, reorderFavorites, toggleFavorite } = useAppNavigation();
  return <><output>{favorites.join(",")}</output><button onClick={() => reorderFavorites(0, 1)}>Reorder</button><button onClick={() => toggleFavorite("/choasis")}>Add fifth</button></>;
}

describe("AppNavigationProvider", () => {
  beforeEach(() => localStorage.clear());

  it("reorders four favorites and persists their order", () => {
    render(<AppNavigationProvider><FavoritesHarness /></AppNavigationProvider>);
    fireEvent.click(screen.getByRole("button", { name: "Reorder" }));

    const expected = "/dice,/counter,/timer,/score-sheet";
    expect(screen.getByRole("status")).toHaveTextContent(expected);
    expect(JSON.parse(localStorage.getItem("bg-counter-favorite-tools") ?? "[]").join(",")).toBe(expected);
  });

  it("does not replace a favorite when the four slots are occupied", () => {
    render(<AppNavigationProvider><FavoritesHarness /></AppNavigationProvider>);
    fireEvent.click(screen.getByRole("button", { name: "Add fifth" }));

    expect(screen.getByRole("status")).toHaveTextContent("/counter,/dice,/timer,/score-sheet");
    expect(JSON.parse(localStorage.getItem("bg-counter-favorite-tools") ?? "[]")).toEqual([
      "/counter",
      "/dice",
      "/timer",
      "/score-sheet",
    ]);
  });
});
