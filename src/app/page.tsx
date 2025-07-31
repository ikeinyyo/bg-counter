"use client";
import { useState } from "react";
import { CounterContainer } from "@/features/layouts/CounterContainer";

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
      id: "player1",
      initialValue: 20,
      name: "Iron Man",
      backgroundColor: "#FF0000",
      icon: "❤️",
    },
    {
      id: "player2",
      initialValue: 20,
      name: "Captain America",
      backgroundColor: "#0000FF",
      icon: "💙",
    },
  ],
  mtg: [
    {
      id: "player1",
      initialValue: 20,
      name: "Shivan Dragon",
      backgroundColor: "#FF4500",
      icon: "🔥",
    },
    {
      id: "player2",
      initialValue: 20,
      name: "Black Lotus",
      backgroundColor: "#000000",
      icon: "💎",
    },
    {
      id: "player3",
      initialValue: 20,
      name: "White Lotus",
      backgroundColor: "#000000",
      icon: "💎",
    },
    {
      id: "player4",
      initialValue: 20,
      name: "Red Lotus",
      backgroundColor: "#000000",
      icon: "💎",
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
