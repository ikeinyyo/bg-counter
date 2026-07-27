"use client";

import { useState, useEffect } from "react";
import { Counter } from "./Counter/Counter";
import { CounterConfig } from "./domain";
import { FaFaceRollingEyes } from "react-icons/fa6";
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
    <main className="min-h-[calc(100vh-3.5rem-2rem)] bg-[var(--surface-muted)] p-2 md:p-4">
      <div className="max-w-7xl mx-auto">
        {counters.length === 0 ? (
          <div className="mt-32 text-center text-xl text-[var(--foreground)]">
            <FaFaceRollingEyes className="mx-auto text-6xl text-[var(--foreground)]/80" />
            <br />
            {t("emptyCounters")}
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
