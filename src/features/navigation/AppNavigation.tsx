"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { IconType } from "react-icons";
import {
  BsDice5,
  BsChatDots,
  BsGear,
  BsHandIndexThumb,
  BsHeartPulse,
  BsHouse,
  BsMoonStars,
  BsQuestionCircle,
  BsStopwatch,
  BsTable,
  BsX,
} from "react-icons/bs";
import { useSettings } from "@/context/SettingsContext";
import { useWakeLock } from "@/hooks/useWakeLock";
import { trackEvent } from "@/lib/telemetry";

export type AppTool = {
  href: string;
  titleKey: string;
  descriptionKey: string;
  icon: IconType;
  accent: string;
};

export const APP_TOOLS: AppTool[] = [
  { href: "/counter", titleKey: "counterTitle", descriptionKey: "counterDescription", icon: BsHeartPulse, accent: "#e32636" },
  { href: "/dice", titleKey: "diceTitle", descriptionKey: "diceDescription", icon: BsDice5, accent: "#7c3aed" },
  { href: "/timer", titleKey: "timerTitle", descriptionKey: "timerDescription", icon: BsStopwatch, accent: "#ea580c" },
  { href: "/score-sheet", titleKey: "scoreSheetTitle", descriptionKey: "scoreSheetDescription", icon: BsTable, accent: "#0284c7" },
  { href: "/choasis", titleKey: "choasisTitle", descriptionKey: "choasisDescription", icon: BsHandIndexThumb, accent: "#059669" },
];

const FAVORITES_KEY = "bg-counter-favorite-tools";
const LAST_TOOL_KEY = "bg-counter-last-tool";
const DEFAULT_FAVORITES = ["/counter", "/dice", "/timer", "/score-sheet"];

type NavigationContextValue = {
  isMenuOpen: boolean;
  openMenu: () => void;
  closeMenu: () => void;
  favorites: string[];
  toggleFavorite: (href: string) => void;
  reorderFavorites: (sourceIndex: number, destinationIndex: number) => void;
  lastTool: string | null;
  wakeLock: ReturnType<typeof useWakeLock>;
};

const NavigationContext = createContext<NavigationContextValue | null>(null);

export function useAppNavigation() {
  const context = useContext(NavigationContext);
  if (!context) throw new Error("useAppNavigation must be used inside AppNavigationProvider");
  return context;
}

export function AppNavigationProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(DEFAULT_FAVORITES);
  const [lastTool, setLastTool] = useState<string | null>(null);
  const wakeLock = useWakeLock();

  useEffect(() => {
    try {
      const storedFavorites = JSON.parse(localStorage.getItem(FAVORITES_KEY) ?? "null");
      if (Array.isArray(storedFavorites)) {
        setFavorites(storedFavorites.filter((href): href is string => APP_TOOLS.some((tool) => tool.href === href)).slice(0, 4));
      }
      const storedLastTool = localStorage.getItem(LAST_TOOL_KEY);
      if (APP_TOOLS.some((tool) => tool.href === storedLastTool)) setLastTool(storedLastTool);
    } catch {
      // Keep useful defaults when storage is unavailable or malformed.
    }
  }, []);

  useEffect(() => {
    const activeTool = APP_TOOLS.find((tool) => tool.href === pathname);
    if (!activeTool) return;
    setLastTool(activeTool.href);
    try {
      localStorage.setItem(LAST_TOOL_KEY, activeTool.href);
    } catch {}
  }, [pathname]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isMenuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMenuOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [isMenuOpen]);

  const openMenu = useCallback(() => {
    trackEvent("navigation_menu_opened", { path: pathname });
    setIsMenuOpen(true);
  }, [pathname]);

  const toggleFavorite = useCallback((href: string) => {
    const removing = favorites.includes(href);
    if (!removing && favorites.length >= 4) {
      try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
      } catch {}
      trackEvent("favorite_limit_reached", { path: href }, { favoriteCount: favorites.length });
      return;
    }
    const next = removing
      ? favorites.filter((item) => item !== href)
      : [...favorites, href];
    setFavorites(next);
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
    } catch {}
    trackEvent("favorite_changed", { path: href, action: removing ? "removed" : "added" }, { favoriteCount: next.length });
  }, [favorites]);

  const reorderFavorites = useCallback((sourceIndex: number, destinationIndex: number) => {
    if (sourceIndex === destinationIndex || sourceIndex < 0 || destinationIndex < 0 || sourceIndex >= favorites.length || destinationIndex >= favorites.length) return;
    const next = [...favorites];
    const [moved] = next.splice(sourceIndex, 1);
    next.splice(destinationIndex, 0, moved);
    setFavorites(next);
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
    } catch {}
    trackEvent("favorites_reordered", { path: moved }, { sourceIndex, destinationIndex });
  }, [favorites]);

  const value = useMemo<NavigationContextValue>(() => ({
    isMenuOpen,
    openMenu,
    closeMenu: () => setIsMenuOpen(false),
    favorites,
    toggleFavorite,
    reorderFavorites,
    lastTool,
    wakeLock,
  }), [favorites, isMenuOpen, lastTool, openMenu, reorderFavorites, toggleFavorite, wakeLock]);

  return <NavigationContext.Provider value={value}>{children}</NavigationContext.Provider>;
}

