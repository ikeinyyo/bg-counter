"use client";

import { useEffect } from "react";
import { BsCheck2, BsGlobe2, BsInfoCircle, BsMoonStars } from "react-icons/bs";
import type { IconType } from "react-icons";
import { APP_VERSION } from "@/config/app";
import { useSettings, type Language, type Theme } from "@/context/SettingsContext";
import { NavBar } from "@/features/navbar/NavBar";
import { trackEvent } from "@/lib/telemetry";

const LANGUAGES: Language[] = ["es", "en", "it"];
const THEMES: Theme[] = ["light", "dark", "system"];

export default function SettingsPage() {
  const { t, language, theme, setLanguage, setTheme } = useSettings();

  useEffect(() => {
    document.title = `Juernes de Mesa — ${t("settingsTitle")}`;
  }, [t]);

  return (
    <>
      <NavBar />
      <main className="min-h-[calc(100dvh-3.5rem-var(--app-bottom-space)-env(safe-area-inset-bottom))] bg-[var(--background)] px-4 py-6 text-[var(--foreground)]">
        <div className="mx-auto max-w-2xl">
          <header className="mb-7">
            <h1 className="text-3xl font-bold tracking-tight">{t("settingsTitle")}</h1>
            <p className="mt-2 text-[var(--text-muted)]">{t("settingsDescription")}</p>
          </header>

          <div className="grid gap-5">
            <SettingSection icon={BsGlobe2} title={t("settingsLanguage")}>
              <div className="grid grid-cols-3 gap-2">
                {LANGUAGES.map((value) => (
                  <Choice key={value} selected={language === value} onClick={() => { setLanguage(value); trackEvent("setting_changed", { setting: "language", value }); }}>
                    {t(value === "es" ? "languageEs" : value === "en" ? "languageEn" : "languageIt")}
                  </Choice>
                ))}
              </div>
            </SettingSection>

            <SettingSection icon={BsMoonStars} title={t("settingsTheme")}>
              <div className="grid grid-cols-3 gap-2">
                {THEMES.map((value) => (
                  <Choice key={value} selected={theme === value} onClick={() => { setTheme(value); trackEvent("setting_changed", { setting: "theme", value }); }}>
                    {t(value === "light" ? "themeLight" : value === "dark" ? "themeDark" : "themeSystem")}
                  </Choice>
                ))}
              </div>
            </SettingSection>

            <SettingSection icon={BsInfoCircle} title={t("settingsAbout")}>
              <div className="flex min-h-12 items-center justify-between gap-4 rounded-2xl bg-[var(--surface-muted)] px-4">
                <span className="text-sm text-[var(--text-muted)]">{t("settingsVersion")}</span>
                <span className="font-mono text-sm font-bold">v{APP_VERSION}</span>
              </div>
            </SettingSection>
          </div>
          <p className="mt-6 text-center text-xs text-[var(--text-muted)]">{t("settingsSaved")}</p>
        </div>
      </main>
    </>
  );
}

function SettingSection({ icon: Icon, title, children }: { icon: IconType; title: string; children: React.ReactNode }) {
  return <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm sm:p-5"><div className="mb-4 flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon /></span><h2 className="font-bold">{title}</h2></div>{children}</section>;
}

function Choice({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button type="button" aria-pressed={selected} onClick={onClick} className={`relative min-h-14 rounded-2xl border px-2 text-sm font-semibold transition ${selected ? "border-primary bg-primary text-white" : "border-[var(--border)] bg-[var(--surface-muted)]"}`}>{children}{selected && <BsCheck2 className="absolute right-1.5 top-1.5" />}</button>;
}
