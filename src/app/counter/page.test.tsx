import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import CounterPage from "./page";
import { layoutTemplates } from "@/features/CounterContainer/config/templates";

vi.mock("@/context/SettingsContext", () => ({
  useSettings: () => ({ t: (key: string) => translations[key] ?? key }),
  useTranslation: () => ({ t: (key: string) => translations[key] ?? key }),
}));

vi.mock("@/features/navbar/NavBar", () => ({
  NavBar: ({ right }: { right?: React.ReactNode | ((args: { requestClose: () => void }) => React.ReactNode) }) => (
    <nav>{typeof right === "function" ? right({ requestClose: vi.fn() }) : right}</nav>
  ),
}));

const translations: Record<string, string> = {
  menuOptions: "Opciones",
  menuEdit: "Editar",
  menuDelete: "Eliminar",
  editorTitle: "Editar contador",
  labelName: "Nombre",
  placeholderCounterName: "Nombre del contador",
  labelDefaultValue: "Valor por defecto",
  labelBackgroundColor: "Color de fondo",
  labelIcon: "Icono",
  labelPreview: "Vista previa",
  actionCancel: "Cancelar",
  actionSave: "Guardar",
  gameLabel: "Juego",
  distributionLabel: "Distribución",
  game_magic: "Magic",
  template_commander: "Commander",
  template_duel: "Duelo",
};

const storedCounters = (templateId: string) =>
  layoutTemplates.find(({ id }) => id === templateId)!.counters;

describe("CounterPage", () => {
  beforeEach(() => {
    localStorage.setItem("current-counters", JSON.stringify(storedCounters("life1")));
    localStorage.setItem("selected-game", "generic");
    localStorage.setItem("selected-template", "life1");
  });

  it("applies and persists a game template without an older template overwriting it", async () => {
    render(<CounterPage />);

    fireEvent.change(document.querySelector("#game")!, { target: { value: "magic" } });
    fireEvent.change(document.querySelector("#template")!, { target: { value: "duel" } });

    await waitFor(() => {
      const persisted = JSON.parse(localStorage.getItem("current-counters") ?? "[]");
      expect(persisted.map(({ id, initialValue }: { id: string; initialValue: number }) => ({ id, initialValue }))).toEqual([
        { id: "player1", initialValue: 20 },
        { id: "player2", initialValue: 20 },
      ]);
    });
    expect(localStorage.getItem("selected-game")).toBe("magic");
    expect(localStorage.getItem("selected-template")).toBe("duel");
  });

  it("edits a counter, stores the result, and marks the layout as custom", async () => {
    render(<CounterPage />);

    fireEvent.click(await screen.findByTitle("Opciones"));
    fireEvent.click(screen.getByRole("button", { name: "Editar" }));
    fireEvent.change(screen.getByPlaceholderText("Nombre del contador"), {
      target: { value: "Marcador principal" },
    });
    fireEvent.change(screen.getByLabelText("Valor por defecto"), {
      target: { value: "25" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Guardar" }));

    await waitFor(() => {
      const [persisted] = JSON.parse(localStorage.getItem("current-counters") ?? "[]");
      expect(persisted).toMatchObject({
        name: "Marcador principal",
        initialValue: 25,
        value: 25,
      });
      expect(localStorage.getItem("selected-template")).toBe("custom");
    });
  });
});
