import { FaEdit, FaTrash } from "react-icons/fa";
import { CounterConfig } from "../domain";
import { useBreakpoint } from "../../../hooks/useBreakpoint";

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
  const breakpoint = useBreakpoint();
  const changeProps = (counter: CounterConfig, size: number) => {
    const xsElementsPerRow = breakpoint.isXs ? size : counter.xsElementsPerRow;
    const mdElementsPerRow = breakpoint.isMd ? size : counter.mdElementsPerRow;
    const lgElementsPerRow = breakpoint.isLg ? size : counter.lgElementsPerRow;

    return {
      xsElementsPerRow,
      mdElementsPerRow,
      lgElementsPerRow,
    };
  };

  const isSelected = (counter: CounterConfig, size: number) => {
    return breakpoint.isXs
      ? counter.xsElementsPerRow == size
      : breakpoint.isMd
      ? counter.mdElementsPerRow == size
      : breakpoint.isLg
      ? counter.lgElementsPerRow == size
      : false;
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
          {[1, 2, 3, 4].map((size) => (
            <button
              key={size}
              onClick={() => {
                const updated = {
                  ...localConfig,
                  ...changeProps(localConfig, size),
                };
                onUpdate?.(updated);
              }}
              className={`w-8 h-8 rounded-full border border-primary text-xs font-semibold hover:border-transparent hover:bg-primary/80 hover:text-white transition-colors
                ${
                  isSelected(localConfig, size)
                    ? "bg-primary text-white"
                    : "bg-transparent text-primary"
                }`}
            >
              {{ 1: "L", 2: "M", 3: "S", 4: "XS" }[size]}
            </button>
          ))}
        </div>
      </div>
    )
  );
};

export { Menu };
