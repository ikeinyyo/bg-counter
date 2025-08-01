"use client";
import { useState, useEffect, useRef } from "react";
import { CounterEditor, CounterConfig } from "./CounterEditor";
import { FaEdit, FaTrash, FaExpandArrowsAlt, FaCog } from "react-icons/fa";
import { getIconByKey } from "./CounterConfig";

type Props = {
  counter: CounterConfig;
  onUpdate?: (config: CounterConfig) => void;
  onDelete?: (id: string) => void;
};

const Counter = ({ counter, onUpdate, onDelete }: Props) => {
  const [count, setCount] = useState(counter.initialValue);
  const [showMenu, setShowMenu] = useState(false);
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

  const cogRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // ✨ Cierre automático al tocar fuera (ratón o móvil)
  useEffect(() => {
    if (!showMenu) return;

    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        cogRef.current &&
        !cogRef.current.contains(target)
      ) {
        setShowMenu(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [showMenu]);

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

      {/* Tuerca – botón discreto */}
      <button
        className="absolute top-2 right-2 z-100 p-2 text-white/70 hover:text-white transition-colors"
        onClick={() => setShowMenu((v) => !v)}
        ref={cogRef}
        title="Opciones"
      >
        <FaCog />
      </button>

      {/* --- MENÚ EMERGENTE --- */}
      {showMenu && (
        <div
          className="absolute top-12 right-2 bg-white/90 backdrop-blur-sm rounded-md shadow-lg p-2 flex flex-col gap-1 z-100"
          onClick={(e) => e.stopPropagation()} // evita que el click se propague
          ref={menuRef}
        >
          {/* Editar */}
          {onUpdate && (
            <button
              onClick={() => {
                setIsEditing(true);
                setShowMenu(false);
              }}
              className="flex items-center gap-2 px-3 py-1 rounded hover:bg-gray-200 text-sm text-black"
            >
              <FaEdit /> Editar
            </button>
          )}

          {/* Borrar */}
          {onDelete && (
            <button
              onClick={() => onDelete(localConfig.id)}
              className="flex items-center gap-2 px-3 py-1 rounded hover:bg-red-100 text-sm text-red-600"
            >
              <FaTrash /> Borrar
            </button>
          )}

          <hr className="my-1" />

          {/* Tallas */}
          <div className="flex justify-between gap-1">
            {["small", "medium", "large"].map((size, i) => (
              <button
                key={size}
                onClick={() => {
                  const updated = { ...localConfig, size };
                  setLocalConfig(updated);
                  onUpdate?.(updated);
                }}
                className={`w-8 h-8 rounded-full border text-xs font-semibold
                  ${
                    localConfig.size === size
                      ? "bg-black text-white"
                      : "bg-transparent border-black text-black"
                  }`}
              >
                {["S", "M", "L"][i]}
              </button>
            ))}
          </div>
        </div>
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
