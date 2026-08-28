"use client";
import { useState, useCallback } from "react";
import {
  CounterConfig,
  getDefaultBySize,
  getExactSizeFromConfig,
  ResponsiveLayout,
  Size,
} from "@/features/CounterContainer/domain";

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
  const [layout, setLayout] = useState<ResponsiveLayout>({
    xsElementsPerRow: counter.xsElementsPerRow ?? 1,
    mdElementsPerRow: counter.mdElementsPerRow ?? 1,
    lgElementsPerRow: counter.lgElementsPerRow ?? 1,
  });
  const size = getExactSizeFromConfig(layout);
  const setSize = (nextSize: Size) => setLayout(getDefaultBySize(nextSize));

  const handleSave = useCallback(() => {
    onSave({
      ...counter,
      name,
      initialValue: defaultValue,
      backgroundColor,
      icon: selectedIcon,
      ...layout,
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
    layout,
  ]);

  return {
    name,
    defaultValue,
    backgroundColor,
    selectedIcon,
    size,
    layout,
    setName,
    setDefaultValue,
    setBackgroundColor,
    setSelectedIcon,
    setSize,
    handleSave,
  };
};
