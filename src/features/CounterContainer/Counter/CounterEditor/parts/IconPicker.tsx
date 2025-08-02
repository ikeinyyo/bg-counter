"use client";
import React from "react";
import { IconDef } from "../../../domain";

type Props = {
  label?: string;
  icons: IconDef[];
  value: string;
  onChange: (val: string) => void;
};

const IconPicker = ({ label = "Icon", icons, value, onChange }: Props) => (
  <div className="min-w-0">
    <label className="block text-sm font-medium text-gray-700 mb-2">
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
      aria-label="Icon Picker"
    >
      {icons.map((icon) => {
        const SelectedIcon = icon.component;
        const selected = value === icon.key;
        return (
          <button
            key={icon.key}
            onClick={() => onChange(icon.key)}
            className={`w-10 h-10 rounded-md border-2 transition-all flex items-center justify-center
            ${
              selected
                ? "border-dark"
                : "border-gray-300 hover:border-gray-500 hover:bg-gray-50"
            }
            snap-start
          `}
            title={icon.name}
            aria-pressed={selected}
            aria-label={`Icon ${icon.name}`}
          >
            <SelectedIcon className="text-xl text-gray-700" />
          </button>
        );
      })}
    </div>
  </div>
);

export { IconPicker };
