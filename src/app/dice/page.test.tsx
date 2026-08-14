import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import DicePage from "./page";

vi.mock("@/context/SettingsContext", () => ({
  useSettings: () => ({ t: (key: string) => translations[key] ?? key }),
}));

vi.mock("@/features/navbar/NavBar", () => ({ NavBar: () => <nav /> }));

const translations: Record<string, string> = {
  diceTitle: "Tiradados",
  diceDescription: "Elige tus dados",
  dicePicker: "Añadir a la tirada",
  diceConfiguration: "Dados de la tirada",
  diceAdd: "Añadir",
  diceRemove: "Quitar",
  diceEmptyTray: "Pulsa un dado o la moneda para añadirlo.",
  diceCoin: "Moneda",
  diceCoinShort: "M",
  diceHeads: "Cara",
  diceTails: "Cruz",
  diceHeadsShort: "C",
  diceTailsShort: "X",
  diceRoll: "Lanzar",
  diceRolling: "Tirando...",
  diceEmptyResult: "Configura los dados y realiza una tirada.",
  diceResult: "Resultado",
  diceTotal: "Puntuación total",
  diceHistory: "Últimas tiradas",
  diceClearHistory: "Limpiar",
  diceResetConfiguration: "Vaciar bandeja",
};

describe("DicePage", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(Math, "random").mockReturnValue(0.5);
  });

  afterEach(() => vi.useRealTimers());

  it("starts with a d6 in the tray and saves its animated roll", () => {
    render(<DicePage />);

    expect(screen.getByRole("button", { name: "Quitar d6" })).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Lanzar" }));
    expect(screen.getByRole("button", { name: "Tirando..." })).toBeDisabled();
    act(() => vi.advanceTimersByTime(700));

    expect(screen.getAllByLabelText("Resultado d6: 4")).toHaveLength(2);
    expect(screen.getByTestId("dice-total")).toHaveTextContent("4");
    const saved = JSON.parse(localStorage.getItem("bg-counter-dice-roller") ?? "{}");
    expect(saved.configuration[6]).toBe(1);
    expect(saved.history[0]).toMatchObject({
      items: [{ kind: "die", sides: 6, value: 4 }],
      total: 4,
    });
  });

  it("adds dice and a coin by tapping their samples and restores them", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    const { unmount } = render(<DicePage />);
    fireEvent.click(screen.getByRole("button", { name: "Quitar d6" }));
    fireEvent.click(screen.getByRole("button", { name: "Añadir d4" }));
    fireEvent.click(screen.getByRole("button", { name: "Añadir d4" }));
    fireEvent.click(screen.getByRole("button", { name: "Añadir d20" }));
    fireEvent.click(screen.getByRole("button", { name: "Añadir Moneda" }));
    fireEvent.click(screen.getByRole("button", { name: "Lanzar" }));
    act(() => vi.advanceTimersByTime(700));

    expect(screen.getAllByLabelText("Resultado d4: 1")).toHaveLength(4);
    expect(screen.getAllByLabelText("Resultado d20: 1")).toHaveLength(2);
    expect(screen.getAllByLabelText("Resultado Moneda: Cara")).toHaveLength(2);
    expect(screen.getByTestId("dice-total")).toHaveTextContent("3");

    unmount();
    render(<DicePage />);
    expect(screen.getAllByRole("button", { name: "Quitar d4" })).toHaveLength(2);
    expect(screen.getByRole("button", { name: "Quitar d20" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Quitar Moneda" })).toBeVisible();
    expect(screen.getAllByLabelText("Resultado Moneda: Cara")).toHaveLength(2);
  });

  it("removes tray items and resets every quantity while preserving history", () => {
    render(<DicePage />);
    fireEvent.click(screen.getByRole("button", { name: "Lanzar" }));
    act(() => vi.advanceTimersByTime(700));
    fireEvent.click(screen.getByRole("button", { name: "Añadir Moneda" }));
    fireEvent.click(screen.getByRole("button", { name: "Vaciar bandeja" }));

    expect(screen.queryByRole("button", { name: /^Quitar/ })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Lanzar" })).toBeDisabled();
    expect(screen.getByRole("heading", { name: "Últimas tiradas" })).toBeVisible();
    const saved = JSON.parse(localStorage.getItem("bg-counter-dice-roller") ?? "{}");
    expect(Object.values(saved.configuration)).toEqual([0, 0, 0, 0, 0, 0, 0, 0]);
    expect(saved.history).toHaveLength(1);
  });

  it("clears saved roll history", () => {
    render(<DicePage />);
    fireEvent.click(screen.getByRole("button", { name: "Lanzar" }));
    act(() => vi.advanceTimersByTime(700));
    fireEvent.click(screen.getByRole("button", { name: "Limpiar" }));

    expect(screen.queryByRole("heading", { name: "Últimas tiradas" })).not.toBeInTheDocument();
    const saved = JSON.parse(localStorage.getItem("bg-counter-dice-roller") ?? "{}");
    expect(saved.history).toEqual([]);
  });

  it("rolls a coin alone as tails without showing a numeric total", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.75);
    render(<DicePage />);
    fireEvent.click(screen.getByRole("button", { name: "Quitar d6" }));
    fireEvent.click(screen.getByRole("button", { name: "Añadir Moneda" }));
    fireEvent.click(screen.getByRole("button", { name: "Lanzar" }));
    act(() => vi.advanceTimersByTime(700));

    expect(screen.getAllByLabelText("Resultado Moneda: Cruz")).toHaveLength(2);
    expect(screen.queryByTestId("dice-total")).not.toBeInTheDocument();
    const saved = JSON.parse(localStorage.getItem("bg-counter-dice-roller") ?? "{}");
    expect(saved.history[0]).toMatchObject({
      items: [{ kind: "coin", value: "tails" }],
      total: 0,
    });
  });

  it("limits every sample to twenty pieces", () => {
    render(<DicePage />);
    const addD8 = screen.getByRole("button", { name: "Añadir d8" });
    for (let index = 0; index < 20; index += 1) {
      fireEvent.click(addD8);
    }

    expect(screen.getAllByRole("button", { name: "Quitar d8" })).toHaveLength(20);
    expect(addD8).toBeDisabled();
  });

  it("migrates dice-only rolls saved by the previous version", () => {
    localStorage.setItem(
      "bg-counter-dice-roller",
      JSON.stringify({
        configuration: { 6: 2 },
        history: [
          {
            id: "old-roll",
            dice: [
              { sides: 6, value: 2 },
              { sides: 6, value: 5 },
            ],
            total: 7,
          },
        ],
      }),
    );

    render(<DicePage />);

    expect(screen.getAllByRole("button", { name: "Quitar d6" })).toHaveLength(2);
    expect(screen.getAllByLabelText("Resultado d6: 2")).toHaveLength(2);
    expect(screen.getAllByLabelText("Resultado d6: 5")).toHaveLength(2);
    expect(screen.getByTestId("dice-total")).toHaveTextContent("7");
  });

  it("falls back safely when stored data is invalid", () => {
    localStorage.setItem("bg-counter-dice-roller", "not-json");
    render(<DicePage />);

    expect(screen.getByRole("button", { name: "Quitar d6" })).toBeVisible();
    expect(screen.getByText("Configura los dados y realiza una tirada.")).toBeVisible();
  });
});
