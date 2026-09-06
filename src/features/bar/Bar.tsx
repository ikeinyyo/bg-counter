import { BsArrowsMove } from "react-icons/bs";
import { FaPlusCircle } from "react-icons/fa";
import { FaArrowRotateRight } from "react-icons/fa6";
import React, { useEffect, useMemo, useState } from "react";
import { layoutTemplates, games, getGameByLayoutId } from "../CounterContainer/config/templates";
import { localizeCounters } from "../CounterContainer/config/localize";
import { CounterConfig } from "../CounterContainer/domain";
import { useTranslation } from "@/context/SettingsContext";
import { NavBar } from "@/features/navbar/NavBar";
import { trackEvent } from "@/lib/telemetry";

type Props = {
  counters: CounterConfig[];
  setCounters: React.Dispatch<React.SetStateAction<CounterConfig[]>>;
  onAdd: () => void;
  onReorder?: () => void;
};

type GameSelection = "generic" | "marvel" | "magic" | "aeons" | "empty" | "custom";

const Bar = ({ counters: _counters, setCounters, onAdd, onReorder }: Props) => {
  const { t } = useTranslation();
  const [selectedGame, setSelectedGame] = useState<GameSelection>("generic");
  const [selectedTemplate, setSelectedTemplate] = useState("empty");
  const templateStorageKey = "selected-template";
  const gameStorageKey = "selected-game";
  const templatesById = useMemo(() => new Map(layoutTemplates.map((template) => [template.id, template] as const)), []);

  const normalizeCounters = (counters: CounterConfig[]) => counters.map((counter) => ({
    id: counter.id,
    initialValue: counter.initialValue,
    name: counter.name,
    backgroundColor: counter.backgroundColor,
    icon: counter.icon,
    xs: counter.xsElementsPerRow ?? 0,
    md: counter.mdElementsPerRow ?? 0,
    lg: counter.lgElementsPerRow ?? 0,
  })).sort((a, b) => a.id.localeCompare(b.id));

  const getMatchingTemplateId = (current: CounterConfig[]) => {
    const normalized = normalizeCounters(current);
    for (const template of layoutTemplates) {
      const localized = normalizeCounters(localizeCounters(template.id, template.counters, t));
      const raw = normalizeCounters(template.counters);
      if (localized.length !== normalized.length) continue;
      const matches = localized.every((item, index) => {
        const candidate = normalized[index];
        return item.id === candidate.id && item.initialValue === candidate.initialValue &&
          (item.name === candidate.name || raw[index].name === candidate.name) &&
          item.backgroundColor === candidate.backgroundColor && item.icon === candidate.icon &&
          item.xs === candidate.xs && item.md === candidate.md && item.lg === candidate.lg;
      });
      if (matches) return template.id;
    }
    return null;
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedTemplate = window.localStorage.getItem(templateStorageKey);
    const storedGame = window.localStorage.getItem(gameStorageKey) || "generic";
    const fallbackGame = ["generic", "marvel", "magic", "aeons", "empty"].includes(storedGame)
      ? storedGame as Exclude<GameSelection, "custom">
      : "generic";
    if (storedTemplate && (storedTemplate === "custom" || templatesById.has(storedTemplate))) {
      setSelectedTemplate(storedTemplate);
      if (storedTemplate === "empty") setSelectedGame("empty");
      else if (storedTemplate === "custom") setSelectedGame("custom");
      else setSelectedGame(getGameByLayoutId(storedTemplate) ?? fallbackGame);
      return;
    }
    const match = getMatchingTemplateId(_counters);
    setSelectedTemplate(match ?? "custom");
    setSelectedGame(match ? getGameByLayoutId(match) ?? fallbackGame : "custom");
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const match = getMatchingTemplateId(_counters);
    const nextTemplate = match ?? "custom";
    if (nextTemplate === "custom") setSelectedGame("custom");
    else if (nextTemplate === "empty") setSelectedGame("empty");
    else {
      const game = getGameByLayoutId(nextTemplate);
      if (game) setSelectedGame(game);
    }
    if (nextTemplate !== selectedTemplate) {
      setSelectedTemplate(nextTemplate);
      if (typeof window !== "undefined") window.localStorage.setItem(templateStorageKey, nextTemplate);
    }
  }, [_counters]); // eslint-disable-line react-hooks/exhaustive-deps

  const applyTemplate = (templateId: string) => {
    setSelectedTemplate(templateId);
    if (typeof window !== "undefined") window.localStorage.setItem(templateStorageKey, templateId);
    if (templateId === "custom") return;
    if (templateId === "empty") {
      trackEvent("counter_template_selected", { templateId }, { counterCount: 0 });
      setCounters([]);
      return;
    }
    const template = templatesById.get(templateId);
    if (!template) return;
    const cloned = template.counters.map((counter) => ({ ...counter }));
    trackEvent("counter_template_selected", { templateId, gameId: getGameByLayoutId(templateId) ?? "unknown" }, { counterCount: cloned.length });
    setCounters(localizeCounters(templateId, cloned, t));
  };

  const handleGameChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const nextGame = event.target.value as Exclude<GameSelection, "custom">;
    trackEvent("counter_game_selected", { gameId: nextGame });
    setSelectedGame(nextGame);
    if (typeof window !== "undefined") window.localStorage.setItem(gameStorageKey, nextGame);
    if (nextGame === "empty") {
      applyTemplate(nextGame);
      return;
    }
    const belongs = games.find((game) => game.id === nextGame)?.layouts.some((layout) => layout.id === selectedTemplate);
    if (!belongs) applyTemplate(games.find((game) => game.id === nextGame)?.layouts[0]?.id ?? "empty");
  };

  const resetCounters = () => {
    trackEvent("counters_reset", {}, { counterCount: _counters.length });
    setCounters((counters) => counters.map((counter) => ({ ...counter, value: counter.initialValue })));
  };

  const addCounter = () => {
    trackEvent("counter_added", { source: "toolbar" }, { counterCount: _counters.length + 1 });
    onAdd();
  };

  const sortedGameIds = useMemo(() => {
    const ids: Array<"generic" | "marvel" | "magic" | "aeons"> = ["generic", "aeons", "magic", "marvel"];
    const rest = ids.filter((id) => id !== "generic").sort((a, b) => t(`game_${a}`).localeCompare(t(`game_${b}`)));
    return ["generic", ...rest] as const;
  }, [t]);

  return (
    <NavBar right={({ requestClose }) => (
      <>
        <section className="grid gap-2">
          <h2 className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[var(--text-muted)]">{t("counterCoreActions")}</h2>
          <div className="grid gap-2 sm:grid-cols-3">
            <button onClick={() => { addCounter(); requestClose(); }} className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-white shadow-sm transition hover:bg-primary/85"><FaPlusCircle />{t("barAddCounter")}</button>
            <button onClick={() => { resetCounters(); requestClose(); }} disabled={_counters.length === 0} className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 text-sm font-bold text-[var(--foreground)] shadow-sm transition hover:bg-[var(--surface-muted)] disabled:cursor-not-allowed disabled:opacity-45"><FaArrowRotateRight />{t("barReset")}</button>
            <button onClick={() => { onReorder?.(); requestClose(); }} disabled={!onReorder || _counters.length < 2} className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 text-sm font-bold text-[var(--foreground)] shadow-sm transition hover:bg-[var(--surface-muted)] disabled:cursor-not-allowed disabled:opacity-45"><BsArrowsMove />{t("counterReorder")}</button>
          </div>
        </section>
        <section className="grid gap-2 border-t border-[var(--border)] pt-4">
          <h2 className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[var(--text-muted)]">{t("counterTemplates")}</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid min-w-0 gap-1 text-xs font-semibold text-[var(--foreground)]">{t("gameLabel")}
              <select suppressHydrationWarning id="game" value={selectedGame} onChange={(event) => { handleGameChange(event); if (event.target.value === "empty") requestClose(); }} className="min-h-11 w-full truncate rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm font-medium text-[var(--foreground)] shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20">
                {selectedGame === "custom" && <option value="custom" disabled>{t("game_custom")}</option>}
                <option value="empty">{t("game_empty")}</option>
                {sortedGameIds.map((id) => <option key={id} value={id}>{t(`game_${id}`)}</option>)}
              </select>
            </label>
            <label className="grid min-w-0 gap-1 text-xs font-semibold text-[var(--foreground)]">{t("distributionLabel")}
              <select suppressHydrationWarning id="template" value={selectedTemplate} disabled={selectedGame === "empty" || selectedGame === "custom"} onChange={(event) => { applyTemplate(event.target.value); requestClose(); }} className="min-h-11 w-full truncate rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm font-medium text-[var(--foreground)] shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60">
                {selectedTemplate === "custom" && <option value="custom" disabled>{t("template_custom")}</option>}
                {selectedGame !== "empty" && selectedGame !== "custom" && games.find((game) => game.id === selectedGame)?.layouts.map((template) => <option key={template.id} value={template.id}>{t(`template_${template.id}`)}</option>)}
              </select>
            </label>
          </div>
        </section>
      </>
    )} />
  );
};

export { Bar };
