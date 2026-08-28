import { CounterConfig } from "../domain";
import { getIconByKey } from "../config/icons";

type Props = {
  localConfig: CounterConfig;
};

const CounterHeader = ({ localConfig }: Props) => {
  const IconComponent = getIconByKey(localConfig.icon);

  return (
    <div className="absolute left-3 right-14 top-3 flex items-center gap-2 text-white sm:left-4 sm:top-4">
      <span className="counter-icon shrink-0">
        <IconComponent />
      </span>
      <span
        className="counter-title truncate font-bold drop-shadow-sm"
      >
        {localConfig.name}
      </span>
    </div>
  );
};

export { CounterHeader };
