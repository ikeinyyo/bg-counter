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
      <label className="block text-sm font-medium text-[var(--text-muted)]">
        {t("labelName")}
      </label>
      <input
        ref={ref}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        {...handlers}
        className="w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-[var(--surface)] text-[var(--foreground)] border border-[var(--border)]"
        placeholder={t("placeholderCounterName")}
        inputMode="text"
        autoComplete="off"
      />
    </div>
  );
};

export { NameField };
