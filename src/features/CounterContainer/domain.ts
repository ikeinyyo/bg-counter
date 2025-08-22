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
  name: string;
  backgroundColor: string;
  icon: string;
  size: "xs" | "s" | "m" | "l";
  xsElementsPerRow?: number;
  mdElementsPerRow?: number;
  lgElementsPerRow?: number;
};

export type IconDef = {
  name: string;
  component: React.ComponentType<{ className?: string }>;
  key: string;
};
