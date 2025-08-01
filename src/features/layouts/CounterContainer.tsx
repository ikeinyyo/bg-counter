"use client";
import { Counter } from "./Counter";
import { useState, useEffect } from "react";
import { CounterConfig } from "./CounterConfig";

type Props = {
  countersDefault: CounterConfig[];
  onDelete: (id: string) => void;
  onUpdate: (updatedCounter: CounterConfig) => void;
};

const CounterContainer = ({ countersDefault, onDelete, onUpdate }: Props) => {
  const [counters, setCounters] = useState<CounterConfig[]>(countersDefault);

  // Sincroniza el estado interno cuando cambian las props
  useEffect(() => {
    setCounters(countersDefault);
  }, [countersDefault]);

  const sizeToColSpan = {
    small: "col-span-1 md:col-span-1 lg:col-span-3",
    medium: "col-span-2 md:col-span-2 lg:col-span-4",
    large: "col-span-2 md:col-span-4 lg:col-span-6",
  };

  return (
    <div className="p-4 min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Contadores
        </h1>
        {counters.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-12 gap-6">
            {counters.map((counter) => (
              <div key={counter.id} className={sizeToColSpan[counter.size]}>
                <Counter
                  counter={counter}
                  onUpdate={onUpdate}
                  onDelete={onDelete}
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xl text-gray-500 mt-16 text-center">
            No hay contadores. Añade uno para comenzar o selecciona una
            plantilla.
          </p>
        )}
      </div>
    </div>
  );
};

export { CounterContainer };
