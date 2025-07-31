"use client";
import { useState } from "react";
import { CounterContainer } from "@/features/layouts/CounterContainer";
import {
  COLORS,
  getColorByKey,
  getIconByKey,
  ICONS,
} from "@/features/layouts/CounterConfig";
import { faker } from "@faker-js/faker";

// Tipos de datos para los contadores
type CounterConfig = {
  id: string;
  initialValue: number;
  name?: string;
  backgroundColor?: string;
  icon?: string;
};

const templates: Record<string, CounterConfig[]> = {
  marvel: [
    {
      id: "villain",
      initialValue: 0,
      name: "Villano",
      backgroundColor: getColorByKey("purple"),
      icon: "skull",
    },
    {
      id: "player2",
      initialValue: 0,
      name: "Amenaza",
      backgroundColor: getColorByKey("yellow"),
      icon: "shield",
    },
    {
      id: "hero",
      initialValue: 0,
      name: "Héroe",
      backgroundColor: getColorByKey("red"),
      icon: "heart",
    },
  ],
  mtg: [
    {
      id: "player1",
      initialValue: 20,
      name: "Ajani",
      backgroundColor: getColorByKey("yellow"),
      icon: "lion",
    },
    {
      id: "player2",
      initialValue: 20,
      name: "Jace",
      backgroundColor: getColorByKey("blue"),
      icon: "drop",
    },
    {
      id: "player3",
      initialValue: 20,
      name: "Liliana",
      backgroundColor: getColorByKey("black"),
      icon: "skull",
    },
    {
      id: "player4",
      initialValue: 20,
      name: "Chandra",
      backgroundColor: getColorByKey("orange"),
      icon: "fire",
    },
    {
      id: "player5",
      initialValue: 20,
      name: "Nissa",
      backgroundColor: getColorByKey("green"),
      icon: "leaf",
    },
  ],
};

export default function Home() {
  const [counters, setCounters] = useState<CounterConfig[]>(templates.marvel); // Cargar template por defecto
  const [selectedTemplate, setSelectedTemplate] = useState<string>("marvel");

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
    const randomName = `Counter ${Math.floor(Math.random() * 1000)}`;
    const randomId = `${Math.random()}`.slice(2);

    return {
      id: randomId,
      initialValue: 0,
      name: faker.person.firstName(),
      backgroundColor: getColorByKey(
        COLORS[Math.floor(Math.random() * COLORS.length)].key
      ),
      icon: ICONS[Math.floor(Math.random() * ICONS.length)].key,
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

  return (
    <div>
      {/* Barra superior */}
      <div className="flex items-center justify-between p-4 bg-gray-800 text-white">
        <div className="text-2xl font-bold">BG Counter</div>

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
              Añadir Contador Aleatorio
            </button>
          </div>
        </div>
      </div>

      {/* Contenedor de los counters */}
      <CounterContainer
        key={selectedTemplate}
        countersDefault={counters}
        onDelete={handleDeleteCounter}
      />
    </div>
  );
}
