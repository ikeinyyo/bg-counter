"use client";
import { useState, useEffect, useRef } from "react";
import { CounterConfig } from "../domain";
import { CounterHeader } from "./CounterHeader";
import { IncrementDecrement } from "./IncrementDecrement";
import { Menu } from "./Menu";
import { CounterEditor } from "./CounterEditor/CounterEditor";
import { FaCog } from "react-icons/fa";

type Props = {
  counter: CounterConfig;
  span?: number;
  onUpdate?: (config: CounterConfig) => void;
  onDelete?: (id: string) => void;
};

const Counter = ({ counter, span, onUpdate, onDelete }: Props) => {
  const [count, setCount] = useState(counter.initialValue);
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const onIncrement = (value: number) =>
    setCount((currentValue) => currentValue + value);
  const onDecrement = (value: number) =>
    setCount((currentValue) => currentValue - value);

  const handleSave = (updated: CounterConfig) => {
    onUpdate?.(updated);
    setIsEditing(false);
  };

  useEffect(() => {
    setCount(counter.initialValue);
  }, [counter.initialValue]);

  const cogRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

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
      style={{ backgroundColor: counter.backgroundColor }}
    >
      <CounterHeader localConfig={counter} />

      <IncrementDecrement
        onDecrement={onDecrement}
        onIncrement={onIncrement}
        localConfig={counter}
      />

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span
          className={`font-bold text-white drop-shadow-lg mt-6 ${
            span && span < 6 ? "text-7xl" : "text-8xl" // TODO: make this dynamic based on span
          }`}
        >
          {count}
        </span>
      </div>

      <button
        className="absolute top-2 right-2 z-100 p-2 text-white/70 hover:text-white transition-colors"
        onClick={() => setShowMenu((isVisible) => !isVisible)}
        ref={cogRef}
        title="Options"
      >
        <FaCog className="w-6 h-6" />
      </button>

      <Menu
        showMenu={showMenu}
        setShowMenu={setShowMenu}
        onUpdate={onUpdate}
        onDelete={onDelete}
        localConfig={counter}
        setIsEditing={setIsEditing}
        menuRef={menuRef}
      />

      {isEditing && (
        <CounterEditor
          counter={counter}
          isOpen={isEditing}
          onClose={() => setIsEditing(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export { Counter };
