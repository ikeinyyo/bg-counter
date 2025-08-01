"use client";
import { useState } from "react";
import { CounterContainer } from "@/features/layouts/CounterContainer";
import {
  COLORS,
  CounterConfig,
  getColorByKey,
  ICONS,
} from "@/features/layouts/CounterConfig";
import { faker } from "@faker-js/faker";

const templates: Record<string, CounterConfig[]> = {
  empty: [],
  marvel: [
    {
      id: "villain",
      initialValue: 0,
      name: "Villano",
      backgroundColor: getColorByKey("purple"),
      icon: "skull",
      size: "medium",
    },
    {
      id: "player2",
      initialValue: 0,
      name: "Amenaza",
      backgroundColor: getColorByKey("yellow"),
      icon: "warning",
      size: "medium",
    },
    {
      id: "hero",
      initialValue: 0,
      name: "Héroe",
      backgroundColor: getColorByKey("red"),
      icon: "heart",
      size: "medium",
    },
  ],
  mtg: [
    {
      id: "player1",
      initialValue: 20,
      name: "Ajani",
      backgroundColor: getColorByKey("yellow"),
      icon: "sun",
      size: "medium",
    },
    {
      id: "player2",
      initialValue: 20,
      name: "Jace",
      backgroundColor: getColorByKey("blue"),
      icon: "water",
      size: "medium",
    },
    {
      id: "player3",
      initialValue: 20,
      name: "Liliana",
      backgroundColor: getColorByKey("black"),
      icon: "skull",
      size: "medium",
    },
    {
      id: "player4",
      initialValue: 20,
      name: "Chandra",
      backgroundColor: getColorByKey("orange"),
      icon: "fire",
      size: "medium",
    },
    {
      id: "player5",
      initialValue: 20,
      name: "Nissa",
      backgroundColor: getColorByKey("green"),
      icon: "leaf",
      size: "medium",
    },
  ],
};

export default function Home() {
  const [counters, setCounters] = useState<CounterConfig[]>(templates.empty); // Cargar template por defecto
  const [selectedTemplate, setSelectedTemplate] = useState<string>("empty");

  // Función para cambiar el template
  const handleTemplateChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selected = event.target.value;
    setSelectedTemplate(selected);
    setCounters(templates[selected]); // Cambiar los counters al template seleccionado
  };

  // Función para generar un contador aleatorio
  const generateRandomCounter = (): CounterConfig => {
    const randomId = `${Math.random()}`.slice(2);

    return {
      id: randomId,
      initialValue: 0,
      name: faker.person.firstName(),
      backgroundColor: getColorByKey(
        COLORS[Math.floor(Math.random() * COLORS.length)].key
      ),
      icon: ICONS[Math.floor(Math.random() * ICONS.length)].key,
      size: "medium",
    };
  };

  // Función para añadir un nuevo contador aleatorio
  const addRandomCounter = () => {
    const newCounter = generateRandomCounter();
    setCounters([...counters, newCounter]);
  };

  const handleDeleteCounter = (id: string) => {
    setCounters(counters.filter((counter) => counter.id !== id));
  };

  const handleUpdateCounter = (updatedCounter: CounterConfig) => {
    setCounters((prev) =>
      prev.map((c) => (c.id === updatedCounter.id ? updatedCounter : c))
    );
  };

  return (
    <div>
      {/* Barra superior */}
      <div className="flex items-center justify-between p-4 bg-gray-800 text-white">
        <a
          className="text-2xl font-bold"
          onClick={() => {
            setCounters(templates.empty);
            setSelectedTemplate("empty");
          }}
          href="/"
        >
          BG Counter
        </a>

        <div className="flex items-center gap-4">
          {/* Selector de plantilla */}
          <div>
            <label htmlFor="template" className="text-xl">
              Selecciona una plantilla
            </label>
            <select
              id="template"
              value={selectedTemplate}
              onChange={handleTemplateChange}
              className="ml-2 px-4 py-2 border border-gray-300 rounded-md"
            >
              <option value="empty">Empty</option>
              <option value="marvel">Marvel Champions</option>
              <option value="mtg">Magic: The Gathering</option>
            </select>
          </div>

          {/* Botón para añadir un nuevo contador aleatorio */}
          <div>
            <button
              onClick={addRandomCounter}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Añadir Contador
            </button>
          </div>
        </div>
      </div>

      {/* Contenedor de los counters */}
      <CounterContainer
        key={selectedTemplate}
        countersDefault={counters}
        onDelete={handleDeleteCounter}
        onUpdate={handleUpdateCounter}
      />
    </div>
  );
}
