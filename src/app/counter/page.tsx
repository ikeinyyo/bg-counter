"use client";

import { useEffect, useState } from "react";
import { CounterContainer } from "@/features/CounterContainer/CounterContainer";
import { CounterConfig } from "@/features/CounterContainer/domain";
import { layoutTemplates } from "@/features/CounterContainer/config/templates";
import { Bar } from "@/features/bar/Bar";
import { CounterLoading } from "@/features/CounterLoading/CounterLoading";
import { useSettings } from "@/context/SettingsContext";

const STORAGE_KEY = "current-counters";

const getInitialCounters = (): CounterConfig[] => {
  if (typeof window === "undefined") {
    return layoutTemplates[0].counters;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return layoutTemplates[0].counters;
    }

    const parsed = JSON.parse(raw) as CounterConfig[];
    return Array.isArray(parsed) ? parsed : layoutTemplates[0].counters;
  } catch {
    return layoutTemplates[0].counters;
  }
};

export default function CounterPage() {
  const [counters, setCounters] = useState<CounterConfig[]>(getInitialCounters);
  const [mounted, setMounted] = useState(false);
  const { t } = useSettings();

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.title = `Juernes de Mesa — ${t("counterTitle")}`;
    }
  }, [t]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || typeof window === "undefined") return;

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(counters));
    } catch {}
  }, [counters, mounted]);

  const handleDeleteCounter = (id: string) => {
    setCounters((prev) => prev.filter((c) => c.id !== id));
  };

  const handleUpdateCounter = (updated: CounterConfig) => {
    setCounters((prev) =>
      prev.map((c) => (c.id === updated.id ? { ...c, ...updated } : c)),
    );
  };

  return (
    <div className="flex flex-col">
      <Bar counters={counters} setCounters={setCounters} />

      {mounted ? (
        <CounterContainer
          countersDefault={counters}
          onDelete={handleDeleteCounter}
          onUpdate={handleUpdateCounter}
        />
      ) : (
        <CounterLoading />
      )}

      {/* Footer is global in layout now */}
    </div>
  );
}
