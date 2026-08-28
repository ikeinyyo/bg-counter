import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useSelectAllOnFocus } from "./useSelectAllOnFocus";

const Field = () => {
  const { ref, handlers } = useSelectAllOnFocus<HTMLInputElement>();
  return <input ref={ref} defaultValue="Counter" {...handlers} />;
};

describe("useSelectAllOnFocus", () => {
  afterEach(() => vi.useRealTimers());

  it("does not keep focus when a touch gesture becomes a scroll", () => {
    vi.useFakeTimers();
    render(<Field />);
    const input = screen.getByRole("textbox");

    fireEvent.touchStart(input, { touches: [{ clientX: 10, clientY: 10 }] });
    fireEvent.touchMove(input, { touches: [{ clientX: 10, clientY: 30 }] });
    input.focus();
    fireEvent.touchEnd(input);
    act(() => vi.runAllTimers());

    expect(input).not.toHaveFocus();
  });

  it("still selects the value after an intentional focus", () => {
    vi.useFakeTimers();
    render(<Field />);
    const input = screen.getByRole("textbox") as HTMLInputElement;

    input.focus();
    act(() => vi.runAllTimers());

    expect(input).toHaveFocus();
    expect(input.selectionStart).toBe(0);
    expect(input.selectionEnd).toBe(input.value.length);
  });
});
