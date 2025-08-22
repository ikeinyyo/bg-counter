import { CounterConfig } from "../domain";
import { getIconByKey } from "../config/icons";

type Props = {
  localConfig: CounterConfig;
};

const CounterHeader = ({ localConfig }: Props) => {
  const IconComponent = getIconByKey(localConfig.icon);

  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 text-white">
      <span className="text-2xl">
        <IconComponent />
      </span>
      <span
        className={`text-lg font-semibold text-center line-clamp-2 ${
          ["small", "large2small", "medium2small", "small2medium"].includes(
            localConfig.size
          )
            ? "hidden md:[display:-webkit-box]"
            : ""
        }`}
      >
        {localConfig.name}
      </span>
    </div>
  );
};

export { CounterHeader };
