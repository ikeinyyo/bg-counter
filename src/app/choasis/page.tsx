"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type TouchEvent as ReactTouchEvent,
} from "react";
import { NavBar } from "@/features/navbar/NavBar";
import { useSettings } from "@/context/SettingsContext";
import { MdTouchApp } from "react-icons/md";
import { FaKeyboard } from "react-icons/fa";
import { trackEvent } from "@/lib/telemetry";

type TouchInfo = {
  id: number;
  x: number;
  y: number;
  color: string;
};

const COLORS: string[] = [
  "#dc2626", // red
  "#ea580c", // orange
  "#eab308", // yellow
  "#16a34a", // green
  "#2563eb", // blue
  "#9333ea", // purple
  "#d1008f", // magenta
  "#ec4899", // pink
  "#0ea5e9", // sky
  "#6b7280", // gray
];

const TIMEOUT = 2000;

export default function ChoasisPage() {
  const { t } = useSettings();

  const computedTitle = useMemo(
    () => `Juernes de Mesa — ${t("choasisTitle")}`,
    [t],
  );

  const containerRef = useRef<HTMLDivElement | null>(null);
  const timerRef = useRef<number | null>(null);

  const [mode, setMode] = useState<"touch" | "manual">("touch");
  const [touches, setTouches] = useState<Map<number, TouchInfo>>(new Map());
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [phase, setPhase] = useState<"idle" | "countdown" | "selected">("idle");
  const [manualPlayersText, setManualPlayersText] = useState<string>("6");
  const manualPlayers = useMemo(() => {
    const raw = manualPlayersText.trim();
    if (raw === "") return 0;
    const n = parseInt(raw, 10);
    if (Number.isNaN(n)) return 0;
    return Math.max(1, Math.min(100, n));
  }, [manualPlayersText]);
  const [manualResult, setManualResult] = useState<number | null>(null);
  const columnsClass = useMemo(() => {
    const n = manualPlayers | 0;
    const cols = Math.max(
      4,
      Math.min(10, Math.ceil(Math.sqrt(Math.max(1, n)))),
    );
    switch (cols) {
      case 4:
        return "grid-cols-4";
      case 5:
        return "grid-cols-5";
      case 6:
        return "grid-cols-6";
      case 7:
        return "grid-cols-7";
      case 8:
        return "grid-cols-8";
      case 9:
        return "grid-cols-9";
      default:
        return "grid-cols-10"; // 10
    }
  }, [manualPlayers]);
  const [raffleActive, setRaffleActive] = useState<boolean>(false);
  const [highlightIndex, setHighlightIndex] = useState<number | null>(null);
  const raffleIntervalRef = useRef<number | null>(null);
  const raffleTimeoutRef = useRef<number | null>(null);

  const clearRaffle = useCallback(() => {
    if (raffleIntervalRef.current) {
      window.clearInterval(raffleIntervalRef.current);
      raffleIntervalRef.current = null;
    }
    if (raffleTimeoutRef.current) {
      window.clearTimeout(raffleTimeoutRef.current);
      raffleTimeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      clearRaffle();
    };
  }, [clearRaffle]);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.title = computedTitle;
    }
  }, [computedTitle]);

  // Default to manual mode on non-touch devices
  useEffect(() => {
    if (typeof window === "undefined") return;
    const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (!hasTouch) {
      const id = window.setTimeout(() => setMode("manual"), 0);
      return () => window.clearTimeout(id);
    }
  }, []);

  // Set a dynamic viewport height CSS variable for mobile browsers (iOS Safari)
  useEffect(() => {
    const setVhVar = () => {
      if (typeof window !== "undefined") {
        const vh = window.innerHeight;
        document.documentElement.style.setProperty("--choasis-vh", `${vh}px`);
      }
    };
    setVhVar();
    window.addEventListener("resize", setVhVar);
    window.addEventListener("orientationchange", setVhVar);
    return () => {
      window.removeEventListener("resize", setVhVar);
      window.removeEventListener("orientationchange", setVhVar);
    };
  }, []);

  // Assign a color not currently in use if possible
  const pickColor = useCallback(() => {
    const used = new Set([...touches.values()].map((t) => t.color));
    const available = COLORS.filter((c) => !used.has(c));
    const pool = available.length > 0 ? available : COLORS;
    return pool[Math.floor(Math.random() * pool.length)];
  }, [touches]);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    clearTimer();
    // 4 seconds from now
    timerRef.current = window.setTimeout(() => {
      // When timer fires, pick one of the active touches (if any)
      setPhase((prev) => (prev === "selected" ? prev : "selected"));
      setTouches((prev) => {
        const ids = [...prev.keys()];
        if (ids.length === 0) return prev;
        const id = ids[Math.floor(Math.random() * ids.length)];
        const info = prev.get(id)!;
        trackEvent("choasis_selection_completed", { mode: "touch" }, { playerCount: ids.length });
        setSelectedId(id);
        setSelectedColor(info.color);
        return prev;
      });
      timerRef.current = null;
    }, TIMEOUT);
  }, [clearTimer]);

  const handleTouchStart = useCallback(
    (e: ReactTouchEvent<HTMLDivElement>) => {
      if (mode !== "touch" || phase === "selected") return;
      const rect = containerRef.current?.getBoundingClientRect();
      const next = new Map(touches);
      for (let i = 0; i < e.changedTouches.length; i++) {
        const tTouch = e.changedTouches[i]!;
        const id = tTouch.identifier;
        const x = tTouch.clientX - (rect?.left ?? 0);
        const y = tTouch.clientY - (rect?.top ?? 0);
        if (!next.has(id)) {
          if (next.size >= 5) {
            // Switch to manual mode when a 6th touch is attempted
            trackEvent("choasis_mode_changed", { mode: "manual", reason: "touch_limit" });
            setMode("manual");
            setManualPlayersText(String(Math.max(6, next.size + 1)));
            setTouches(new Map());
            setPhase("idle");
            clearTimer();
            return;
          }
          next.set(id, { id, x, y, color: pickColor() });
        }
      }
      if (next.size > 0) {
        setPhase("countdown");
        startTimer(); // restart timer whenever a new touch appears
      }
      setTouches(next);
    },
    [mode, phase, touches, pickColor, startTimer, clearTimer],
  );

  const handleTouchMove = useCallback(
    (e: ReactTouchEvent<HTMLDivElement>) => {
      if (mode !== "touch" || phase === "selected") return;
      const rect = containerRef.current?.getBoundingClientRect();
      const next = new Map(touches);
      for (let i = 0; i < e.changedTouches.length; i++) {
        const tTouch = e.changedTouches[i]!;
        const id = tTouch.identifier;
        const x = tTouch.clientX - (rect?.left ?? 0);
        const y = tTouch.clientY - (rect?.top ?? 0);
        const info = next.get(id);
        if (info) next.set(id, { ...info, x, y });
      }
      setTouches(next);
    },
    [mode, phase, touches],
  );

  const handleTouchEnd = useCallback(
    (e: ReactTouchEvent<HTMLDivElement>) => {
      if (mode !== "touch" || phase === "selected") return;
      const next = new Map(touches);
      for (let i = 0; i < e.changedTouches.length; i++) {
        const tTouch = e.changedTouches[i]!;
        next.delete(tTouch.identifier);
      }
      setTouches(next);
      if (next.size === 0) {
        setPhase("idle");
        clearTimer();
      }
    },
    [mode, phase, touches, clearTimer],
  );

  const resetAll = useCallback(() => {
    setSelectedId(null);
    setSelectedColor(null);
    setTouches(new Map());
    setPhase("idle");
    clearTimer();
  }, [clearTimer]);

  // countdown number removed from UI for a cleaner experience

  // selection expansion: compute final scale dynamically
  const getFinalScale = useCallback(
    (x: number, y: number, baseRadius: number) => {
      if (typeof window === "undefined") return 20; // SSR fallback
      const w = window.innerWidth;
      const h = window.innerHeight;
      const distances = [
        Math.hypot(x - 0, y - 0),
        Math.hypot(x - w, y - 0),
        Math.hypot(x - 0, y - h),
        Math.hypot(x - w, y - h),
      ];
      const far = Math.max(...distances);
      return (far + 40) / baseRadius; // little margin
    },
    [],
  );

  const circles = [...touches.values()];
  const selected = selectedId != null ? touches.get(selectedId) : null;

  return (
    <>
      <NavBar
        right={({ requestClose }) => (
          <div className="grid w-full gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                {t("choasisMenuTitle")}
              </p>
              <p className="mt-1 text-sm leading-5 text-[var(--text-muted)]">
                {t("choasisMenuDescription")}
              </p>
            </div>
            <button
              onClick={() => {
                const nextMode = mode === "touch" ? "manual" : "touch";
                trackEvent("choasis_mode_changed", { mode: nextMode, reason: "user" });
                setMode(nextMode);
                resetAll();
                setManualResult(null);
                setRaffleActive(false);
                setHighlightIndex(null);
                clearRaffle();
                requestClose();
              }}
              className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-primary/80"
            >
              {mode === "touch" ? <FaKeyboard aria-hidden /> : <MdTouchApp aria-hidden />}
              {mode === "touch" ? t("choasisToManual") : t("choasisToTouch")}
            </button>
          </div>
        )}
      />
      <main
        className="bg-[var(--background)] text-[var(--foreground)]"
        style={{
          height:
            "calc(var(--choasis-vh, 100dvh) - 6.5rem - env(safe-area-inset-bottom))",
        }}
      >
        <div
          ref={containerRef}
          className={`relative mx-auto h-full w-full overflow-hidden select-none ${
            mode === "touch" ? "touch-none" : ""
          }`}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
          onClick={phase === "selected" ? resetAll : undefined}
        >
          {mode === "manual" && (
            <div className="absolute inset-0 flex flex-col items-center justify-start pt-8 md:pt-10 lg:pt-12">
              <div className="flex flex-col items-center gap-4 px-8 text-center max-w-[92vw] md:max-w-[48rem]">
                <p className="text-xl md:text-2xl font-semibold text-[var(--foreground)]/90">
                  {t("choasisManualTitle")}
                </p>
                {/* Fixed-height result display to avoid layout shift */}
                <div className="h-16 flex items-center justify-center">
                  <span
                    className={`text-5xl md:text-6xl font-extrabold tracking-tight ${
                      manualResult != null
                        ? "text-primary"
                        : "text-[var(--foreground)]/30"
                    }`}
                  >
                    {manualResult != null ? manualResult : "?"}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <label
                    className="text-sm md:text-base"
                    htmlFor="manualPlayers"
                  >
                    {t("choasisManualPlayersLabel")}:
                  </label>
                  <input
                    id="manualPlayers"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="1-100"
                    value={manualPlayersText}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/[^0-9]/g, "");
                      setManualPlayersText(digits);
                      // If current selection is out of range, clear it on the fly
                      const next = parseInt(digits || "0", 10);
                      if (
                        !Number.isNaN(next) &&
                        manualResult &&
                        manualResult > next
                      ) {
                        setManualResult(null);
                      }
                    }}
                    onBlur={() => {
                      // Clamp on blur and normalize empty to ""
                      const n = manualPlayers;
                      trackEvent("choasis_player_count_set", { mode: "manual" }, { playerCount: n });
                      setManualPlayersText(n > 0 ? String(n) : "");
                    }}
                    className="w-28 rounded-md border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] px-3 py-2 shadow-sm text-center"
                  />
                  <button
                    disabled={raffleActive || (manualPlayers | 0) < 1}
                    onClick={() => {
                      if (raffleActive) return;
                      const n = manualPlayers | 0;
                      if (n < 1) return;
                      setManualResult(null);
                      setRaffleActive(true);
                      // initial highlight
                      const initial = Math.floor(Math.random() * n) + 1;
                      setHighlightIndex(initial);
                      clearRaffle();
                      raffleIntervalRef.current = window.setInterval(() => {
                        const count = Math.max(
                          1,
                          Math.min(100, manualPlayers | 0),
                        );
                        let next = Math.floor(Math.random() * count) + 1;
                        setHighlightIndex((prev) => {
                          if (prev && next === prev) {
                            next = next % count || count;
                          }
                          return next;
                        });
                      }, 90);
                      raffleTimeoutRef.current = window.setTimeout(() => {
                        const finalPick = Math.floor(Math.random() * n) + 1;
                        trackEvent("choasis_selection_completed", { mode: "manual" }, { playerCount: n });
                        clearRaffle();
                        setHighlightIndex(finalPick);
                        setManualResult(finalPick);
                        setRaffleActive(false);
                      }, TIMEOUT);
                    }}
                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/80 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {t("choasisManualRandomize")}
                  </button>
                </div>
                {/* Players grid (non-interactive items) */}
                <div className="mt-2 w-full">
                  <div
                    className={`mx-auto grid ${columnsClass} gap-1.5 max-w-[28rem]`}
                  >
                    {Array.from({ length: manualPlayers }, (_, i) => i + 1).map(
                      (idx) => {
                        const isSelected = raffleActive
                          ? highlightIndex === idx
                          : manualResult === idx;
                        const sizeClass =
                          manualPlayers <= 16
                            ? "text-3xl sm:text-4xl md:text-5xl"
                            : "text-base text-lg";
                        return (
                          <div
                            key={idx}
                            className={`flex items-center justify-center aspect-square rounded p-1 sm:p-1.5 md:p-2 ${
                              isSelected
                                ? "bg-primary/10 ring-1 ring-primary"
                                : "bg-[var(--surface)]/60"
                            }`}
                          >
                            <span
                              className={
                                (isSelected
                                  ? "text-primary"
                                  : "text-[var(--foreground)]/80") +
                                " " +
                                sizeClass +
                                " font-semibold leading-none select-none"
                              }
                            >
                              {idx}
                            </span>
                          </div>
                        );
                      },
                    )}
                  </div>
                </div>
                {/* Bottom label removed to keep focus on big result */}
              </div>
            </div>
          )}
          {/* Placeholder (touch mode) */}
          {mode === "touch" && phase === "idle" && circles.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="flex flex-col items-center gap-3 px-8 text-center max-w-[92vw] md:max-w-[48rem]">
                <MdTouchApp
                  aria-hidden
                  className="text-5xl md:text-6xl select-none opacity-90"
                />
                <p className="text-xl md:text-2xl font-semibold text-[var(--foreground)]/90">
                  {t("choasisPlaceholder")}
                </p>
                <p className="text-sm md:text-base text-[var(--foreground)]/70">
                  <span className="mr-1">{t("choasisMoreThanFive")}</span>
                  <span>{t("choasisManualHintMenu")}</span>
                </p>
              </div>
            </div>
          )}

          {/* Countdown hint removed intentionally */}

          {/* Touch circles */}
          {mode === "touch" && (
            <div className="absolute inset-0">
              {circles.map((c) => {
                const size = 120; // base circle size (bigger for visibility under finger)
                const baseRadius = size / 2;
                const isSelected = selected && c.id === selected.id;
                const finalScale = isSelected
                  ? getFinalScale(c.x, c.y, baseRadius)
                  : 1;
                const animClass =
                  phase === "selected"
                    ? isSelected
                      ? "choasis-beat-expand"
                      : "choasis-shrink"
                    : "choasis-pulse";
                const style: React.CSSProperties & {
                  [key: string]: string | number;
                } = {
                  left: c.x - baseRadius,
                  top: c.y - baseRadius,
                  width: size,
                  height: size,
                  background: c.color,
                };
                style["--choasis-final-scale"] = String(finalScale);
                return (
                  <div
                    key={c.id}
                    className={`pointer-events-none absolute rounded-full shadow-lg choasis-circle ${animClass}`}
                    style={style}
                  />
                );
              })}
            </div>
          )}

          {/* Color fill overlay after selection */}
          {mode === "touch" && phase === "selected" && selectedColor && (
            <div
              className="pointer-events-auto absolute inset-0 choasis-overlay"
              style={{ background: selectedColor }}
            >
              <div className="absolute inset-0 flex items-center justify-center px-8 text-center">
                <span className="text-xl md:text-2xl font-semibold text-white drop-shadow max-w-[92vw] md:max-w-[48rem] break-words">
                  {t("choasisResetHint")}
                </span>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Animations */}
      <style jsx global>{`
        /* Solid circle base: no masks, no gradients */
        .choasis-circle {
          transform-origin: center center;
          will-change: transform, opacity;
          opacity: 0.95;
        }

        /* Countdown gentle pulse (slightly faster and larger) */
        .choasis-pulse {
          animation: choasis-pulse 1000ms ease-in-out infinite;
        }
        @keyframes choasis-pulse {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.09);
          }
        }

        /* One bigger heartbeat (after a short pause), then expand to cover */
        .choasis-beat-expand {
          animation:
            choasis-beat-once 480ms ease-out 120ms,
            choasis-expand 1200ms cubic-bezier(0.2, 0.8, 0.2, 1) 720ms forwards;
        }
        @keyframes choasis-beat-once {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.22);
          }
          100% {
            transform: scale(1);
          }
        }
        @keyframes choasis-expand {
          from {
            transform: scale(1);
          }
          to {
            transform: scale(var(--choasis-final-scale, 24));
          }
        }

        /* Non-selected circles shrink and fade out */
        .choasis-shrink {
          animation: choasis-shrink 420ms ease-out forwards;
        }
        @keyframes choasis-shrink {
          from {
            transform: scale(1);
            opacity: 0.95;
          }
          to {
            transform: scale(0.6);
            opacity: 0;
          }
        }

        /* Overlay fade-in for the selected color */
        .choasis-overlay {
          animation: choasis-overlay-fade 260ms ease-out both;
          animation-delay: 720ms; /* show overlay after beat pause begins expand */
        }
        @keyframes choasis-overlay-fade {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}
