"use client";
import React from "react";
import { Counter } from "../Counter";
import { CounterConfig, getDefaultBySize } from "../../domain";
import { ICONS } from "../../config/icons";
import { COLORS } from "../../config/colors";
import { useCounterEditorState } from "./useCounterEditorState";
import { Modal } from "./Modal";
import { CounterEditorHeader } from "./parts/CounterEditorHeader";
import { NameField } from "./parts/NameField";
import { ColorPicker } from "./parts/ColorPicker";
import { IconPicker } from "./parts/IconPicker";
import { ActionBar } from "./parts/ActionBar";
import { CounterPreview } from "./parts/CounterPreview";
import { DefaultValueField } from "./parts/DefaultValueField";

type Props = {
  counter: CounterConfig;
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: CounterConfig) => void;
};

const CounterEditor = ({ counter, isOpen, onClose, onSave }: Props) => {
  const {
    name,
    defaultValue,
    backgroundColor,
    selectedIcon,
    setName,
    setDefaultValue,
    setBackgroundColor,
    setSelectedIcon,
    handleSave,
  } = useCounterEditorState({ counter, onClose, onSave });

  if (!isOpen) return null;

  return (
    <Modal onClose={onClose}>
      <div className="p-6">
        <CounterEditorHeader title="Edit Counter" onClose={onClose} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="w-full min-w-0">
            <div className="grid gap-4">
              <NameField value={name} onChange={setName} />

              <DefaultValueField
                value={defaultValue}
                onChange={setDefaultValue}
                label="Valor por defecto"
                min={-9999}
                max={9999}
                step={1}
              />

              <ColorPicker
                label="Background color"
                colors={COLORS}
                value={backgroundColor}
                onChange={setBackgroundColor}
              />

              <IconPicker
                label="Icon"
                icons={ICONS}
                value={selectedIcon}
                onChange={setSelectedIcon}
              />
            </div>
          </div>

          <div className="flex flex-col h-full min-h-[360px]">
            <CounterPreview label="Preview">
              <Counter
                key={`${name}-${backgroundColor}-${selectedIcon}-${defaultValue}`}
                counter={{
                  id: counter.id,
                  initialValue: defaultValue,
                  value: defaultValue,
                  name,
                  backgroundColor,
                  icon: selectedIcon,
                  ...getDefaultBySize("M"),
                }}
                isPreview={true}
              />
            </CounterPreview>

            <div className="mt-auto pt-4">
              <ActionBar onCancel={onClose} onSave={handleSave} />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export { CounterEditor };
