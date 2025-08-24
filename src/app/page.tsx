"use client";
import { useState, useEffect } from "react";
import { CounterContainer } from "@/features/CounterContainer/CounterContainer";
import { CounterConfig } from "@/features/CounterContainer/domain";
import { useWakeLock } from "@/hooks/useWakeLock";
import { layoutTemplates } from "@/features/CounterContainer/config/templates";
import { Bar } from "@/features/bar/Bar";
import { Footer } from "@/features/footer/Footer";
import { CounterLoading } from "@/features/CounterLoading/CounterLoading";

const STORAGE_KEY = "current-counters";

export default function Home() {
  const [counters, setCounters] = useState<CounterConfig[]>(
    layoutTemplates[0].counters
  );
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CounterConfig[];
        if (Array.isArray(parsed)) setCounters(parsed);
      }
    } catch {
    } finally {
      setMounted(true);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(counters));
    } catch {}
  }, [counters, mounted]);

  const { isSupported, requestWakeLock, isActive } = useWakeLock();
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "visible") activateWakeLock();
    };
    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("focus", handleVisibility);
    activateWakeLock();
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("focus", handleVisibility);
    };
  }, [isSupported, requestWakeLock]);
  const activateWakeLock = () => {
    if (isSupported) requestWakeLock();
  };

  const handleDeleteCounter = (id: string) => {
    setCounters((prev) => prev.filter((c) => c.id !== id));
  };
  const handleUpdateCounter = (updated: CounterConfig) => {
    setCounters((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
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

      <Footer isWakeLockActive={isActive} activateWakeLock={activateWakeLock} />
    </div>
  );
}
