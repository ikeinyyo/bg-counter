export const OFFLINE_ROUTES = [
  "/",
  "/counter",
  "/choasis",
  "/timer",
  "/score-sheet",
  "/dice",
  "/help",
  "/settings",
] as const;

export const PWA_PUBLIC_ASSETS = [
  "/manifest.webmanifest",
  "/apple-touch-icon.png",
  "/apple-touch-icon-precomposed.png",
  "/companion-touch-icon.png",
  "/images/favicon.png",
  "/images/logo.png",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/companion-192.png",
  "/icons/companion-512.png",
  "/icons/apple-touch-icon.png",
  "/sounds/universfield-digital-alarm-clock-151927.mp3",
] as const;

export const PWA_PRECACHE_URLS = [
  ...OFFLINE_ROUTES,
  ...PWA_PUBLIC_ASSETS,
] as const;
