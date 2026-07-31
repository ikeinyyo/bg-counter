"use client";
import Link from "next/link";
import Image from "next/image";
import packageJson from "../../../package.json";
import { useEffect, useRef, useState } from "react";
import { FaEllipsisVertical } from "react-icons/fa6";
import { useTranslation } from "@/context/SettingsContext";

type Props = {
  compact?: boolean;
  right?:
    | React.ReactNode
    | ((utils: { requestClose: () => void }) => React.ReactNode);
};

const NavBar = ({ compact = false, right }: Props) => {
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
    <header className="relative flex h-14 items-center justify-between border-b border-[var(--border)] bg-[var(--navbar-bg)] p-2 text-[var(--navbar-fg)]">
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
            className="p-2 pl-4"
          />
          <span
            className={compact ? "hidden min-[1080px]:inline" : "hidden md:inline"}
          >
            {t("appTitle")}
          </span>
          <span
            className={`${compact ? "hidden min-[1080px]:inline" : "hidden md:inline"} mt-3 text-xs text-gray-400`}
          >
            v{packageJson.version}
          </span>
        </div>
      </Link>

      {/* Desktop/tablet actions */}
      {hasRight && (
        <div
          className={`${compact ? "hidden lg:flex" : "hidden md:flex"} min-w-0 items-center gap-2 xl:gap-4`}
        >
          {renderRight()}
        </div>
      )}

      {/* Mobile overflow button */}
      {hasRight && (
        <button
          ref={btnRef}
          className={`${compact ? "lg:hidden" : "md:hidden"} rounded p-2 hover:bg-white/10`}
          aria-haspopup="menu"
          aria-expanded={open}
          aria-label="Menu"
          onClick={() => setOpen((v) => !v)}
        >
          <FaEllipsisVertical />
        </button>
      )}

      {/* Mobile dropdown */}
      {open && hasRight && (
        <div
          ref={menuRef}
          role="menu"
          className="absolute right-2 top-14 z-[200] min-w-60 rounded-md border border-[var(--border)] bg-[var(--surface)] p-3 shadow-lg text-[var(--foreground)]"
        >
          <div className="flex flex-col gap-3">{renderRight()}</div>
        </div>
      )}
    </header>
  );
};

export { NavBar };
