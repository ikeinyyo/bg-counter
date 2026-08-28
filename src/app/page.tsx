"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { DragDropContext, Draggable, Droppable, type DropResult } from "@hello-pangea/dnd";
import { BsArrowDownCircle, BsArrowRight, BsChatDots, BsGear, BsGripVertical, BsQuestionCircle, BsShare, BsStar, BsStarFill, BsX } from "react-icons/bs";
import { useSettings } from "@/context/SettingsContext";
import { APP_TOOLS, type AppTool, useAppNavigation } from "@/features/navigation/AppNavigation";
import { NavBar } from "@/features/navbar/NavBar";
import { detectInstallGuide, isRunningStandalone, type InstallGuide } from "@/lib/pwaInstall";
import { trackEvent } from "@/lib/telemetry";

const FEEDBACK_EMAIL_URL = "mailto:info@juernesdemesa.com";

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export default function Home() {
  const { t } = useSettings();
  const { favorites, toggleFavorite, reorderFavorites, lastTool } = useAppNavigation();
  const [feedbackUrl, setFeedbackUrl] = useState(FEEDBACK_EMAIL_URL);
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(null);
  const [canInstall, setCanInstall] = useState(false);
  const [installGuide, setInstallGuide] = useState<InstallGuide>("desktop");
  const [showInstallHelp, setShowInstallHelp] = useState(false);
  const [showFavoriteOrder, setShowFavoriteOrder] = useState(false);
  const usesFeedbackForm = feedbackUrl !== FEEDBACK_EMAIL_URL;
  const lastToolConfig = APP_TOOLS.find((tool) => tool.href === lastTool);

  const computedTitle = useMemo(() => t("appTitle"), [t]);

  useEffect(() => {
    document.title = computedTitle;
  }, [computedTitle]);

  useEffect(() => {
    let active = true;
    const loadFeedbackUrl = async () => {
      try {
        const response = await fetch("/api/feedback-config", { cache: "no-store" });
        if (!response.ok) return;
        const configuration = (await response.json()) as { feedbackUrl?: unknown };
        if (active && typeof configuration.feedbackUrl === "string") setFeedbackUrl(configuration.feedbackUrl);
      } catch {}
    };
    void loadFeedbackUrl();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    const navigatorWithStandalone = navigator as Navigator & { standalone?: boolean };
    setInstallGuide(detectInstallGuide(navigator));
    setCanInstall(!isRunningStandalone(navigatorWithStandalone, window.matchMedia("(display-mode: standalone)").matches));
    const captureInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as InstallPromptEvent);
    };
    const captureInstalled = () => {
      setInstallPrompt(null);
      setCanInstall(false);
      setShowInstallHelp(false);
      trackEvent("pwa_installed");
    };
    window.addEventListener("beforeinstallprompt", captureInstallPrompt);
    window.addEventListener("appinstalled", captureInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", captureInstallPrompt);
      window.removeEventListener("appinstalled", captureInstalled);
    };
  }, []);

  const favoriteTools = favorites.map((href) => APP_TOOLS.find((tool) => tool.href === href)).filter((tool): tool is AppTool => Boolean(tool));
  const reorder = ({ source, destination }: DropResult) => {
    if (destination) reorderFavorites(source.index, destination.index);
  };

  const requestInstall = async () => {
    if (!installPrompt) {
      trackEvent("pwa_install_help_opened", { guide: installGuide });
      setShowInstallHelp(true);
      return;
    }
    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    trackEvent("pwa_install_prompt", { outcome: choice.outcome });
    if (choice.outcome === "accepted") {
      setInstallPrompt(null);
      setCanInstall(false);
    }
  };

  return (
    <>
      <NavBar />
      <main className="min-h-[calc(100dvh-3.5rem-var(--app-bottom-space)-env(safe-area-inset-bottom))] overflow-hidden bg-[var(--background)] px-4 py-5 text-[var(--foreground)] sm:py-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-7">
          <section className="relative overflow-hidden rounded-[2rem] bg-[#09090b] px-5 py-7 text-white shadow-xl sm:px-8 lg:py-8">
            <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-primary/35 blur-3xl" />
            <div className="absolute -bottom-24 left-1/3 h-48 w-48 rounded-full bg-violet-600/20 blur-3xl" />
            <div className={`relative grid gap-6 ${lastToolConfig ? "lg:grid-cols-[minmax(0,1.25fr)_minmax(19rem,0.75fr)] lg:items-end" : ""}`}>
              <div className="max-w-2xl">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">{t("homeEyebrow")}</p>
                <h1 className="mt-3 text-3xl font-black leading-tight tracking-tight sm:text-4xl xl:text-5xl">{t("homeTitle")}</h1>
                <p className="mt-3 max-w-xl text-sm leading-6 text-white/65 sm:text-base">{t("homeDescription")}</p>
              </div>
              {lastToolConfig && (
                <Link href={lastToolConfig.href} onClick={() => trackEvent("tool_opened", { path: lastToolConfig.href, source: "continue" })} className="flex min-h-16 w-full items-center gap-3 rounded-2xl bg-white px-4 text-left text-black shadow-lg transition active:scale-[0.98]">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl text-white" style={{ backgroundColor: lastToolConfig.accent }}><lastToolConfig.icon size={22} /></span>
                  <span className="min-w-0 flex-1"><span className="block text-xs font-bold uppercase tracking-wider text-black/45">{t("homeContinue")}</span><span className="block truncate text-lg font-bold">{t(lastToolConfig.titleKey)}</span></span>
                  <BsArrowRight size={20} />
                </Link>
              )}
            </div>
          </section>

          <section>
            <div className="mb-3 flex items-end justify-between gap-4"><div><h2 className="text-xl font-bold">{t("homeFavorites")}</h2><p className="mt-1 text-sm text-[var(--text-muted)]">{t("homeFavoritesHint")}</p></div><button type="button" onClick={() => { trackEvent("favorites_reorder_opened", { source: "home" }); setShowFavoriteOrder(true); }} className="flex min-h-10 shrink-0 items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm font-bold shadow-sm"><BsGripVertical />{t("favoriteReorder")}</button></div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {favoriteTools.map((tool) => (
                <article key={tool.href} className="relative flex min-w-0 items-center overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                  <Link href={tool.href} onClick={() => trackEvent("tool_opened", { path: tool.href, source: "home_favorites" })} className="flex min-h-16 min-w-0 flex-1 items-center gap-3 p-3 pr-1"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white" style={{ backgroundColor: tool.accent }}><tool.icon size={20} /></span><h3 className="truncate font-bold">{t(tool.titleKey)}</h3></Link>
                  <button type="button" aria-label={t("favoriteRemove")} onClick={() => toggleFavorite(tool.href)} className="flex h-12 w-11 shrink-0 items-center justify-center text-amber-500"><BsStarFill /></button>
                </article>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold">{t("homeAllTools")}</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {APP_TOOLS.map((tool) => <ToolCard key={tool.href} tool={tool} favorite={favorites.includes(tool.href)} favoriteLimitReached={favorites.length >= 4} onToggle={() => toggleFavorite(tool.href)} detailed />)}
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold">{t("homeMore")}</h2>
            <div className="overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-sm">
              {canInstall && <button type="button" onClick={() => void requestInstall()} className="flex min-h-16 w-full items-center gap-3 px-4 text-left font-semibold hover:bg-[var(--surface-muted)]"><BsArrowDownCircle className="text-primary" size={20} /><span className="flex-1"><span className="block">{t("installApp")}</span><span className="mt-0.5 block text-xs font-normal text-[var(--text-muted)]">{t("installAppHint")}</span></span><BsArrowRight className="text-[var(--text-muted)]" /></button>}
              <MoreLink href="/settings" icon={BsGear} label={t("settingsTitle")} />
              <MoreLink href="/help" icon={BsQuestionCircle} label={t("helpTitle")} />
              <a href={feedbackUrl} target={usesFeedbackForm ? "_blank" : undefined} rel={usesFeedbackForm ? "noopener noreferrer" : undefined} onClick={() => trackEvent("feedback_opened", { destination: usesFeedbackForm ? "form" : "email" })} className="flex min-h-14 items-center gap-3 border-t border-[var(--border)] px-4 font-semibold transition hover:bg-[var(--surface-muted)]"><BsChatDots className="text-primary" size={20} /><span className="flex-1">{t("feedbackLabel")}</span><BsArrowRight className="text-[var(--text-muted)]" /></a>
            </div>
          </section>
        </div>
      </main>
      {showFavoriteOrder && <div className="fixed inset-0 z-[700] flex items-end justify-center bg-black/60 p-3 backdrop-blur-sm sm:items-center" onClick={() => setShowFavoriteOrder(false)}><section role="dialog" aria-modal="true" aria-labelledby="favorite-order-title" className="w-full max-w-md rounded-[1.75rem] bg-[var(--surface)] p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] text-[var(--foreground)] shadow-2xl" onClick={(event) => event.stopPropagation()}><div className="mb-4 flex items-start justify-between gap-4"><div><h2 id="favorite-order-title" className="text-xl font-bold">{t("favoriteReorderTitle")}</h2><p className="mt-1 text-sm text-[var(--text-muted)]">{t("favoriteReorderHint")}</p></div><button type="button" onClick={() => setShowFavoriteOrder(false)} aria-label={t("close")} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--surface-muted)]"><BsX size={20} /></button></div><DragDropContext onDragEnd={reorder}><Droppable droppableId="favorite-tools" direction="vertical">{(provided) => <div ref={provided.innerRef} {...provided.droppableProps} className="grid gap-2">{favoriteTools.map((tool, index) => <Draggable key={tool.href} draggableId={tool.href} index={index}>{(dragProvided, snapshot) => <div ref={dragProvided.innerRef} {...dragProvided.draggableProps} style={dragProvided.draggableProps.style} className={`flex min-h-16 items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] pl-3 ${snapshot.isDragging ? "shadow-xl" : ""}`}><span className="flex h-10 w-10 items-center justify-center rounded-xl text-white" style={{ backgroundColor: tool.accent }}><tool.icon size={20} /></span><span className="min-w-0 flex-1 truncate font-bold">{t(tool.titleKey)}</span><button type="button" {...dragProvided.dragHandleProps} aria-label={`${t("favoriteReorder")} ${t(tool.titleKey)}`} className="flex h-16 w-12 touch-none items-center justify-center border-l border-[var(--border)] text-[var(--text-muted)]"><BsGripVertical size={24} /></button></div>}</Draggable>)}{provided.placeholder}</div>}</Droppable></DragDropContext></section></div>}
      {showInstallHelp && <InstallHelp guide={installGuide} onClose={() => setShowInstallHelp(false)} />}
    </>
  );
}

function InstallHelp({ guide, onClose }: { guide: InstallGuide; onClose: () => void }) {
  const { t } = useSettings();
  const content = {
    "ios-chrome": { title: "installIosTitle", description: "installIosChromeDescription", firstStep: "installIosChromeStepShare" },
    "ios-safari": { title: "installIosTitle", description: "installIosSafariDescription", firstStep: "installIosSafariStepShare" },
    "ios-other": { title: "installIosTitle", description: "installIosOtherDescription", firstStep: "installGenericStepMenu" },
    android: { title: "installAndroidTitle", description: "installAndroidDescription", firstStep: "installAndroidStepMenu" },
    desktop: { title: "installDesktopTitle", description: "installDesktopDescription", firstStep: "installDesktopStepMenu" },
  }[guide];

  return <div className="fixed inset-0 z-[700] flex items-end justify-center bg-black/60 p-3 backdrop-blur-sm sm:items-center" onClick={onClose}><section role="dialog" aria-modal="true" aria-labelledby="install-help-title" className="w-full max-w-md rounded-[1.75rem] bg-[var(--surface)] p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] text-[var(--foreground)] shadow-2xl" onClick={(event) => event.stopPropagation()}><div className="flex items-start justify-between gap-4"><div><h2 id="install-help-title" className="text-xl font-bold">{t(content.title)}</h2><p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">{t(content.description)}</p></div><button type="button" onClick={onClose} aria-label={t("close")} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--surface-muted)]"><BsX size={20} /></button></div><ol className="mt-5 grid gap-3"><li className="flex items-center gap-3 rounded-2xl bg-[var(--surface-muted)] p-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white"><BsShare /></span><span className="text-sm font-semibold">1. {t(content.firstStep)}</span></li><li className="flex items-center gap-3 rounded-2xl bg-[var(--surface-muted)] p-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white"><BsArrowDownCircle /></span><span className="text-sm font-semibold">2. {t("installGenericStepAdd")}</span></li></ol><p className="mt-4 text-xs leading-5 text-[var(--text-muted)]">{t("installGenericFallback")}</p></section></div>;
}

function ToolCard({ tool, favorite, favoriteLimitReached, onToggle, detailed = false }: { tool: AppTool; favorite: boolean; favoriteLimitReached: boolean; onToggle: () => void; detailed?: boolean }) {
  const { t } = useSettings();
  const Icon = tool.icon;
  return (
    <article className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <Link href={tool.href} onClick={() => trackEvent("tool_opened", { path: tool.href, source: "home" })} className="flex min-h-32 flex-col p-4 pr-12">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl text-white shadow-sm" style={{ backgroundColor: tool.accent }}><Icon size={22} /></span>
        <h3 className="mt-3 font-bold">{t(tool.titleKey)}</h3>
        {detailed && <p className="mt-1 text-sm leading-5 text-[var(--text-muted)]">{t(tool.descriptionKey)}</p>}
      </Link>
      <button type="button" aria-label={t(favorite ? "favoriteRemove" : favoriteLimitReached ? "favoriteLimit" : "favoriteAdd")} title={t(favorite ? "favoriteRemove" : favoriteLimitReached ? "favoriteLimit" : "favoriteAdd")} aria-pressed={favorite} disabled={!favorite && favoriteLimitReached} onClick={onToggle} className={`absolute right-2 top-2 flex h-11 w-11 items-center justify-center rounded-full transition disabled:cursor-not-allowed disabled:opacity-30 ${favorite ? "text-amber-500" : "text-[var(--text-muted)] hover:bg-[var(--surface-muted)]"}`}>{favorite ? <BsStarFill /> : <BsStar />}</button>
    </article>
  );
}

function MoreLink({ href, icon: Icon, label }: { href: string; icon: typeof BsGear; label: string }) {
  return <Link href={href} onClick={() => trackEvent("navigation_link_opened", { path: href, source: "home_more" })} className="flex min-h-14 items-center gap-3 border-t border-[var(--border)] px-4 font-semibold first:border-t-0 hover:bg-[var(--surface-muted)]"><Icon className="text-primary" size={20} /><span className="flex-1">{label}</span><BsArrowRight className="text-[var(--text-muted)]" /></Link>;
}
