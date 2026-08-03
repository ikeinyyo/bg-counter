import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import ChoasisPage from "./page";

vi.mock("@/context/SettingsContext", () => ({
  useSettings: () => ({ t: (key: string) => translations[key] ?? key }),
}));

vi.mock("@/features/navbar/NavBar", () => ({
  NavBar: ({ right }: { right?: (args: { requestClose: () => void }) => React.ReactNode }) => (
    <nav>{right?.({ requestClose: vi.fn() })}</nav>
  ),
}));

const translations: Record<string, string> = {
  choasisTitle: "Choasis",
  choasisToManual: "Modo manual",
  choasisToTouch: "Modo táctil",
  choasisManualTitle: "Modo manual",
  choasisManualPlayersLabel: "Número de jugadores",
  choasisManualRandomize: "Elegir",
  choasisPlaceholder: "Pon tu dedo",
  choasisResetHint: "Toca para reiniciar",
  choasisMoreThanFive: "¿Más de 5?",
  choasisManualHintMenu: "Usa el modo manual",
};

describe("ChoasisPage", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(Math, "random").mockReturnValue(0.49);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("switches to manual mode and chooses a player inside the configured range", () => {
    render(<ChoasisPage />);
    fireEvent.click(screen.getByRole("button", { name: "Modo manual" }));

    const players = screen.getByLabelText("Número de jugadores:");
    fireEvent.change(players, { target: { value: "8" } });
    fireEvent.click(screen.getByRole("button", { name: "Elegir" }));
    expect(screen.getByRole("button", { name: "Elegir" })).toBeDisabled();

    act(() => vi.advanceTimersByTime(2100));

    expect(screen.getByText("4", { selector: ".text-5xl" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Elegir" })).toBeEnabled();
  });

  it("filters invalid characters and limits manual mode to 100 players", () => {
    render(<ChoasisPage />);
    fireEvent.click(screen.getByRole("button", { name: "Modo manual" }));

    const players = screen.getByLabelText("Número de jugadores:");
    fireEvent.change(players, { target: { value: "12abc0" } });
    fireEvent.blur(players);

    expect(players).toHaveValue("100");
    expect(document.querySelectorAll(".aspect-square")).toHaveLength(100);
  });

  it("switches from touch to manual mode when a sixth player joins", () => {
    const { container } = render(<ChoasisPage />);
    const touchArea = container.querySelector("main > div")!;
    const touches = Array.from({ length: 6 }, (_, identifier) => ({
      identifier,
      clientX: 40 + identifier * 20,
      clientY: 80,
    }));
    fireEvent.touchStart(touchArea, { changedTouches: touches });

    expect(screen.getByText("Modo manual", { selector: "p" })).toBeVisible();
    expect(screen.getByLabelText("Número de jugadores:")).toHaveValue("6");
  });

  it("tracks a touch, selects it after the countdown, and resets on tap", () => {
    const { container } = render(<ChoasisPage />);
    const touchArea = container.querySelector("main > div")!;
    const finger = { identifier: 7, clientX: 100, clientY: 140 };

    fireEvent.touchStart(touchArea, { changedTouches: [finger] });
    expect(container.querySelector(".choasis-circle")).toHaveClass("choasis-pulse");

    fireEvent.touchMove(touchArea, {
      changedTouches: [{ ...finger, clientX: 150, clientY: 180 }],
    });
    expect(container.querySelector(".choasis-circle")).toHaveStyle({
      left: "90px",
      top: "120px",
    });

    act(() => vi.advanceTimersByTime(2_000));
    expect(screen.getByText("Toca para reiniciar")).toBeVisible();
    expect(container.querySelector(".choasis-circle")).toHaveClass(
      "choasis-beat-expand",
    );

    fireEvent.click(touchArea);
    expect(screen.getByText("Pon tu dedo")).toBeVisible();
    expect(container.querySelector(".choasis-circle")).not.toBeInTheDocument();
  });

  it("cancels the selection countdown when the last finger is removed", () => {
    const { container } = render(<ChoasisPage />);
    const touchArea = container.querySelector("main > div")!;
    const finger = { identifier: 2, clientX: 80, clientY: 100 };

    fireEvent.touchStart(touchArea, { changedTouches: [finger] });
    fireEvent.touchEnd(touchArea, { changedTouches: [finger] });
    act(() => vi.advanceTimersByTime(2_100));

    expect(screen.getByText("Pon tu dedo")).toBeVisible();
    expect(screen.queryByText("Toca para reiniciar")).not.toBeInTheDocument();
  });
});
