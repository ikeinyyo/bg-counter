import { useEffect, useState } from "react";

export type Breakpoint = "xs" | "md" | "lg";

const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>("xs");

  const calcBreakpoint = () => {
    const width = window.innerWidth;
    if (width >= 1024) return "lg";
    if (width >= 768) return "md";
    return "xs";
  };

  useEffect(() => {
    setBreakpoint(calcBreakpoint());

    const handleResize = () => {
      setBreakpoint(calcBreakpoint());
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return {
    breakpoint,
    isXs: breakpoint === "xs",
    isMd: breakpoint === "md",
    isLg: breakpoint === "lg",
  };
};

export { useBreakpoint };
