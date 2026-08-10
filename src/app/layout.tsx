import type { Metadata, Viewport } from "next";
import { SettingsProvider } from "@/context/SettingsContext";
import { Footer } from "@/features/footer/Footer";
import { VHProvider } from "@/features/layout/VHProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Juernes de Mesa - Companion",
  description:
    "Companion app with handy tools for board games — counters and more. Designed for quick, mobile use.",
  icons: {
    icon: "/images/favicon.png",
    apple: "/icons/apple-touch-icon.png",
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Juernes de Mesa",
  },
};

export const viewport: Viewport = {
  themeColor: "#be1e2d",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" data-theme="light">
      <body className="antialiased">
        <SettingsProvider>
          <VHProvider />
          {children}
          <Footer />
        </SettingsProvider>
      </body>
    </html>
  );
}
