import type { Metadata, Viewport } from "next";
import { SettingsProvider } from "@/context/SettingsContext";
import { VHProvider } from "@/features/layout/VHProvider";
import { TelemetryProvider } from "@/features/telemetry/TelemetryProvider";
import {
  AppNavigation,
  AppNavigationProvider,
} from "@/features/navigation/AppNavigation";
import "./globals.css";

export const metadata: Metadata = {
  applicationName: "Companion",
  title: "Companion",
  description:
    "Companion app with handy tools for board games — counters and more. Designed for quick, mobile use.",
  manifest: "/manifest.webmanifest",
  icons: {
    apple: [
      {
        url: "/companion-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Companion",
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
      <head>
        <link rel="apple-touch-icon-precomposed" sizes="180x180" href="/apple-touch-icon-precomposed.png" />
      </head>
      <body className="antialiased">
        <SettingsProvider>
          <AppNavigationProvider>
            <VHProvider />
            <TelemetryProvider />
            {children}
            <AppNavigation />
          </AppNavigationProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
