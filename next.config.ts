import withSerwistInit from "@serwist/next";
import type { NextConfig } from "next";
import { PWA_PRECACHE_URLS } from "./src/config/pwa";

const nextConfig: NextConfig = {
  output: "standalone",
};

const offlineRevision =
  process.env.GITHUB_SHA ?? process.env.SOURCE_VERSION ?? Date.now().toString();

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV !== "production",
  register: true,
  cacheOnNavigation: true,
  reloadOnOnline: false,
  additionalPrecacheEntries: PWA_PRECACHE_URLS.map((url) => ({
    url,
    revision: offlineRevision,
  })),
});

export default withSerwist(nextConfig);
