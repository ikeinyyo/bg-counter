"use client";
import { useState } from "react";

type Props = {
  counter: number;
  name?: string;
  backgroundColor?: string;
  icon?: string;
};

const Counter = ({
  counter,
  name = "Vida",
  backgroundColor = "#1f2937",
  icon = "❤️",
}: Props) => {
  const [count, setCount] = useState(counter);

  const onIncrement = () => {
    setCount(count + 1);
  };

  const onDecrement = () => {
    setCount(count - 1);
  };

  return (
    <div
      className="relative w-full h-64 rounded-lg shadow-lg overflow-hidden select-none"
      style={{ backgroundColor }}
    >
      {/* Counter Name and Icon */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 text-white">
        <span className="text-2xl">{icon}</span>
        <span className="text-lg font-semibold">{name}</span>
      </div>

      {/* Left Half - Decrement Zone */}
      <div
        className="absolute left-0 top-0 w-1/2 h-full flex items-center justify-center cursor-pointer transition-all duration-150 hover:bg-black hover:bg-opacity-20 active:bg-black active:bg-opacity-30"
        onClick={onDecrement}
      >
        <div className="text-white text-6xl font-bold opacity-20 hover:opacity-40 transition-opacity">
          −
        </div>
      </div>

      {/* Right Half - Increment Zone */}
      <div
        className="absolute right-0 top-0 w-1/2 h-full flex items-center justify-center cursor-pointer transition-all duration-150 hover:bg-white hover:bg-opacity-10 active:bg-white active:bg-opacity-20"
        onClick={onIncrement}
      >
        <div className="text-white text-6xl font-bold opacity-20 hover:opacity-40 transition-opacity">
          +
        </div>
      </div>

      {/* Central Counter Display */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="text-8xl font-bold text-white drop-shadow-lg">
          {count}
        </span>
      </div>

      {/* Visual Divider */}
      <div className="absolute left-1/2 top-0 w-px h-full bg-white bg-opacity-20 transform -translate-x-1/2"></div>
    </div>
  );
};

export { Counter };
