"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { initializeTelemetry, trackEvent, trackPageView } from "@/lib/telemetry";

export const TelemetryProvider = () => {
  const pathname = usePathname();

  useEffect(() => {
    const telemetry = initializeTelemetry();
    if (!telemetry) return;

    const displayMode = window.matchMedia("(display-mode: standalone)").matches
      ? "standalone"
      : "browser";
    trackEvent("app_loaded", {
      displayMode,
      language: navigator.language,
      touchCapable: navigator.maxTouchPoints > 0,
    });
  }, []);

  useEffect(() => {
    trackPageView(pathname);
  }, [pathname]);

  return null;
};
