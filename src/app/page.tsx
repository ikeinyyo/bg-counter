"use client";

import Link from "next/link";
import {
  BsHeartPulse,
  BsPlusCircleFill,
  BsHandIndexThumb,
  BsQuestionCircle,
  BsStopwatch,
  BsTable,
  BsDice5,
  BsChatDots,
} from "react-icons/bs";
import { useSettings } from "@/context/SettingsContext";
import { NavBar } from "@/features/navbar/NavBar";
import { useEffect, useMemo, useState } from "react";
import { trackEvent } from "@/lib/telemetry";

const FEEDBACK_EMAIL_URL = "mailto:info@juernesdemesa.com";

export default function Home() {
  const { t } = useSettings();
  const [feedbackUrl, setFeedbackUrl] = useState(FEEDBACK_EMAIL_URL);
  const usesFeedbackForm = feedbackUrl !== FEEDBACK_EMAIL_URL;

  const computedTitle = useMemo(
    () => `Juernes de Mesa — ${t("appTitle")}`,
    [t],
  );

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.title = computedTitle;
    }
  }, [computedTitle]);

  useEffect(() => {
    let active = true;

    const loadFeedbackUrl = async () => {
      try {
        const response = await fetch("/api/feedback-config", { cache: "no-store" });
        if (!response.ok) return;
        const configuration = (await response.json()) as { feedbackUrl?: unknown };
        if (active && typeof configuration.feedbackUrl === "string") {
          setFeedbackUrl(configuration.feedbackUrl);
        }
      } catch {
        // Keep the email fallback when runtime configuration is unavailable.
      }
    };

    void loadFeedbackUrl();
    return () => {
      active = false;
    };
  }, []);

  const tools = [
    {
      title: t("counterTitle"),
      description: t("counterDescription"),
      href: "/counter",
      icon: BsHeartPulse,
    },
    {
      title: t("choasisTitle"),
      description: t("choasisDescription"),
      href: "/choasis",
      icon: BsHandIndexThumb,
    },
    {
      title: t("timerTitle"),
      description: t("timerDescription"),
      href: "/timer",
      icon: BsStopwatch,
    },
    {
      title: t("scoreSheetTitle"),
      description: t("scoreSheetDescription"),
      href: "/score-sheet",
      icon: BsTable,
    },
    {
      title: t("diceTitle"),
      description: t("diceDescription"),
      href: "/dice",
      icon: BsDice5,
    },
    {
      title: t("helpTitle"),
      description: t("helpDescription"),
      href: "/help",
      icon: BsQuestionCircle,
    },
    {
      title: t("feedbackLabel"),
      description: t("feedbackDescription"),
      href: feedbackUrl,
      icon: BsChatDots,
      feedback: true,
    },
    {
      title: t("soonTitle"),
      description: t("soonDescription"),
      href: "#",
      icon: BsPlusCircleFill,
      disabled: true,
    },
  ];

  return (
    <>
      <NavBar />
      <main
        className="bg-[var(--background)] px-4 py-6 text-[var(--foreground)]"
        style={{
          minHeight:
            "calc(var(--app-vh, 100dvh) - 3.5rem - 3rem - env(safe-area-inset-bottom))",
        }}
      >
        <div className="mx-auto flex max-w-5xl flex-col gap-6">
          <section className="pt-2">
            <h1 className="text-3xl font-semibold tracking-tight">
              {t("homeTitle")}
            </h1>
            <p className="mt-2 text-sm leading-6 text-[var(--text-muted)] max-w-2xl">
              {t("homeDescription")}
            </p>
          </section>

          <section className="grid gap-3">
            {tools.map((tool) => {
              const Icon = tool.icon;
              const content = (
                <article
                  className={`flex items-center gap-4 rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm transition-all ${
                    tool.disabled
                      ? "opacity-60"
                      : "active:scale-[0.99] hover:-translate-y-0.5"
                  }`}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                    <Icon size={22} />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold">{tool.title}</h2>
                    <p className="mt-1 text-sm text-[var(--text-muted)]">
                      {tool.description}
                    </p>
                  </div>
                </article>
              );

              if (tool.disabled) {
                return <div key={tool.title}>{content}</div>;
              }

              if ("feedback" in tool) {
                return (
                  <a
                    key={tool.title}
                    href={tool.href}
                    target={usesFeedbackForm ? "_blank" : undefined}
                    rel={usesFeedbackForm ? "noopener noreferrer" : undefined}
                    className="block"
                    onClick={() => {
                      trackEvent("tool_opened", { path: "feedback" });
                      trackEvent("feedback_opened", {
                        destination: usesFeedbackForm ? "form" : "email",
                      });
                    }}
                  >
                    {content}
                  </a>
                );
              }

              return (
                <Link
                  key={tool.title}
                  href={tool.href}
                  className="block"
                  onClick={() => trackEvent("tool_opened", { path: tool.href })}
                >
                  {content}
                </Link>
              );
            })}
          </section>
        </div>
      </main>
    </>
  );
}
