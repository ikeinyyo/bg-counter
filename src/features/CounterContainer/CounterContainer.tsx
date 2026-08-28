"use client";

import { Counter } from "./Counter/Counter";
import { CounterConfig, getCounterRowCount } from "./domain";
import type { CSSProperties } from "react";
import { BsEmojiFrown, BsPlusCircle } from "react-icons/bs";
import { useTranslation } from "@/context/SettingsContext";
import { trackEvent } from "@/lib/telemetry";

type Props = {
  countersDefault: CounterConfig[];
  onDelete: (id: string) => void;
  onUpdate: (updated: CounterConfig) => void;
  onDuplicate: (counter: CounterConfig) => void;
  onAdd: () => void;
};

const CounterContainer = ({
  countersDefault,
  onDelete,
  onUpdate,
  onDuplicate,
  onAdd,
}: Props) => {
  const { t } = useTranslation();
  const mobileRowCount = getCounterRowCount(countersDefault, "xs");
  const mobileGridStyle = {
    "--counter-row-count": mobileRowCount,
    "--counter-value-size": mobileRowCount >= 4 ? "3.5rem" : mobileRowCount === 3 ? "4.25rem" : "5rem",
    "--counter-symbol-size": mobileRowCount >= 4 ? "2.25rem" : mobileRowCount === 3 ? "2.625rem" : "3rem",
  } as CSSProperties;

  const spans = (elementsPerRow: number | undefined, fallback: number) => {
    const safe = [1, 2, 3, 4, 6].includes(elementsPerRow ?? 0)
      ? (elementsPerRow as number)
      : fallback;
    return 12 / safe;
  };

  const sizeToClass = (counter: CounterConfig) => {
    const xsClasses = {
      2: "col-span-2",
      3: "col-span-3",
      4: "col-span-4",
      6: "col-span-6",
      12: "col-span-12",
    } as const;
    const mdClasses = {
      2: "md:col-span-2",
      3: "md:col-span-3",
      4: "md:col-span-4",
      6: "md:col-span-6",
      12: "md:col-span-12",
    } as const;
    const lgClasses = {
      2: "lg:col-span-2",
      3: "lg:col-span-3",
      4: "lg:col-span-4",
      6: "lg:col-span-6",
      12: "lg:col-span-12",
    } as const;
    const xs = spans(counter.xsElementsPerRow, 1) as keyof typeof xsClasses;
    const md = spans(counter.mdElementsPerRow, 2) as keyof typeof mdClasses;
    const lg = spans(counter.lgElementsPerRow, 2) as keyof typeof lgClasses;
    return `${xsClasses[xs]} ${mdClasses[md]} ${lgClasses[lg]}`;
  };

  return (
    <main
      className="bg-[var(--surface-muted)] p-2 md:p-4"
      style={{
        minHeight:
          "calc(var(--app-vh, 100dvh) - 3.5rem - env(safe-area-inset-top) - var(--app-bottom-space) - env(safe-area-inset-bottom))",
      }}
    >
      <div className="max-w-7xl mx-auto">
        {countersDefault.length === 0 ? (
          <div
            className="flex items-center justify-center"
            style={{
              minHeight:
                "calc(var(--app-vh, 100dvh) - 3.5rem - var(--app-bottom-space) - env(safe-area-inset-bottom))",
            }}
          >
            <div className="flex flex-col items-center gap-3 px-8 text-center max-w-[92vw] md:max-w-[48rem]">
              <BsEmojiFrown
                aria-hidden
                className="text-6xl text-[var(--foreground)]/80"
              />
              <p className="text-xl md:text-2xl font-semibold text-[var(--foreground)]/90">
                {t("emptyCounters")}
              </p>
              <p className="text-sm md:text-base leading-6 text-[var(--text-muted)]">
                {t("emptyCountersHint")}
              </p>
              <button
                type="button"
                onClick={() => {
                  trackEvent("counter_added", { source: "empty_state" }, { counterCount: 1 });
                  onAdd();
                }}
                className="mt-2 flex min-h-11 items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-primary/85 active:scale-[0.98]"
              >
                <BsPlusCircle aria-hidden />
                {t("emptyAddCounter")}
              </button>
            </div>
          </div>
        ) : (
          <div className="counter-grid grid grid-flow-dense grid-cols-12 gap-2 md:gap-4 lg:gap-6" style={mobileGridStyle}>
            {countersDefault.map((counter) => {
              return (
                <div
                  key={counter.id}
                  className={`counter-cell ${sizeToClass(counter)}`}
                >
                  <Counter
                    counter={counter}
                    onDelete={onDelete}
                    onUpdate={onUpdate}
                    onDuplicate={onDuplicate}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
};

export { CounterContainer };
