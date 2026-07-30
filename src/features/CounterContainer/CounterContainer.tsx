"use client";

import { useState, useEffect } from "react";
import { Counter } from "./Counter/Counter";
import { CounterConfig } from "./domain";
import { MdAddBox } from "react-icons/md";
import { useBreakpoint } from "../../hooks/useBreakpoint";
import { useTranslation } from "@/context/SettingsContext";

type Props = {
  countersDefault: CounterConfig[];
  onDelete: (id: string) => void;
  onUpdate: (updated: CounterConfig) => void;
};

const CounterContainer = ({ countersDefault, onDelete, onUpdate }: Props) => {
  const [counters, setCounters] = useState<CounterConfig[]>(countersDefault);
  const { t } = useTranslation();

  useEffect(() => setCounters(countersDefault), [countersDefault]);

  const sizeToClass = (counter: CounterConfig) => {
    const xsSpan = 12 / (counter.xsElementsPerRow || 2);
    const mdSpan = 12 / (counter.mdElementsPerRow || 2);
    const lgSpan = 12 / (counter.lgElementsPerRow || 1);
    return `col-span-${xsSpan} md:col-span-${mdSpan} lg:col-span-${lgSpan}`;
  };

  const breakpoint = useBreakpoint();

  const spanBySize = (counter: CounterConfig) => {
    if (breakpoint.isLg) {
      return 12 / (counter.lgElementsPerRow || 2);
    } else if (breakpoint.isMd) {
      return 12 / (counter.mdElementsPerRow || 2);
    } else {
      return 12 / (counter.xsElementsPerRow || 1);
    }
  };

  return (
    <main
      className="bg-[var(--surface-muted)] p-2 md:p-4"
      style={{
        minHeight: "calc(var(--app-vh, 100dvh) - 3.5rem - 3rem)",
      }}
    >
      <div className="max-w-7xl mx-auto">
        {counters.length === 0 ? (
          <div
            className="flex items-center justify-center"
            style={{ minHeight: "calc(var(--app-vh, 100dvh) - 3.5rem - 3rem)" }}
          >
            <div className="flex flex-col items-center gap-3 px-8 text-center max-w-[92vw] md:max-w-[48rem]">
              <MdAddBox
                aria-hidden
                className="text-6xl text-[var(--foreground)]/80"
              />
              <p className="text-xl md:text-2xl font-semibold text-[var(--foreground)]/90">
                {t("emptyCounters")}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-12 grid-flow-dense gap-2 md:gap-4 lg:gap-6">
            {counters.map((counter) => {
              const span = spanBySize(counter);
              return (
                <div key={counter.id} className={sizeToClass(counter)}>
                  <Counter
                    counter={counter}
                    span={span}
                    onDelete={onDelete}
                    onUpdate={onUpdate}
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
