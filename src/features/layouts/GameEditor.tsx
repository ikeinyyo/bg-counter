import React, { useState } from "react";
import { FaHeart, FaShield, FaFire, FaGem } from "react-icons/fa";
import { ICONS } from "./CounterConfig";

const GameEditor = ({ counters, onSave, onClose, loadTemplate }) => {
  const [localCounters, setLocalCounters] = useState(counters);

  // Función para editar un contador
  const handleEditCounter = (index, updatedCounter) => {
    const updatedCounters = [...localCounters];
    updatedCounters[index] = updatedCounter;
    setLocalCounters(updatedCounters);
  };

  // Función para agregar un nuevo contador
  const handleAddCounter = () => {
    setLocalCounters([
      ...localCounters,
      {
        id: Date.now(),
        name: "Nuevo Contador",
        backgroundColor: "#FFFFFF",
        icon: "heart",
      },
    ]);
  };

  // Función para eliminar un contador
  const handleDeleteCounter = (index) => {
    const updatedCounters = localCounters.filter((_, i) => i !== index);
    setLocalCounters(updatedCounters);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Botón de cerrar y título */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Configurar Counters
            </h2>
            <button onClick={onClose} className="text-gray-500 text-xl">
              ×
            </button>
          </div>

          {/* Cargar template */}
          <div className="mb-4">
            <button
              onClick={() => loadTemplate("marvel")}
              className="mr-2 p-2 border rounded-md bg-gray-200 hover:bg-gray-300"
            >
              Cargar Marvel Champions
            </button>
            <button
              onClick={() => loadTemplate("mtg")}
              className="p-2 border rounded-md bg-gray-200 hover:bg-gray-300"
            >
              Cargar MTG
            </button>
          </div>

          {/* Mostrar los counters */}
          {localCounters.map((counter, index) => (
            <div key={counter.id} className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <input
                  type="text"
                  value={counter.name}
                  onChange={(e) =>
                    handleEditCounter(index, {
                      ...counter,
                      name: e.target.value,
                    })
                  }
                  className="border p-2 rounded-md"
                />
                <div>
                  <button
                    onClick={() => handleDeleteCounter(index)}
                    className="p-2 bg-red-500 text-white rounded-md"
                  >
                    Eliminar
                  </button>
                </div>
              </div>

              {/* Selector de color */}
              <input
                type="color"
                value={counter.backgroundColor}
                onChange={(e) =>
                  handleEditCounter(index, {
                    ...counter,
                    backgroundColor: e.target.value,
                  })
                }
              />

              {/* Selector de icono */}
            </div>
          ))}

          {/* Botón de agregar contador */}
          <button
            onClick={handleAddCounter}
            className="p-2 border rounded-md bg-green-200 hover:bg-green-300"
          >
            Agregar Contador
          </button>

          {/* Botones de guardar y cancelar */}
          <div className="mt-4 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              onClick={() => onSave(localCounters)}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export { GameEditor };
