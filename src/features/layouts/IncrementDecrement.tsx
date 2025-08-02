import { useState, useRef } from "react";
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
  // Estados para manejo de presión
  const [isLongPress, setIsLongPress] = useState(false);
  const [pressTimer, setPressTimer] = useState<NodeJS.Timeout | null>(null);
  const [repeatTimer, setRepeatTimer] = useState<NodeJS.Timeout | null>(null);
  const [pressedButton, setPressedButton] = useState<
    "increment" | "decrement" | null
  >(null);
  const [isScrolling, setIsScrolling] = useState(false);

  // Referencias para control de eventos
  const touchStartPos = useRef<{ x: number; y: number } | null>(null);
  const isProcessing = useRef(false);
  const eventId = useRef(0);

  // Detectar si es dispositivo táctil
  const isTouchDevice = useRef(
    "ontouchstart" in window || navigator.maxTouchPoints > 0
  );

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

  // Función para repetición en long press
  const startRepeating = (buttonType: "increment" | "decrement") => {
    const timer = setInterval(() => {
      executeAction(buttonType, 10);
    }, 500);
    setRepeatTimer(timer);
  };

  const stopRepeating = () => {
    if (repeatTimer) {
      clearInterval(repeatTimer);
      setRepeatTimer(null);
    }
  };

  // Manejador de inicio de presión
  const handlePressStart = (
    buttonType: "increment" | "decrement",
    currentEventId: number
  ) => {
    if (isProcessing.current) return;
    isProcessing.current = true;

    setPressedButton(buttonType);

    const timer = setTimeout(() => {
      if (eventId.current === currentEventId && !isScrolling) {
        setIsLongPress(true);
        startRepeating(buttonType);
      }
    }, 500);
    setPressTimer(timer);
  };

  // Manejador de fin de presión
  const handlePressEnd = (currentEventId: number) => {
    // Solo procesar si es el mismo evento que inició
    if (eventId.current !== currentEventId) return;

    if (pressTimer) {
      clearTimeout(pressTimer);
      setPressTimer(null);
    }

    stopRepeating();

    // Ejecutar solo si no fue long press y no hay scroll
    if (!isLongPress && pressedButton && !isScrolling) {
      executeAction(pressedButton, 1);
    }

    // Resetear estados
    setIsLongPress(false);
    setPressedButton(null);
    isProcessing.current = false;
  };

  const handleDecrementMouseDown = (event: React.MouseEvent) => {
    event.preventDefault();
    const currentEventId = ++eventId.current;
    handlePressStart("decrement", currentEventId);
  };

  const handleIncrementMouseDown = (event: React.MouseEvent) => {
    event.preventDefault();
    const currentEventId = ++eventId.current;
    handlePressStart("increment", currentEventId);
  };

  const handleMouseUp = (event: React.MouseEvent) => {
    handlePressEnd(eventId.current);
  };

  const handleDecrementTouchStart = (event: React.TouchEvent) => {
    setIsScrolling(false);

    touchStartPos.current = {
      x: event.touches[0].clientX,
      y: event.touches[0].clientY,
    };

    const currentEventId = ++eventId.current;
    handlePressStart("decrement", currentEventId);
  };

  const handleIncrementTouchStart = (event: React.TouchEvent) => {
    setIsScrolling(false);

    touchStartPos.current = {
      x: event.touches[0].clientX,
      y: event.touches[0].clientY,
    };

    const currentEventId = ++eventId.current;
    handlePressStart("increment", currentEventId);
  };

  const handleTouchMove = (event: React.TouchEvent) => {
    if (touchStartPos.current) {
      const dx = Math.abs(event.touches[0].clientX - touchStartPos.current.x);
      const dy = Math.abs(event.touches[0].clientY - touchStartPos.current.y);

      if (dx > 10 || dy > 10) {
        setIsScrolling(true);

        if (pressTimer) {
          clearTimeout(pressTimer);
          setPressTimer(null);
        }

        stopRepeating();
        setIsLongPress(false);
        setPressedButton(null);
        isProcessing.current = false;
      }
    }
  };

  const handleTouchEnd = (event: React.TouchEvent) => {
    if (isScrolling) {
      setIsScrolling(false);
      stopRepeating();
      setIsLongPress(false);
      setPressedButton(null);
      isProcessing.current = false;
      touchStartPos.current = null;
      return;
    }

    handlePressEnd(eventId.current);
    touchStartPos.current = null;
  };

  return (
    <>
      <div
        className="absolute left-0 top-0 w-1/2 h-full flex items-center justify-center cursor-pointer transition-all duration-150 hover:bg-opacity-10 active:bg-opacity-20"
        {...(isTouchDevice.current
          ? {
              onTouchStart: handleDecrementTouchStart,
              onTouchMove: handleTouchMove,
              onTouchEnd: handleTouchEnd,
            }
          : {
              onMouseDown: handleDecrementMouseDown,
              onMouseUp: handleMouseUp,
            })}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="absolute inset-0 bg-white opacity-0 hover:opacity-10 transition-opacity z-30" />
          <div
            className={`text-white font-bold opacity-30 hover:opacity-60 transition-opacity mr-12 z-20 ${
              ["small", "large2small", "medium2small", "small2medium"].includes(
                localConfig.size
              )
                ? "text-4xl lg:text-6xl md:text-6xl"
                : "text-6xl"
            }`}
          >
            −
          </div>
        </div>
      </div>

      <div
        className="absolute right-0 top-0 w-1/2 h-full flex items-center justify-center cursor-pointer transition-all duration-150 hover:bg-opacity-10 active:bg-opacity-20"
        {...(isTouchDevice.current
          ? {
              onTouchStart: handleIncrementTouchStart,
              onTouchMove: handleTouchMove,
              onTouchEnd: handleTouchEnd,
            }
          : {
              onMouseDown: handleIncrementMouseDown,
              onMouseUp: handleMouseUp,
            })}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="absolute inset-0 bg-white opacity-0 hover:opacity-10 transition-opacity z-30" />
          <div
            className={`text-white font-bold opacity-30 hover:opacity-60 transition-opacity ml-12 z-20 ${
              ["small", "large2small", "medium2small", "small2medium"].includes(
                localConfig.size
              )
                ? "text-4xl lg:text-6xl md:text-6xl"
                : "text-6xl"
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
