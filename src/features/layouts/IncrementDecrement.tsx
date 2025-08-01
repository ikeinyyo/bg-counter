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
  const [isLongPress, setIsLongPress] = useState(false);
  const [pressTimer, setPressTimer] = useState<NodeJS.Timeout | null>(null);
  const [repeatTimer, setRepeatTimer] = useState<NodeJS.Timeout | null>(null);
  const [pressedButton, setPressedButton] = useState<
    "increment" | "decrement" | null
  >(null);
  const [actionExecuted, setActionExecuted] = useState(false); // Para evitar la duplicación de acción
  const [isScrolling, setIsScrolling] = useState(false); // Para verificar si se está desplazando
  const touchStartPos = useRef<{ x: number; y: number } | null>(null); // Para almacenar la posición inicial del toque

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
    const timer = setInterval(() => {
      executeAction(buttonType, 10); // Repite cada 500 ms
    }, 500);
    setRepeatTimer(timer);
  };

  const stopRepeating = () => {
    if (repeatTimer) {
      clearInterval(repeatTimer); // Detiene el intervalo
      setRepeatTimer(null);
    }
  };

  const handlePressStart = (buttonType: "increment" | "decrement") => {
    if (actionExecuted) return; // Evita que se ejecute si ya se ejecutó una acción

    setPressedButton(buttonType);

    // Temporizador para detectar long press
    const timer = setTimeout(() => {
      setIsLongPress(true);
      if (isScrolling) return; // Si se detecta scroll, no se ejecuta la acción
      startRepeating(buttonType); // Comienza a repetir la acción
    }, 500); // 500 ms = 0.5 segundos

    setPressTimer(timer);
  };

  const handlePressEnd = () => {
    if (actionExecuted) return; // Evita la duplicación de acción

    if (pressTimer) {
      clearTimeout(pressTimer); // Limpia el temporizador de "long press"
      setPressTimer(null);
    }

    stopRepeating(); // Detiene el intervalo si existe

    if (!isLongPress && pressedButton) {
      executeAction(pressedButton, 1); // Ejecuta una vez si no fue long press
      setActionExecuted(true); // Marca la acción como ejecutada
    }

    setIsLongPress(false);
    setPressedButton(null);
  };

  const handleDecrementMouseDown = (event: React.MouseEvent) => {
    event.preventDefault(); // Previene la duplicación
    setActionExecuted(false);
    handlePressStart("decrement");
  };

  const handleIncrementMouseDown = (event: React.MouseEvent) => {
    event.preventDefault(); // Previene la duplicación
    setActionExecuted(false);
    handlePressStart("increment");
  };

  const handleMouseUp = (event: React.MouseEvent) => {
    handlePressEnd();
  };

  const handleDecrementTouchStart = (event: React.TouchEvent) => {
    event.preventDefault(); // Previene la duplicación
    setActionExecuted(false);

    // Guardar la posición inicial del toque
    touchStartPos.current = {
      x: event.touches[0].clientX,
      y: event.touches[0].clientY,
    };

    handlePressStart("decrement");
  };

  const handleIncrementTouchStart = (event: React.TouchEvent) => {
    event.preventDefault(); // Previene la duplicación
    setActionExecuted(false);

    // Guardar la posición inicial del toque
    touchStartPos.current = {
      x: event.touches[0].clientX,
      y: event.touches[0].clientY,
    };

    handlePressStart("increment");
  };

  const handleTouchMove = (event: React.TouchEvent) => {
    if (touchStartPos.current) {
      const dx = Math.abs(event.touches[0].clientX - touchStartPos.current.x);
      const dy = Math.abs(event.touches[0].clientY - touchStartPos.current.y);

      // Si el desplazamiento es mayor a un umbral (en píxeles), se considera como scroll
      if (dx > 10 || dy > 10) {
        setIsScrolling(true);

        // Cancelar inmediatamente el temporizador de long press
        if (pressTimer) {
          clearTimeout(pressTimer);
          setPressTimer(null);
        }

        // Detener cualquier repetición en curso
        stopRepeating();

        // Resetear estados
        setIsLongPress(false);
        setPressedButton(null);
      }
    }
  };

  const handleTouchEnd = (event: React.TouchEvent) => {
    if (isScrolling) {
      // Resetear el estado de scroll y limpiar todo
      setIsScrolling(false);
      stopRepeating();
      setIsLongPress(false);
      setPressedButton(null);
      setActionExecuted(false);
      touchStartPos.current = null;
      return;
    }

    handlePressEnd();
    touchStartPos.current = null; // Limpiar la posición de inicio
  };

  return (
    <>
      <div
        className="absolute left-0 top-0 w-1/2 h-full flex items-center justify-center cursor-pointer transition-all duration-150 hover:bg-opacity-10 active:bg-opacity-20"
        onMouseDown={handleDecrementMouseDown}
        onMouseUp={handleMouseUp}
        onTouchStart={handleDecrementTouchStart}
        onTouchMove={handleTouchMove} // Detectar el movimiento
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
        onTouchMove={handleTouchMove} // Detectar el movimiento
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
