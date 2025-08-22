import React from "react";
import { useSelectAllOnFocus } from "./useSelectAllOnFocus";

type Props = {
  value: number;
  onChange: (v: number) => void;
  label?: string;
  min?: number;
  max?: number;
  step?: number;
};

const DefaultValueField = ({
  value,
  onChange,
  label = "Default value",
  min,
  max,
  step = 1,
}: Props) => {
  const { ref, handlers } = useSelectAllOnFocus<HTMLInputElement>();

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <input
        ref={ref}
        type="number"
        className="w-full text-black rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
        value={Number.isFinite(value) ? value : 0}
        onChange={(e) => {
          const next = e.target.value === "" ? 0 : Number(e.target.value);
          onChange(Number.isNaN(next) ? 0 : next);
        }}
        {...handlers}
        min={min}
        max={max}
        step={step}
        inputMode="numeric"
      />
    </div>
  );
};

export { DefaultValueField };
