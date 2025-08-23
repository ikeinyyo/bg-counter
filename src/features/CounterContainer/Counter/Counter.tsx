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
  isPreview?: boolean;
};

const Counter = ({ counter, span, onUpdate, onDelete, isPreview }: Props) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const onIncrement = (value: number) =>
    onUpdate?.({ ...counter, value: counter.value! + value });
  const onDecrement = (value: number) =>
    onUpdate?.({ ...counter, value: counter.value! - value });

  const handleSave = (updated: CounterConfig) => {
    onUpdate?.({ ...updated, value: updated.initialValue });
    setIsEditing(false);
  };

  useEffect(() => {
    if (counter.value === undefined) {
      onUpdate?.({ ...counter, value: counter.initialValue });
    }
  }, [counter.initialValue, onUpdate]);

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

  const isSmall = !!(span && span <= 6);

  return (
    <div
      className="relative w-full h-56 rounded-lg shadow-lg overflow-hidden select-none"
      style={{ backgroundColor: counter.backgroundColor }}
    >
      <CounterHeader localConfig={counter} isSmall={isSmall} />

      <IncrementDecrement
        onDecrement={onDecrement}
        onIncrement={onIncrement}
        isSmall={isSmall}
      />

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span
          className={`font-bold drop-shadow-lg mt-6 ${
            isSmall ? "text-7xl md:text-8xl" : "text-8xl"
          }`}
        >
          {counter.value!}
        </span>
      </div>

      {!isPreview && (
        <button
          className="absolute top-2 right-2 z-100 p-2 text-white/70 hover:text-white transition-colors"
          onClick={() => setShowMenu((isVisible) => !isVisible)}
          ref={cogRef}
          title="Options"
        >
          <FaCog
            className={`${isSmall ? "w-4 h-4 md:w-6 md:h-6" : "w-6 h-6"}`}
          />
        </button>
      )}

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
