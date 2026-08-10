import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Counter } from "./Counter";
import type { CounterConfig } from "../domain";

vi.mock("@/context/SettingsContext", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const counter = (initialValue: number): CounterConfig => ({
  id: "player1",
  initialValue,
  name: "Player 1",
  backgroundColor: "#eab308",
  icon: "heart",
  xsElementsPerRow: 2,
  mdElementsPerRow: 2,
  lgElementsPerRow: 2,
});

describe("Counter", () => {
  it("does not overwrite its parent configuration when it mounts or changes template", () => {
    const onUpdate = vi.fn();
    const { rerender } = render(
      <Counter counter={counter(40)} onUpdate={onUpdate} />,
    );

    rerender(<Counter counter={counter(20)} onUpdate={onUpdate} />);

    expect(onUpdate).not.toHaveBeenCalled();
  });
});
