import {
  FaHeart,
  FaStar,
  FaCrown,
  FaFire,
  FaGem,
  FaSkull,
  FaMagic,
  FaSun,
  FaMoon,
  FaCompass,
  FaBook,
  FaWrench,
  FaAppleAlt,
  FaBolt,
  FaLeaf,
  FaCoins,
  FaSpider,
  FaDna,
  FaBalanceScale,
} from "react-icons/fa";
import {
  FaBurst,
  FaDroplet,
  FaHandBackFist,
  FaMask,
  FaPeopleGroup,
  FaShieldHalved,
  FaShieldHeart,
} from "react-icons/fa6";

import { PiWarningFill } from "react-icons/pi";

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
    | "medium2large";
};

const COLORS = [
  { name: "Red", value: "#dc2626", key: "red" },
  { name: "Orange", value: "#ea580c", key: "orange" },
  { name: "Yellow", value: "#eab308", key: "yellow" },
  { name: "Green", value: "#16a34a", key: "green" },
  { name: "Teal", value: "#0d9488", key: "teal" },
  { name: "Blue", value: "#2563eb", key: "blue" },
  { name: "Indigo", value: "#4f46e5", key: "indigo" },
  { name: "Purple", value: "#9333ea", key: "purple" },
  { name: "Pink", value: "#ec4899", key: "pink" },
  { name: "Black", value: "#1f2937", key: "black" },
  { name: "Brown", value: "#92400e", key: "brown" },
  { name: "Light Blue", value: "#38bdf8", key: "lightblue" },
  { name: "Cyan", value: "#06b6d4", key: "cyan" },
  { name: "Light Green", value: "#34d399", key: "lightgreen" },
  { name: "Lime", value: "#84cc16", key: "lime" },
  { name: "Violet", value: "#8b5cf6", key: "violet" },
  { name: "Crimson", value: "#9b1d20", key: "crimson" },
  { name: "Magenta", value: "#d1008f", key: "magenta" },
];

const ICONS = [
  { name: "Heart", component: FaHeart, key: "heart" },
  { name: "Warning", component: PiWarningFill, key: "warning" },
  { name: "Star", component: FaStar, key: "star" },
  { name: "Shield", component: FaShieldHalved, key: "shield" },

  { name: "Sun", component: FaSun, key: "sun" },
  { name: "Water", component: FaDroplet, key: "water" },
  { name: "Skull", component: FaSkull, key: "skull" },
  { name: "Fire", component: FaFire, key: "fire" },
  { name: "Leaf", component: FaLeaf, key: "leaf" },

  { name: "Crown", component: FaCrown, key: "crown" },
  { name: "Bolt", component: FaBolt, key: "bolt" },
  { name: "Gem", component: FaGem, key: "gem" },
  { name: "Coins", component: FaCoins, key: "coins" },
  { name: "Magic", component: FaMagic, key: "magic" },
  { name: "Compass", component: FaCompass, key: "compass" },
  { name: "Apple", component: FaAppleAlt, key: "applealt" },
  { name: "Book", component: FaBook, key: "book" },
  { name: "Wrench", component: FaWrench, key: "wrench" },

  { name: "Spider", component: FaSpider, key: "spider" },
  { name: "Dna", component: FaDna, key: "dna" },
  { name: "Mask", component: FaMask, key: "mask" },
  { name: "Justice", component: FaBalanceScale, key: "justice" },
  { name: "Leadership", component: FaPeopleGroup, key: "leadership" },
  { name: "Aggression", component: FaHandBackFist, key: "aggression" },
  { name: "Protection", component: FaShieldHeart, key: "protection" },

  { name: "Moon", component: FaMoon, key: "moon" },
  { name: "Burst", component: FaBurst, key: "burst" },
];

const getColorByKey = (key: string) => {
  return COLORS.find((color) => color.key === key)?.value || "#dc2626";
};

const getIconByKey = (key: string) => {
  return ICONS.find((icon) => icon.key === key)?.component || FaHeart;
};
export { COLORS, ICONS, getColorByKey, getIconByKey };
