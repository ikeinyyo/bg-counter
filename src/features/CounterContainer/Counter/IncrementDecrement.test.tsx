import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { IncrementDecrement } from "./IncrementDecrement";

const renderControl = () => {
  const onIncrement = vi.fn();
  const onDecrement = vi.fn();
  render(
    <IncrementDecrement
      onIncrement={onIncrement}
      onDecrement={onDecrement}
      isSmall={false}
      incrementLabel="Sumar"
      decrementLabel="Restar"
    />,
  );
  return { onIncrement, onDecrement };
};

describe("IncrementDecrement", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    delete (window as Window & { ontouchstart?: unknown }).ontouchstart;
    Object.defineProperty(navigator, "maxTouchPoints", {
      configurable: true,
      value: 0,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("increments and decrements one point on short mouse presses", () => {
    const { onIncrement, onDecrement } = renderControl();

    fireEvent.mouseDown(screen.getByLabelText("Sumar"));
    fireEvent.mouseUp(screen.getByLabelText("Sumar"));
    fireEvent.mouseDown(screen.getByLabelText("Restar"));
    fireEvent.mouseUp(screen.getByLabelText("Restar"));

    expect(onIncrement).toHaveBeenCalledWith(1);
    expect(onDecrement).toHaveBeenCalledWith(1);
  });

  it("repeats ten-point changes during a long press without adding a short press", () => {
    const { onIncrement } = renderControl();

    fireEvent.mouseDown(screen.getByLabelText("Sumar"));
    act(() => vi.advanceTimersByTime(1_010));
    fireEvent.mouseUp(screen.getByLabelText("Sumar"));

    expect(onIncrement).toHaveBeenCalledTimes(2);
    expect(onIncrement).toHaveBeenNthCalledWith(1, 10);
    expect(onIncrement).toHaveBeenNthCalledWith(2, 10);
  });

  it("finishes a press released outside the control", () => {
    const { onDecrement } = renderControl();

    fireEvent.mouseDown(screen.getByLabelText("Restar"));
    fireEvent.mouseUp(window);

    expect(onDecrement).toHaveBeenCalledOnce();
    expect(onDecrement).toHaveBeenCalledWith(1);
  });

  it("finishes a short press when the pointer leaves the control", () => {
    const { onIncrement } = renderControl();
    const increment = screen.getByLabelText("Sumar");

    fireEvent.mouseDown(increment);
    fireEvent.mouseLeave(increment);

    expect(onIncrement).toHaveBeenCalledOnce();
    expect(onIncrement).toHaveBeenCalledWith(1);
  });

  it("cancels a touch press when it becomes a scroll gesture", () => {
    Object.defineProperty(window, "ontouchstart", {
      configurable: true,
      value: null,
    });
    const { onIncrement } = renderControl();
    const increment = screen.getByLabelText("Sumar");

    fireEvent.touchStart(increment, {
      touches: [{ clientX: 10, clientY: 10 }],
    });
    fireEvent.touchMove(increment, {
      touches: [{ clientX: 30, clientY: 10 }],
    });
    act(() => vi.advanceTimersByTime(1_100));
    fireEvent.touchEnd(increment);

    expect(onIncrement).not.toHaveBeenCalled();
  });

  it("handles a short decrement press on touch devices", () => {
    Object.defineProperty(window, "ontouchstart", {
      configurable: true,
      value: null,
    });
    const { onDecrement } = renderControl();
    const decrement = screen.getByLabelText("Restar");

    fireEvent.touchStart(decrement, {
      touches: [{ clientX: 10, clientY: 10 }],
    });
    fireEvent.touchEnd(decrement);

    expect(onDecrement).toHaveBeenCalledOnce();
    expect(onDecrement).toHaveBeenCalledWith(1);
  });

  it("shows the accumulated delta and hides it after the feedback timeout", () => {
    renderControl();
    const increment = screen.getByLabelText("Sumar");

    fireEvent.mouseDown(increment);
    fireEvent.mouseUp(increment);
    expect(screen.getByText("+1").parentElement).toHaveClass("opacity-100");

    act(() => vi.advanceTimersByTime(2_000));
    expect(screen.getByText("+1").parentElement).toHaveClass("opacity-0");
    act(() => vi.advanceTimersByTime(320));
    expect(screen.getByText("0")).toBeInTheDocument();
  });
});
