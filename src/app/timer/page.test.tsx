import { act, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import TimerPage from "./page";

vi.mock("@/context/SettingsContext", () => ({
  useSettings: () => ({ t: (key: string) => translations[key] ?? key }),
}));
vi.mock("@/features/navbar/NavBar", () => ({ NavBar: () => <nav /> }));

const translations: Record<string, string> = {
  timerTitle: "Temporizador",
  timerDescription: "Configura una cuenta atrás",
  timerMinutes: "Minutos",
  timerSeconds: "Segundos",
  timerStart: "Iniciar",
  timerResume: "Reanudar",
  timerRestart: "Reiniciar",
  timerStop: "Detener",
  timerReady: "Temporizador preparado",
  timerRunning: "Cuenta atrás en curso",
  timerPaused: "Temporizador detenido",
  timerFinished: "¡Tiempo finalizado!",
  timerAriaLabel: "Tiempo restante",
};

describe("TimerPage", () => {
  beforeEach(() => {
    vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue();
    vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => undefined);
    Object.defineProperty(navigator, "vibrate", {
      configurable: true,
      value: vi.fn(),
    });
  });

  it("starts at thirty seconds on first visit and persists changes", () => {
    render(<TimerPage />);
    expect(screen.getByLabelText("Minutos")).toHaveValue(0);
    expect(screen.getByLabelText("Segundos")).toHaveValue(30);
    expect(screen.getByRole("timer")).toHaveTextContent("00:30");

    fireEvent.change(screen.getByLabelText("Minutos"), { target: { value: "2" } });
    fireEvent.change(screen.getByLabelText("Segundos"), { target: { value: "15" } });
    expect(localStorage.getItem("bg-counter-timer-duration-seconds")).toBe("135");
  });

  it("restores the previously configured duration", () => {
    localStorage.setItem("bg-counter-timer-duration-seconds", "75");
    render(<TimerPage />);
    expect(screen.getByLabelText("Minutos")).toHaveValue(1);
    expect(screen.getByLabelText("Segundos")).toHaveValue(15);
    expect(screen.getByRole("timer")).toHaveTextContent("01:15");
  });

  it("starts, pauses, resumes, and restarts the countdown", () => {
    vi.useFakeTimers();
    render(<TimerPage />);
    fireEvent.click(screen.getByRole("button", { name: "Iniciar" }));
    expect(screen.getByText("Cuenta atrás en curso")).toBeVisible();
    expect(screen.getByLabelText("Segundos")).toBeDisabled();

    act(() => vi.advanceTimersByTime(1200));
    expect(screen.getByRole("timer")).toHaveTextContent("00:29");
    fireEvent.click(screen.getByRole("button", { name: "Detener" }));
    expect(screen.getByRole("button", { name: "Reanudar" })).toBeEnabled();
    fireEvent.click(screen.getByRole("button", { name: "Reanudar" }));
    fireEvent.click(screen.getByRole("button", { name: "Reiniciar" }));
    expect(screen.getByRole("timer")).toHaveTextContent("00:30");
    vi.useRealTimers();
  });

  it("finishes a short countdown and plays the alarm", () => {
    vi.useFakeTimers();
    render(<TimerPage />);
    fireEvent.change(screen.getByLabelText("Segundos"), { target: { value: "1" } });
    fireEvent.click(screen.getByRole("button", { name: "Iniciar" }));
    act(() => vi.advanceTimersByTime(1100));

    expect(screen.getAllByText("¡Tiempo finalizado!")[0]).toBeVisible();
    expect(screen.getByRole("timer")).toHaveTextContent("00:00");
    expect(HTMLMediaElement.prototype.play).toHaveBeenCalled();
    vi.useRealTimers();
  });
});
