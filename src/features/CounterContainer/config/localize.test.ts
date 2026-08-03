import { describe, expect, it } from "vitest";
import type { CounterConfig } from "../domain";
import { localizeCounters } from "./localize";

const t = (key: string) =>
  ({
    counter_player: "Jugador",
    counter_hero: "Héroe",
    counter_villain: "Villano",
    counter_threat: "Amenaza",
    counter_resource: "Recurso",
    counter_life: "Vida",
    counter_energy: "Energía",
  })[key] ?? key;

const counter = (id: string, name = "Original"): CounterConfig => ({
  id,
  name,
  initialValue: 0,
  backgroundColor: "#000000",
  icon: "heart",
});

describe("localizeCounters", () => {
  it("localizes every Marvel counter role", () => {
    const result = localizeCounters(
      "marvel4P",
      ["villain", "threat", "counter", "hero", "hero3"].map((id) => counter(id)),
      t,
    );

    expect(result.map(({ name }) => name)).toEqual([
      "Villano",
      "Amenaza",
      "Recurso",
      "Héroe",
      "Héroe 3",
    ]);
  });

  it("localizes generic and Aeon's End player numbers", () => {
    expect(localizeCounters("life2", [counter("player1"), counter("player2")], t))
      .toEqual([
        expect.objectContaining({ name: "Jugador 1" }),
        expect.objectContaining({ name: "Jugador 2" }),
      ]);
    expect(localizeCounters("aeons1P", [counter("player1"), counter("city")], t))
      .toEqual([
        expect.objectContaining({ name: "Jugador 1" }),
        expect.objectContaining({ name: "Original" }),
      ]);
  });

  it("localizes both parts of the life and energy layout", () => {
    const result = localizeCounters(
      "lifeEnergy",
      [counter("player1-life"), counter("player1-energy")],
      t,
    );

    expect(result.map(({ name }) => name)).toEqual([
      "Jugador 1 - Vida",
      "Jugador 1 - Energía",
    ]);
  });

  it("preserves custom names and does not mutate the source counters", () => {
    const source = counter("custom", "Mi contador");
    const [localized] = localizeCounters("duel", [source], t);

    expect(localized.name).toBe("Mi contador");
    expect(localized).not.toBe(source);
    expect(source.name).toBe("Mi contador");
  });
});
