import { useCallback, useEffect, useRef, useState } from "react";

const STORAGE_KEY = "bg-counter-wake-lock-enabled";

const useWakeLock = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [isEnabled, setIsEnabledState] = useState(true);
  const [isActive, setIsActive] = useState(false);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);
  const requestRef = useRef<Promise<boolean> | null>(null);
  const isEnabledRef = useRef(true);
  const isMountedRef = useRef(false);

  const requestWakeLock = useCallback(function acquireWakeLock(): Promise<boolean> {
    if (
      typeof navigator === "undefined" ||
      !("wakeLock" in navigator) ||
      document.visibilityState !== "visible" ||
      !isEnabledRef.current ||
      !isMountedRef.current
    ) {
      return Promise.resolve(false);
    }

    if (wakeLockRef.current && !wakeLockRef.current.released) {
      return Promise.resolve(true);
    }

    if (requestRef.current) return requestRef.current;

    const request = (async () => {
      try {
        const sentinel = await navigator.wakeLock.request("screen");

        if (
          !isMountedRef.current ||
          !isEnabledRef.current ||
          document.visibilityState !== "visible"
        ) {
          await sentinel.release();
          return false;
        }

        wakeLockRef.current = sentinel;
        setIsActive(true);

        sentinel.addEventListener(
          "release",
          () => {
            if (wakeLockRef.current === sentinel) {
              wakeLockRef.current = null;
              if (isMountedRef.current) setIsActive(false);
            }

            // Some browsers release the lock while changing visibility. If the
            // page is already visible again, retry after the release settles.
            if (
              isMountedRef.current &&
              isEnabledRef.current &&
              document.visibilityState === "visible"
            ) {
              window.setTimeout(() => void acquireWakeLock(), 0);
            }
          },
          { once: true },
        );

        return true;
      } catch (error) {
        console.warn("Unable to acquire the screen wake lock", error);
        if (isMountedRef.current) setIsActive(false);
        return false;
      }
    })();

    requestRef.current = request;
    void request.finally(() => {
      if (requestRef.current === request) requestRef.current = null;
    });
    return request;
  }, []);

  const releaseWakeLock = useCallback(async () => {
    const sentinel = wakeLockRef.current;
    wakeLockRef.current = null;
    if (isMountedRef.current) setIsActive(false);

    if (sentinel && !sentinel.released) {
      try {
        await sentinel.release();
      } catch (error) {
        console.warn("Unable to release the screen wake lock", error);
      }
    }
  }, []);

  const setIsEnabled = useCallback((enabled: boolean) => {
    isEnabledRef.current = enabled;
    setIsEnabledState(enabled);

    try {
      window.localStorage.setItem(STORAGE_KEY, String(enabled));
    } catch {
      // Keep the setting for this session if storage is unavailable.
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    let enabled = true;

    try {
      const storedValue = window.localStorage.getItem(STORAGE_KEY);
      enabled = storedValue === null ? true : storedValue === "true";
    } catch {
      // Wake lock is enabled on first use by default.
    }

    isEnabledRef.current = enabled;
    setIsEnabledState(enabled);
    setIsSupported("wakeLock" in navigator);

    return () => {
      isMountedRef.current = false;
      const sentinel = wakeLockRef.current;
      wakeLockRef.current = null;
      if (sentinel && !sentinel.released) void sentinel.release();
    };
  }, []);

  useEffect(() => {
    if (!isSupported) return;

    if (isEnabled) {
      void requestWakeLock();
    } else {
      void releaseWakeLock();
    }
  }, [isEnabled, isSupported, releaseWakeLock, requestWakeLock]);

  useEffect(() => {
    const reacquireWakeLock = () => {
      if (
        document.visibilityState === "visible" &&
        isEnabledRef.current
      ) {
        void requestWakeLock();
      }
    };

    document.addEventListener("visibilitychange", reacquireWakeLock);
    window.addEventListener("focus", reacquireWakeLock);
    window.addEventListener("pageshow", reacquireWakeLock);

    return () => {
      document.removeEventListener("visibilitychange", reacquireWakeLock);
      window.removeEventListener("focus", reacquireWakeLock);
      window.removeEventListener("pageshow", reacquireWakeLock);
    };
  }, [requestWakeLock]);

  return {
    isSupported,
    isEnabled,
    isActive,
    setIsEnabled,
    requestWakeLock,
    releaseWakeLock,
  };
};

export { useWakeLock };
