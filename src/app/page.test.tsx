import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import Home from "./page";

vi.mock("@/context/SettingsContext", () => ({
  useSettings: () => ({ t: (key: string) => translations[key] ?? key }),
}));

vi.mock("@/features/navbar/NavBar", () => ({ NavBar: () => <nav /> }));
vi.mock("@/lib/telemetry", () => ({ trackEvent: vi.fn() }));

const translations: Record<string, string> = {
  appTitle: "Companion",
  homeTitle: "Herramientas",
  homeDescription: "Utilidades",
  counterTitle: "Counters",
  counterDescription: "Contadores",
  choasisTitle: "Choasis",
  choasisDescription: "Elegir jugador",
  timerTitle: "Temporizador",
  timerDescription: "Cuenta atrás",
  scoreSheetTitle: "Hoja de puntuación",
  scoreSheetDescription: "Puntuaciones",
  diceTitle: "Tiradados",
  diceDescription: "Dados",
  helpTitle: "Ayuda",
  helpDescription: "Guía",
  feedbackLabel: "Enviar feedback",
  feedbackDescription: "Comparte tus ideas",
  soonTitle: "Pronto",
  soonDescription: "Más herramientas",
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("main menu feedback", () => {
  it("opens the configured feedback form from the tools menu", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ feedbackUrl: "https://forms.example.com/feedback" }),
      }),
    );

    render(<Home />);
    const feedbackLink = screen.getByRole("link", { name: /Enviar feedback/i });

    await waitFor(() =>
      expect(feedbackLink).toHaveAttribute(
        "href",
        "https://forms.example.com/feedback",
      ),
    );
    expect(feedbackLink).toHaveAttribute("target", "_blank");
  });

  it("uses email when no form is configured", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ feedbackUrl: null }),
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<Home />);
    const feedbackLink = screen.getByRole("link", { name: /Enviar feedback/i });

    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    expect(feedbackLink).toHaveAttribute(
      "href",
      "mailto:info@juernesdemesa.com",
    );
    expect(feedbackLink).not.toHaveAttribute("target");
  });
});
