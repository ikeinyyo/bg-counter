import {
  FaHeart,
  FaStar,
  FaCrown,
  FaFire,
  FaBolt,
  FaGem,
  FaSkull,
  FaMagic,
  FaLeaf,
  FaSnowflake,
  FaSun,
} from "react-icons/fa";
import { FaDroplet, FaShield } from "react-icons/fa6";
import {
  GiSwordman,
  GiMagicSwirl,
  GiDragonHead,
  GiCrystalBall,
  GiAngelWings,
  GiDeathSkull,
  GiDrop,
  GiLion,
} from "react-icons/gi";

export type CounterConfig = {
  id: string;
  initialValue: number;
  name: string;
  backgroundColor: string;
  icon: string;
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

const getColorByKey = (key: string) => {
  return COLORS.find((color) => color.key === key)?.value;
};

const getIconByKey = (key: string) => {
  return ICONS.find((icon) => icon.key === key)?.component;
};

const ICONS = [
  { name: "Corazón", component: FaHeart, key: "heart" },
  { name: "Escudo", component: FaShield, key: "shield" },
  { name: "Estrella", component: FaStar, key: "star" },
  { name: "Corona", component: FaCrown, key: "crown" },
  { name: "Fuego", component: FaFire, key: "fire" },
  { name: "Rayo", component: FaBolt, key: "bolt" },
  { name: "Gema", component: FaGem, key: "gem" },
  { name: "Calavera", component: FaSkull, key: "skull" },
  { name: "Magia", component: FaMagic, key: "magic" },
  { name: "Hoja", component: FaLeaf, key: "leaf" },
  { name: "Copo", component: FaSnowflake, key: "snowflake" },
  { name: "Sol", component: FaSun, key: "sun" },
  { name: "Guerrero", component: GiSwordman, key: "swordman" },
  { name: "Hechizo", component: GiMagicSwirl, key: "magicswirl" },
  { name: "Dragón", component: GiDragonHead, key: "dragon" },
  { name: "Cristal", component: GiCrystalBall, key: "crystal" },
  { name: "Alas", component: GiAngelWings, key: "wings" },
  { name: "Muerte", component: GiDeathSkull, key: "death" },
  { name: "Gota", component: FaDroplet, key: "drop" },
  { name: "Leon", component: GiLion, key: "lion" },
];

export { COLORS, ICONS, getColorByKey, getIconByKey };
