import { FaEdit, FaTrash } from "react-icons/fa";
import { useTranslation } from "@/context/SettingsContext";
import {
  CounterConfig,
  getDefaultBySize,
  getSizeFromConfig,
  Size,
} from "../domain";
import { trackEvent } from "@/lib/telemetry";

type Props = {
  showMenu: boolean;
  setShowMenu: (value: boolean) => void;
  onUpdate?: (config: CounterConfig) => void;
  onDelete?: (id: string) => void;
  localConfig: CounterConfig;
  setIsEditing: (value: boolean) => void;
  menuRef: React.RefObject<HTMLDivElement | null>;
};

const Menu = ({
  showMenu,
  setShowMenu,
  onUpdate,
  onDelete,
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
      <div
        className="absolute top-12 right-2 z-100 flex flex-col gap-1 rounded-md border border-[var(--border)] bg-[var(--surface)]/95 p-2 shadow-lg backdrop-blur-sm"
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
            className="flex items-center gap-2 rounded px-3 py-1 text-sm text-[var(--foreground)] transition-colors hover:bg-[var(--surface-muted)]"
          >
            <FaEdit /> {t("menuEdit")}
          </button>
        )}

        {onDelete && (
          <button
            onClick={() => {
              trackEvent("counter_deleted", { icon: localConfig.icon });
              onDelete(localConfig.id);
            }}
            className="flex items-center gap-2 px-3 py-1 rounded hover:bg-red-100 text-sm text-red-600"
          >
            <FaTrash /> {t("menuDelete")}
          </button>
        )}

        <hr className="my-1" />

        <div className="flex justify-between gap-1">
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
              className={`w-8 h-8 rounded-full border border-primary text-xs font-semibold hover:border-transparent hover:bg-primary/80 hover:text-white transition-colors
                ${
                  getSizeFromConfig(localConfig) === (size as Size)
                    ? "bg-primary text-white"
                    : "bg-transparent text-primary"
                }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>
    )
  );
};

export { Menu };
