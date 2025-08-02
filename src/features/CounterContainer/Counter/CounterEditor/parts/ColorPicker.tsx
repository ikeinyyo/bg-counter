"use client";
import React from "react";
import { Color } from "../../../domain";

type Props = {
  label?: string;
  colors: Color[];
  value: string;
  onChange: (val: string) => void;
};

const ColorPicker = ({ label = "Color", colors, value, onChange }: Props) => (
  <div className="min-w-0">
    <label className="block text-sm font-medium text-gray-700 mb-2">
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
      aria-label="Color Picker"
    >
      {colors.map((color) => {
        const selected = value === color.value;
        return (
          <button
            key={color.value}
            onClick={() => onChange(color.value)}
            className={`
              w-10 h-10 rounded-md border-2 transition-all
              ${
                selected
                  ? "border-dark"
                  : "border-gray-300 hover:border-gray-500"
              }
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

export { ColorPicker };
