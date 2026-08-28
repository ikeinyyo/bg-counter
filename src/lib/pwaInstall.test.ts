import { describe, expect, it } from "vitest";
import { detectInstallGuide, isRunningStandalone } from "./pwaInstall";

const navigatorFor = (userAgent: string, platform = "iPhone", maxTouchPoints = 5) => ({
  userAgent,
  platform,
  maxTouchPoints,
});

describe("PWA install environment", () => {
  it("recognizes Chrome and Safari on iOS", () => {
    expect(detectInstallGuide(navigatorFor("Mozilla/5.0 (iPhone) CriOS/140 Mobile/15E148 Safari/604.1"))).toBe("ios-chrome");
    expect(detectInstallGuide(navigatorFor("Mozilla/5.0 (iPhone) Version/18.0 Mobile/15E148 Safari/604.1"))).toBe("ios-safari");
  });

  it("recognizes iPads requesting the desktop site", () => {
    expect(detectInstallGuide(navigatorFor("Mozilla/5.0 (Macintosh) Version/18.0 Safari/605.1.15", "MacIntel", 5))).toBe("ios-safari");
  });

  it("uses Android and desktop fallbacks", () => {
    expect(detectInstallGuide(navigatorFor("Mozilla/5.0 (Linux; Android 15) Chrome/140 Mobile", "Linux armv8l"))).toBe("android");
    expect(detectInstallGuide(navigatorFor("Mozilla/5.0 (Windows NT 10.0) Chrome/140", "Win32", 0))).toBe("desktop");
  });

  it("detects both standalone APIs", () => {
    expect(isRunningStandalone({ ...navigatorFor("iPhone"), standalone: true }, false)).toBe(true);
    expect(isRunningStandalone(navigatorFor("Chrome"), true)).toBe(true);
    expect(isRunningStandalone(navigatorFor("Chrome"), false)).toBe(false);
  });
});
