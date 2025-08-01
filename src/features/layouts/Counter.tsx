"use client";
import { useState, useEffect } from "react";
import { CounterEditor, CounterConfig } from "./CounterEditor";
import { FaEdit, FaTrash, FaExpandArrowsAlt } from "react-icons/fa";
import { getIconByKey } from "./CounterConfig";

type Props = {
  counter: CounterConfig;
  onUpdate?: (config: CounterConfig) => void;
  onDelete?: (id: string) => void;
};

const Counter = ({ counter, onUpdate, onDelete }: Props) => {
  const [count, setCount] = useState(counter.initialValue);

  // Sincroniza el valor cuando cambia el template
  useEffect(() => {
    setCount(counter.initialValue);
  }, [counter.initialValue]);

  const [isEditing, setIsEditing] = useState(false);
  const [localConfig, setLocalConfig] = useState(counter);

  const onIncrement = () => setCount((c) => c + 1);
  const onDecrement = () => setCount((c) => c - 1);

  const handleSave = (updated: CounterConfig) => {
    setLocalConfig(updated);
    onUpdate(updated);
    setIsEditing(false);
  };

  const IconComponent = getIconByKey(localConfig.icon);

  return (
    <div
      className="relative w-full h-56 rounded-lg shadow-lg overflow-hidden select-none"
      style={{ backgroundColor: localConfig.backgroundColor }}
    >
      {/* Counter Name and Icon */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 text-white">
        <span className="text-2xl">
          <IconComponent />
        </span>
        <span
          className={`text-lg font-semibold ${
            localConfig.size === "small" ? "hidden lg:inline" : ""
          }`}
        >
          {localConfig.name}
        </span>
      </div>

      {/* Left Half - Decrement Zone */}
      <div
        className="absolute left-0 top-0 w-1/2 h-full flex items-center justify-center cursor-pointer transition-all duration-150 hover:bg-opacity-10 active:bg-opacity-20"
        onClick={onDecrement}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Fondo blanco con opacidad */}
          <div className="absolute inset-0 bg-white opacity-0 hover:opacity-10 transition-opacity z-30" />
          {/* Icono de decremento */}
          <div
            className={`text-white text-6xl font-bold opacity-30 hover:opacity-60 transition-opacity mr-4 z-20 ${
              localConfig.size === "small" ? "hidden lg:inline" : ""
            }`}
          >
            −
          </div>
        </div>
      </div>

      <div
        className="absolute right-0 top-0 w-1/2 h-full flex items-center justify-center cursor-pointer transition-all duration-150 hover:bg-opacity-10 active:bg-opacity-20"
        onClick={onIncrement}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Fondo blanco con opacidad */}
          <div className="absolute inset-0 bg-white opacity-0 hover:opacity-10 transition-opacity z-30" />
          {/* Icono de incremento */}
          <div
            className={`text-white text-6xl font-bold opacity-30 hover:opacity-60 transition-opacity ml-4 z-20 ${
              localConfig.size === "small" ? "hidden lg:inline" : ""
            }`}
          >
            +
          </div>
        </div>
      </div>

      {/* Central Counter Display */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="text-8xl font-bold text-white drop-shadow-lg">
          {count}
        </span>
      </div>

      {/* Edit Button */}
      {onUpdate && (
        <button
          onClick={() => setIsEditing(true)}
          className="absolute top-2 right-2 z-10 p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-full transition-colors z-100"
        >
          <FaEdit />
        </button>
      )}

      {/* Size Toggle Button */}
      <button
        onClick={() => {
          const sizes = ["small", "medium", "large"];
          const currentIndex = sizes.indexOf(localConfig.size);
          const nextSize = sizes[(currentIndex + 1) % sizes.length];
          const updated = { ...localConfig, size: nextSize };
          setLocalConfig(updated);
          if (onUpdate) onUpdate(updated);
        }}
        className="absolute top-2 left-10 z-10 p-2 text-white hover:bg-blue-600 hover:bg-opacity-20 rounded-full transition-colors z-100"
        title="Cambiar tamaño"
      >
        <FaExpandArrowsAlt />
      </button>

      {/* Delete Button */}
      {onDelete && (
        <button
          onClick={() => onDelete(localConfig.id)}
          className="absolute top-2 left-2 z-10 p-2 text-white hover:bg-red-600 hover:bg-opacity-20 rounded-full transition-colors z-100"
        >
          <FaTrash />
        </button>
      )}

      {isEditing && (
        <CounterEditor
          counter={localConfig}
          isOpen={isEditing}
          onClose={() => setIsEditing(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export { Counter };
