"use client";

import Link from "next/link";
import {
  useSettings,
  useTranslation,
  type Language,
  type Theme,
} from "@/context/SettingsContext";
import { FaComputer, FaGlobe, FaMoon, FaSun } from "react-icons/fa6";
import { useWakeLock } from "@/hooks/useWakeLock";
import { trackEvent } from "@/lib/telemetry";

const Footer = () => {
  const { t } = useTranslation();
  const { language, theme, setLanguage, setTheme } = useSettings();
  const { isSupported, isEnabled, isActive, setIsEnabled } = useWakeLock();
  const themeIcon =
    theme === "dark" ? (
      <FaMoon />
    ) : theme === "light" ? (
      <FaSun />
    ) : (
      <FaComputer />
    );
  return (
    <footer
      className="flex h-[calc(3rem+env(safe-area-inset-bottom))] min-h-[calc(3rem+env(safe-area-inset-bottom))] shrink-0 items-center justify-end overflow-hidden md:justify-between border-t border-[var(--border)] bg-[var(--navbar-bg)] text-[var(--navbar-fg)]"
      style={{
        paddingBottom: "env(safe-area-inset-bottom)",
        paddingLeft: "calc(env(safe-area-inset-left, 0px) + 8px)",
        paddingRight: "calc(env(safe-area-inset-right, 0px) + 8px)",
      }}
    >
      <span className="hidden md:inline-flex leading-tight text-xs">
        <span className="whitespace-nowrap">© 2025 </span>
        <Link
          className="text-primary hover:text-white transition-colors text-bold cursor-pointer"
          href="https://juernesdemesa.com"
        >
          Juernes de Mesa
        </Link>
        <span>. {t("footerAllRights")}</span>
      </span>
      <div className="flex min-w-0 items-center gap-1.5 sm:gap-3">
        <div className="flex shrink-0 items-center gap-1">
          <span className="whitespace-nowrap text-[10px] sm:text-xs">
            {t("wakeLockShortLabel")}
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={isEnabled}
            aria-label={t("wakeLockLabel")}
            title={
              !isSupported
                ? t("wakeLockUnsupported")
                : isActive
                  ? t("wakeLockActive")
                  : t("wakeLockInactive")
            }
            disabled={!isSupported}
            onClick={() => {
              trackEvent("setting_changed", { setting: "wakeLock", value: !isEnabled });
              setIsEnabled(!isEnabled);
            }}
            className={`relative h-5 w-9 shrink-0 rounded-full border border-white/25 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-40 ${
              isEnabled ? "bg-primary" : "bg-gray-600"
            }`}
          >
            <span
              aria-hidden
              className={`absolute left-0.5 top-0.5 h-[14px] w-[14px] rounded-full bg-white shadow-sm transition-transform ${
                isEnabled ? "translate-x-4" : "translate-x-0"
              }`}
            />
          </button>
        </div>
        <div className="flex items-center gap-1">
          <FaGlobe aria-hidden className="hidden sm:block opacity-80" />
          <select
            aria-label={t("languageLabel")}
            value={language}
            onChange={(e) => {
              trackEvent("setting_changed", { setting: "language", value: e.target.value });
              setLanguage(e.target.value as Language);
            }}
            className="min-w-0 rounded-md border border-white/20 bg-black text-white px-1 sm:px-2 py-1 text-xs shadow-sm"
          >
            <option value="es">{t("languageEs")}</option>
            <option value="en">{t("languageEn")}</option>
            <option value="it">{t("languageIt")}</option>
          </select>
        </div>
        <div className="flex items-center gap-1">
          <span aria-hidden className="hidden sm:block opacity-80">
            {themeIcon}
          </span>
          <select
            aria-label={t("themeLabel")}
            value={theme}
            onChange={(e) => {
              trackEvent("setting_changed", { setting: "theme", value: e.target.value });
              setTheme(e.target.value as Theme);
            }}
            className="min-w-0 rounded-md border border-white/20 bg-black text-white px-1 sm:px-2 py-1 text-xs shadow-sm"
          >
            <option value="light">{t("themeLight")}</option>
            <option value="dark">{t("themeDark")}</option>
            <option value="system">{t("themeSystem")}</option>
          </select>
        </div>
      </div>
    </footer>
  );
};

export { Footer };
