"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FaArrowRotateRight, FaPlay, FaStop } from "react-icons/fa6";
import { useSettings } from "@/context/SettingsContext";
import { NavBar } from "@/features/navbar/NavBar";
import { trackEvent } from "@/lib/telemetry";

type TimerStatus = "idle" | "running" | "paused" | "finished";

const RING_RADIUS = 112;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;
const TIMER_STORAGE_KEY = "bg-counter-timer-duration-seconds";

export default function TimerPage() {
  const { t } = useSettings();
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(30);
  const [remainingMs, setRemainingMs] = useState(30 * 1000);
  const [status, setStatus] = useState<TimerStatus>("idle");
  const deadlineRef = useRef<number | null>(null);
  const alarmAudioRef = useRef<HTMLAudioElement | null>(null);
  const alarmTimeoutRef = useRef<number | null>(null);
  const audioUnlockPromiseRef = useRef<Promise<void> | null>(null);

  const totalMs = (minutes * 60 + seconds) * 1000;

  const stopAlarm = useCallback(() => {
    if ("vibrate" in navigator) navigator.vibrate(0);

    if (alarmTimeoutRef.current !== null) {
      window.clearTimeout(alarmTimeoutRef.current);
      alarmTimeoutRef.current = null;
    }

    const audio = alarmAudioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      audio.loop = false;
    }
  }, []);

  const prepareAudio = useCallback(() => {
    const audio = alarmAudioRef.current;
    if (!audio || audioUnlockPromiseRef.current) return;

    audio.volume = 0;
    audioUnlockPromiseRef.current = audio
      .play()
      .then(() => {
        audio.pause();
        audio.currentTime = 0;
      })
      .catch(() => {
        // The alarm will make another playback attempt when time runs out.
      })
      .finally(() => {
        audio.volume = 1;
        audioUnlockPromiseRef.current = null;
      });
  }, []);

  const playAlarm = useCallback(() => {
    const startPlayback = async () => {
      if (audioUnlockPromiseRef.current) {
        await audioUnlockPromiseRef.current;
      }

      stopAlarm();
      if ("vibrate" in navigator) {
        navigator.vibrate([400, 100, 400, 100, 400, 100, 400, 100, 400, 100, 400]);
      }

      const audio = alarmAudioRef.current;
      if (!audio) return;
      audio.volume = 1;
      audio.currentTime = 0;
      audio.loop = true;

      try {
        await audio.play();
        alarmTimeoutRef.current = window.setTimeout(stopAlarm, 3000);
      } catch (error) {
        console.warn("Unable to play the timer alarm", error);
      }
    };

    void startPlayback();
  }, [stopAlarm]);

  useEffect(() => {
    document.title = `Juernes de Mesa — ${t("timerTitle")}`;
  }, [t]);

  useEffect(() => {
    try {
      const storedValue = window.localStorage.getItem(TIMER_STORAGE_KEY);
      if (storedValue === null) return;

      const storedDuration = Number(storedValue);
      if (
        Number.isInteger(storedDuration) &&
        storedDuration >= 0 &&
        storedDuration <= 99 * 60 + 59
      ) {
        setMinutes(Math.floor(storedDuration / 60));
        setSeconds(storedDuration % 60);
        setRemainingMs(storedDuration * 1000);
      }
    } catch {
      // Keep the thirty-second default if storage is unavailable.
    }
  }, []);

  useEffect(() => {
    if (status !== "running" || deadlineRef.current === null) return;

    const updateRemainingTime = () => {
      if (deadlineRef.current === null) return;
      const nextRemaining = Math.max(0, deadlineRef.current - Date.now());
      setRemainingMs(nextRemaining);

      if (nextRemaining === 0) {
        deadlineRef.current = null;
        setStatus("finished");
        trackEvent("timer_completed", {}, { durationSeconds: totalMs / 1000 });
        playAlarm();
      }
    };

    updateRemainingTime();
    const interval = window.setInterval(updateRemainingTime, 100);
    return () => window.clearInterval(interval);
  }, [playAlarm, status, totalMs]);

  useEffect(() => {
    return () => {
      stopAlarm();
    };
  }, [stopAlarm]);

  const updateDuration = (nextMinutes: number, nextSeconds: number) => {
    const safeMinutes = Math.min(99, Math.max(0, nextMinutes));
    const safeSeconds = Math.min(59, Math.max(0, nextSeconds));
    setMinutes(safeMinutes);
    setSeconds(safeSeconds);
    setRemainingMs((safeMinutes * 60 + safeSeconds) * 1000);
    deadlineRef.current = null;
    setStatus("idle");
    stopAlarm();

    try {
      window.localStorage.setItem(
        TIMER_STORAGE_KEY,
        String(safeMinutes * 60 + safeSeconds),
      );
    } catch {
      // The duration still works for this session if storage is unavailable.
    }
  };

  const startTimer = () => {
    stopAlarm();
    prepareAudio();
    const duration =
      status === "paused" && remainingMs > 0 ? remainingMs : totalMs;
    if (duration <= 0) return;

    trackEvent(
      "timer_started",
      { startType: status === "paused" ? "resume" : "new" },
      { configuredDurationSeconds: totalMs / 1000, remainingSeconds: duration / 1000 },
    );

    setRemainingMs(duration);
    deadlineRef.current = Date.now() + duration;
    setStatus("running");
  };

  const stopTimer = () => {
    const remaining =
      deadlineRef.current !== null
        ? Math.max(0, deadlineRef.current - Date.now())
        : remainingMs;
    trackEvent("timer_paused", {}, {
      configuredDurationSeconds: totalMs / 1000,
      elapsedSeconds: Math.max(0, (totalMs - remaining) / 1000),
    });
    if (deadlineRef.current !== null) {
      setRemainingMs(remaining);
    }
    deadlineRef.current = null;
    setStatus("paused");
    stopAlarm();
  };

  const restartTimer = () => {
    trackEvent("timer_reset", { previousStatus: status }, { durationSeconds: totalMs / 1000 });
    deadlineRef.current = null;
    setRemainingMs(totalMs);
    setStatus("idle");
    stopAlarm();
  };

  const displaySeconds = Math.ceil(remainingMs / 1000);
  const formattedTime = `${String(Math.floor(displaySeconds / 60)).padStart(2, "0")}:${String(displaySeconds % 60).padStart(2, "0")}`;
  const progress = totalMs > 0 ? Math.min(1, remainingMs / totalMs) : 0;
  const ringOffset = -RING_CIRCUMFERENCE * (1 - progress);

  const statusText = useMemo(() => {
    switch (status) {
      case "running":
        return t("timerRunning");
      case "paused":
        return t("timerPaused");
      case "finished":
        return t("timerFinished");
      default:
        return t("timerReady");
    }
  }, [status, t]);

  return (
    <>
      <audio
        ref={alarmAudioRef}
        preload="auto"
      >
        <source
          src="/sounds/universfield-digital-alarm-clock-151927.mp3"
          type="audio/mpeg"
        />
      </audio>
      <NavBar />
      <main
        className="bg-[var(--background)] px-4 py-6 text-[var(--foreground)]"
        style={{
          minHeight:
            "calc(var(--app-vh, 100dvh) - 3.5rem - 3rem - env(safe-area-inset-bottom))",
        }}
      >
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-6">
          <header className="w-full text-center">
            <h1 className="text-3xl font-semibold tracking-tight">
              {t("timerTitle")}
            </h1>
            <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
              {t("timerDescription")}
            </p>
          </header>

          <div className="relative h-64 w-64 sm:h-72 sm:w-72">
            <svg
              className="h-full w-full -rotate-90"
              viewBox="0 0 256 256"
              aria-hidden
            >
              <circle
                cx="128"
                cy="128"
                r={RING_RADIUS}
                fill="none"
                stroke="var(--border)"
                strokeWidth="14"
              />
              <circle
                cx="128"
                cy="128"
                r={RING_RADIUS}
                fill="none"
                stroke="var(--color-primary)"
                strokeWidth="14"
                strokeLinecap="round"
                strokeDasharray={RING_CIRCUMFERENCE}
                strokeDashoffset={ringOffset}
                className="transition-[stroke-dashoffset] duration-100"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span
                role="timer"
                aria-label={`${t("timerAriaLabel")}: ${formattedTime}`}
                className="font-mono text-4xl font-semibold tabular-nums sm:text-5xl"
              >
                {formattedTime}
              </span>
              <span
                className={`mt-2 text-sm font-medium ${
                  status === "finished"
                    ? "text-primary"
                    : "text-[var(--text-muted)]"
                }`}
              >
                {statusText}
              </span>
            </div>
          </div>

          <div className="flex items-end justify-center gap-3">
            <label className="flex flex-col gap-1 text-sm font-medium">
              {t("timerMinutes")}
              <input
                type="number"
                inputMode="numeric"
                min="0"
                max="99"
                value={minutes}
                disabled={status === "running"}
                onChange={(event) =>
                  updateDuration(Number(event.target.value) || 0, seconds)
                }
                onBlur={() =>
                  trackEvent("timer_duration_set", {}, { durationSeconds: totalMs / 1000 })
                }
                className="w-28 rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-center text-lg shadow-sm disabled:opacity-60"
              />
            </label>
            <span aria-hidden className="pb-2 text-2xl font-semibold">
              :
            </span>
            <label className="flex flex-col gap-1 text-sm font-medium">
              {t("timerSeconds")}
              <input
                type="number"
                inputMode="numeric"
                min="0"
                max="59"
                value={seconds}
                disabled={status === "running"}
                onChange={(event) =>
                  updateDuration(minutes, Number(event.target.value) || 0)
                }
                onBlur={() =>
                  trackEvent("timer_duration_set", {}, { durationSeconds: totalMs / 1000 })
                }
                className="w-28 rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-center text-lg shadow-sm disabled:opacity-60"
              />
            </label>
          </div>

          <div className="flex w-full max-w-xl flex-wrap justify-center gap-3">
            <button
              type="button"
              disabled={status === "running" || totalMs === 0}
              onClick={startTimer}
              className="flex min-w-32 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 font-medium text-white transition-colors hover:bg-primary/80 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FaPlay aria-hidden />
              {status === "paused" ? t("timerResume") : t("timerStart")}
            </button>
            <button
              type="button"
              onClick={restartTimer}
              className="flex min-w-32 items-center justify-center gap-2 rounded-md border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 font-medium transition-colors hover:bg-[var(--surface-muted)]"
            >
              <FaArrowRotateRight aria-hidden />
              {t("timerRestart")}
            </button>
            <button
              type="button"
              disabled={status !== "running"}
              onClick={stopTimer}
              className="flex min-w-32 items-center justify-center gap-2 rounded-md border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 font-medium transition-colors hover:bg-[var(--surface-muted)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FaStop aria-hidden />
              {t("timerStop")}
            </button>
          </div>

          <span className="sr-only" aria-live="assertive">
            {status === "finished" ? t("timerFinished") : ""}
          </span>
        </div>
      </main>
    </>
  );
}
