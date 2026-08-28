"use client";
import React from "react";
import { useTranslation } from "@/context/SettingsContext";
import { Counter } from "../Counter";
import { CounterConfig } from "../../domain";
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
import { SizePicker } from "./parts/SizePicker";

type Props = {
  counter: CounterConfig;
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: CounterConfig) => void;
};

const CounterEditor = ({ counter, isOpen, onClose, onSave }: Props) => {
  const { t } = useTranslation();
  const {
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
  } = useCounterEditorState({ counter, onClose, onSave });

  if (!isOpen) return null;

  return (
    <Modal onClose={onClose}>
      <div className="flex max-h-[92dvh] flex-col sm:max-h-[90vh]">
        <div className="sticky top-0 z-10 border-b border-[var(--border)] bg-[var(--surface)] px-4 py-4 sm:px-6">
          <CounterEditorHeader title={t("editorTitle")} onClose={onClose} />
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-1 gap-5 overflow-y-auto p-4 sm:p-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(20rem,0.85fr)] lg:gap-8">
          <div className="w-full min-w-0 order-2 lg:order-1">
            <div className="grid gap-5">
              <NameField value={name} onChange={setName} />

              <DefaultValueField
                value={defaultValue}
                onChange={setDefaultValue}
                label={t("labelDefaultValue")}
                min={-9999}
                max={9999}
                step={1}
              />

              <ColorPicker
                label={t("labelBackgroundColor")}
                colors={COLORS}
                value={backgroundColor}
                onChange={setBackgroundColor}
              />

              <IconPicker
                label={t("labelIcon")}
                icons={ICONS}
                value={selectedIcon}
                onChange={setSelectedIcon}
              />

              <SizePicker value={size} layout={layout} onChange={setSize} />
            </div>
          </div>

          <div className="order-1 flex flex-col lg:order-2 lg:sticky lg:top-0 lg:self-start">
            <CounterPreview label={t("labelPreview")}>
              <Counter
                key={`${name}-${backgroundColor}-${selectedIcon}-${defaultValue}`}
                counter={{
                  id: counter.id,
                  initialValue: defaultValue,
                  value: defaultValue,
                  name,
                  backgroundColor,
                  icon: selectedIcon,
                  ...layout,
                }}
                isPreview={true}
              />
            </CounterPreview>
          </div>
        </div>

        <div className="sticky bottom-0 z-10 border-t border-[var(--border)] bg-[var(--surface)] px-4 py-3 sm:px-6">
          <div className="ml-auto max-w-md">
            <ActionBar onCancel={onClose} onSave={handleSave} />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export { CounterEditor };
