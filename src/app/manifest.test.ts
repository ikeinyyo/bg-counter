import { describe, expect, it } from "vitest";
import { OFFLINE_ROUTES, PWA_PRECACHE_URLS } from "@/config/pwa";
import manifest from "./manifest";

describe("PWA manifest", () => {
  it("is installable and provides the required application icons", () => {
    const value = manifest();

    expect(value).toMatchObject({
      name: "Juernes de Mesa — Companion",
      start_url: "/",
      scope: "/",
      display: "standalone",
      theme_color: "#be1e2d",
    });
    expect(value.icons).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ sizes: "192x192" }),
        expect.objectContaining({ sizes: "512x512" }),
      ]),
    );
  });

  it("precaches every tool and all essential local resources", () => {
    expect(OFFLINE_ROUTES).toEqual([
      "/",
      "/counter",
      "/choasis",
      "/timer",
      "/score-sheet",
      "/dice",
      "/help",
    ]);
    expect(PWA_PRECACHE_URLS).toEqual(
      expect.arrayContaining([
        "/manifest.webmanifest",
        "/apple-touch-icon.png",
        "/images/logo.png",
        "/sounds/universfield-digital-alarm-clock-151927.mp3",
      ]),
    );
  });
});
