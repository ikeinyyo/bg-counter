export type Color = {
  name: string;
  value: string;
  key: string;
};

export type Layout = {
  name: string;
  id: string;
  counters: CounterConfig[];
};

export type CounterConfig = {
  id: string;
  initialValue: number;
  value?: number;
  name: string;
  backgroundColor: string;
  icon: string;
  xsElementsPerRow?: number;
  mdElementsPerRow?: number;
  lgElementsPerRow?: number;
};

export type IconDef = {
  name: string;
  component: React.ComponentType<{ className?: string }>;
  key: string;
};

export type Size = "XS" | "S" | "M" | "L";

const getDefaultBySize = (size: Size) => {
  switch (size) {
    case "XS":
      return { xsElementsPerRow: 2, mdElementsPerRow: 3, lgElementsPerRow: 4 };
    case "S":
      return { xsElementsPerRow: 2, mdElementsPerRow: 2, lgElementsPerRow: 4 };
    case "M":
      return { xsElementsPerRow: 1, mdElementsPerRow: 2, lgElementsPerRow: 2 };
    case "L":
    default:
      return { xsElementsPerRow: 1, mdElementsPerRow: 1, lgElementsPerRow: 1 };
  }
};

const getSizeFromConfig = (config: CounterConfig): Size => {
  const xs = config.xsElementsPerRow ?? 0;
  const md = config.mdElementsPerRow ?? 0;
  const lg = config.lgElementsPerRow ?? 0;

  if (xs >= 2 && md >= 3 && lg >= 4) {
    return "XS";
  }

  if (xs >= 2 && md >= 2 && lg >= 4) {
    return "S";
  }

  if (xs >= 1 && md >= 2 && lg >= 2) {
    return "M";
  }

  return "L";
};

export { getDefaultBySize, getSizeFromConfig };
