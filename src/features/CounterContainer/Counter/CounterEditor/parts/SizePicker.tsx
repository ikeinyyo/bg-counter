"use client";

import { FaDesktop, FaMobileAlt, FaTabletAlt } from "react-icons/fa";
import { useTranslation } from "@/context/SettingsContext";
import { ResponsiveLayout, SIZE_PRESETS, Size } from "../../../domain";

type Props = {
  value: Size | null;
  layout: ResponsiveLayout;
  onChange: (size: Size) => void;
};

const SIZES: Size[] = ["XS", "S", "M", "L"];

const SizePicker = ({ value, layout, onChange }: Props) => {
  const { t } = useTranslation();

  return (
    <fieldset>
      <legend className="mb-2 text-sm font-semibold text-[var(--foreground)]">
        {t("labelCounterSize")}
      </legend>
      {value === null && (
        <div className="mb-2 flex items-center justify-between gap-3 rounded-xl border border-dashed border-primary/50 bg-primary/5 px-3 py-2 text-xs">
          <span className="font-semibold text-[var(--foreground)]">
            {t("counterSizeCustom")}
          </span>
          <span className="text-[var(--text-muted)]">
            {layout.xsElementsPerRow} · {layout.mdElementsPerRow} · {layout.lgElementsPerRow}
          </span>
        </div>
      )}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {SIZES.map((size) => {
          const preset = SIZE_PRESETS[size];
          const selected = value === size;
          return (
            <button
              key={size}
              type="button"
              onClick={() => onChange(size)}
              aria-pressed={selected}
              aria-label={`${t(`counterSizePreset_${size}`)} (${size})`}
              className={`rounded-2xl border p-3 text-left transition active:scale-[0.99] ${
                selected
                  ? "border-primary bg-primary/8 ring-2 ring-primary/15"
                  : "border-[var(--border)] bg-[var(--surface)] hover:border-primary/50"
              }`}
            >
              <span className="flex items-center justify-between gap-2">
                <span className="text-sm font-bold text-[var(--foreground)]">
                  {t(`counterSizePreset_${size}`)}
                </span>
                <span
                  aria-hidden
                  className={`rounded-md px-1.5 py-0.5 text-[0.65rem] font-black ${
                    selected
                      ? "bg-primary text-white"
                      : "bg-[var(--surface-muted)] text-[var(--text-muted)]"
                  }`}
                >
                  {size}
                </span>
              </span>
              <span className="mt-2 grid grid-cols-3 gap-1 text-[0.68rem] text-[var(--text-muted)]">
                <span className="flex items-center gap-1" title={t("deviceMobile")}>
                  <FaMobileAlt aria-hidden /> {preset.xsElementsPerRow}
                </span>
                <span className="flex items-center justify-center gap-1" title={t("deviceTablet")}>
                  <FaTabletAlt aria-hidden /> {preset.mdElementsPerRow}
                </span>
                <span className="flex items-center justify-end gap-1" title={t("deviceDesktop")}>
                  <FaDesktop aria-hidden /> {preset.lgElementsPerRow}
                </span>
              </span>
            </button>
          );
        })}
      </div>
      <p className="mt-2 text-xs leading-5 text-[var(--text-muted)]">
        {value ? t(`counterSizeHint_${value}`) : t("counterSizeCustomHint")}
      </p>
      <p className="mt-1 text-[0.68rem] text-[var(--text-muted)]">
        {t("counterSizeLegend")}
      </p>
    </fieldset>
  );
};

export { SizePicker };
