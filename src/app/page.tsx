"use client";
import { useState, useEffect } from "react";
import { CounterContainer } from "@/features/CounterContainer/CounterContainer";
import { CounterConfig } from "@/features/CounterContainer/domain";
import { useWakeLock } from "@/hooks/useWakeLock";
import { layoutTemplates } from "@/features/CounterContainer/config/templates";
import { Bar } from "@/features/bar/Bar";
import { Footer } from "@/features/footer/Footer";

export default function Home() {
  const [counters, setCounters] = useState<CounterConfig[]>(
    layoutTemplates[0].counters
  );
  const { isSupported, requestWakeLock, isActive } = useWakeLock();

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        activateWakeLock();
      }
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
    console.log("Activando wake lock");
    if (isSupported) {
      requestWakeLock();
    }
  };

  const handleDeleteCounter = (id: string) => {
    setCounters(counters.filter((counter) => counter.id !== id));
  };

  const handleUpdateCounter = (updatedCounter: CounterConfig) => {
    setCounters((prev) =>
      prev.map((c) => (c.id === updatedCounter.id ? updatedCounter : c))
    );
  };

  return (
    <div className="flex flex-col">
      <Bar counters={counters} setCounters={setCounters} />

      <CounterContainer
        countersDefault={counters}
        onDelete={handleDeleteCounter}
        onUpdate={handleUpdateCounter}
      />

      <Footer isWakeLockActive={isActive} activateWakeLock={activateWakeLock} />
    </div>
  );
}
