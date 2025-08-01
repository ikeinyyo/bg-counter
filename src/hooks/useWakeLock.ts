import { useEffect, useRef, useState } from "react";

export const useWakeLock = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  useEffect(() => {
    // Verificar si el navegador soporta Wake Lock API
    setIsSupported("wakeLock" in navigator);
  }, []);

  const requestWakeLock = async () => {
    if (!isSupported) {
      console.warn("Wake Lock API no está soportada en este navegador");
      return false;
    }

    // Verificar que la página esté visible antes de solicitar wake lock
    if (document.hidden) {
      console.warn("No se puede activar Wake Lock: la página no está visible");
      return false;
    }

    try {
      wakeLockRef.current = await navigator.wakeLock.request("screen");
      setIsActive(true);

      // Listener para cuando se libera el wake lock
      wakeLockRef.current.addEventListener("release", () => {
        setIsActive(false);
        console.log("Wake Lock liberado");
      });

      console.log("Wake Lock activado");
      return true;
    } catch (err) {
      console.error("Error al activar Wake Lock:", err);
      return false;
    }
  };

  const releaseWakeLock = async () => {
    if (wakeLockRef.current) {
      await wakeLockRef.current.release();
      wakeLockRef.current = null;
      setIsActive(false);
    }
  };

  // Reactivar wake lock cuando la página vuelve a ser visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (
        document.visibilityState === "visible" &&
        isActive &&
        !wakeLockRef.current
      ) {
        requestWakeLock();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isActive, isSupported]);

  // Limpiar al desmontar el componente
  useEffect(() => {
    return () => {
      releaseWakeLock();
    };
  }, []);

  return {
    isSupported,
    isActive,
    requestWakeLock,
    releaseWakeLock,
  };
};
