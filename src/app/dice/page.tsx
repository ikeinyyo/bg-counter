"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BsDice5 } from "react-icons/bs";
import { useSettings } from "@/context/SettingsContext";
import { NavBar } from "@/features/navbar/NavBar";
import { trackEvent } from "@/lib/telemetry";

const DICE_TYPES = [4, 6, 8, 10, 12, 20, 100] as const;
const PIECE_TYPES = [...DICE_TYPES, "coin"] as const;
const MAX_PIECES_PER_TYPE = 20;
const MAX_HISTORY = 10;
const ROLL_ANIMATION_MS = 700;
const STORAGE_KEY = "bg-counter-dice-roller";

type DieSides = (typeof DICE_TYPES)[number];
type PieceType = (typeof PIECE_TYPES)[number];
type Configuration = Record<PieceType, number>;
type DieResult = { kind: "die"; sides: DieSides; value: number };
type CoinResult = { kind: "coin"; value: "heads" | "tails" };
type Result = DieResult | CoinResult;
type SavedRoll = { id: string; items: Result[]; total: number };

const DEFAULT_CONFIGURATION: Configuration = {
  4: 0,
  6: 1,
  8: 0,
  10: 0,
  12: 0,
  20: 0,
  100: 0,
  coin: 0,
};

function PieceArtwork({ type }: { type: PieceType }) {
  switch (type) {
    case 4:
      return <polygon points="50,5 96,91 4,91" fill="#16a34a" />;
    case 6:
      return <rect x="9" y="9" width="82" height="82" fill="#16b8ca" />;
    case 8:
      return (
        <>
          <polygon points="50,3 92,30 96,76 50,97 4,76 8,30" fill="#6b21a8" />
          <polygon points="50,3 77,76 50,97 23,76" fill="#9333ea" />
          <polygon points="8,30 50,3 23,76 4,76" fill="#7e22ce" />
        </>
      );
    case 10:
      return (
        <>
          <polygon points="50,3 91,38 89,73 50,97 11,73 9,38" fill="#9d174d" />
          <polygon points="50,3 78,73 50,86 22,73" fill="#ec4899" />
          <polygon points="9,38 50,3 22,73 11,73" fill="#be185d" />
        </>
      );
    case 12:
      return (
        <>
          <polygon points="50,3 76,12 94,34 94,66 76,88 50,97 24,88 6,66 6,34 24,12" fill="#b91c1c" />
          <polygon points="50,20 78,39 68,74 32,74 22,39" fill="#ef4444" />
          <polygon points="24,12 50,20 22,39 6,34" fill="#dc2626" />
        </>
      );
    case 20:
      return (
        <>
          <polygon points="50,3 96,32 94,75 50,98 6,75 4,32" fill="#ea580c" />
          <polygon points="50,3 78,75 50,98 22,75" fill="#f97316" />
          <polygon points="4,32 50,3 22,75 6,75" fill="#fb5b0a" />
          <polygon points="4,32 96,32 78,75 22,75" fill="#ff7a00" opacity="0.75" />
        </>
      );
    case 100:
      return (
        <>
          <circle cx="50" cy="50" r="47" fill="#52525b" />
          <circle cx="50" cy="50" r="37" fill="#71717a" />
        </>
      );
    case "coin":
      return (
        <>
          <circle cx="50" cy="50" r="46" fill="#a16207" />
          <circle cx="50" cy="50" r="37" fill="#d4a017" />
          <circle cx="50" cy="50" r="31" fill="none" stroke="#fde68a" strokeWidth="2" />
        </>
      );
  }
}

function PieceFace({
  type,
  result,
  size = "result",
}: {
  type: PieceType;
  result?: number | "heads" | "tails";
  size?: "sample" | "tray" | "result" | "history";
}) {
  const { t } = useSettings();
  const sizeClass = {
    sample: "h-14 w-14",
    tray: "h-11 w-11",
    result: "h-16 w-16",
    history: "h-10 w-10",
  }[size];
  const label =
    type === "coin"
      ? result === "heads"
        ? t("diceHeadsShort")
        : result === "tails"
          ? t("diceTailsShort")
          : t("diceCoinShort")
      : result ?? type;
  const fontSize = String(label).length >= 3 ? 21 : 31;

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 100 100"
      className={`${sizeClass} shrink-0 overflow-visible drop-shadow-sm`}
    >
      <PieceArtwork type={type} />
      <text
        x="50"
        y={type === 4 ? "68" : "61"}
        textAnchor="middle"
        fill="white"
        fontWeight="800"
        fontSize={fontSize}
      >
        {label}
      </text>
    </svg>
  );
}

