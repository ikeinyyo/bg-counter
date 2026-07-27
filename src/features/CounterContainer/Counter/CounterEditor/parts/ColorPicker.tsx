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
      <label className="block text-sm font-medium text-[var(--text-muted)] mb-2">
        {label}
      </label>

      <div
        className="
        grid grid-rows-2 [grid-auto-flow:column] auto-cols-max gap-2
        w-full h-24
        overflow-x-auto overflow-y-hidden
        pr-1 py-1
        snap-x snap-mandatory
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
              w-10 h-10 rounded-md transition-all box-border
              border-3 ${borderColorClass}
              snap-start
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
