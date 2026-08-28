"use client";
import { useRef, useCallback, useMemo } from "react";

type TargetEl = HTMLInputElement | HTMLTextAreaElement;

/**
 * Selecciona todo al entrar por primera vez en foco (tab, click o touch).
 * Si el campo ya está enfocado, NO intercepta los clics/touches,
 * permitiendo colocar el caret o seleccionar una parte del texto.
 */
export function useSelectAllOnFocus<T extends TargetEl>() {
  const ref = useRef<T | null>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const touchMoved = useRef(false);
  const suppressFocusUntil = useRef(0);

  const isFocused = () => ref.current === document.activeElement;

  const selectAll = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    try {
      el.setSelectionRange(0, el.value.length);
    } catch {
      el.select?.();
    }
  }, []);

  const focusAndSelect = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    if (!isFocused()) el.focus();
    // Seleccionamos en el siguiente tick para no pelear con el caret nativo
    setTimeout(selectAll, 0);
  }, [selectAll]);

  // 1) Foco por teclado (TAB) o focus programático
  const onFocus = useCallback(() => {
    if (touchMoved.current || Date.now() < suppressFocusUntil.current) {
      ref.current?.blur();
      return;
    }
    setTimeout(selectAll, 0);
  }, [selectAll]);

  // 2) Ratón: solo interceptar si AÚN no está enfocado
  const onMouseDown = useCallback(
    (e: React.MouseEvent<T>) => {
      if (!isFocused()) {
        e.preventDefault(); // evita que el click coloque el caret
        focusAndSelect();
      }
      // si ya está enfocado, dejamos que el usuario haga su selección normal
    },
    [focusAndSelect]
  );

  // En táctil esperamos al final del gesto: así un scroll que empieza sobre
  // el campo no abre el teclado ni selecciona su contenido accidentalmente.
  const onTouchStart = useCallback((event: React.TouchEvent<T>) => {
    const touch = event.touches[0];
    touchStart.current = touch ? { x: touch.clientX, y: touch.clientY } : null;
    touchMoved.current = false;
  }, []);

  const onTouchMove = useCallback((event: React.TouchEvent<T>) => {
    const start = touchStart.current;
    const touch = event.touches[0];
    if (
      start &&
      touch &&
      (Math.abs(touch.clientX - start.x) > 8 ||
        Math.abs(touch.clientY - start.y) > 8)
    ) {
      touchMoved.current = true;
    }
  }, []);

  const onTouchEnd = useCallback((event: React.TouchEvent<T>) => {
    if (touchMoved.current) {
      suppressFocusUntil.current = Date.now() + 400;
      event.preventDefault();
      ref.current?.blur();
    }
    touchStart.current = null;
    touchMoved.current = false;
  }, []);

  // 4) Blur: sin estado adicional — el propio blur garantiza que el próximo foco será “primero”
  const onBlur = useCallback(() => {
    /* no-op, pero puedes limpiar estado aquí si lo necesitas */
  }, []);

  const handlers = useMemo(
    () => ({
      onFocus,
      onMouseDown,
      onTouchStart,
      onTouchMove,
      onTouchEnd,
      onBlur,
    }),
    [onFocus, onMouseDown, onTouchStart, onTouchMove, onTouchEnd, onBlur]
  );

  return { ref, handlers, focusAndSelect, selectAll };
}