const isDieSides = (value: unknown): value is DieSides =>
  typeof value === "number" && DICE_TYPES.includes(value as DieSides);

const normalizeQuantity = (value: unknown) => {
  const quantity = Number(value);
  return Number.isFinite(quantity)
    ? Math.min(MAX_PIECES_PER_TYPE, Math.max(0, Math.trunc(quantity)))
    : 0;
};

const parseResult = (item: unknown): Result | null => {
  if (typeof item !== "object" || item === null) return null;
  const candidate = item as Partial<Result> & { sides?: unknown; value?: unknown };
  // Migrate rolls saved by the previous dice-only format.
  if (
    (candidate.kind === "die" || candidate.kind === undefined) &&
    isDieSides(candidate.sides) &&
    Number.isInteger(candidate.value) &&
    Number(candidate.value) >= 1 &&
    Number(candidate.value) <= candidate.sides
  ) {
    return { kind: "die", sides: candidate.sides, value: Number(candidate.value) };
  }
  if (
    candidate.kind === "coin" &&
    (candidate.value === "heads" || candidate.value === "tails")
  ) {
    return { kind: "coin", value: candidate.value };
  }
  return null;
};

const getInitialState = (): { configuration: Configuration; history: SavedRoll[] } => {
  if (typeof window === "undefined") {
    return { configuration: DEFAULT_CONFIGURATION, history: [] };
  }
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return { configuration: DEFAULT_CONFIGURATION, history: [] };
    const parsed = JSON.parse(stored) as {
      configuration?: Record<string, unknown>;
      history?: Array<{ id?: unknown; items?: unknown[]; dice?: unknown[] }>;
    };
    const configuration = Object.fromEntries(
      PIECE_TYPES.map((type) => [
        type,
        normalizeQuantity(parsed.configuration?.[type] ?? DEFAULT_CONFIGURATION[type]),
      ]),
    ) as Configuration;
    const history = Array.isArray(parsed.history)
      ? parsed.history
          .map((roll, index) => {
            const items = (roll.items ?? roll.dice ?? [])
              .map(parseResult)
              .filter((item): item is Result => item !== null);
            return {
              id:
                typeof roll.id === "string"
                  ? roll.id
                  : `legacy-${index}-${Date.now()}`,
              items,
              total: items.reduce(
                (sum, item) => sum + (item.kind === "die" ? item.value : 0),
                0,
              ),
            };
          })
          .filter((roll) => roll.items.length > 0)
          .slice(0, MAX_HISTORY)
      : [];
    return { configuration, history };
  } catch {
    return { configuration: DEFAULT_CONFIGURATION, history: [] };
  }
};

const rollPiece = (type: PieceType): Result =>
  type === "coin"
    ? { kind: "coin", value: Math.random() < 0.5 ? "heads" : "tails" }
    : { kind: "die", sides: type, value: Math.floor(Math.random() * type) + 1 };

const resultType = (result: Result): PieceType =>
  result.kind === "coin" ? "coin" : result.sides;

