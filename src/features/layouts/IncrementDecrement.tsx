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
  // Estados para mouse
  const [mouseIsLongPress, setMouseIsLongPress] = useState(false);
  const [mousePressTimer, setMousePressTimer] = useState<NodeJS.Timeout | null>(
    null
  );
  const [mouseRepeatTimer, setMouseRepeatTimer] =
    useState<NodeJS.Timeout | null>(null);
  const [mousePressedButton, setMousePressedButton] = useState<
    "increment" | "decrement" | null
  >(null);

  // Estados para touch
  const [touchIsLongPress, setTouchIsLongPress] = useState(false);
  const [touchPressTimer, setTouchPressTimer] = useState<NodeJS.Timeout | null>(
    null
  );
  const [touchRepeatTimer, setTouchRepeatTimer] =
    useState<NodeJS.Timeout | null>(null);
  const [touchPressedButton, setTouchPressedButton] = useState<
    "increment" | "decrement" | null
  >(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [lastActionTime, setLastActionTime] = useState(0);
  const touchStartPos = useRef<{ x: number; y: number } | null>(null);
  const executionPending = useRef(false);

  const executeAction = (
    buttonType: "increment" | "decrement",
    value: number
  ) => {
    const now = Date.now();
    console.log(
      "executeAction called:",
      buttonType,
      value,
      now,
      "lastActionTime:",
      lastActionTime
    );

    // Prevenir ejecuciones muy rápidas (menos de 250ms para touch)
    if (now - lastActionTime < 250) {
      console.log(
        "Action blocked - too fast, time diff:",
        now - lastActionTime
      );
      return;
    }

    setLastActionTime(now);
    console.log("Action executed:", buttonType, value);

    if (buttonType === "increment") {
      onIncrement(value);
    } else if (buttonType === "decrement") {
      onDecrement(value);
    }
  };

  // Funciones para mouse
  const startMouseRepeating = (buttonType: "increment" | "decrement") => {
    const timer = setInterval(() => {
      executeAction(buttonType, 10);
    }, 500);
    setMouseRepeatTimer(timer);
  };

  const stopMouseRepeating = () => {
    if (mouseRepeatTimer) {
      clearInterval(mouseRepeatTimer);
      setMouseRepeatTimer(null);
    }
  };

  // Funciones para touch
  const startTouchRepeating = (buttonType: "increment" | "decrement") => {
    const timer = setInterval(() => {
      executeAction(buttonType, 10);
    }, 500);
    setTouchRepeatTimer(timer);
  };

  const stopTouchRepeating = () => {
    if (touchRepeatTimer) {
      clearInterval(touchRepeatTimer);
      setTouchRepeatTimer(null);
    }
  };

  // Manejadores para mouse
  const handleMousePressStart = (buttonType: "increment" | "decrement") => {
    setMousePressedButton(buttonType);

    const timer = setTimeout(() => {
      setMouseIsLongPress(true);
      startMouseRepeating(buttonType);
    }, 500);

    setMousePressTimer(timer);
  };

  const handleMousePressEnd = () => {
    if (mousePressTimer) {
      clearTimeout(mousePressTimer);
      setMousePressTimer(null);
    }

    stopMouseRepeating();

    if (!mouseIsLongPress && mousePressedButton) {
      executeAction(mousePressedButton, 1);
    }

    setMouseIsLongPress(false);
    setMousePressedButton(null);
  };

  // Manejadores para touch
  const handleTouchPressStart = (buttonType: "increment" | "decrement") => {
    console.log("handleTouchPressStart:", buttonType);
    if (isScrolling) return;

    setTouchPressedButton(buttonType);

    const timer = setTimeout(() => {
      if (!isScrolling) {
        setTouchIsLongPress(true);
        startTouchRepeating(buttonType);
      }
    }, 500);

    setTouchPressTimer(timer);
  };

  const handleTouchPressEnd = () => {
    console.log(
      "handleTouchPressEnd called, touchIsLongPress:",
      touchIsLongPress,
      "touchPressedButton:",
      touchPressedButton,
      "isScrolling:",
      isScrolling,
      "executionPending:",
      executionPending.current
    );

    if (touchPressTimer) {
      clearTimeout(touchPressTimer);
      setTouchPressTimer(null);
    }

    stopTouchRepeating();

    // Prevenir múltiples ejecuciones
    if (
      !touchIsLongPress &&
      touchPressedButton &&
      !isScrolling &&
      !executionPending.current
    ) {
      console.log("About to execute action - setting executionPending to true");
      executionPending.current = true;

      // Ejecutar inmediatamente sin setTimeout
      executeAction(touchPressedButton, 1);

      // Resetear la bandera después de un delay más largo
      setTimeout(() => {
        executionPending.current = false;
        console.log("executionPending reset to false");
      }, 300); // Aumentado a 300ms para prevenir dobles llamadas
    } else {
      console.log("Action skipped - conditions not met or execution pending");
    }

    setTouchIsLongPress(false);
    setTouchPressedButton(null);
  };

  const handleDecrementMouseDown = (event: React.MouseEvent) => {
    // Si se detectó touch recientemente, ignorar eventos de mouse
    if (isTouchDevice) return;

    event.preventDefault();
    handleMousePressStart("decrement");
  };

  const handleIncrementMouseDown = (event: React.MouseEvent) => {
    // Si se detectó touch recientemente, ignorar eventos de mouse
    if (isTouchDevice) return;

    event.preventDefault();
    handleMousePressStart("increment");
  };

  const handleMouseUp = (event: React.MouseEvent) => {
    // Si se detectó touch recientemente, ignorar eventos de mouse
    if (isTouchDevice) return;

    handleMousePressEnd();
  };

  const handleDecrementTouchStart = (event: React.TouchEvent) => {
    console.log("handleDecrementTouchStart called");
    event.preventDefault();

    // Marcar que es un dispositivo táctil
    setIsTouchDevice(true);
    setIsScrolling(false);

    touchStartPos.current = {
      x: event.touches[0].clientX,
      y: event.touches[0].clientY,
    };

    handleTouchPressStart("decrement");
  };

  const handleIncrementTouchStart = (event: React.TouchEvent) => {
    console.log("handleIncrementTouchStart called");
    event.preventDefault();

    // Marcar que es un dispositivo táctil
    setIsTouchDevice(true);
    setIsScrolling(false);

    touchStartPos.current = {
      x: event.touches[0].clientX,
      y: event.touches[0].clientY,
    };

    handleTouchPressStart("increment");
  };

  const handleTouchMove = (event: React.TouchEvent) => {
    if (touchStartPos.current) {
      const dx = Math.abs(event.touches[0].clientX - touchStartPos.current.x);
      const dy = Math.abs(event.touches[0].clientY - touchStartPos.current.y);

      if (dx > 10 || dy > 10) {
        setIsScrolling(true);

        if (touchPressTimer) {
          clearTimeout(touchPressTimer);
          setTouchPressTimer(null);
        }

        stopTouchRepeating();
        setTouchIsLongPress(false);
        setTouchPressedButton(null);
      }
    }
  };

  const handleTouchEnd = (event: React.TouchEvent) => {
    console.log(
      "handleTouchEnd called, isScrolling:",
      isScrolling,
      "executionPending:",
      executionPending.current
    );

    if (isScrolling) {
      setIsScrolling(false);
      stopTouchRepeating();
      setTouchIsLongPress(false);
      setTouchPressedButton(null);
      touchStartPos.current = null;
      return;
    }

    // Solo ejecutar si no hay una ejecución pendiente
    if (!executionPending.current) {
      handleTouchPressEnd();
    } else {
      console.log("handleTouchEnd skipped - execution already pending");
    }

    touchStartPos.current = null;

    // Resetear la bandera de touch después de un pequeño delay
    setTimeout(() => {
      setIsTouchDevice(false);
    }, 100);
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
