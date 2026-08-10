export const OFFLINE_ROUTES = [
  "/",
  "/counter",
  "/choasis",
  "/timer",
  "/score-sheet",
  "/help",
] as const;

export const PWA_PUBLIC_ASSETS = [
  "/manifest.webmanifest",
  "/images/favicon.png",
  "/images/logo.png",
  "/icons/icon.svg",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/apple-touch-icon.png",
  "/sounds/universfield-digital-alarm-clock-151927.mp3",
] as const;

export const PWA_PRECACHE_URLS = [
  ...OFFLINE_ROUTES,
  ...PWA_PUBLIC_ASSETS,
] as const;
