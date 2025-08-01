"use client";

import { useState, useEffect } from "react";
import { Counter } from "./Counter";
import { CounterConfig } from "./CounterConfig";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { FaFaceRollingEyes } from "react-icons/fa6";

/* -------------------- utilidades -------------------- */

/** nº de columnas que ocupa cada tamaño (en un grid de 12 col). */
const spanBySize: Record<CounterConfig["size"], number> = {
  small: 3,
  medium: 4,
  large: 6,
};

/** Calcula cuántas columnas han quedado libres en la fila actual
 *  tras recorrer los elementos hasta `idx - 1`.
 */
const spaceLeftBefore = (items: CounterConfig[], idx: number) => {
  let cols = 0;
  for (let i = 0; i < idx; i++) {
    cols = (cols + spanBySize[items[i].size]) % 12;
  }
  return 12 - cols; // 12 → fila vacía, 1-11 → hueco parcial
};

/** Devuelve el índice donde un span `dragSpan` encaja empezando en `idx`. */
const findValidIndex = (
  items: CounterConfig[],
  idx: number,
  dragSpan: number
) => {
  let pos = idx;
  while (true) {
    const space = spaceLeftBefore(items, pos);
    if (space === 12 || space >= dragSpan) return pos;
    /* si no cabe y no estamos al final, salta al comienzo de la sig. fila */
    pos++;
    if (pos > items.length) return items.length;
  }
};

/* --------------------- componente -------------------- */

type Props = {
  countersDefault: CounterConfig[];
  onDelete: (id: string) => void;
  onUpdate: (updated: CounterConfig) => void;
  onReorder?: (ordered: CounterConfig[]) => void;
};

export const CounterContainer = ({
  countersDefault,
  onDelete,
  onUpdate,
  onReorder,
}: Props) => {
  const [counters, setCounters] = useState<CounterConfig[]>(countersDefault);

  /* sincroniza con props externas */
  useEffect(() => setCounters(countersDefault), [countersDefault]);

  const sizeToClass = {
    small: "col-span-1 md:col-span-1 lg:col-span-3",
    medium: "col-span-2 md:col-span-2 lg:col-span-4",
    large: "col-span-2 md:col-span-4 lg:col-span-6",
  } as const;

  /* ---------- drag & drop ---------- */
  const handleDragEnd = ({ source, destination }: DropResult) => {
    if (!destination) return;

    /* 1- obtén el elemento y quítalo de la lista */
    const list = [...counters];
    const [dragged] = list.splice(source.index, 1);

    /* 2- calcula índice válido donde pueda entrar */
    const targetIdx = findValidIndex(
      list,
      destination.index,
      spanBySize[dragged.size]
    );

    /* 3- inserta y actualiza estado */
    list.splice(targetIdx, 0, dragged);
    setCounters(list);
    onReorder?.(list);
  };

  return (
    <div className="p-4 min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto">
        {counters.length === 0 ? (
          <div className="text-xl text-dark mt-32 text-center">
            <FaFaceRollingEyes className="mx-auto text-6xl text-dark/80" />
            <br />
            No hay contadores. Añade uno para comenzar o selecciona una
            plantilla.
          </div>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="grid" direction="vertical">
              {(dropProvided) => (
                <div
                  ref={dropProvided.innerRef}
                  {...dropProvided.droppableProps}
                  className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-12 grid-flow-dense gap-6"
                >
                  {counters.map((counter, idx) => {
                    const span = spanBySize[counter.size];
                    return (
                      <Draggable
                        key={counter.id}
                        draggableId={counter.id}
                        index={idx}
                      >
                        {(dragProvided, snapshot) => (
                          <div
                            ref={dragProvided.innerRef}
                            {...dragProvided.draggableProps}
                            {...dragProvided.dragHandleProps}
                            className={sizeToClass[counter.size]}
                            style={{
                              gridColumnEnd: `span ${span}`,
                              transition: snapshot.isDragging
                                ? "none"
                                : undefined,
                              ...dragProvided.draggableProps.style,
                            }}
                          >
                            <Counter
                              counter={counter}
                              onDelete={onDelete}
                              onUpdate={onUpdate}
                            />
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                  {dropProvided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </div>
    </div>
  );
};
