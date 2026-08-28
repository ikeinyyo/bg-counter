import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Companion",
    short_name: "Companion",
    description:
      "Utilidades para juegos de mesa: contadores, temporizador, selección de jugadores y hoja de puntuación.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#be1e2d",
    lang: "es",
    categories: ["games", "utilities"],
    icons: [
      {
        src: "/icons/companion-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/companion-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
