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
  category?: IconCategory;
};

export type IconCategory =
  | "favorites"
  | "superheroes"
  | "fantasy"
  | "combat"
  | "nature"
  | "scifi"
  | "objects";

export type Size = "XS" | "S" | "M" | "L";

export type ResponsiveLayout = Required<
  Pick<
    CounterConfig,
    "xsElementsPerRow" | "mdElementsPerRow" | "lgElementsPerRow"
  >
>;

const SIZE_PRESETS: Record<Size, ResponsiveLayout> = {
  XS: { xsElementsPerRow: 2, mdElementsPerRow: 3, lgElementsPerRow: 4 },
  S: { xsElementsPerRow: 2, mdElementsPerRow: 2, lgElementsPerRow: 4 },
  M: { xsElementsPerRow: 1, mdElementsPerRow: 2, lgElementsPerRow: 2 },
  L: { xsElementsPerRow: 1, mdElementsPerRow: 1, lgElementsPerRow: 1 },
};

const getDefaultBySize = (size: Size): ResponsiveLayout => ({
  ...SIZE_PRESETS[size],
});

const getExactSizeFromConfig = (
  config: Pick<
    CounterConfig,
    "xsElementsPerRow" | "mdElementsPerRow" | "lgElementsPerRow"
  >,
): Size | null =>
  (Object.entries(SIZE_PRESETS) as [Size, ResponsiveLayout][]).find(
    ([, preset]) =>
      config.xsElementsPerRow === preset.xsElementsPerRow &&
      config.mdElementsPerRow === preset.mdElementsPerRow &&
      config.lgElementsPerRow === preset.lgElementsPerRow,
  )?.[0] ?? null;

const getSizeFromConfig = (
  config: Pick<
    CounterConfig,
    "xsElementsPerRow" | "mdElementsPerRow" | "lgElementsPerRow"
  >,
): Size => {
  const xs = config.xsElementsPerRow ?? 0;
  const md = config.mdElementsPerRow ?? 0;
  const lg = config.lgElementsPerRow ?? 0;

  return (Object.entries(SIZE_PRESETS) as [Size, ResponsiveLayout][]).reduce(
    (closest, [size, preset]) => {
      const distance =
        Math.abs(xs - preset.xsElementsPerRow) +
        Math.abs(md - preset.mdElementsPerRow) +
        Math.abs(lg - preset.lgElementsPerRow);
      return distance < closest.distance ? { size, distance } : closest;
    },
    { size: "L" as Size, distance: Number.POSITIVE_INFINITY },
  ).size;
};

export {
  SIZE_PRESETS,
  getDefaultBySize,
  getExactSizeFromConfig,
  getSizeFromConfig,
};