export default function DicePage() {
  const { t } = useSettings();
  const [initialState] = useState(getInitialState);
  const [configuration, setConfiguration] = useState(initialState.configuration);
  const [history, setHistory] = useState(initialState.history);
  const [displayedResults, setDisplayedResults] = useState<Result[]>(
    initialState.history[0]?.items ?? [],
  );
  const [isRolling, setIsRolling] = useState(false);
  const animationIntervalRef = useRef<number | null>(null);
  const animationTimeoutRef = useRef<number | null>(null);

  const clearAnimation = useCallback(() => {
    if (animationIntervalRef.current !== null) {
      window.clearInterval(animationIntervalRef.current);
      animationIntervalRef.current = null;
    }
    if (animationTimeoutRef.current !== null) {
      window.clearTimeout(animationTimeoutRef.current);
      animationTimeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    document.title = `Juernes de Mesa — ${t("diceTitle")}`;
  }, [t]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ configuration, history }),
      );
    } catch {
      // The roller remains available if storage is unavailable.
    }
  }, [configuration, history]);

  useEffect(() => clearAnimation, [clearAnimation]);

  const selectedPieces = useMemo(
    () =>
      PIECE_TYPES.flatMap((type) =>
        Array.from({ length: configuration[type] }, () => type),
      ),
    [configuration],
  );
  const total = displayedResults.reduce(
    (sum, item) => sum + (item.kind === "die" ? item.value : 0),
    0,
  );
  const hasDiceResult = displayedResults.some((item) => item.kind === "die");

  const addPiece = (type: PieceType) => {
    if (isRolling || configuration[type] >= MAX_PIECES_PER_TYPE) return;
    trackEvent("dice_piece_added", { pieceType: type });
    setConfiguration((current) => ({ ...current, [type]: current[type] + 1 }));
  };

  const removePiece = (type: PieceType) => {
    if (isRolling || configuration[type] === 0) return;
    trackEvent("dice_piece_removed", { pieceType: type });
    setConfiguration((current) => ({ ...current, [type]: current[type] - 1 }));
  };

  const resetConfiguration = () => {
    if (isRolling) return;
    trackEvent("dice_configuration_reset", {}, { pieceCount: selectedPieces.length });
    setConfiguration(
      Object.fromEntries(PIECE_TYPES.map((type) => [type, 0])) as Configuration,
    );
  };

  const roll = () => {
    if (selectedPieces.length === 0 || isRolling) return;
    clearAnimation();
    const finalResults = selectedPieces.map(rollPiece);
    const animate = () => setDisplayedResults(selectedPieces.map(rollPiece));
    setIsRolling(true);
    animate();
    animationIntervalRef.current = window.setInterval(animate, 80);
    animationTimeoutRef.current = window.setTimeout(() => {
      clearAnimation();
      setDisplayedResults(finalResults);
      setIsRolling(false);
      const savedRoll: SavedRoll = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        items: finalResults,
        total: finalResults.reduce(
          (sum, item) => sum + (item.kind === "die" ? item.value : 0),
          0,
        ),
      };
      const diceResults = finalResults.filter(
        (item): item is DieResult => item.kind === "die",
      );
      const coinResults = finalResults.filter(
        (item): item is CoinResult => item.kind === "coin",
      );
      trackEvent(
        "dice_rolled",
        {
          configuration: PIECE_TYPES.filter((type) => configuration[type] > 0)
            .map((type) => `${type}:${configuration[type]}`)
            .join(","),
        },
        {
          pieceCount: finalResults.length,
          diceCount: diceResults.length,
          coinCount: coinResults.length,
          diceTotal: savedRoll.total,
          headsCount: coinResults.filter((item) => item.value === "heads").length,
        },
      );
      setHistory((current) => [savedRoll, ...current].slice(0, MAX_HISTORY));
    }, ROLL_ANIMATION_MS);
  };

  const resultLabel = (item: Result) =>
    item.kind === "coin"
      ? `${t("diceCoin")}: ${t(item.value === "heads" ? "diceHeads" : "diceTails")}`
      : `d${item.sides}: ${item.value}`;

  return (
    <>
      <NavBar />
      <main
        className="bg-[var(--background)] px-3 py-5 text-[var(--foreground)] sm:px-4 sm:py-6"
        style={{ minHeight: "calc(var(--app-vh, 100dvh) - 3.5rem - var(--app-bottom-space) - env(safe-area-inset-bottom))" }}
      >
        <div className="mx-auto flex max-w-4xl flex-col gap-5">
          <header className="text-center">
            <h1 className="text-3xl font-semibold tracking-tight">{t("diceTitle")}</h1>
            <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">{t("diceDescription")}</p>
          </header>

          <section aria-labelledby="dice-picker-title">
            <h2 id="dice-picker-title" className="mb-3 text-lg font-semibold">{t("dicePicker")}</h2>
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
              {PIECE_TYPES.map((type) => {
                const name = type === "coin" ? t("diceCoin") : `d${type}`;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => addPiece(type)}
                    disabled={isRolling || configuration[type] >= MAX_PIECES_PER_TYPE}
                    aria-label={`${t("diceAdd")} ${name}`}
                    className="relative flex min-h-20 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2 shadow-sm transition-transform active:scale-95 disabled:opacity-40"
                  >
                    <PieceFace type={type} size="sample" />
                    {configuration[type] > 0 && (
                      <span className="absolute right-1 top-1 flex h-6 min-w-6 items-center justify-center rounded-full bg-[var(--foreground)] px-1 text-xs font-bold text-[var(--background)]">
                        {configuration[type]}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          <section aria-labelledby="dice-tray-title" className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3 shadow-sm">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 id="dice-tray-title" className="text-lg font-semibold">{t("diceConfiguration")}</h2>
              <button
                type="button"
                onClick={resetConfiguration}
                disabled={isRolling || selectedPieces.length === 0}
                className="text-sm font-medium text-primary hover:underline disabled:opacity-40"
              >
                {t("diceResetConfiguration")}
              </button>
            </div>
            {selectedPieces.length === 0 ? (
              <p className="py-4 text-center text-sm text-[var(--text-muted)]">{t("diceEmptyTray")}</p>
            ) : (
              <div className="flex flex-wrap justify-center gap-2">
                {selectedPieces.map((type, index) => {
                  const name = type === "coin" ? t("diceCoin") : `d${type}`;
                  return (
                    <button
                      key={`${type}-${index}`}
                      type="button"
                      onClick={() => removePiece(type)}
                      disabled={isRolling}
                      aria-label={`${t("diceRemove")} ${name}`}
                      className="rounded-lg transition-transform active:scale-90"
                    >
                      <PieceFace type={type} size="tray" />
                    </button>
                  );
                })}
              </div>
            )}
          </section>

          <button
            type="button"
            onClick={roll}
            disabled={selectedPieces.length === 0 || isRolling}
            className="mx-auto flex min-h-12 w-full max-w-sm items-center justify-center gap-3 rounded-xl bg-primary px-6 py-3 text-lg font-semibold text-white shadow-md transition-transform active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <BsDice5 aria-hidden className={isRolling ? "dice-roll-icon" : ""} size={25} />
            {isRolling ? t("diceRolling") : t("diceRoll")}
          </button>

          <section aria-live="polite" aria-busy={isRolling} className="min-h-40 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm">
            {displayedResults.length === 0 ? (
              <div className="flex min-h-32 flex-col items-center justify-center gap-2 text-center text-[var(--text-muted)]">
                <BsDice5 aria-hidden size={38} />
                <p>{t("diceEmptyResult")}</p>
              </div>
            ) : (
              <>
                <div className="flex flex-wrap justify-center gap-2">
                  {displayedResults.map((item, index) => (
                    <div
                      key={`${resultType(item)}-${index}`}
                      aria-label={`${t("diceResult")} ${resultLabel(item)}`}
                      className={isRolling ? "dice-result-rolling" : ""}
                    >
                      <PieceFace type={resultType(item)} result={item.value} />
                    </div>
                  ))}
                </div>
                {hasDiceResult && (
                  <>
                    <p className="mt-4 text-center text-sm font-medium text-[var(--text-muted)]">{t("diceTotal")}</p>
                    <p className="text-center text-5xl font-black text-primary" data-testid="dice-total">{total}</p>
                  </>
                )}
              </>
            )}
          </section>

          {history.length > 0 && (
            <section aria-labelledby="dice-history-title">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h2 id="dice-history-title" className="text-lg font-semibold">{t("diceHistory")}</h2>
                <button
                  type="button"
                  onClick={() => {
                    trackEvent("dice_history_cleared", {}, { rollCount: history.length });
                    setHistory([]);
                  }}
                  className="text-sm font-medium text-primary hover:underline"
                >{t("diceClearHistory")}</button>
              </div>
              <ol className="space-y-2">
                {history.map((savedRoll, index) => {
                  const containsDice = savedRoll.items.some((item) => item.kind === "die");
                  return (
                    <li key={savedRoll.id} className="flex items-center justify-between gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2">
                      <div className="flex min-w-0 flex-wrap items-center gap-1.5">
                        <span className="mr-1 text-sm text-[var(--text-muted)]">{index + 1}.</span>
                        {savedRoll.items.map((item, itemIndex) => (
                          <span key={`${savedRoll.id}-${itemIndex}`} aria-label={`${t("diceResult")} ${resultLabel(item)}`}>
                            <PieceFace type={resultType(item)} result={item.value} size="history" />
                          </span>
                        ))}
                      </div>
                      {containsDice && <strong className="shrink-0 text-xl text-primary">{savedRoll.total}</strong>}
                    </li>
                  );
                })}
              </ol>
            </section>
          )}
        </div>
      </main>

      <style jsx global>{`
        @keyframes dice-result-roll {
          0% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(12deg); }
          100% { transform: translateY(0) rotate(0deg); }
        }
        @keyframes dice-icon-roll { to { transform: rotate(360deg); } }
        .dice-result-rolling { animation: dice-result-roll 320ms ease-in-out infinite; }
        .dice-roll-icon { animation: dice-icon-roll 450ms linear infinite; }
        @media (prefers-reduced-motion: reduce) {
          .dice-result-rolling, .dice-roll-icon { animation: none; }
        }
      `}</style>
    </>
  );
}
