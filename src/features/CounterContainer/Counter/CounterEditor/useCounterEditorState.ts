"use client";
import { useState, useCallback } from "react";
import { CounterConfig } from "@/features/CounterContainer/domain";

type Args = {
  counter: CounterConfig;
  onClose: () => void;
  onSave: (config: CounterConfig) => void;
};

export const useCounterEditorState = ({ counter, onClose, onSave }: Args) => {
  const [name, setName] = useState(counter.name);
  const [defaultValue, setDefaultValue] = useState<number>(
    typeof counter.initialValue === "number" ? counter.initialValue : 0
  );
  const [backgroundColor, setBackgroundColor] = useState(
    counter.backgroundColor
  );
  const [selectedIcon, setSelectedIcon] = useState(counter.icon);

  const handleSave = useCallback(() => {
    onSave({
      ...counter,
      name,
      initialValue: defaultValue,
      backgroundColor,
      icon: selectedIcon,
    });
    onClose();
  }, [
    onSave,
    onClose,
    counter,
    name,
    defaultValue,
    backgroundColor,
    selectedIcon,
  ]);

  return {
    name,
    defaultValue,
    backgroundColor,
    selectedIcon,
    setName,
    setDefaultValue,
    setBackgroundColor,
    setSelectedIcon,
    handleSave,
  };
};
