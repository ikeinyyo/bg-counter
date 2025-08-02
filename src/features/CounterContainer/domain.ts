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
  size:
    | "small"
    | "medium"
    | "large"
    | "medium2small"
    | "large2small"
    | "full"
    | "medium2large"
    | "small2medium";
};

export type IconDef = {
  name: string;
  component: React.ComponentType<{ className?: string }>;
  key: string;
};
