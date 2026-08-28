"use client";
import { useState, useEffect, useRef } from "react";
import { CounterConfig } from "../domain";
import { CounterHeader } from "./CounterHeader";
import { IncrementDecrement } from "./IncrementDecrement";
import { Menu } from "./Menu";
import { CounterEditor } from "./CounterEditor/CounterEditor";
import { FaEllipsisVertical } from "react-icons/fa6";
import { useTranslation } from "@/context/SettingsContext";
import { trackEvent } from "@/lib/telemetry";

type Props = {
  counter: CounterConfig;
  onUpdate?: (config: CounterConfig) => void;
  onDelete?: (id: string) => void;
  onDuplicate?: (counter: CounterConfig) => void;
  isPreview?: boolean;
};

const Counter = ({ counter, onUpdate, onDelete, onDuplicate, isPreview }: Props) => {
  const { t } = useTranslation();
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [localValue, setLocalValue] = useState<number>(
    counter.value ?? counter.initialValue,
  );

  const valueRef = useRef(localValue);
  useEffect(() => {
    valueRef.current = localValue;
  }, [localValue]);

  useEffect(() => {
    const next = counter.value ?? counter.initialValue;
    setLocalValue(next);
    valueRef.current = next;
  }, [counter.value, counter.initialValue]);

  const pushUpdate = (nextValue: number) => {
    onUpdate?.({ ...counter, value: nextValue });
  };

  const onIncrement = (amount: number) => {
    const next = valueRef.current + amount;
    setLocalValue(next);
    pushUpdate(next);
    if (!isPreview) {
      trackEvent("counter_value_changed", { direction: "increment", icon: counter.icon }, { amount, resultingValue: next });
    }
  };

  const onDecrement = (amount: number) => {
    const next = valueRef.current - amount;
    setLocalValue(next);
    pushUpdate(next);
    if (!isPreview) {
      trackEvent("counter_value_changed", { direction: "decrement", icon: counter.icon }, { amount, resultingValue: next });
    }
  };

  const handleSave = (updated: CounterConfig) => {
    trackEvent("counter_edited", { icon: updated.icon }, { defaultValue: updated.initialValue });
    onUpdate?.({ ...updated, value: updated.initialValue });
    setIsEditing(false);
  };

  const cogRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!showMenu) return;
    const lockBody = window.matchMedia("(max-width: 639px)").matches;
    const previousOverflow = document.body.style.overflow;
    if (lockBody) document.body.style.overflow = "hidden";
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
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setShowMenu(false);
    };
    document.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      if (lockBody) document.body.style.overflow = previousOverflow;
      document.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showMenu]);

  return (
    <div className="relative h-full w-full">
      <div
        className="counter-card group relative w-full select-none overflow-hidden rounded-[1.35rem] border border-black/10 shadow-[0_8px_24px_rgba(15,23,42,0.16)]"
        style={{ backgroundColor: counter.backgroundColor }}
      >
        <CounterHeader localConfig={counter} />

        <IncrementDecrement
          onDecrement={onDecrement}
          onIncrement={onIncrement}
          decrementLabel={`${t("counterDecrement")} ${counter.name}`}
          incrementLabel={`${t("counterIncrement")} ${counter.name}`}
        />

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="counter-value font-black tracking-tight text-white drop-shadow-lg">
            {localValue}
          </span>
        </div>

        {!isPreview && (
          <button
            className="absolute right-2 top-2 z-40 flex h-10 w-10 items-center justify-center rounded-full bg-black/15 text-white/80 backdrop-blur-sm transition hover:bg-black/30 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            onClick={() => setShowMenu((isVisible) => !isVisible)}
            ref={cogRef}
            title={t("menuOptions")}
          >
            <FaEllipsisVertical className="h-4 w-4" />
          </button>
        )}
      </div>

      <Menu
        showMenu={showMenu}
        setShowMenu={setShowMenu}
        onUpdate={onUpdate}
        onDelete={onDelete}
        onDuplicate={onDuplicate}
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
