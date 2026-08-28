import sharp from "sharp";

const source = process.argv.slice(2).find((argument) => argument !== "--");

if (!source) {
  throw new Error("Indica la ruta de la imagen maestra, por ejemplo: pnpm icons:pwa -- public/images/app-icon.png");
}

const icons = [
  ["public/apple-touch-icon.png", 180],
  ["public/apple-touch-icon-precomposed.png", 180],
  ["public/companion-touch-icon.png", 180],
  ["public/icons/apple-touch-icon.png", 180],
  ["public/icons/icon-192.png", 192],
  ["public/icons/icon-512.png", 512],
  ["public/icons/companion-192.png", 192],
  ["public/icons/companion-512.png", 512],
  ["public/images/favicon.png", 64],
  ["src/app/apple-icon.png", 180],
];

await Promise.all(
  icons.map(([output, size]) =>
    sharp(source)
      .resize(size, size)
      .png()
      .toFile(output),
  ),
);
