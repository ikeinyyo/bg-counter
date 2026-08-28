"use client";

import React, { useMemo, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useTranslation } from "@/context/SettingsContext";
import { IconCategory, IconDef } from "../../../domain";

type Props = {
  label?: string;
  icons: IconDef[];
  value: string;
  onChange: (val: string) => void;
};

const CATEGORIES: IconCategory[] = [
  "favorites",
  "superheroes",
  "fantasy",
  "combat",
  "nature",
  "scifi",
  "objects",
];

const IconPicker = ({ label = "Icon", icons, value, onChange }: Props) => {
  const { t } = useTranslation();
  const selectedCategory =
    icons.find((icon) => icon.key === value)?.category ?? "favorites";
  const [category, setCategory] = useState<IconCategory>(selectedCategory);
  const [query, setQuery] = useState("");

  const visibleIcons = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase();
    if (normalized) {
      return icons.filter((icon) =>
        `${icon.name} ${icon.key}`.toLocaleLowerCase().includes(normalized),
      );
    }
    return icons.filter((icon) => icon.category === category);
  }, [category, icons, query]);

  return (
    <fieldset className="min-w-0">
      <legend className="mb-2 text-sm font-semibold text-[var(--foreground)]">
        {label}
      </legend>

      <div className="relative">
        <FaSearch
          aria-hidden
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[var(--text-muted)]"
        />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t("iconSearchPlaceholder")}
          aria-label={t("iconSearchPlaceholder")}
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {!query && (
        <div
          className="mt-3 flex gap-2 overflow-x-auto pb-1"
          aria-label={t("iconCategoriesAria")}
        >
          {CATEGORIES.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              aria-pressed={category === item}
              className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                category === item
                  ? "border-primary bg-primary text-white"
                  : "border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] hover:border-primary/60 hover:text-[var(--foreground)]"
              }`}
            >
              {t(`iconCategory_${item}`)}
            </button>
          ))}
        </div>
      )}

      <div
        className="mt-3 grid max-h-52 grid-cols-[repeat(auto-fill,minmax(2.75rem,1fr))] gap-2 overflow-y-auto rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] p-3"
        role="listbox"
        aria-label={t("iconPickerAria")}
      >
        {visibleIcons.map((icon) => {
          const SelectedIcon = icon.component;
          const selected = value === icon.key;
          return (
            <button
              key={icon.key}
              type="button"
              onClick={() => onChange(icon.key)}
              className={`flex aspect-square min-h-11 items-center justify-center rounded-xl border text-[var(--foreground)] transition active:scale-95 ${
                selected
                  ? "border-primary bg-primary text-white shadow-sm ring-2 ring-primary/20"
                  : "border-[var(--border)] bg-[var(--surface)] hover:border-primary/60 hover:text-primary"
              }`}
              title={icon.name}
              role="option"
              aria-selected={selected}
              aria-label={`${t("labelIcon")} ${icon.name}`}
            >
              <SelectedIcon className="text-xl" />
            </button>
          );
        })}
        {visibleIcons.length === 0 && (
          <p className="col-span-full py-5 text-center text-sm text-[var(--text-muted)]">
            {t("iconSearchEmpty")}
          </p>
        )}
      </div>
    </fieldset>
  );
};

export { IconPicker };
