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
import Link from "next/link";
import { FaPlusCircle } from "react-icons/fa";
import Image from "next/image";

const templates: Record<string, CounterConfig[]> = {
  empty: [],
  marvelSolo: [
    {
      id: "villain",
      initialValue: 0,
      name: "Villano",
      backgroundColor: getColorByKey("purple"),
      icon: "skull",
      size: "medium",
    },
    {
      id: "warning",
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
  marvelSoloCounters: [
    {
      id: "villain",
      initialValue: 0,
      name: "Villano",
      backgroundColor: getColorByKey("purple"),
      icon: "skull",
      size: "large",
    },
    {
      id: "threat",
      initialValue: 0,
      name: "Amenaza",
      backgroundColor: getColorByKey("yellow"),
      icon: "warning",
      size: "large",
    },
    {
      id: "hero",
      initialValue: 0,
      name: "Héroe",
      backgroundColor: getColorByKey("red"),
      icon: "heart",
      size: "small",
    },
    {
      id: "counter",
      initialValue: 0,
      name: "Contador",
      backgroundColor: getColorByKey("black"),
      icon: "star",
      size: "small",
    },
  ],
  marvelGroup: [
    {
      id: "villain",
      initialValue: 0,
      name: "Villano",
      backgroundColor: getColorByKey("purple"),
      icon: "skull",
      size: "large",
    },
    {
      id: "threat",
      initialValue: 0,
      name: "Amenaza",
      backgroundColor: getColorByKey("yellow"),
      icon: "warning",
      size: "large",
    },
    {
      id: "hero1",
      initialValue: 0,
      name: "Héroe 1",
      backgroundColor: getColorByKey("red"),
      icon: "heart",
      size: "small",
    },
    {
      id: "hero2",
      initialValue: 0,
      name: "Héroe 2",
      backgroundColor: getColorByKey("blue"),
      icon: "heart",
      size: "small",
    },
  ],
  commander: [
    {
      id: "player1",
      initialValue: 40,
      name: "Ajani",
      backgroundColor: getColorByKey("yellow"),
      icon: "sun",
      size: "small",
    },
    {
      id: "player2",
      initialValue: 40,
      name: "Jace",
      backgroundColor: getColorByKey("blue"),
      icon: "water",
      size: "small",
    },
    {
      id: "player3",
      initialValue: 40,
      name: "Liliana",
      backgroundColor: getColorByKey("black"),
      icon: "skull",
      size: "small",
    },
    {
      id: "player4",
      initialValue: 40,
      name: "Chandra",
      backgroundColor: getColorByKey("orange"),
      icon: "fire",
      size: "small",
    },
  ],
  duel: [
    {
      id: "player1",
      initialValue: 20,
      name: "Ajani",
      backgroundColor: getColorByKey("yellow"),
      icon: "sun",
      size: "large",
    },
    {
      id: "player2",
      initialValue: 20,
      name: "Jace",
      backgroundColor: getColorByKey("blue"),
      icon: "water",
      size: "large",
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
      <div className="flex items-center justify-between p-2 bg-dark text-white h-14">
        <Link
          className="text-2xl font-bold hover:text-primary transition-colors"
          onClick={() => {
            setCounters(templates.empty);
            setSelectedTemplate("empty");
          }}
          href="/"
        >
          <div className="flex items-center gap-2">
            <Image
              src="/images/logo.png"
              width={100}
              height={50}
              alt="Logo de Juernes de Mesa"
              className="p-2 pl-4"
            />
            <span className="lg:inline md:inline hidden">Counter App</span>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          {/* Selector de plantilla */}
          <div>
            <select
              id="template"
              value={selectedTemplate}
              onChange={handleTemplateChange}
              className="px-4 py-2 max-w-72 bg-dark border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 transition-colors ease-in-out"
            >
              <option value="empty">Sin plantilla</option>
              <option value="marvelSolo">Marvel Champions - 1P</option>
              <option value="marvelSoloCounters">
                Marvel Champions - 1P Contadores
              </option>
              <option value="marvelGroup">Marvel Champions - 2P</option>
              <option value="commander">MTG Commander</option>
              <option value="duel">MTG Duel</option>
            </select>
          </div>

          {/* Botón para añadir un nuevo contador aleatorio */}
          <div>
            <button
              onClick={addRandomCounter}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/80 transition-colors flex"
            >
              <FaPlusCircle className="h-6 w-6" />
              <span className="lg:inline hidden ml-2">Añadir Contador</span>
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
