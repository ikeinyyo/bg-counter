"use client";
import React, { useState, useEffect } from "react";
import { CounterEditor, CounterConfig } from "./CounterEditor";
import { FaEdit } from "react-icons/fa";
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
  GiDrop,
  GiLion,
} from "react-icons/gi";
import { FaDroplet, FaShield } from "react-icons/fa6";

type Props = {
  counter: CounterConfig;
  onUpdate: (config: CounterConfig) => void;
};

const ICON_MAP: Record<string, React.ComponentType> = {
  heart: FaHeart,
  shield: FaShield,
  star: FaStar,
  crown: FaCrown,
  fire: FaFire,
  bolt: FaBolt,
  gem: FaGem,
  skull: FaSkull,
  magic: FaMagic,
  leaf: FaLeaf,
  snowflake: FaSnowflake,
  sun: FaSun,
  swordman: GiSwordman,
  magicswirl: GiMagicSwirl,
  dragon: GiDragonHead,
  crystal: GiCrystalBall,
  wings: GiAngelWings,
  death: GiDeathSkull,
  drop: FaDroplet,
  lion: GiLion,
};

const Counter = ({ counter, onUpdate }: Props) => {
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

  const IconComponent = ICON_MAP[localConfig.icon] || FaHeart;

  return (
    <div
      className="relative w-full h-64 rounded-lg shadow-lg overflow-hidden select-none"
      style={{ backgroundColor: localConfig.backgroundColor }}
    >
      {/* Counter Name and Icon */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 text-white">
        <span className="text-2xl">
          <IconComponent />
        </span>
        <span className="text-lg font-semibold">{localConfig.name}</span>
      </div>

      {/* Left Half - Decrement Zone */}
      <div
        className="absolute left-0 top-0 w-1/2 h-full flex items-center justify-center cursor-pointer transition-all duration-150 hover:bg-opacity-10 active:bg-opacity-20"
        onClick={onDecrement}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Fondo blanco con opacidad */}
          <div className="absolute inset-0 bg-white opacity-0 hover:opacity-30 transition-opacity z-30" />
          {/* Icono de decremento */}
          <div className="text-white text-6xl font-bold opacity-30 hover:opacity-60 transition-opacity mr-4 z-20">
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
          <div className="absolute inset-0 bg-white opacity-0 hover:opacity-30 transition-opacity z-30" />
          {/* Icono de incremento */}
          <div className="text-white text-6xl font-bold opacity-30 hover:opacity-60 transition-opacity ml-4 z-20">
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
      <button
        onClick={() => setIsEditing(true)}
        className="absolute top-2 right-2 z-10 p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
      >
        <FaEdit />
      </button>
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
