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
    // Solo seleccionar todo si venimos de "no enfocado"
    // (Si ya estaba enfocado, el navegador no dispara focus otra vez)
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

  // 3) Táctil: solo actuar si AÚN no está enfocado (sin preventDefault para no bloquear teclado)
  const onTouchStart = useCallback(() => {
    if (!isFocused()) {
      focusAndSelect();
    }
  }, [focusAndSelect]);

  // 4) Blur: sin estado adicional — el propio blur garantiza que el próximo foco será “primero”
  const onBlur = useCallback(() => {
    /* no-op, pero puedes limpiar estado aquí si lo necesitas */
  }, []);

  const handlers = useMemo(
    () => ({ onFocus, onMouseDown, onTouchStart, onBlur }),
    [onFocus, onMouseDown, onTouchStart, onBlur]
  );

  return { ref, handlers, focusAndSelect, selectAll };
}
