"use client";
import React from "react";
import { useState } from "react";
import {
  FaHeart,
  FaStar,
  FaCrown,
  FaFire,
  FaBolt,
  FaGem,
  FaSkull,
  FaMagic,
  FaLeaf,
  FaSnowflake,
  FaSun,
} from "react-icons/fa";
import {
  GiSwordman,
  GiMagicSwirl,
  GiDragonHead,
  GiCrystalBall,
  GiAngelWings,
  GiDeathSkull,
} from "react-icons/gi";

export type CounterConfig = {
  id: string;
  initialValue: number;
  name: string;
  backgroundColor: string;
  icon: string;
};

type Props = {
  counter: CounterConfig;
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: CounterConfig) => void;
};

const COLORS = [
  { name: "Rojo", value: "#dc2626" },
  { name: "Azul", value: "#2563eb" },
  { name: "Verde", value: "#16a34a" },
  { name: "Púrpura", value: "#9333ea" },
  { name: "Rosa", value: "#ec4899" },
  { name: "Amarillo", value: "#eab308" },
  { name: "Naranja", value: "#ea580c" },
  { name: "Gris", value: "#6b7280" },
  { name: "Índigo", value: "#4f46e5" },
  { name: "Teal", value: "#0d9488" },
  { name: "Negro", value: "#1f2937" },
  { name: "Marrón", value: "#92400e" },
];

const ICONS = [
  { name: "Corazón", component: FaHeart, key: "heart" },
  { name: "Estrella", component: FaStar, key: "star" },
  { name: "Corona", component: FaCrown, key: "crown" },
  { name: "Fuego", component: FaFire, key: "fire" },
  { name: "Rayo", component: FaBolt, key: "bolt" },
  { name: "Gema", component: FaGem, key: "gem" },
  { name: "Calavera", component: FaSkull, key: "skull" },
  { name: "Magia", component: FaMagic, key: "magic" },
  { name: "Hoja", component: FaLeaf, key: "leaf" },
  { name: "Copo", component: FaSnowflake, key: "snowflake" },
  { name: "Sol", component: FaSun, key: "sun" },
  { name: "Guerrero", component: GiSwordman, key: "swordman" },
  { name: "Hechizo", component: GiMagicSwirl, key: "magicswirl" },
  { name: "Dragón", component: GiDragonHead, key: "dragon" },
  { name: "Cristal", component: GiCrystalBall, key: "crystal" },
  { name: "Alas", component: GiAngelWings, key: "wings" },
  { name: "Muerte", component: GiDeathSkull, key: "death" },
];

const CounterEditor = ({ counter, isOpen, onClose, onSave }: Props) => {
  const [name, setName] = useState(counter.name || ""); // Default to empty string if undefined
  const [backgroundColor, setBackgroundColor] = useState(
    counter.backgroundColor || "#ffffff"
  ); // Default to white if undefined
  const [selectedIcon, setSelectedIcon] = useState(counter.icon || "heart"); // Default to "heart" if undefined

  const handleSave = () => {
    onSave({
      ...counter,
      name,
      backgroundColor,
      icon: selectedIcon,
    });
    onClose();
  };

  const getIconComponent = (iconKey: string) => {
    const iconData = ICONS.find((icon) => icon.key === iconKey);
    return iconData ? iconData.component : FaHeart;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
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

          {/* Preview */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Vista Previa
            </h3>
            <div
              className="w-full h-24 rounded-lg flex items-center justify-center relative"
              style={{ backgroundColor }}
            >
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 flex items-center gap-2 text-white">
                <span className="text-lg">
                  {React.createElement(getIconComponent(selectedIcon))}
                </span>
                <span className="text-sm font-semibold">{name}</span>
              </div>
              <span className="text-4xl font-bold text-white">
                {counter.initialValue}
              </span>
            </div>
          </div>

          {/* Name Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nombre del contador"
            />
          </div>

          {/* Color Picker */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color de Fondo
            </label>
            <div className="grid grid-cols-4 gap-2">
              {COLORS.map((color) => (
                <button
                  key={color.value}
                  onClick={() => setBackgroundColor(color.value)}
                  className={`w-full h-10 rounded-md border-2 transition-all ${
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
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Icono
            </label>
            <div className="grid grid-cols-6 gap-2 max-h-48 overflow-y-auto">
              {ICONS.map((icon) => (
                <button
                  key={icon.key}
                  onClick={() => setSelectedIcon(icon.key)}
                  className={`p-3 rounded-md border-2 transition-all flex items-center justify-center ${
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

          {/* Action Buttons */}
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
      </div>
    </div>
  );
};

export { CounterEditor };
