"use client";
import React from "react";
import { useTranslation } from "@/context/SettingsContext";
import { FaX } from "react-icons/fa6";

type Props = {
  title: string;
  onClose: () => void;
};

const CounterEditorHeader = ({ title, onClose }: Props) => {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
          {t("counterTitle")}
        </p>
        <h2 className="mt-1 text-xl font-bold text-[var(--foreground)] sm:text-2xl">{title}</h2>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="flex h-11 w-11 items-center justify-center rounded-full text-[var(--text-muted)] transition hover:bg-[var(--surface-muted)] hover:text-[var(--foreground)]"
        aria-label={t("close")}
        title={t("close")}
      >
        <FaX className="w-5 h-5" />
      </button>
    </div>
  );
};

export { CounterEditorHeader };
