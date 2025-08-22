import { FaEdit, FaTrash } from "react-icons/fa";
import {
  CounterConfig,
  getDefaultBySize,
  getSizeFromConfig,
  Size,
} from "../domain";

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
  const changeProps = (size: Size) => {
    return getDefaultBySize(size);
  };

  return (
    showMenu && (
      <div
        className="absolute top-12 right-2 bg-white/90 backdrop-blur-sm rounded-md shadow-lg p-2 flex flex-col gap-1 z-100"
        onClick={(e) => e.stopPropagation()}
        ref={menuRef}
      >
        {onUpdate && (
          <button
            onClick={() => {
              setIsEditing(true);
              setShowMenu(false);
            }}
            className="flex items-center gap-2 px-3 py-1 rounded hover:bg-gray-200 text-sm text-black"
          >
            <FaEdit /> Edit
          </button>
        )}

        {onDelete && (
          <button
            onClick={() => onDelete(localConfig.id)}
            className="flex items-center gap-2 px-3 py-1 rounded hover:bg-red-100 text-sm text-red-600"
          >
            <FaTrash /> Delete
          </button>
        )}

        <hr className="my-1" />

        <div className="flex justify-between gap-1">
          {["XS", "S", "M", "L"].map((size) => (
            <button
              key={size}
              onClick={() => {
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
