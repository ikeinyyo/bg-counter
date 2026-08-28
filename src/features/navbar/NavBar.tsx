"use client";
import Link from "next/link";
import Image from "next/image";
import packageJson from "../../../package.json";
import { useEffect, useRef, useState } from "react";
import { FaSliders, FaX } from "react-icons/fa6";
import { useTranslation } from "@/context/SettingsContext";

type Props = {
  right?:
    | React.ReactNode
    | ((utils: { requestClose: () => void }) => React.ReactNode);
};

const NavBar = ({ right }: Props) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const btnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        btnRef.current &&
        !btnRef.current.contains(target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  // Language/Theme selectors are placed in Footer now

  const requestClose = () => setOpen(false);

  const renderRight = () => {
    if (typeof right === "function") {
      return (right as (u: { requestClose: () => void }) => React.ReactNode)({
        requestClose,
      });
    }
    return right;
  };

  const hasRight = Boolean(right);

  return (
    <header className="sticky top-0 z-[150] flex h-14 items-center justify-between border-b border-white/10 bg-[var(--navbar-bg)] px-2 text-[var(--navbar-fg)] shadow-sm">
      <Link
        className="text-2xl font-bold hover:text-primary transition-colors"
        href="/"
      >
        <div className="flex items-center gap-2">
          <Image
            src="/images/logo.png"
            width={100}
            height={50}
            alt={t("logoAlt")}
            className="p-2 pl-3"
          />
          <span className="hidden md:inline">
            {t("appTitle")}
          </span>
          <span className="mt-3 hidden text-xs text-gray-400 md:inline">
            v{packageJson.version}
          </span>
        </div>
      </Link>

      {hasRight && (
        <button
          ref={btnRef}
          className="flex h-10 items-center gap-2 rounded-xl bg-white/10 px-3 text-sm font-semibold transition hover:bg-white/15"
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-label="Menu"
          onClick={() => setOpen((v) => !v)}
        >
          <FaSliders />
          <span>{t("navActions")}</span>
        </button>
      )}

      {open && hasRight && (
        <div className="fixed inset-0 top-14 z-[200] bg-black/55 backdrop-blur-sm" onClick={() => setOpen(false)}>
          <div
            ref={menuRef}
            role="dialog"
            aria-modal="true"
            aria-label={t("navActions")}
            className="absolute inset-x-0 bottom-0 max-h-[calc(100dvh-3.5rem)] overflow-y-auto rounded-t-[1.75rem] border border-[var(--border)] bg-[var(--surface)] p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] text-[var(--foreground)] shadow-2xl lg:inset-y-0 lg:left-auto lg:w-[26rem] lg:rounded-l-[1.75rem] lg:rounded-tr-none lg:pb-4"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-bold">{t("navActions")}</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={t("close")}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--surface-muted)] text-[var(--text-muted)]"
              >
                <FaX />
              </button>
            </div>
            <div className="flex flex-col gap-3">{renderRight()}</div>
          </div>
        </div>
      )}
    </header>
  );
};

export { NavBar };
