import type { CounterConfig } from "../domain";

/**
 * Localize counter names at apply time using the current language.
 * Names are snapshotted and will not change if the language changes later.
 */
export function localizeCounters(
  layoutId: string,
  counters: CounterConfig[],
  t: (key: string) => string,
): CounterConfig[] {
  const isMarvel = layoutId.startsWith("marvel");
  const isGenericPlayers =
    layoutId.startsWith("life") || layoutId.startsWith("aeons");
  const isLifeEnergy = layoutId === "lifeEnergy";

  const localizeName = (c: CounterConfig): string => {
    if (isMarvel) {
      if (c.id === "villain") return t("counter_villain");
      if (c.id === "threat") return t("counter_threat");
      if (c.id === "counter") return t("counter_resource");
      if (c.id === "hero") return t("counter_hero");
      const heroMatch = c.id.match(/^hero(\d+)$/);
      if (heroMatch) return `${t("counter_hero")} ${heroMatch[1]}`;
    }

    if (isLifeEnergy) {
      const m = c.id.match(/^player(\d+)-(life|energy)$/);
      if (m) {
        const n = m[1];
        const kind = m[2] === "life" ? t("counter_life") : t("counter_energy");
        return `${t("counter_player")} ${n} - ${kind}`;
      }
    }

    if (isGenericPlayers) {
      const m = c.id.match(/^player(\d+)$/);
      if (m) {
        return `${t("counter_player")} ${m[1]}`;
      }
    }

    return c.name;
  };

  return counters.map((c) => ({ ...c, name: localizeName(c) }));
}
