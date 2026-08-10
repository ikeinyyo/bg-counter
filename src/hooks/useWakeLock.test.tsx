import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useWakeLock } from "./useWakeLock";

vi.mock("next/navigation", () => ({
  usePathname: () => "/test",
}));

class FakeSentinel extends EventTarget {
  released = false;
  release = vi.fn(async () => {
    if (this.released) return;
    this.released = true;
    this.dispatchEvent(new Event("release"));
  });
}

describe("useWakeLock", () => {
  const request = vi.fn<() => Promise<FakeSentinel>>();

  beforeEach(() => {
    request.mockReset();
    request.mockImplementation(async () => new FakeSentinel());
    Object.defineProperty(navigator, "wakeLock", {
      configurable: true,
      value: { request },
    });
    Object.defineProperty(document, "visibilityState", {
      configurable: true,
      value: "visible",
    });
  });

  it("is enabled by default and acquires a screen wake lock", async () => {
    const { result } = renderHook(() => useWakeLock());

    await waitFor(() => expect(result.current.isSupported).toBe(true));
    await waitFor(() => expect(result.current.isActive).toBe(true));
    expect(result.current.isEnabled).toBe(true);
    expect(request).toHaveBeenCalledWith("screen");
  });

  it("persists disabling and releases the active lock", async () => {
    const sentinel = new FakeSentinel();
    request.mockResolvedValueOnce(sentinel);
    const { result } = renderHook(() => useWakeLock());
    await waitFor(() => expect(result.current.isActive).toBe(true));

    act(() => result.current.setIsEnabled(false));

    await waitFor(() => expect(sentinel.release).toHaveBeenCalled());
    expect(result.current.isActive).toBe(false);
    expect(localStorage.getItem("bg-counter-wake-lock-enabled")).toBe("false");
  });

  it("reacquires a lock released by the browser when focus returns", async () => {
    const first = new FakeSentinel();
    const second = new FakeSentinel();
    request.mockResolvedValueOnce(first).mockResolvedValueOnce(second);
    const { result } = renderHook(() => useWakeLock());
    await waitFor(() => expect(result.current.isActive).toBe(true));

    await act(async () => first.release());
    act(() => window.dispatchEvent(new Event("focus")));

    await waitFor(() => expect(request).toHaveBeenCalledTimes(2));
    await waitFor(() => expect(result.current.isActive).toBe(true));
  });

  it("respects a saved disabled preference on entry", async () => {
    localStorage.setItem("bg-counter-wake-lock-enabled", "false");
    const { result } = renderHook(() => useWakeLock());

    await waitFor(() => expect(result.current.isSupported).toBe(true));
    expect(result.current.isEnabled).toBe(false);
    expect(request).not.toHaveBeenCalled();
  });

  it("reports unsupported browsers without attempting a request", async () => {
    Reflect.deleteProperty(navigator, "wakeLock");

    const { result } = renderHook(() => useWakeLock());

    await waitFor(() => expect(result.current.isSupported).toBe(false));
    expect(result.current.isEnabled).toBe(true);
    expect(result.current.isActive).toBe(false);
    expect(request).not.toHaveBeenCalled();
    await expect(result.current.requestWakeLock()).resolves.toBe(false);
  });

  it("stays inactive after a rejected request and recovers on focus", async () => {
    const warning = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    request.mockRejectedValue(new Error("permission denied"));
    const { result } = renderHook(() => useWakeLock());

    await waitFor(() => expect(request).toHaveBeenCalled());
    await waitFor(() => expect(warning).toHaveBeenCalled());
    expect(result.current.isActive).toBe(false);

    request.mockReset();
    request.mockResolvedValue(new FakeSentinel());
    act(() => window.dispatchEvent(new Event("focus")));

    await waitFor(() => expect(result.current.isActive).toBe(true));
  });

  it("releases a request that completes after the setting was disabled", async () => {
    let resolveRequest!: (sentinel: FakeSentinel) => void;
    request.mockImplementationOnce(
      () => new Promise<FakeSentinel>((resolve) => (resolveRequest = resolve)),
    );
    const { result } = renderHook(() => useWakeLock());
    await waitFor(() => expect(request).toHaveBeenCalledOnce());

    act(() => result.current.setIsEnabled(false));
    const sentinel = new FakeSentinel();
    await act(async () => resolveRequest(sentinel));

    await waitFor(() => expect(sentinel.release).toHaveBeenCalledOnce());
    expect(result.current.isActive).toBe(false);
  });

  it("waits while hidden and acquires when the document becomes visible", async () => {
    Object.defineProperty(document, "visibilityState", {
      configurable: true,
      value: "hidden",
    });
    const { result } = renderHook(() => useWakeLock());
    await waitFor(() => expect(result.current.isSupported).toBe(true));
    expect(request).not.toHaveBeenCalled();

    Object.defineProperty(document, "visibilityState", {
      configurable: true,
      value: "visible",
    });
    act(() => document.dispatchEvent(new Event("visibilitychange")));

    await waitFor(() => expect(result.current.isActive).toBe(true));
  });

  it("synchronizes an externally disabled setting and releases the lock", async () => {
    const sentinel = new FakeSentinel();
    request.mockResolvedValueOnce(sentinel);
    const { result } = renderHook(() => useWakeLock());
    await waitFor(() => expect(result.current.isActive).toBe(true));

    localStorage.setItem("bg-counter-wake-lock-enabled", "false");
    act(() =>
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: "bg-counter-wake-lock-enabled",
          newValue: "false",
        }),
      ),
    );

    await waitFor(() => expect(result.current.isEnabled).toBe(false));
    await waitFor(() => expect(sentinel.release).toHaveBeenCalledOnce());
    expect(result.current.isActive).toBe(false);
  });

  it("remains disabled even if the browser fails to release the sentinel", async () => {
    const warning = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const sentinel = new FakeSentinel();
    sentinel.release.mockRejectedValueOnce(new Error("release failed"));
    request.mockResolvedValueOnce(sentinel);
    const { result } = renderHook(() => useWakeLock());
    await waitFor(() => expect(result.current.isActive).toBe(true));

    act(() => result.current.setIsEnabled(false));

    await waitFor(() => expect(warning).toHaveBeenCalled());
    expect(result.current.isEnabled).toBe(false);
    expect(result.current.isActive).toBe(false);
  });

  it("releases its active sentinel when the component unmounts", async () => {
    const sentinel = new FakeSentinel();
    request.mockResolvedValueOnce(sentinel);
    const { result, unmount } = renderHook(() => useWakeLock());
    await waitFor(() => expect(result.current.isActive).toBe(true));

    unmount();

    expect(sentinel.release).toHaveBeenCalledOnce();
  });
});
