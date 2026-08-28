"use client";
import React from "react";
import { useTranslation } from "@/context/SettingsContext";

type Props = {
  onCancel: () => void;
  onSave: () => void;
  isSaving?: boolean;
};

const ActionBar = ({ onCancel, onSave, isSaving }: Props) => {
  const { t } = useTranslation();
  return (
    <div className="flex gap-3">
      <button
        onClick={onCancel}
        className="min-h-11 flex-1 rounded-xl border border-[var(--border)] px-4 py-2 font-semibold text-[var(--foreground)] transition-colors hover:bg-[var(--surface-muted)]"
      >
        {t("actionCancel")}
      </button>
      <button
        onClick={onSave}
        disabled={isSaving}
        className="min-h-11 flex-1 rounded-xl bg-primary px-4 py-2 font-semibold text-white transition-colors hover:bg-primary/80 disabled:opacity-60"
      >
        {isSaving ? t("actionSaving") : t("actionSave")}
      </button>
    </div>
  );
};

export { ActionBar };
