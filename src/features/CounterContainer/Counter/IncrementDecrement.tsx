import { useEffect, useRef, useState } from "react";

type Props = {
  onDecrement: (value: number) => void;
  onIncrement: (value: number) => void;
  isSmall: boolean;
};

const HOLD_DELAY_MS = 500;
const REPEAT_EVERY_MS = 500;
const REPEAT_STEP = 10;

const IncrementDecrement = ({ onDecrement, onIncrement, isSmall }: Props) => {
  const [delta, setDelta] = useState(0);
  const [showDelta, setShowDelta] = useState(false);
  const [isLongPress, setIsLongPress] = useState(false);
  const [pressedButton, setPressedButton] = useState<
    "increment" | "decrement" | null
  >(null);
  const [isScrolling, setIsScrolling] = useState(false);

  const touchStartPos = useRef<{ x: number; y: number } | null>(null);
  const isProcessing = useRef(false);
  const eventId = useRef(0);
  const isTouchDevice = useRef(
    "ontouchstart" in window || navigator.maxTouchPoints > 0
  );

  const pressTimerRef = useRef<number | null>(null);
  const repeatTimerRef = useRef<number | null>(null);
  const deltaTimeoutRef = useRef<number | null>(null);

  const clearPressTimer = () => {
    if (pressTimerRef.current != null) {
      window.clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }
  };

  const stopRepeating = () => {
    if (repeatTimerRef.current != null) {
      window.clearInterval(repeatTimerRef.current);
      repeatTimerRef.current = null;
    }
  };

  const hideDelta = () => {
    setShowDelta(false);
    window.setTimeout(() => setDelta(0), 320);
  };

  const executeAction = (
    buttonType: "increment" | "decrement",
    value: number
  ) => {
    if (buttonType === "increment") {
      console.log("increment", value);
      onIncrement(value);
      setDelta((d) => d + value);
    } else {
      console.log("decrement", value);
      onDecrement(value);
      setDelta((d) => d - value);
    }
    setShowDelta(true);
    if (deltaTimeoutRef.current) window.clearTimeout(deltaTimeoutRef.current);
    deltaTimeoutRef.current = window.setTimeout(() => hideDelta(), 2000);
  };

  const startRepeating = (buttonType: "increment" | "decrement") => {
    executeAction(buttonType, REPEAT_STEP);
    repeatTimerRef.current = window.setInterval(() => {
      executeAction(buttonType, REPEAT_STEP);
    }, REPEAT_EVERY_MS);
  };

  const handlePressStart = (
    buttonType: "increment" | "decrement",
    currentEventId: number
  ) => {
    if (isProcessing.current) return;
    isProcessing.current = true;
    setPressedButton(buttonType);

    clearPressTimer();
    pressTimerRef.current = window.setTimeout(() => {
      if (eventId.current === currentEventId && !isScrolling) {
        setIsLongPress(true);
        startRepeating(buttonType);
      }
    }, HOLD_DELAY_MS);
  };

  const handlePressEnd = (currentEventId: number) => {
    if (eventId.current !== currentEventId) return;

    clearPressTimer();
    stopRepeating();

    if (!isLongPress && pressedButton && !isScrolling) {
      executeAction(pressedButton, 1);
    }

    setIsLongPress(false);
    setPressedButton(null);
    isProcessing.current = false;
  };

  const onWindowMouseUp = () => {
    handlePressEnd(eventId.current);
    window.removeEventListener("mouseup", onWindowMouseUp);
  };

  const handleDecrementMouseDown = (event: React.MouseEvent) => {
    event.preventDefault();
    const currentEventId = ++eventId.current;
    window.addEventListener("mouseup", onWindowMouseUp);
    handlePressStart("decrement", currentEventId);
  };

  const handleIncrementMouseDown = (event: React.MouseEvent) => {
    event.preventDefault();
    const currentEventId = ++eventId.current;
    window.addEventListener("mouseup", onWindowMouseUp);
    handlePressStart("increment", currentEventId);
  };

  const handleMouseUp = () => {
    handlePressEnd(eventId.current);
    window.removeEventListener("mouseup", onWindowMouseUp);
  };

  const handleMouseLeave = () => {
    handlePressEnd(eventId.current);
    window.removeEventListener("mouseup", onWindowMouseUp);
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
        clearPressTimer();
        stopRepeating();
        setIsLongPress(false);
        setPressedButton(null);
        isProcessing.current = false;
      }
    }
  };

  const handleTouchEnd = () => {
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

  useEffect(() => {
    return () => {
      clearPressTimer();
      stopRepeating();
      if (deltaTimeoutRef.current) window.clearTimeout(deltaTimeoutRef.current);
      window.removeEventListener("mouseup", onWindowMouseUp);
    };
  }, []);

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
              onMouseLeave: handleMouseLeave,
            })}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="absolute inset-0 bg-white opacity-0 hover:opacity-10 transition-opacity z-30" />
          <div
            className={`text-white font-bold opacity-30 hover:opacity-60 transition-opacity mt-8 mr-12 z-20 ${
              isSmall ? "text-4xl md:text-6xl" : "text-6xl"
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
              onMouseLeave: handleMouseLeave,
            })}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="absolute inset-0 bg-white opacity-0 hover:opacity-10 transition-opacity z-30" />
          <div
            className={`text-white font-bold opacity-30 hover:opacity-60 transition-opacity mt-8 ml-12 z-20 ${
              isSmall ? "text-4xl md:text-6xl" : "text-6xl"
            }`}
          >
            +
          </div>
        </div>
      </div>

      <div className="absolute left-1/2 transform -translate-x-1/2 bottom-0 h-full flex items-center justify-center cursor-pointer">
        <div
          className={`
            relative w-full h-full flex items-center justify-center
            transition-opacity duration-300 ease-in-out
            ${showDelta ? "opacity-100" : "opacity-0"}
          `}
        >
          <div
            className={`font-bold mt-38 text-white opacity-70 tracking-wide ${
              isSmall ? "text-3xl md:text-4xl" : "text-4xl"
            }`}
          >
            {delta > 0 ? "+" : ""}
            {delta}
          </div>
        </div>
      </div>
    </>
  );
};

export { IncrementDecrement };