export function AppNavigation() {
  const pathname = usePathname();
  const { t } = useSettings();
  const { isMenuOpen, closeMenu, favorites, wakeLock } = useAppNavigation();
  const favoriteTools = favorites.map((href) => APP_TOOLS.find((tool) => tool.href === href)).filter((tool): tool is AppTool => Boolean(tool)).slice(0, 4);

  return (
    <>
      {isMenuOpen && (
        <div className="fixed inset-0 z-[500] bg-black/60 backdrop-blur-sm" onClick={closeMenu}>
          <aside
            role="dialog"
            aria-modal="true"
            aria-label={t("navigationMenu")}
            className="absolute inset-y-0 left-0 flex w-[min(88vw,23rem)] flex-col border-r border-white/10 bg-[#0b0b0c] text-white shadow-2xl"
            style={{ paddingTop: "env(safe-area-inset-top)", paddingBottom: "env(safe-area-inset-bottom)" }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Juernes de Mesa</p>
                <p className="mt-0.5 text-lg font-bold">{t("appTitle")}</p>
              </div>
              <button type="button" onClick={closeMenu} aria-label={t("close")} className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10">
                <BsX size={24} />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto p-3" aria-label={t("navigationMenu")}>
              <Link href="/" onClick={() => trackEvent("navigation_link_opened", { path: "/", source: "navigation_menu" })} className={`flex min-h-12 items-center gap-3 rounded-2xl px-3 font-semibold ${pathname === "/" ? "bg-primary text-white" : "hover:bg-white/10"}`}>
                <BsHouse size={20} /> {t("navigationHome")}
              </Link>
              <p className="mb-2 mt-5 px-3 text-[11px] font-bold uppercase tracking-[0.16em] text-white/45">{t("navigationTools")}</p>
              <div className="grid gap-1">
                {APP_TOOLS.map((tool) => {
                  const Icon = tool.icon;
                  const active = pathname === tool.href;
                  return (
                    <Link key={tool.href} href={tool.href} onClick={() => trackEvent("tool_opened", { path: tool.href, source: "navigation_menu" })} className={`flex min-h-12 items-center gap-3 rounded-2xl px-3 font-semibold transition ${active ? "bg-white/15 text-white" : "text-white/80 hover:bg-white/10"}`}>
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: `${tool.accent}30`, color: tool.accent }}><Icon size={19} /></span>
                      {t(tool.titleKey)}
                    </Link>
                  );
                })}
              </div>
              <p className="mb-2 mt-5 px-3 text-[11px] font-bold uppercase tracking-[0.16em] text-white/45">{t("navigationMore")}</p>
              <Link href="/settings" onClick={() => trackEvent("navigation_link_opened", { path: "/settings", source: "navigation_menu" })} className={`flex min-h-12 items-center gap-3 rounded-2xl px-3 font-semibold ${pathname === "/settings" ? "bg-white/15" : "hover:bg-white/10"}`}><BsGear size={20} /> {t("settingsTitle")}</Link>
              <Link href="/help" onClick={() => trackEvent("navigation_link_opened", { path: "/help", source: "navigation_menu" })} className={`flex min-h-12 items-center gap-3 rounded-2xl px-3 font-semibold ${pathname === "/help" ? "bg-white/15" : "hover:bg-white/10"}`}><BsQuestionCircle size={20} /> {t("helpTitle")}</Link>
              <a href="mailto:info@juernesdemesa.com" onClick={() => trackEvent("feedback_opened", { destination: "email", source: "navigation_menu" })} className="flex min-h-12 items-center gap-3 rounded-2xl px-3 font-semibold hover:bg-white/10"><BsChatDots size={20} /> {t("feedbackLabel")}</a>
            </nav>

            <div className="border-t border-white/10 p-3">
              <button
                type="button"
                role="switch"
                aria-checked={wakeLock.isEnabled}
                aria-label={t("wakeLockLabel")}
                disabled={!wakeLock.isSupported}
                onClick={() => {
                  trackEvent("setting_changed", { setting: "wakeLock", value: !wakeLock.isEnabled });
                  wakeLock.setIsEnabled(!wakeLock.isEnabled);
                }}
                className="flex min-h-14 w-full items-center gap-3 rounded-2xl bg-white/10 px-3 text-left disabled:opacity-40"
              >
                <BsMoonStars size={20} />
                <span className="flex-1 text-sm font-semibold">{t("wakeLockShortLabel")}</span>
                <span className={`relative h-6 w-11 rounded-full transition ${wakeLock.isEnabled ? "bg-primary" : "bg-white/20"}`}><span className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-transform ${wakeLock.isEnabled ? "translate-x-6" : "translate-x-1"}`} /></span>
              </button>
            </div>
          </aside>
        </div>
      )}

      <nav className="fixed inset-x-0 bottom-0 z-[120] grid h-[calc(4rem+env(safe-area-inset-bottom))] grid-cols-5 border-t border-[var(--border)] bg-[var(--surface)]/95 px-1 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_25px_rgba(0,0,0,0.12)] backdrop-blur-xl md:hidden" aria-label={t("navigationPrimary")}>
        <BottomLink href="/" label={t("navigationHome")} active={pathname === "/"} icon={BsHouse} onOpen={() => trackEvent("navigation_link_opened", { path: "/", source: "bottom_navigation" })} />
        {favoriteTools.map((tool) => <BottomLink key={tool.href} href={tool.href} label={t(tool.titleKey)} active={pathname === tool.href} icon={tool.icon} onOpen={() => trackEvent("tool_opened", { path: tool.href, source: "bottom_navigation" })} />)}
        {Array.from({ length: 4 - favoriteTools.length }, (_, index) => <div key={`empty-${index}`} />)}
      </nav>
    </>
  );
}

function BottomLink({ href, label, active, icon: Icon, onOpen }: { href: string; label: string; active: boolean; icon: IconType; onOpen?: () => void }) {
  return <Link href={href} onClick={onOpen} aria-current={active ? "page" : undefined} className={`flex min-w-0 flex-col items-center justify-center gap-1 px-1 text-[10px] font-semibold ${active ? "text-primary" : "text-[var(--text-muted)]"}`}><Icon size={21} /><span className="max-w-full truncate">{label}</span></Link>;
}
