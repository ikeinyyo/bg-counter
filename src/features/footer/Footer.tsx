"use client";

import Link from "next/link";
import {
  useSettings,
  useTranslation,
  type Language,
  type Theme,
} from "@/context/SettingsContext";
import { FaGlobe, FaSun, FaMoon, FaComputer } from "react-icons/fa6";
import { useWakeLock } from "@/hooks/useWakeLock";

type Props = {
  isWakeLockActive?: boolean;
  activateWakeLock?: () => void;
};

const Footer = ({ isWakeLockActive, activateWakeLock }: Props) => {
  const { t } = useTranslation();
  const { language, theme, setLanguage, setTheme } = useSettings();
  const { isSupported, isActive, requestWakeLock } = useWakeLock();
  const themeIcon =
    theme === "dark" ? (
      <FaMoon />
    ) : theme === "light" ? (
      <FaSun />
    ) : (
      <FaComputer />
    );
  return (
    <footer className="flex h-12 items-center justify-between border-t border-[var(--border)] bg-[var(--navbar-bg)] px-3 text-[var(--navbar-fg)]">
      <span className="text-[10px] sm:text-xs">
        Copyright © 2025{" "}
        <Link
          className="text-primary hover:text-white transition-colors text-bold cursor-pointer"
          href="https://juernesdemesa.com"
        >
          Juernes de Mesa
        </Link>
        . {t("footerAllRights")}
      </span>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          <FaGlobe aria-hidden className="opacity-80" />
          <select
            aria-label={t("languageLabel")}
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            className="rounded-md border border-white/20 bg-black text-white px-2 py-1 text-xs shadow-sm"
          >
            <option value="es">{t("languageEs")}</option>
            <option value="en">{t("languageEn")}</option>
            <option value="it">{t("languageIt")}</option>
          </select>
        </div>
        <div className="flex items-center gap-1">
          <span aria-hidden className="opacity-80">
            {themeIcon}
          </span>
          <select
            aria-label={t("themeLabel")}
            value={theme}
            onChange={(e) => setTheme(e.target.value as Theme)}
            className="rounded-md border border-white/20 bg-black text-white px-2 py-1 text-xs shadow-sm"
          >
            <option value="light">{t("themeLight")}</option>
            <option value="dark">{t("themeDark")}</option>
            <option value="system">{t("themeSystem")}</option>
          </select>
        </div>
        {(typeof isWakeLockActive === "boolean" || isSupported) && (
          <button
            className={`w-4 h-4 ml-1 rounded-full ${
              (
                typeof isWakeLockActive === "boolean"
                  ? isWakeLockActive
                  : isActive
              )
                ? "bg-true"
                : "bg-false"
            }`}
            onClick={
              activateWakeLock
                ? activateWakeLock
                : () => {
                    if (isSupported) requestWakeLock();
                  }
            }
            aria-label="Wake Lock"
            title="Wake Lock"
          />
        )}
      </div>
    </footer>
  );
};

export { Footer };
