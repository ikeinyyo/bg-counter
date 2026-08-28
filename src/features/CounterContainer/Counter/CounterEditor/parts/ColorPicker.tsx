"use client";
import React from "react";
import { useTranslation } from "@/context/SettingsContext";
import { Color } from "../../../domain";

type Props = {
  label?: string;
  colors: Color[];
  value: string;
  onChange: (val: string) => void;
};

const ColorPicker = ({ label = "Color", colors, value, onChange }: Props) => {
  const { t, resolvedTheme } = useTranslation();
  return (
    <div className="min-w-0">
      <label className="mb-2 block text-sm font-semibold text-[var(--foreground)]">
        {label}
      </label>

      <div
        className="
        grid grid-cols-[repeat(auto-fill,minmax(3rem,1fr))] gap-x-3 gap-y-4
        w-full max-h-40 overflow-y-auto rounded-2xl border border-[var(--border)]
        bg-[var(--surface-muted)] p-4
      "
        role="listbox"
        aria-label={t("colorPickerAria")}
      >
        {colors.map((color) => {
          const selected = value === color.value;
          const borderColorClass = selected
            ? resolvedTheme === "dark"
              ? "border-white"
              : "border-black"
            : "border-[var(--border)] hover:border-primary/60";

          return (
            <button
              key={color.value}
              onClick={() => onChange(color.value)}
              className={`
              aspect-square min-h-12 rounded-xl transition-all box-border
              border-3 ${borderColorClass}
            `}
              style={{ backgroundColor: color.value }}
              title={color.name}
              aria-label={`Color ${color.name}`}
              role="option"
              aria-selected={selected}
            />
          );
        })}
      </div>
    </div>
  );
};

export { ColorPicker };
