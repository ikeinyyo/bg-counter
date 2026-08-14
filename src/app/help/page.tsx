"use client";

import { useEffect } from "react";
import {
  BsGear,
  BsHandIndexThumb,
  BsHeartPulse,
  BsStopwatch,
  BsTable,
  BsDice5,
} from "react-icons/bs";
import { useSettings } from "@/context/SettingsContext";
import { NavBar } from "@/features/navbar/NavBar";

export default function HelpPage() {
  const { t } = useSettings();

  useEffect(() => {
    document.title = `Juernes de Mesa — ${t("helpTitle")}`;
  }, [t]);

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
        <div className="mx-auto flex max-w-3xl flex-col gap-6">
          <header>
            <h1 className="text-3xl font-semibold tracking-tight">
              {t("helpTitle")}
            </h1>
            <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
              {t("helpDescription")}
            </p>
          </header>

          <article className="divide-y divide-[var(--border)]">
            <section className="pb-8">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <BsGear aria-hidden size={21} />
                </span>
                <h2 className="text-2xl font-semibold tracking-tight">
                  {t("helpConfigTitle")}
                </h2>
              </div>
              <p className="mt-4 leading-7 text-[var(--text-muted)]">
                {t("helpConfigText")}
              </p>
              <h3 className="mt-5 text-lg font-semibold">
                {t("helpConfigOptionsTitle")}
              </h3>
              <ul className="mt-3 list-disc space-y-2 pl-6 leading-7 text-[var(--text-muted)] marker:text-primary">
                <li>{t("helpConfigLanguage")}</li>
                <li>{t("helpConfigTheme")}</li>
                <li>{t("helpConfigWakeLock")}</li>
              </ul>
            </section>

            <section className="py-8">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <BsHeartPulse aria-hidden size={21} />
                </span>
                <h2 className="text-2xl font-semibold tracking-tight">
                  {t("helpCountersTitle")}
                </h2>
              </div>
              <p className="mt-4 leading-7 text-[var(--text-muted)]">
                {t("helpCountersText")}
              </p>
              <h3 className="mt-5 text-lg font-semibold">
                {t("helpCountersMenuTitle")}
              </h3>
              <p className="mt-2 leading-7 text-[var(--text-muted)]">
                {t("helpCountersMenuText")}
              </p>
              <h3 className="mt-5 text-lg font-semibold">
                {t("helpCountersEditTitle")}
              </h3>
              <p className="mt-2 leading-7 text-[var(--text-muted)]">
                {t("helpCountersEditText")}
              </p>
            </section>

            <section className="py-8">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <BsHandIndexThumb aria-hidden size={21} />
                </span>
                <h2 className="text-2xl font-semibold tracking-tight">
                  {t("helpChoasisTitle")}
                </h2>
              </div>
              <p className="mt-4 leading-7 text-[var(--text-muted)]">
                {t("helpChoasisText")}
              </p>
              <h3 className="mt-5 text-lg font-semibold">
                {t("helpChoasisTouchTitle")}
              </h3>
              <p className="mt-2 leading-7 text-[var(--text-muted)]">
                {t("helpChoasisTouchText")}
              </p>
              <h3 className="mt-5 text-lg font-semibold">
                {t("helpChoasisManualTitle")}
              </h3>
              <p className="mt-2 leading-7 text-[var(--text-muted)]">
                {t("helpChoasisManualText")}
              </p>
            </section>

            <section className="py-8">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <BsStopwatch aria-hidden size={21} />
                </span>
                <h2 className="text-2xl font-semibold tracking-tight">
                  {t("timerTitle")}
                </h2>
              </div>
              <p className="mt-4 leading-7 text-[var(--text-muted)]">
                {t("helpTimerText")}
              </p>
              <h3 className="mt-5 text-lg font-semibold">
                {t("helpTimerSetupTitle")}
              </h3>
              <p className="mt-2 leading-7 text-[var(--text-muted)]">
                {t("helpTimerSetupText")}
              </p>
              <h3 className="mt-5 text-lg font-semibold">
                {t("helpTimerControlsTitle")}
              </h3>
              <p className="mt-2 leading-7 text-[var(--text-muted)]">
                {t("helpTimerControlsText")}
              </p>
              <h3 className="mt-5 text-lg font-semibold">
                {t("helpTimerFinishTitle")}
              </h3>
              <p className="mt-2 leading-7 text-[var(--text-muted)]">
                {t("helpTimerFinishText")}
              </p>
            </section>

            <section className="py-8">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <BsDice5 aria-hidden size={21} />
                </span>
                <h2 className="text-2xl font-semibold tracking-tight">
                  {t("diceTitle")}
                </h2>
              </div>
              <p className="mt-4 leading-7 text-[var(--text-muted)]">
                {t("helpDiceText")}
              </p>
              <h3 className="mt-5 text-lg font-semibold">
                {t("helpDiceSetupTitle")}
              </h3>
              <p className="mt-2 leading-7 text-[var(--text-muted)]">
                {t("helpDiceSetupText")}
              </p>
              <h3 className="mt-5 text-lg font-semibold">
                {t("helpDiceRollTitle")}
              </h3>
              <p className="mt-2 leading-7 text-[var(--text-muted)]">
                {t("helpDiceRollText")}
              </p>
              <h3 className="mt-5 text-lg font-semibold">
                {t("helpDiceHistoryTitle")}
              </h3>
              <p className="mt-2 leading-7 text-[var(--text-muted)]">
                {t("helpDiceHistoryText")}
              </p>
            </section>

            <section className="pt-8">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <BsTable aria-hidden size={21} />
                </span>
                <h2 className="text-2xl font-semibold tracking-tight">
                  {t("scoreSheetTitle")}
                </h2>
              </div>
              <p className="mt-4 leading-7 text-[var(--text-muted)]">
                {t("helpScoreSheetText")}
              </p>
              <h3 className="mt-5 text-lg font-semibold">
                {t("helpScoreSheetStructureTitle")}
              </h3>
              <p className="mt-2 leading-7 text-[var(--text-muted)]">
                {t("helpScoreSheetStructureText")}
              </p>
              <h3 className="mt-5 text-lg font-semibold">
                {t("helpScoreSheetScoresTitle")}
              </h3>
              <p className="mt-2 leading-7 text-[var(--text-muted)]">
                {t("helpScoreSheetScoresText")}
              </p>
              <h3 className="mt-5 text-lg font-semibold">
                {t("helpScoreSheetStorageTitle")}
              </h3>
              <p className="mt-2 leading-7 text-[var(--text-muted)]">
                {t("helpScoreSheetStorageText")}
              </p>
            </section>
          </article>
        </div>
      </main>
    </>
  );
}
