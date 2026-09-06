"use client";

import { useRef, useState, type PointerEvent } from "react";
import { BsArrowsMove, BsCheck2, BsPlusCircle } from "react-icons/bs";
import { getIconByKey } from "./config/icons";
import { getDefaultBySize, type CounterConfig, type Size } from "./domain";

type Props = {
	counters: CounterConfig[];
	onUpdate: (updated: CounterConfig) => void;
	onAdd: () => void;
	onReorder: (sourceIndex: number, destinationIndex: number) => void;
	onClose: () => void;
	t: (key: string) => string;
};

type DragState = { id: string; x: number; y: number; startX: number; startY: number };

const CounterReorder = ({ counters, onUpdate, onAdd, onReorder, onClose, t }: Props) => {
	const [activeId, setActiveId] = useState<string | null>(null);
	const [overId, setOverId] = useState<string | null>(null);
	const [offset, setOffset] = useState({ x: 0, y: 0 });
	const drag = useRef<DragState | null>(null);
	const tileRefs = useRef<Record<string, HTMLButtonElement | null>>({});

	const span = (value: number | undefined, fallback: number) => 12 / ([1, 2, 3, 4, 6].includes(value ?? 0) ? value! : fallback);
	const sizeClass = (counter: CounterConfig) => {
		const classes = { 2: "col-span-2", 3: "col-span-3", 4: "col-span-4", 6: "col-span-6", 12: "col-span-12" } as const;
		const md = { 2: "md:col-span-2", 3: "md:col-span-3", 4: "md:col-span-4", 6: "md:col-span-6", 12: "md:col-span-12" } as const;
		const lg = { 2: "lg:col-span-2", 3: "lg:col-span-3", 4: "lg:col-span-4", 6: "lg:col-span-6", 12: "lg:col-span-12" } as const;
		return `${classes[span(counter.xsElementsPerRow, 1) as keyof typeof classes]} ${md[span(counter.mdElementsPerRow, 2) as keyof typeof md]} ${lg[span(counter.lgElementsPerRow, 2) as keyof typeof lg]}`;
	};

	const findDestination = (x: number, y: number, draggedId: string) => {
		const candidates = counters.flatMap((counter, index) => {
			if (counter.id === draggedId || !tileRefs.current[counter.id]) return [];
			return [{ counter, index, rect: tileRefs.current[counter.id]!.getBoundingClientRect() }];
		});
		const target = candidates.sort((a, b) => {
			const row = Math.abs(a.rect.top + a.rect.height / 2 - y) - Math.abs(b.rect.top + b.rect.height / 2 - y);
			return row || Math.abs(a.rect.left + a.rect.width / 2 - x) - Math.abs(b.rect.left + b.rect.width / 2 - x);
		})[0];
		const sourceIndex = counters.findIndex((counter) => counter.id === draggedId);
		if (!target) return { id: null, index: sourceIndex };
		const after = y > target.rect.bottom || x > target.rect.right || (y >= target.rect.top && y <= target.rect.bottom && x > target.rect.left + target.rect.width / 2);
		const insertion = target.index + (after ? 1 : 0);
		return { id: target.counter.id, index: sourceIndex < insertion ? insertion - 1 : insertion };
	};

	const startDrag = (event: PointerEvent<HTMLButtonElement>, id: string) => {
		if (event.button !== 0 || !event.isPrimary) return;
		event.preventDefault();
		event.currentTarget.setPointerCapture(event.pointerId);
		drag.current = { id, x: event.clientX, y: event.clientY, startX: event.clientX, startY: event.clientY };
		setActiveId(id);
		setOverId(id);
	};

	const moveDrag = (event: PointerEvent<HTMLButtonElement>) => {
		if (!drag.current) return;
		drag.current.x = event.clientX;
		drag.current.y = event.clientY;
		setOffset({ x: event.clientX - drag.current.startX, y: event.clientY - drag.current.startY });
		setOverId(findDestination(event.clientX, event.clientY, drag.current.id).id);
	};

	const endDrag = (event: PointerEvent<HTMLButtonElement>) => {
		if (!drag.current) return;
		const current = drag.current;
		const source = counters.findIndex((counter) => counter.id === current.id);
		const destination = findDestination(current.x, current.y, current.id).index;
		if (source >= 0 && destination >= 0 && source !== destination) onReorder(source, destination);
		if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
		drag.current = null;
		setActiveId(null);
		setOverId(null);
		setOffset({ x: 0, y: 0 });
	};

	return (
		<section aria-labelledby="counter-reorder-title" className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3 shadow-sm md:p-4">
			<div className="mb-3 flex flex-wrap items-center justify-between gap-2"><div className="flex items-center gap-2"><BsArrowsMove className="text-primary" /><h2 id="counter-reorder-title" className="font-bold">{t("counterReorderTitle")}</h2></div><div className="flex items-center gap-2"><button type="button" onClick={onAdd} className="flex min-h-10 items-center gap-2 rounded-xl border border-[var(--border)] px-3 text-sm font-bold text-[var(--foreground)] transition hover:bg-[var(--surface-muted)]"><BsPlusCircle />{t("barAddCounter")}</button><button type="button" onClick={onClose} className="flex min-h-10 items-center gap-2 rounded-xl bg-primary px-3 text-sm font-bold text-white"><BsCheck2 />{t("counterReorderDone")}</button></div></div>
			<p className="mb-3 text-sm text-[var(--text-muted)]">{t("counterReorderHint")}</p>
			<div className="grid grid-flow-row grid-cols-12 gap-2 md:gap-3">
				{counters.map((counter) => {
					const Icon = getIconByKey(counter.icon);
					const size = (Object.keys({ XS: 1, S: 2, M: 3, L: 4 }) as Size[]).find((key) => { const config = getDefaultBySize(key); return config.xsElementsPerRow === counter.xsElementsPerRow && config.mdElementsPerRow === counter.mdElementsPerRow && config.lgElementsPerRow === counter.lgElementsPerRow; });
					return <div key={counter.id} className={sizeClass(counter)}><button type="button" ref={(element) => { tileRefs.current[counter.id] = element; }} onPointerDown={(event) => startDrag(event, counter.id)} onPointerMove={moveDrag} onPointerUp={endDrag} onPointerCancel={endDrag} style={activeId === counter.id ? { transform: `translate(${offset.x}px, ${offset.y}px) scale(1.03)` } : undefined} className={`counter-reorder-tile relative flex min-h-20 w-full touch-none select-none flex-col items-center justify-center gap-1 rounded-2xl border p-2 text-center ${activeId === counter.id ? "z-20 cursor-grabbing border-primary shadow-2xl" : overId === counter.id ? "border-primary bg-primary/10" : "border-[var(--border)] bg-[var(--surface-muted)]"}`}><span className="flex h-10 w-10 items-center justify-center rounded-xl text-xl text-white" style={{ backgroundColor: counter.backgroundColor }}><Icon /></span><span className="max-w-full truncate text-sm font-bold">{counter.name}</span><span className="text-xs text-[var(--text-muted)]">{counter.value ?? counter.initialValue}</span></button><div className="mt-1 grid grid-cols-4 gap-1 rounded-lg bg-[var(--surface-muted)] p-1">{(["XS", "S", "M", "L"] as Size[]).map((key) => { const config = getDefaultBySize(key); const selected = key === size; return <button key={key} type="button" onClick={() => onUpdate({ ...counter, ...config })} aria-pressed={selected} className={`min-h-7 rounded-md text-[0.65rem] font-bold ${selected ? "bg-[var(--surface)] text-primary shadow-sm" : "text-[var(--text-muted)]"}`}>{key}</button>; })}</div></div>;
				})}
			</div>
		</section>
	);
};

export { CounterReorder };
