import { FaCopy, FaEdit, FaTrash } from "react-icons/fa";
import { useTranslation } from "@/context/SettingsContext";
import {
  CounterConfig,
  getDefaultBySize,
  getExactSizeFromConfig,
  Size,
} from "../domain";
import { trackEvent } from "@/lib/telemetry";

type Props = {
  showMenu: boolean;
  setShowMenu: (value: boolean) => void;
  onUpdate?: (config: CounterConfig) => void;
  onDelete?: (id: string) => void;
  onDuplicate?: (counter: CounterConfig) => void;
  localConfig: CounterConfig;
  setIsEditing: (value: boolean) => void;
  menuRef: React.RefObject<HTMLDivElement | null>;
};

const Menu = ({
  showMenu,
  setShowMenu,
  onUpdate,
  onDelete,
  onDuplicate,
  localConfig,
  setIsEditing,
  menuRef,
}: Props) => {
  const { t } = useTranslation();
  const changeProps = (size: Size) => {
    return getDefaultBySize(size);
  };

  return (
    showMenu && (
      <>
        <button
          type="button"
          tabIndex={-1}
          aria-label={t("close")}
          onClick={() => setShowMenu(false)}
          className="fixed inset-0 z-[240] bg-black/45 backdrop-blur-[1px] sm:hidden"
        />
        <div
          role="menu"
          aria-label={t("menuOptions")}
          className="fixed inset-x-3 bottom-[calc(0.75rem+env(safe-area-inset-bottom))] z-[250] flex min-w-52 flex-col gap-1 rounded-2xl border border-[var(--border)] bg-[var(--surface)]/95 p-2 shadow-2xl backdrop-blur-md sm:absolute sm:inset-x-auto sm:bottom-auto sm:right-2 sm:top-14 sm:z-50 sm:shadow-xl"
          onClick={(e) => e.stopPropagation()}
          ref={menuRef}
        >
        {onUpdate && (
          <button
            onClick={() => {
              trackEvent("counter_editor_opened");
              setIsEditing(true);
              setShowMenu(false);
            }}
            className="flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold text-[var(--foreground)] transition-colors hover:bg-[var(--surface-muted)]"
          >
            <FaEdit /> {t("menuEdit")}
          </button>
        )}

        {onDuplicate && (
          <button
            onClick={() => {
              trackEvent("counter_duplicated", { icon: localConfig.icon });
              onDuplicate?.(localConfig);
              setShowMenu(false);
            }}
            className="flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold text-[var(--foreground)] transition-colors hover:bg-[var(--surface-muted)]"
          >
            <FaCopy /> {t("menuDuplicate")}
          </button>
        )}

        {onDelete && (
          <button
            onClick={() => {
              trackEvent("counter_deleted", { icon: localConfig.icon });
              onDelete(localConfig.id);
            }}
            className="flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold text-red-600 transition-colors hover:bg-red-500/10"
          >
            <FaTrash /> {t("menuDelete")}
          </button>
        )}

        <div className="my-1 border-t border-[var(--border)]" />

        <span className="px-2 pt-1 text-[0.68rem] font-bold uppercase tracking-wider text-[var(--text-muted)]">
          {t("labelCounterSize")}
        </span>

        <div className="grid grid-cols-4 gap-1 rounded-xl bg-[var(--surface-muted)] p-1">
          {["XS", "S", "M", "L"].map((size) => (
            <button
              key={size}
              onClick={() => {
                trackEvent("counter_size_changed", { size });
                const updated = {
                  ...localConfig,
                  ...changeProps(size as Size),
                };
                onUpdate?.(updated);
              }}
              aria-label={`${t(`counterSizePreset_${size}`)} (${size})`}
              title={t(`counterSizeHint_${size}`)}
              aria-pressed={getExactSizeFromConfig(localConfig) === (size as Size)}
              className={`h-9 rounded-lg text-xs font-bold transition-colors
                ${
                  getExactSizeFromConfig(localConfig) === (size as Size)
                    ? "bg-[var(--surface)] text-primary shadow-sm"
                    : "text-[var(--text-muted)] hover:text-[var(--foreground)]"
                }`}
            >
              {size}
            </button>
          ))}
        </div>
        </div>
      </>
    )
  );
};

export { Menu };
