"use client";

import { useState, useEffect } from "react";
import { Counter } from "./Counter";
import { CounterConfig } from "./CounterConfig";
import { FaFaceRollingEyes } from "react-icons/fa6";

/* -------------------- utilidades -------------------- */

/** nº de columnas que ocupa cada tamaño (en un grid de 12 col). */
const spanBySize: Record<CounterConfig["size"], number> = {
  small: 3,
  medium: 4,
  large: 6,
  medium2small: 4,
  large2small: 6,
  full: 12,
  medium2large: 6,
};

/* --------------------- componente -------------------- */

type Props = {
  countersDefault: CounterConfig[];
  onDelete: (id: string) => void;
  onUpdate: (updated: CounterConfig) => void;
};

export const CounterContainer = ({
  countersDefault,
  onDelete,
  onUpdate,
}: Props) => {
  const [counters, setCounters] = useState<CounterConfig[]>(countersDefault);

  /* sincroniza con props externas */
  useEffect(() => setCounters(countersDefault), [countersDefault]);

  const sizeToClass = {
    small: "col-span-1 md:col-span-1 lg:col-span-3",
    medium: "col-span-2 md:col-span-2 lg:col-span-4",
    medium2small: "col-span-1 md:col-span-2 lg:col-span-4",
    medium2large: "col-span-2 md:col-span-4 lg:col-span-4",
    large: "col-span-2 md:col-span-4 lg:col-span-6",
    large2small: "col-span-1 md:col-span-2 lg:col-span-6",
    full: "col-span-2 md:col-span-4 lg:col-span-12",
  } as const;

  return (
    <div className="p-4 min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto">
        {counters.length === 0 ? (
          <div className="text-xl text-dark mt-32 text-center">
            <FaFaceRollingEyes className="mx-auto text-6xl text-dark/80" />
            <br />
            No hay contadores. Añade uno para comenzar o selecciona una
            plantilla.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-12 grid-flow-dense gap-6">
            {counters.map((counter, idx) => {
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
                    onDelete={onDelete}
                    onUpdate={onUpdate}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
