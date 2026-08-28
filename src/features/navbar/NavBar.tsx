"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FaArrowLeft, FaBars, FaSliders, FaX } from "react-icons/fa6";
import { useTranslation } from "@/context/SettingsContext";
import { APP_TOOLS, useAppNavigation } from "@/features/navigation/AppNavigation";
import { trackEvent } from "@/lib/telemetry";

type Props = {
  right?: React.ReactNode | ((utils: { requestClose: () => void }) => React.ReactNode);
};

const NavBar = ({ right }: Props) => {
  const { t } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();
  const { openMenu, favorites } = useAppNavigation();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const requestClose = () => setOpen(false);
  const renderRight = () => typeof right === "function" ? right({ requestClose }) : right;
  const activeTool = APP_TOOLS.find((tool) => tool.href === pathname);
  const favoriteTools = favorites
    .map((href) => APP_TOOLS.find((tool) => tool.href === href))
    .filter((tool): tool is (typeof APP_TOOLS)[number] => Boolean(tool));
  const isSecondary = pathname === "/help" || pathname === "/settings";
  const title = activeTool ? t(activeTool.titleKey) : pathname === "/help" ? t("helpTitle") : pathname === "/settings" ? t("settingsTitle") : t("appTitle");

  return (
    <header className="sticky top-0 z-[150] flex h-[calc(3.5rem+env(safe-area-inset-top))] items-center justify-between border-b border-white/10 bg-[var(--navbar-bg)] px-2 pt-[env(safe-area-inset-top)] text-[var(--navbar-fg)] shadow-sm">
      <div className="relative z-10 flex min-w-0 flex-1 items-center gap-1">
        {isSecondary ? (
          <button type="button" onClick={() => { trackEvent("navigation_back", { path: pathname }); window.history.length > 1 ? router.back() : router.push("/"); }} aria-label={t("navigationBack")} className="flex h-10 w-10 items-center justify-center rounded-xl hover:bg-white/10"><FaArrowLeft /></button>
        ) : (
          <button type="button" onClick={openMenu} aria-label={t("navigationMenu")} className="flex h-10 w-10 items-center justify-center rounded-xl hover:bg-white/10"><FaBars /></button>
        )}
        <button type="button" onClick={openMenu} aria-label={t("navigationMenu")} className={`${isSecondary ? "flex" : "hidden"} h-10 w-10 items-center justify-center rounded-xl hover:bg-white/10`}><FaBars /></button>
        <Link href="/" onClick={() => trackEvent("navigation_link_opened", { path: "/", source: "brand" })} aria-label={t("navigationHome")} className="mx-2 hidden shrink-0 md:block">
          <Image src="/images/logo.png" width={82} height={41} alt={t("logoAlt")} className="h-auto w-[82px] object-contain" />
        </Link>
        <nav className="hidden min-w-0 items-center gap-1 overflow-x-auto [scrollbar-width:none] md:flex [&::-webkit-scrollbar]:hidden" aria-label={t("homeFavorites")}>
          {favoriteTools.map((tool) => {
            const Icon = tool.icon;
            const active = pathname === tool.href;
            return (
              <Link
                key={tool.href}
                href={tool.href}
                onClick={() => trackEvent("tool_opened", { path: tool.href, source: "top_navigation" })}
                aria-current={active ? "page" : undefined}
                className={`flex h-10 shrink-0 items-center gap-2 rounded-xl px-3 text-xs font-bold transition ${active ? "bg-primary text-white" : "text-white/70 hover:bg-white/10 hover:text-white"}`}
              >
                <Icon size={18} />
                <span>{t(tool.titleKey)}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="pointer-events-none absolute left-1/2 flex max-w-[calc(100%-11rem)] -translate-x-1/2 items-center justify-center px-1 md:hidden">
        <span className="truncate text-base font-bold">{title}</span>
      </div>

      <div className="relative z-10 ml-auto flex min-w-10 shrink-0 items-center justify-end gap-1">
        {right && <button className="flex h-10 items-center gap-2 rounded-xl bg-white/10 px-3 text-sm font-semibold transition hover:bg-white/15" aria-haspopup="dialog" aria-expanded={open} aria-label={t("navToolActions")} onClick={() => setOpen((value) => { const next = !value; if (next) trackEvent("tool_options_opened", { path: pathname }); return next; })}><FaSliders /><span className="hidden lg:inline">{t("navActions")}</span></button>}
      </div>

      {open && right && (
        <div className="fixed inset-0 top-[calc(3.5rem+env(safe-area-inset-top))] z-[200] bg-black/55 backdrop-blur-sm" onClick={() => setOpen(false)}>
          <div ref={menuRef} role="dialog" aria-modal="true" aria-label={t("navActions")} className="absolute inset-x-0 bottom-0 max-h-[calc(100dvh-3.5rem-env(safe-area-inset-top))] overflow-y-auto rounded-t-[1.75rem] border border-[var(--border)] bg-[var(--surface)] p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] text-[var(--foreground)] shadow-2xl lg:inset-y-0 lg:left-auto lg:w-[26rem] lg:rounded-l-[1.75rem] lg:rounded-tr-none lg:pb-4" onClick={(event) => event.stopPropagation()}>
            <div className="mb-3 flex items-center justify-between"><span className="text-sm font-bold">{t("navActions")}</span><button type="button" onClick={() => setOpen(false)} aria-label={t("close")} className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--surface-muted)] text-[var(--text-muted)]"><FaX /></button></div>
            <div className="flex flex-col gap-3">{renderRight()}</div>
          </div>
        </div>
      )}
    </header>
  );
};

export { NavBar };
