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
import { FaShield } from "react-icons/fa6";
import {
  GiSwordman,
  GiMagicSwirl,
  GiDragonHead,
  GiCrystalBall,
  GiAngelWings,
  GiDeathSkull,
} from "react-icons/gi";

export type CounterConfig = {
  id: string;
  initialValue: number;
  name: string;
  backgroundColor: string;
  icon: string;
};

const COLORS = [
  { name: "Rojo", value: "#dc2626" },
  { name: "Azul", value: "#2563eb" },
  { name: "Verde", value: "#16a34a" },
  { name: "Púrpura", value: "#9333ea" },
  { name: "Rosa", value: "#ec4899" },
  { name: "Amarillo", value: "#eab308" },
  { name: "Naranja", value: "#ea580c" },
  { name: "Gris", value: "#6b7280" },
  { name: "Índigo", value: "#4f46e5" },
  { name: "Teal", value: "#0d9488" },
  { name: "Negro", value: "#1f2937" },
  { name: "Marrón", value: "#92400e" },
];

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
];

export { COLORS, ICONS };
