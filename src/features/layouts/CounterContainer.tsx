"use client";
import { Counter } from "./Counter";
import { useState, useEffect } from "react";

// Tipos de datos para los contadores
type CounterConfig = {
  id: string;
  initialValue: number;
  name?: string;
  backgroundColor?: string;
  icon?: string;
};

type Props = {
  countersDefault: CounterConfig[];
  onDelete: (id: string) => void;
};

const CounterContainer = ({ countersDefault, onDelete }: Props) => {
  const [counters, setCounters] = useState<CounterConfig[]>(countersDefault);

  // Sincroniza el estado interno cuando cambian las props
  useEffect(() => {
    setCounters(countersDefault);
  }, [countersDefault]);

  return (
    <div className="p-4 min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Contadores
        </h1>
        {counters.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {counters.map((counter) => (
              <Counter
                key={counter.id}
                counter={counter}
                onUpdate={() => {}}
                onDelete={onDelete}
              />
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
