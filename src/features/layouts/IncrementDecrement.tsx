import { useState } from "react";
import { CounterConfig } from "./CounterConfig";

type Props = {
  onDecrement: (value: number) => void;
  onIncrement: (value: number) => void;
  localConfig: CounterConfig;
};

const IncrementDecrement = ({
  onDecrement,
  onIncrement,
  localConfig,
}: Props) => {
  const [isLongPress, setIsLongPress] = useState(false);
  const [pressTimer, setPressTimer] = useState<NodeJS.Timeout | null>(null);
  const [repeatTimer, setRepeatTimer] = useState<NodeJS.Timeout | null>(null);
  const [pressedButton, setPressedButton] = useState<
    "increment" | "decrement" | null
  >(null);

  const executeAction = (
    buttonType: "increment" | "decrement",
    value: number
  ) => {
    if (buttonType === "increment") {
      onIncrement(value);
    } else if (buttonType === "decrement") {
      onDecrement(value);
    }
  };

  const startRepeating = (buttonType: "increment" | "decrement") => {
    // Ejecuta inmediatamente el primer incremento/decremento de 10
    executeAction(buttonType, 10);

    // Luego continúa repitiendo cada 150ms
    const timer = setInterval(() => {
      executeAction(buttonType, 10);
    }, 500);

    setRepeatTimer(timer);
  };

  const handlePressStart = (buttonType: "increment" | "decrement") => {
    setPressedButton(buttonType);

    // Inicia un temporizador para detectar long press
    const timer = setTimeout(() => {
      setIsLongPress(true);
      startRepeating(buttonType);
    }, 1000); // 1000 ms = 1 segundo

    setPressTimer(timer);
  };

  const handlePressEnd = () => {
    // Limpiamos todos los temporizadores
    if (pressTimer) {
      clearTimeout(pressTimer);
      setPressTimer(null);
    }

    if (repeatTimer) {
      clearInterval(repeatTimer);
      setRepeatTimer(null);
    }

    // Si no fue un long press, ejecuta incremento/decremento de 1
    if (!isLongPress && pressedButton) {
      executeAction(pressedButton, 1);
    }

    // Reseteamos los estados
    setIsLongPress(false);
    setPressedButton(null);
  };

  const handleDecrementMouseDown = (event: React.MouseEvent) => {
    handlePressStart("decrement");
  };

  const handleIncrementMouseDown = (event: React.MouseEvent) => {
    handlePressStart("increment");
  };

  const handleMouseUp = (event: React.MouseEvent) => {
    handlePressEnd();
  };

  const handleDecrementTouchStart = (event: React.TouchEvent) => {
    handlePressStart("decrement");
  };

  const handleIncrementTouchStart = (event: React.TouchEvent) => {
    handlePressStart("increment");
  };

  const handleTouchEnd = (event: React.TouchEvent) => {
    handlePressEnd();
  };

  return (
    <>
      <div
        className="absolute left-0 top-0 w-1/2 h-full flex items-center justify-center cursor-pointer transition-all duration-150 hover:bg-opacity-10 active:bg-opacity-20"
        onMouseDown={handleDecrementMouseDown}
        onMouseUp={handleMouseUp}
        onTouchStart={handleDecrementTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="absolute inset-0 bg-white opacity-0 hover:opacity-10 transition-opacity z-30" />
          <div
            className={`text-white text-6xl font-bold opacity-30 hover:opacity-60 transition-opacity mr-4 z-20 ${
              ["small", "large2small", "medium2small"].includes(
                localConfig.size
              )
                ? "hidden lg:inline md:inline"
                : ""
            }`}
          >
            −
          </div>
        </div>
      </div>

      <div
        className="absolute right-0 top-0 w-1/2 h-full flex items-center justify-center cursor-pointer transition-all duration-150 hover:bg-opacity-10 active:bg-opacity-20"
        onMouseDown={handleIncrementMouseDown}
        onMouseUp={handleMouseUp}
        onTouchStart={handleIncrementTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="absolute inset-0 bg-white opacity-0 hover:opacity-10 transition-opacity z-30" />
          <div
            className={`text-white text-6xl font-bold opacity-30 hover:opacity-60 transition-opacity ml-4 z-20 ${
              ["small", "large2small", "medium2small"].includes(
                localConfig.size
              )
                ? "hidden lg:inline md:inline"
                : ""
            }`}
          >
            +
          </div>
        </div>
      </div>
    </>
  );
};

export default IncrementDecrement;
