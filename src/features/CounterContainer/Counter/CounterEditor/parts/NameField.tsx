"use client";
import React from "react";
import { useSelectAllOnFocus } from "./useSelectAllOnFocus";

type Props = {
  value: string;
  onChange: (val: string) => void;
};

const NameField = ({ value, onChange }: Props) => {
  const { ref, handlers } = useSelectAllOnFocus<HTMLInputElement>();

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">Name</label>
      <input
        ref={ref}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        {...handlers}
        className="text-black w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        placeholder="Nombre del contador"
        inputMode="text"
        autoComplete="off"
      />
    </div>
  );
};

export { NameField };
