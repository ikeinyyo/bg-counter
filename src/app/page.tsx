"use client";
import { useState } from "react";
import { CounterContainer } from "@/features/layouts/CounterContainer";
import { getColorByKey } from "@/features/layouts/CounterConfig";

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
  // Mantener el estado de los counters y la plantilla seleccionada
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

  return (
    <div>
      {/* Selector de plantilla */}
      <div className="mb-4">
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

      {/* Contenedor de los counters, se pasa la key para forzar el re-render */}
      <CounterContainer key={selectedTemplate} countersDefault={counters} />
    </div>
  );
}
