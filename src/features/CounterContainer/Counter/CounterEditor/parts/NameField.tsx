"use client";
import React from "react";
import { useTranslation } from "@/context/SettingsContext";
import { useSelectAllOnFocus } from "./useSelectAllOnFocus";

type Props = {
  value: string;
  onChange: (val: string) => void;
};

const NameField = ({ value, onChange }: Props) => {
  const { t } = useTranslation();
  const { ref, handlers } = useSelectAllOnFocus<HTMLInputElement>();

  return (
    <div>
      <label
        htmlFor="counter-name"
        className="mb-2 block text-sm font-semibold text-[var(--foreground)]"
      >
        {t("labelName")}
      </label>
      <input
        id="counter-name"
        ref={ref}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        {...handlers}
        className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-[var(--foreground)] outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        placeholder={t("placeholderCounterName")}
        inputMode="text"
        autoComplete="off"
      />
    </div>
  );
};

export { NameField };
