"use client";
import React from "react";
import { useTranslation } from "@/context/SettingsContext";
import { IconDef } from "../../../domain";

type Props = {
  label?: string;
  icons: IconDef[];
  value: string;
  onChange: (val: string) => void;
};

const IconPicker = ({ label = "Icon", icons, value, onChange }: Props) => {
  const { t, resolvedTheme } = useTranslation();

  return (
    <div className="min-w-0">
      <label className="block text-sm font-medium text-[var(--text-muted)] mb-2">
        {label}
      </label>
      <div
        className="
        grid grid-rows-4 [grid-auto-flow:column] auto-cols-max gap-2
        w-full h-44
        overflow-x-auto overflow-y-hidden
        pr-1 py-1
        snap-x snap-mandatory
      "
        role="listbox"
        aria-label={t("iconPickerAria")}
      >
        {icons.map((icon) => {
          const SelectedIcon = icon.component;
          const selected = value === icon.key;
          const borderColorClass = selected
            ? resolvedTheme === "dark"
              ? "border-white"
              : "border-black"
            : "border-[var(--border)] hover:border-primary/60";
          return (
            <button
              key={icon.key}
              onClick={() => onChange(icon.key)}
              className={`w-10 h-10 rounded-md border-2 transition-all flex items-center justify-center
                          border-3 ${borderColorClass}
                          snap-start
          `}
              title={icon.name}
              aria-pressed={selected}
              aria-label={`${t("labelIcon")} ${icon.name}`}
            >
              <SelectedIcon className="text-xl text-[var(--foreground)]" />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export { IconPicker };
