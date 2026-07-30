"use client";

import { useEffect } from "react";

export function VHProvider() {
  useEffect(() => {
    const setVhVar = () => {
      if (typeof window === "undefined") return;
      const vv = (window as any).visualViewport as VisualViewport | undefined;
      const vh = vv?.height ?? window.innerHeight;
      document.documentElement.style.setProperty("--app-vh", `${vh}px`);
    };

    setVhVar();
    window.addEventListener("resize", setVhVar);
    window.addEventListener("orientationchange", setVhVar);
    const vv = (window as any).visualViewport as VisualViewport | undefined;
    vv?.addEventListener("resize", setVhVar);
    vv?.addEventListener("scroll", setVhVar);
    return () => {
      window.removeEventListener("resize", setVhVar);
      window.removeEventListener("orientationchange", setVhVar);
      vv?.removeEventListener("resize", setVhVar);
      vv?.removeEventListener("scroll", setVhVar);
    };
  }, []);

  return null;
}
