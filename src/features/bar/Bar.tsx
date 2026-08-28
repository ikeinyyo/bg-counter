import { FaPlusCircle } from "react-icons/fa";
import React, { useEffect, useMemo, useState } from "react";
import {
  layoutTemplates,
  games,
  getGameByLayoutId,
} from "../CounterContainer/config/templates";
import { localizeCounters } from "../CounterContainer/config/localize";
import { CounterConfig } from "../CounterContainer/domain";
import { FaArrowRotateRight } from "react-icons/fa6";
import { useTranslation } from "@/context/SettingsContext";
import { NavBar } from "@/features/navbar/NavBar";
import { trackEvent } from "@/lib/telemetry";

type Props = {
  counters: CounterConfig[];
  setCounters: React.Dispatch<React.SetStateAction<CounterConfig[]>>;
  onAdd: () => void;
};

type GameSelection =
  | "generic"
  | "marvel"
  | "magic"
  | "aeons"
  | "empty"
  | "custom";

const Bar = ({ counters: _counters, setCounters, onAdd }: Props) => {
  const { t } = useTranslation();
  const [selectedGame, setSelectedGame] =
    useState<GameSelection>("generic");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("empty");

  const STORAGE_KEY_TEMPLATE = "selected-template";
  const STORAGE_KEY_GAME = "selected-game";

  const templatesById = useMemo(() => {
    const map = new Map(layoutTemplates.map((lt) => [lt.id, lt] as const));
    return map;
  }, []);

  const normalizeCounters = (arr: CounterConfig[]) =>
    arr
      .map((c) => ({
        id: c.id,
        initialValue: c.initialValue,
        name: c.name,
        backgroundColor: c.backgroundColor,
        icon: c.icon,
        xs: c.xsElementsPerRow ?? 0,
        md: c.mdElementsPerRow ?? 0,
        lg: c.lgElementsPerRow ?? 0,
      }))
      .sort((a, b) => (a.id > b.id ? 1 : a.id < b.id ? -1 : 0));

  const getMatchingTemplateId = (current: CounterConfig[]): string | null => {
    const norm = normalizeCounters(current);
    for (const lt of layoutTemplates) {
      const tn = normalizeCounters(localizeCounters(lt.id, lt.counters, t));
      const rawTn = normalizeCounters(lt.counters);
      if (tn.length !== norm.length) continue;
      let same = true;
      for (let i = 0; i < tn.length; i++) {
        const a = tn[i];
        const b = norm[i];
        if (
          a.id !== b.id ||
          a.initialValue !== b.initialValue ||
          (a.name !== b.name && rawTn[i].name !== b.name) ||
          a.backgroundColor !== b.backgroundColor ||
          a.icon !== b.icon ||
          a.xs !== b.xs ||
          a.md !== b.md ||
          a.lg !== b.lg
        ) {
          same = false;
          break;
        }
      }
      if (same) return lt.id;
    }
    return null;
  };

  // On mount: restore last selected game/template or infer from current counters
  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(STORAGE_KEY_TEMPLATE);
    const rawGame = window.localStorage.getItem(STORAGE_KEY_GAME) || "generic";
    const storedGame = (():
      | "generic"
      | "marvel"
      | "magic"
      | "aeons"
      | "empty" => {
      switch (rawGame) {
        case "generic":
        case "marvel":
        case "magic":
        case "aeons":
        case "empty":
          return rawGame;
        default:
          return "generic"; // map legacy 'custom' or others to generic
      }
    })();

    // If a valid template is stored, prefer its game inference
    if (stored && (stored === "custom" || templatesById.has(stored))) {
      setSelectedTemplate(stored);
      if (stored === "empty") {
        setSelectedGame("empty");
      } else if (stored === "custom") {
        setSelectedGame("custom");
      } else if (stored !== "custom") {
        const gid = getGameByLayoutId(stored);
        setSelectedGame(gid ?? storedGame);
      }
      return;
    }

    // infer from counters when nothing stored
    const match = getMatchingTemplateId(_counters);
    setSelectedTemplate(match ?? "custom");
    if (match) {
      const gid = getGameByLayoutId(match);
      setSelectedGame(gid ?? storedGame);
    } else {
      setSelectedGame("custom");
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // When counters change due to edits, reflect "custom" if they diverge
  useEffect(() => {
    const match = getMatchingTemplateId(_counters);
    const next = match ?? "custom";
    if (next === "custom") {
      setSelectedGame("custom");
    } else if (next === "empty") {
      setSelectedGame("empty");
    } else {
      const game = getGameByLayoutId(next);
      if (game) setSelectedGame(game);
    }

    if (next !== selectedTemplate) {
      setSelectedTemplate(next);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY_TEMPLATE, next);
      }
    }
  }, [_counters]); // eslint-disable-line react-hooks/exhaustive-deps

  const applyTemplate = (selectedId: string) => {
    setSelectedTemplate(selectedId);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY_TEMPLATE, selectedId);
    }
    if (selectedId === "custom") {
      // Do not change counters, just reflect state
      return;
    }
    if (selectedId === "empty") {
      trackEvent("counter_template_selected", { templateId: selectedId }, { counterCount: 0 });
      setCounters([]);
      return;
    }
    const lt = templatesById.get(selectedId);
    if (lt) {
      const cloned = lt.counters.map((c) => ({ ...c }));
      trackEvent(
        "counter_template_selected",
        { templateId: selectedId, gameId: getGameByLayoutId(selectedId) ?? "unknown" },
        { counterCount: cloned.length },
      );
      setCounters(localizeCounters(selectedId, cloned, t));
    }
  };

  const handleTemplateChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const selectedId = event.target.value;
    applyTemplate(selectedId);
  };

  const handleGameChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const nextGame = event.target.value as
      | "generic"
      | "marvel"
      | "magic"
      | "aeons"
      | "empty";
    trackEvent("counter_game_selected", { gameId: nextGame });
    setSelectedGame(nextGame);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY_GAME, nextGame);
    }

    // Root option: apply and disable distribution
    if (nextGame === "empty") {
      applyTemplate(nextGame);
      return;
    }

    // Ensure selected template belongs to the new game
    const belongs = games
      .find((g) => g.id === nextGame)
      ?.layouts.some((l) => l.id === selectedTemplate);
    if (!belongs) {
      const first = games.find((g) => g.id === nextGame)?.layouts[0];
      if (first) {
        applyTemplate(first.id);
      } else {
        // fallback to empty
        applyTemplate("empty");
      }
    }
  };

  const resetCounters = () => {
    trackEvent("counters_reset", {}, { counterCount: _counters.length });
    setCounters((prev) =>
      prev.map((counter) => ({
        ...counter,
        value: counter.initialValue,
      })),
    );
  };

  const addCounter = () => {
    trackEvent("counter_added", { source: "toolbar" }, { counterCount: _counters.length + 1 });
    onAdd();
  };

  const sortedGameIds = useMemo(() => {
    const ids: Array<"generic" | "marvel" | "magic" | "aeons"> = [
      "generic",
      "aeons",
      "magic",
      "marvel",
    ];
    const rest = ids
      .filter((g) => g !== "generic")
      .sort((a, b) => t(`game_${a}`).localeCompare(t(`game_${b}`)));
    return ["generic", ...rest] as const;
  }, [t]);

  return (
    <NavBar
      right={({ requestClose }) => (
        <>
          <div className="grid min-w-0 gap-1">
            <label htmlFor="game" className="text-[0.68rem] font-bold uppercase tracking-wider text-[var(--text-muted)]">
              {t("gameLabel")}
            </label>
            <select
              suppressHydrationWarning
              id="game"
              value={selectedGame}
              onChange={(e) => {
                const val = e.target.value as
                  | "generic"
                  | "marvel"
                  | "magic"
                  | "aeons"
                  | "empty";
                handleGameChange(e);
                if (val === "empty") {
                  requestClose();
                }
              }}
              className="min-h-11 w-full truncate rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm font-medium text-[var(--foreground)] shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              {selectedGame === "custom" && (
                <option value="custom" disabled>
                  {t("game_custom")}
                </option>
              )}
              <option value="empty">{t("game_empty")}</option>
              {sortedGameIds.map((id) => (
                <option key={id} value={id}>
                  {t(`game_${id}`)}
                </option>
              ))}
            </select>
          </div>

          <div className="grid min-w-0 gap-1">
            <label htmlFor="template" className="text-[0.68rem] font-bold uppercase tracking-wider text-[var(--text-muted)]">
              {t("distributionLabel")}
            </label>
            <select
              suppressHydrationWarning
              id="template"
              value={selectedTemplate}
              disabled={
                selectedGame === "empty" || selectedGame === "custom"
              }
              onChange={(e) => {
                handleTemplateChange(e);
                requestClose();
              }}
              className="min-h-11 w-full truncate rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm font-medium text-[var(--foreground)] shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {selectedTemplate === "custom" && (
                <option value="custom" disabled>
                  {t("template_custom")}
                </option>
              )}
              {selectedGame !== "empty" &&
                selectedGame !== "custom" &&
                games
                  .find((g) => g.id === selectedGame)
                  ?.layouts.map((template) => (
                    <option key={template.id} value={template.id}>
                      {t(`template_${template.id}`)}
                    </option>
                  ))}
            </select>
          </div>

          <div className="mt-1 flex flex-col gap-2 lg:mt-0 lg:flex-row">
            <button
              onClick={() => {
                addCounter();
                requestClose();
              }}
              className="flex min-h-11 flex-1 items-center justify-center whitespace-nowrap rounded-xl bg-primary px-4 text-sm font-bold text-white shadow-sm transition hover:bg-primary/85 active:scale-[0.98] lg:flex-none"
            >
              <FaPlusCircle className="h-4 w-4 shrink-0" />
              <span className="ml-2">{t("barAddCounter")}</span>
            </button>
            <button
              onClick={() => {
                resetCounters();
                requestClose();
              }}
              disabled={_counters.length === 0}
              className="flex min-h-11 flex-1 items-center justify-center whitespace-nowrap rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 text-sm font-bold text-[var(--foreground)] shadow-sm transition hover:bg-[var(--surface-muted)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-45 lg:flex-none"
            >
              <FaArrowRotateRight className="h-4 w-4 shrink-0" />
              <span className="ml-2">{t("barReset")}</span>
            </button>
          </div>
        </>
      )}
    />
  );
};

export { Bar };
