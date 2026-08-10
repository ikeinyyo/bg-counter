import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ScoreSheetPage from "./page";

vi.mock("@/context/SettingsContext", () => ({
  useSettings: () => ({ language: "es", t: (key: string) => translations[key] ?? key }),
}));
vi.mock("@/features/navbar/NavBar", () => ({
  NavBar: ({ right }: { right?: (args: { requestClose: () => void }) => React.ReactNode }) => (
    <nav>{right?.({ requestClose: vi.fn() })}</nav>
  ),
}));

const translations: Record<string, string> = {
  scoreSheetTitle: "Hoja de puntuación",
  scoreSheetDescription: "Anota y suma los puntos",
  scoreSheetConcept: "Concepto",
  scoreSheetPlayer: "Jugador",
  scoreSheetScore: "Puntuación",
  scoreSheetTotal: "Total",
  scoreSheetAddConcept: "Añadir concepto",
  scoreSheetAddPlayer: "Añadir jugador",
  scoreSheetRemoveConcept: "Eliminar concepto",
  scoreSheetRemovePlayer: "Eliminar jugador",
  scoreSheetWinner: "Mayor puntuación",
  scoreSheetCurrentWinner: "Ganador actual",
  scoreSheetTie: "Empate",
  scoreSheetWinnerUndecided: "Ganador por decidir",
  scoreSheetClearScores: "Limpiar puntuaciones",
  scoreSheetReset: "Restablecer tabla",
  scoreSheetClearHint: "Puedes limpiar las puntuaciones desde el menú.",
};

describe("ScoreSheetPage", () => {
  beforeEach(() => {
    Element.prototype.scrollTo = vi.fn();
  });

  it("calculates totals and highlights the current winner", async () => {
    const user = userEvent.setup();
    render(<ScoreSheetPage />);

    await user.type(screen.getByLabelText("Jugador 1"), "Ana");
    await user.type(screen.getByLabelText("Jugador 2"), "Luis");
    await user.type(screen.getByLabelText("Concepto 1"), "Ronda");
    fireEvent.change(screen.getByLabelText("Puntuación: Ana, Ronda"), {
      target: { value: "12.5" },
    });
    fireEvent.change(screen.getByLabelText("Puntuación: Luis, Ronda"), {
      target: { value: "8" },
    });

    expect(screen.getByText("Ganador actual: Ana")).toBeVisible();
    const winner = screen.getByTitle("Mayor puntuación");
    expect(winner).toHaveTextContent("12,5");
    expect(winner).toHaveClass("text-primary");
  });

  it("adds players and concepts and prevents deleting the last ones", async () => {
    const user = userEvent.setup();
    render(<ScoreSheetPage />);

    await user.click(screen.getByLabelText("Añadir jugador"));
    expect(screen.getByLabelText("Jugador 3")).toBeVisible();
    await user.click(screen.getByLabelText("Añadir concepto"));
    expect(screen.getByLabelText("Concepto 2")).toBeVisible();

    const removePlayers = screen.getAllByTitle("Eliminar jugador");
    await user.click(removePlayers[2]);
    await user.click(removePlayers[1]);
    expect(screen.getByTitle("Eliminar jugador")).toBeDisabled();

    const removeConcepts = screen.getAllByTitle("Eliminar concepto");
    await user.click(removeConcepts[1]);
    expect(screen.getByTitle("Eliminar concepto")).toBeDisabled();
  });

  it("clears scores without removing structure and can reset the whole table", async () => {
    const user = userEvent.setup();
    render(<ScoreSheetPage />);
    await user.type(screen.getByLabelText("Jugador 1"), "Ana");
    fireEvent.change(screen.getByLabelText(/Puntuación: Ana, Concepto 1/), {
      target: { value: "10" },
    });

    await user.click(screen.getByRole("button", { name: "Limpiar puntuaciones" }));
    expect(screen.getByLabelText("Jugador 1")).toHaveValue("Ana");
    expect(screen.getAllByRole("spinbutton")[0]).toHaveValue(null);

    await user.click(screen.getByRole("button", { name: "Restablecer tabla" }));
    expect(screen.getAllByPlaceholderText(/Jugador/)).toHaveLength(1);
    expect(screen.getAllByPlaceholderText(/Concepto/)).toHaveLength(1);
  });

  it("restores a complete table from local storage", () => {
    localStorage.setItem(
      "bg-counter-score-sheet",
      JSON.stringify({
        players: [{ id: "p1", name: "Marta" }],
        rows: [{ id: "r1", concept: "Bonus", scores: { p1: "7" } }],
      }),
    );
    render(<ScoreSheetPage />);

    expect(screen.getByLabelText("Jugador 1")).toHaveValue("Marta");
    expect(screen.getByLabelText("Concepto 1")).toHaveValue("Bonus");
    expect(within(screen.getByRole("table")).getByTitle("Mayor puntuación")).toHaveTextContent("7");
  });
});
