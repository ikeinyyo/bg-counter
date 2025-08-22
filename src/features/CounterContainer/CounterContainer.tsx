"use client";

import { useState, useEffect } from "react";
import { Counter } from "./Counter/Counter";
import { CounterConfig } from "./domain";
import { FaFaceRollingEyes } from "react-icons/fa6";

type Props = {
  countersDefault: CounterConfig[];
  onDelete: (id: string) => void;
  onUpdate: (updated: CounterConfig) => void;
};

const CounterContainer = ({ countersDefault, onDelete, onUpdate }: Props) => {
  const [counters, setCounters] = useState<CounterConfig[]>(countersDefault);

  useEffect(() => setCounters(countersDefault), [countersDefault]);

  const sizeToClass = {
    small: "col-span-1 md:col-span-1 lg:col-span-3",
    medium: "col-span-2 md:col-span-2 lg:col-span-4",
    medium2small: "col-span-1 md:col-span-2 lg:col-span-4",
    medium2large: "col-span-2 md:col-span-4 lg:col-span-4",
    large: "col-span-2 md:col-span-4 lg:col-span-6",
    large2small: "col-span-1 md:col-span-2 lg:col-span-6",
    full: "col-span-2 md:col-span-4 lg:col-span-12",
    small2medium: "col-span-1 md:col-span-2 lg:col-span-3",
  } as const;

  const spanBySize: Record<CounterConfig["size"], number> = {
    small: 3,
    medium: 4,
    large: 6,
    medium2small: 4,
    large2small: 6,
    full: 12,
    medium2large: 6,
    small2medium: 3,
  };

  return (
    <main className="p-2 md:p-4 bg-gray-100 min-h-[calc(100vh-3.5rem-2rem)]">
      <div className="max-w-7xl mx-auto">
        {counters.length === 0 ? (
          <div className="text-xl text-dark mt-32 text-center">
            <FaFaceRollingEyes className="mx-auto text-6xl text-dark/80" />
            <br />
            No hay contadores. Añade uno para comenzar o selecciona una
            plantilla.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-12 grid-flow-dense gap-2 md:gap-4 lg:gap-6">
            {counters.map((counter) => {
              const span = spanBySize[counter.size];
              return (
                <div
                  key={counter.id}
                  className={sizeToClass[counter.size]}
                  style={{
                    gridColumnEnd: `span ${span}`,
                  }}
                >
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
