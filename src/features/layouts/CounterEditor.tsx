"use client";
import React, { useState } from "react";
import { Counter } from "./Counter"; // Usamos el componente Counter
import { COLORS, CounterConfig, ICONS } from "./CounterConfig"; // Aseguramos que CounterConfig sea importado correctamente

type Props = {
  counter: CounterConfig;
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: CounterConfig) => void;
};

const CounterEditor = ({ counter, isOpen, onClose, onSave }: Props) => {
  const [name, setName] = useState(counter.name);
  const [backgroundColor, setBackgroundColor] = useState(
    counter.backgroundColor
  );
  const [selectedIcon, setSelectedIcon] = useState(counter.icon);

  const handleSave = () => {
    onSave({
      ...counter,
      name,
      backgroundColor,
      icon: selectedIcon,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-500 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Fila de título, botón "X" y botones de acción */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Editar Contador
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Contenedor de dos columnas (Formulario + Vista Previa) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Formulario de Edición */}
            <div className="w-full">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="text-black w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nombre del contador"
                />
              </div>

              <div className="grid mb-4">
                {/* Color Picker */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color de Fondo
                  </label>
                  <div className="flex flex-wrap space-x-2">
                    {COLORS.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => setBackgroundColor(color.value)}
                        className={`w-10 h-10 rounded-md border-2 transition-all my-1 ${
                          backgroundColor === color.value
                            ? "border-gray-800 scale-110"
                            : "border-gray-300 hover:border-gray-500"
                        }`}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>

                {/* Icon Picker */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Icono
                  </label>
                  <div className="flex flex-wrap space-x-2 max-h-48 overflow-y-auto">
                    {ICONS.map((icon) => (
                      <button
                        key={icon.key}
                        onClick={() => setSelectedIcon(icon.key)}
                        className={`w-10 h-10 rounded-md border-2 transition-all flex items-center justify-center my-1 ${
                          selectedIcon === icon.key
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-300 hover:border-gray-500 hover:bg-gray-50"
                        }`}
                        title={icon.name}
                      >
                        <icon.component className="text-xl text-gray-700" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Guardar
                </button>
              </div>
            </div>

            {/* Vista Previa del Contador */}
            <div className="w-full flex items-center justify-center">
              <Counter
                key={`${name}-${backgroundColor}-${selectedIcon}`} // Esto fuerza la re-renderización
                counter={{
                  id: counter.id,
                  initialValue: counter.initialValue,
                  name,
                  backgroundColor,
                  icon: selectedIcon,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { CounterEditor };
