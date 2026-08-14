"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { configureTelemetry, trackEvent, trackPageView } from "@/lib/telemetry";

export const TelemetryProvider = () => {
  const pathname = usePathname();

  useEffect(() => {
    let active = true;

    const loadRuntimeConfiguration = async () => {
      let connectionString: string | undefined;
      try {
        const response = await fetch("/api/telemetry-config", { cache: "no-store" });
        if (response.ok) {
          const configuration = (await response.json()) as {
            connectionString?: unknown;
          };
          if (typeof configuration.connectionString === "string") {
            connectionString = configuration.connectionString;
          }
        }
      } catch {
        // Telemetry must never prevent the application from loading.
      } finally {
        if (!active) return;
        const telemetry = configureTelemetry(connectionString);
        if (!telemetry) return;

        const displayMode = window.matchMedia("(display-mode: standalone)").matches
          ? "standalone"
          : "browser";
        trackEvent("app_loaded", {
          displayMode,
          language: navigator.language,
          touchCapable: navigator.maxTouchPoints > 0,
        });
      }
    };

    void loadRuntimeConfiguration();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    trackPageView(pathname);
  }, [pathname]);

  return null;
};
