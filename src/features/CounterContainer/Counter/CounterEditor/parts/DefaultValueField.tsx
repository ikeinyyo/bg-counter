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
      <label
        htmlFor="counter-default-value"
        className="block text-sm font-medium text-[var(--text-muted)] mb-2"
      >
        {label}
      </label>
      <input
        id="counter-default-value"
        ref={ref}
        type="number"
        className="w-full rounded-md border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
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
