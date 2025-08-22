import { useEffect, useRef, useState } from "react";

export const useWakeLock = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  useEffect(() => {
    setIsSupported("wakeLock" in navigator);
  }, []);

  const requestWakeLock = async () => {
    if (!isSupported) {
      return false;
    }

    if (document.hidden) {
      return false;
    }

    try {
      wakeLockRef.current = await navigator.wakeLock.request("screen");
      setIsActive(true);

      wakeLockRef.current.addEventListener("release", () => {
        setIsActive(false);
      });

      return true;
    } catch (err) {
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
