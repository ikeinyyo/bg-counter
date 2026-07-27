"use client";
import React from "react";
import { useTranslation } from "@/context/SettingsContext";

type Props = {
  onCancel: () => void;
  onSave: () => void;
  isSaving?: boolean;
};

const ActionBar = ({ onCancel, onSave, isSaving }: Props) => {
  const { t, resolvedTheme } = useTranslation();
  const theme =
    resolvedTheme === "dark"
      ? "hover:bg-[var(--foreground)] hover:text-black"
      : "hover:bg-black hover:text-white";
  return (
    <div className="flex gap-3">
      <button
        onClick={onCancel}
        className={`flex-1 px-4 py-2 border border-[var(--foreground)] rounded-md text-[var(--foreground)]  transition-colors ${theme}`}
      >
        {t("actionCancel")}
      </button>
      <button
        onClick={onSave}
        disabled={isSaving}
        className="flex-1 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/80 transition-colors disabled:opacity-60"
      >
        {isSaving ? t("actionSaving") : t("actionSave")}
      </button>
    </div>
  );
};

export { ActionBar };
