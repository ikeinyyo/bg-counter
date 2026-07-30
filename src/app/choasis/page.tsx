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

export default function ChoasisPage() {
  const { t } = useSettings();

  const computedTitle = useMemo(
    () => `Juernes de Mesa — ${t("choasisTitle")}`,
    [t],
  );

  const containerRef = useRef<HTMLDivElement | null>(null);
  const timerRef = useRef<number | null>(null);

  const [touches, setTouches] = useState<Map<number, TouchInfo>>(new Map());
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [phase, setPhase] = useState<"idle" | "countdown" | "selected">("idle");
  const [countdownEndsAt, setCountdownEndsAt] = useState<number | null>(null);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.title = computedTitle;
    }
  }, [computedTitle]);

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
    setCountdownEndsAt(null);
  }, []);

  const startTimer = useCallback(() => {
    clearTimer();
    // 4 seconds from now
    const endsAt = Date.now() + 4000;
    setCountdownEndsAt(endsAt);
    timerRef.current = window.setTimeout(() => {
      // When timer fires, pick one of the active touches (if any)
      setPhase((prev) => (prev === "selected" ? prev : "selected"));
      setTouches((prev) => {
        const ids = [...prev.keys()];
        if (ids.length === 0) return prev;
        const id = ids[Math.floor(Math.random() * ids.length)];
        const info = prev.get(id)!;
        setSelectedId(id);
        setSelectedColor(info.color);
        return prev;
      });
      timerRef.current = null;
    }, 4000);
  }, [clearTimer]);

  const handleTouchStart = useCallback(
    (e: ReactTouchEvent<HTMLDivElement>) => {
      if (phase === "selected") return;
      const rect = containerRef.current?.getBoundingClientRect();
      const next = new Map(touches);
      for (let i = 0; i < e.changedTouches.length; i++) {
        const tTouch = e.changedTouches.item(i)!;
        const id = tTouch.identifier;
        const x = tTouch.clientX - (rect?.left ?? 0);
        const y = tTouch.clientY - (rect?.top ?? 0);
        if (!next.has(id)) {
          next.set(id, { id, x, y, color: pickColor() });
        }
      }
      if (next.size > 0) {
        setPhase("countdown");
        startTimer(); // restart timer whenever a new touch appears
      }
      setTouches(next);
    },
    [phase, touches, pickColor, startTimer],
  );

  const handleTouchMove = useCallback(
    (e: ReactTouchEvent<HTMLDivElement>) => {
      if (phase === "selected") return;
      const rect = containerRef.current?.getBoundingClientRect();
      const next = new Map(touches);
      for (let i = 0; i < e.changedTouches.length; i++) {
        const tTouch = e.changedTouches.item(i)!;
        const id = tTouch.identifier;
        const x = tTouch.clientX - (rect?.left ?? 0);
        const y = tTouch.clientY - (rect?.top ?? 0);
        const info = next.get(id);
        if (info) next.set(id, { ...info, x, y });
      }
      setTouches(next);
    },
    [phase, touches],
  );

  const handleTouchEnd = useCallback(
    (e: ReactTouchEvent<HTMLDivElement>) => {
      if (phase === "selected") return;
      const next = new Map(touches);
      for (let i = 0; i < e.changedTouches.length; i++) {
        const tTouch = e.changedTouches.item(i)!;
        next.delete(tTouch.identifier);
      }
      setTouches(next);
      if (next.size === 0) {
        setPhase("idle");
        clearTimer();
      }
    },
    [phase, touches, clearTimer],
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
      if (!containerRef.current) return 20; // fallback
      const rect = containerRef.current.getBoundingClientRect();
      const distances = [
        Math.hypot(x - 0, y - 0),
        Math.hypot(x - rect.width, y - 0),
        Math.hypot(x - 0, y - rect.height),
        Math.hypot(x - rect.width, y - rect.height),
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
      <NavBar />
      <main
        className="bg-[var(--background)] text-[var(--foreground)]"
        style={{
          height:
            "calc(var(--choasis-vh, 100dvh) - 6.5rem - env(safe-area-inset-bottom))",
        }}
      >
        <div
          ref={containerRef}
          className="relative mx-auto h-full w-full overflow-hidden touch-none select-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
          onClick={phase === "selected" ? resetAll : undefined}
        >
          {/* Placeholder */}
          {phase === "idle" && circles.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col items-center gap-3 px-8 text-center max-w-[92vw] md:max-w-[48rem]">
                <MdTouchApp
                  aria-hidden
                  className="text-5xl md:text-6xl select-none opacity-90"
                />
                <p className="text-xl md:text-2xl font-semibold text-[var(--foreground)]/90">
                  {t("choasisPlaceholder")}
                </p>
              </div>
            </div>
          )}

          {/* Countdown hint removed intentionally */}

          {/* Touch circles */}
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

          {/* Color fill overlay after selection */}
          {phase === "selected" && selectedColor && (
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
