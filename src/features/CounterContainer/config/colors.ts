import { Color } from "../domain";

const COLORS: Color[] = [
  { name: "Black", value: "#1f2937", key: "black" },
  { name: "Red", value: "#dc2626", key: "red" },
  { name: "Orange", value: "#ea580c", key: "orange" },
  { name: "Yellow", value: "#eab308", key: "yellow" },
  { name: "Green", value: "#16a34a", key: "green" },
  { name: "Blue", value: "#2563eb", key: "blue" },
  { name: "Purple", value: "#9333ea", key: "purple" },
  { name: "Magenta", value: "#d1008f", key: "magenta" },
  { name: "Pink", value: "#ec4899", key: "pink" },
  { name: "Brown", value: "#92400e", key: "brown" },
  { name: "Gray", value: "#6b7280", key: "gray" },

  { name: "Bright Red", value: "#FF2D00", key: "brightred" },
  { name: "Carmine", value: "#960018", key: "carmine" },
  { name: "Crimson", value: "#9b1d20", key: "crimson" },
  { name: "Rose", value: "#f43f5e", key: "rose" },

  { name: "Flame Orange", value: "#FF5B00", key: "flameorange" },
  { name: "Bright Tangerine", value: "#FF9500", key: "brighttangerine" },
  { name: "Amber", value: "#f59e0b", key: "amber" },
  { name: "Sunglow", value: "#FFCC33", key: "sunglow" },

  { name: "Lime", value: "#84cc16", key: "lime" },
  { name: "Lime Green", value: "#32CD32", key: "limegreen" },
  { name: "Light Green", value: "#34d399", key: "lightgreen" },
  { name: "Emerald", value: "#059669", key: "emerald" },
  { name: "Spring Green", value: "#00E676", key: "springgreen" },

  { name: "Teal", value: "#0d9488", key: "teal" },
  { name: "Bright Teal", value: "#00C7B7", key: "brightteal" },
  { name: "Cyan", value: "#06b6d4", key: "cyan" },
  { name: "Cyan Blue", value: "#00BFFF", key: "cyanblue" },
  { name: "Light Blue", value: "#38bdf8", key: "lightblue" },
  { name: "Sky", value: "#0ea5e9", key: "sky" },
  { name: "Azure", value: "#007FFF", key: "azure" },

  { name: "Royal Blue", value: "#4169E1", key: "royalblue2" },
  { name: "Indigo", value: "#4f46e5", key: "indigo" },
  { name: "Vivid Indigo", value: "#5A4FCF", key: "vividindigo" },
  { name: "Violet", value: "#8b5cf6", key: "violet" },
  { name: "Vivid Violet", value: "#9C27FF", key: "vividviolet" },

  { name: "Hot Magenta", value: "#FF1DCE", key: "hotmagenta" },
  { name: "Fuchsia", value: "#c026d3", key: "fuchsia" },

  { name: "Sand", value: "#d6a76c", key: "sand" },
  { name: "Light Gray", value: "#bbbbbb", key: "lightgray" },
];

const getColorByKey = (key: string) => {
  return COLORS.find((color) => color.key === key)?.value || "#dc2626";
};

export { COLORS, getColorByKey };
