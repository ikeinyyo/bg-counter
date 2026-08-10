import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SettingsProvider, translations, useSettings } from "./SettingsContext";

const Consumer = () => {
  const { language, theme, resolvedTheme, setLanguage, setTheme, t } =
    useSettings();
  return (
    <div>
      <span data-testid="language">{language}</span>
      <span data-testid="theme">{theme}</span>
      <span data-testid="resolved-theme">{resolvedTheme}</span>
      <span>{t("homeTitle")}</span>
      <button onClick={() => setLanguage("en")}>English</button>
      <button onClick={() => setTheme("dark")}>Dark</button>
    </div>
  );
};

describe("SettingsProvider", () => {
  it("keeps the same translation keys in every supported language", () => {
    const spanishKeys = Object.keys(translations.es).sort();

    expect(Object.keys(translations.en).sort()).toEqual(spanishKeys);
    expect(Object.keys(translations.it).sort()).toEqual(spanishKeys);
  });

  it("changes language and theme and persists both settings", async () => {
    const user = userEvent.setup();
    render(
      <SettingsProvider>
        <Consumer />
      </SettingsProvider>,
    );

    await user.click(screen.getByRole("button", { name: "English" }));
    await user.click(screen.getByRole("button", { name: "Dark" }));

    expect(screen.getByTestId("language")).toHaveTextContent("en");
    expect(screen.getByTestId("theme")).toHaveTextContent("dark");
    expect(screen.getByTestId("resolved-theme")).toHaveTextContent("dark");
    expect(document.documentElement).toHaveAttribute("lang", "en");
    expect(document.documentElement).toHaveAttribute("data-theme", "dark");
    expect(JSON.parse(localStorage.getItem("bg-counter-settings") ?? "{}")).toEqual(
      { language: "en", theme: "dark" },
    );
  });

  it("restores saved settings on mount", async () => {
    localStorage.setItem(
      "bg-counter-settings",
      JSON.stringify({ language: "it", theme: "light" }),
    );

    render(
      <SettingsProvider>
        <Consumer />
      </SettingsProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("language")).toHaveTextContent("it");
      expect(screen.getByTestId("theme")).toHaveTextContent("light");
    });
    expect(screen.getByText("La tua compagna di gioco al tavolo.")).toBeVisible();
  });

  it("follows the system color scheme when system theme is selected", async () => {
    const listeners = new Set<(event: MediaQueryListEvent) => void>();
    let matches = true;
    vi.stubGlobal(
      "matchMedia",
      vi.fn().mockImplementation(() => ({
        get matches() {
          return matches;
        },
        addEventListener: (_event: string, listener: (event: MediaQueryListEvent) => void) =>
          listeners.add(listener),
        removeEventListener: (_event: string, listener: (event: MediaQueryListEvent) => void) =>
          listeners.delete(listener),
      })),
    );

    render(
      <SettingsProvider>
        <Consumer />
      </SettingsProvider>,
    );

    await waitFor(() =>
      expect(screen.getByTestId("resolved-theme")).toHaveTextContent("dark"),
    );
    matches = false;
    listeners.forEach((listener) =>
      listener({ matches: false } as MediaQueryListEvent),
    );
    await waitFor(() =>
      expect(screen.getByTestId("resolved-theme")).toHaveTextContent("light"),
    );
  });
});
