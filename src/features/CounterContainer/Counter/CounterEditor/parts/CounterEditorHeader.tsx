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
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-2xl font-bold text-[var(--foreground)]">{title}</h2>
      <button
        onClick={onClose}
        className="text-[var(--text-muted)] hover:text-[var(--foreground)] text-2xl"
        aria-label={t("close")}
        title={t("close")}
      >
        <FaX className="w-5 h-5" />
      </button>
    </div>
  );
};

export { CounterEditorHeader };
