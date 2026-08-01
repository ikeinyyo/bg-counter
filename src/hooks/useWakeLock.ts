import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const STORAGE_KEY = "bg-counter-wake-lock-enabled";

const useWakeLock = () => {
  const pathname = usePathname();
  const [isSupported, setIsSupported] = useState(false);
  const [isEnabled, setIsEnabledState] = useState(true);
  const [isActive, setIsActive] = useState(false);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);
  const requestRef = useRef<Promise<boolean> | null>(null);
  const isEnabledRef = useRef(true);
  const isMountedRef = useRef(false);
  const retryTimeoutRef = useRef<number | null>(null);

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
      if (isMountedRef.current) setIsActive(true);
      return Promise.resolve(true);
    }

    if (wakeLockRef.current?.released) {
      wakeLockRef.current = null;
      if (isMountedRef.current) setIsActive(false);
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

  const reconcileWakeLock = useCallback(async () => {
    if (!isMountedRef.current || typeof navigator === "undefined") return;

    let enabled = true;
    try {
      const storedValue = window.localStorage.getItem(STORAGE_KEY);
      enabled = storedValue === null ? true : storedValue === "true";
    } catch {
      // Wake lock is enabled on first use by default.
    }

    isEnabledRef.current = enabled;
    setIsEnabledState(enabled);

    if (retryTimeoutRef.current !== null) {
      window.clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }

    if (!enabled) {
      await releaseWakeLock();
      return;
    }

    if (
      !("wakeLock" in navigator) ||
      document.visibilityState !== "visible"
    ) {
      return;
    }

    const acquired = await requestWakeLock();
    if (
      !acquired &&
      isMountedRef.current &&
      isEnabledRef.current &&
      document.visibilityState === "visible"
    ) {
      // A page can report itself as visible before it is fully active. Retry
      // once after entry/navigation to cover that transient browser state.
      retryTimeoutRef.current = window.setTimeout(() => {
        retryTimeoutRef.current = null;
        void requestWakeLock();
      }, 500);
    }
  }, [releaseWakeLock, requestWakeLock]);

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
      if (retryTimeoutRef.current !== null) {
        window.clearTimeout(retryTimeoutRef.current);
        retryTimeoutRef.current = null;
      }
      const sentinel = wakeLockRef.current;
      wakeLockRef.current = null;
      if (sentinel && !sentinel.released) void sentinel.release();
    };
  }, []);

  useEffect(() => {
    void reconcileWakeLock();
  }, [isEnabled, isSupported, reconcileWakeLock]);

  useEffect(() => {
    const reconcile = () => {
      void reconcileWakeLock();
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) reconcile();
    };

    document.addEventListener("visibilitychange", reconcile);
    window.addEventListener("focus", reconcile);
    window.addEventListener("pageshow", reconcile);
    window.addEventListener("storage", handleStorage);

    return () => {
      document.removeEventListener("visibilitychange", reconcile);
      window.removeEventListener("focus", reconcile);
      window.removeEventListener("pageshow", reconcile);
      window.removeEventListener("storage", handleStorage);
    };
  }, [reconcileWakeLock]);

  useEffect(() => {
    void reconcileWakeLock();
  }, [pathname, reconcileWakeLock]);

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
