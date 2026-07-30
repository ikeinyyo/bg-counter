import { FaPlusCircle } from "react-icons/fa";
import React, { useEffect, useMemo, useState } from "react";
import { COLORS, getColorByKey } from "../CounterContainer/config/colors";
import {
  layoutTemplates,
  games,
  getGameByLayoutId,
} from "../CounterContainer/config/templates";
import { localizeCounters } from "../CounterContainer/config/localize";
import { faker } from "@faker-js/faker";
import { CounterConfig, getDefaultBySize } from "../CounterContainer/domain";
import { ICONS } from "../CounterContainer/config/icons";
import { FaArrowRotateRight } from "react-icons/fa6";
import { useTranslation } from "@/context/SettingsContext";
import { NavBar } from "@/features/navbar/NavBar";

type Props = {
  counters: CounterConfig[];
  setCounters: React.Dispatch<React.SetStateAction<CounterConfig[]>>;
};

const Bar = ({ counters: _counters, setCounters }: Props) => {
  const { t } = useTranslation();
  const [selectedGame, setSelectedGame] = useState<
    "generic" | "marvel" | "magic" | "aeons" | "empty"
  >("generic");
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
      const tn = normalizeCounters(lt.counters);
      if (tn.length !== norm.length) continue;
      let same = true;
      for (let i = 0; i < tn.length; i++) {
        const a = tn[i];
        const b = norm[i];
        if (
          a.id !== b.id ||
          a.initialValue !== b.initialValue ||
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
      } else if (stored !== "custom") {
        const gid = getGameByLayoutId(stored);
        setSelectedGame(gid ?? storedGame);
      } // for 'custom', keep storedGame
      return;
    }

    // infer from counters when nothing stored
    const match = getMatchingTemplateId(_counters);
    setSelectedTemplate(match ?? "custom");
    if (match) {
      const gid = getGameByLayoutId(match);
      setSelectedGame(gid ?? storedGame);
    } else {
      setSelectedGame(storedGame);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // When counters change due to edits, reflect "custom" if they diverge
  useEffect(() => {
    const match = getMatchingTemplateId(_counters);
    const next = match ?? "custom";
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
      setCounters([]);
      return;
    }
    const lt = templatesById.get(selectedId);
    if (lt) {
      const cloned = lt.counters.map((c) => ({ ...c }));
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

  const generateRandomCounter = (): CounterConfig => {
    return {
      id: faker.string.uuid(),
      initialValue: 0,
      name: faker.person.firstName(),
      backgroundColor: getColorByKey(
        COLORS[Math.floor(Math.random() * COLORS.length)].key,
      ),
      icon: ICONS[Math.floor(Math.random() * ICONS.length)].key,
      ...getDefaultBySize("M"),
    };
  };

  const resetCounters = () => {
    setCounters((prev) =>
      prev.map((counter) => ({
        ...counter,
        value: counter.initialValue,
      })),
    );
  };

  const addRandomCounter = () => {
    const newCounter = generateRandomCounter();
    setCounters((prev) => [...prev, newCounter]);
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
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium">{t("gameLabel")}</span>
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
              className="text-sm px-4 py-2 w-56 truncate rounded-md border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] shadow-sm transition-colors ease-in-out focus:outline-none focus:ring-2"
            >
              <option value="empty">{t("game_empty")}</option>
              {sortedGameIds.map((id) => (
                <option key={id} value={id}>
                  {t(`game_${id}`)}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium">
              {t("distributionLabel")}
            </span>
            <select
              suppressHydrationWarning
              id="template"
              value={selectedTemplate}
              disabled={selectedGame === "empty"}
              onChange={(e) => {
                handleTemplateChange(e);
                requestClose();
              }}
              className="text-sm px-4 py-2 w-56 truncate rounded-md border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] shadow-sm transition-colors ease-in-out focus:outline-none focus:ring-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {selectedTemplate === "custom" && (
                <option value="custom" disabled>
                  {t("template_custom")}
                </option>
              )}
              {selectedGame !== "empty" &&
                games
                  .find((g) => g.id === selectedGame)
                  ?.layouts.map((template) => (
                    <option key={template.id} value={template.id}>
                      {t(`template_${template.id}`)}
                    </option>
                  ))}
            </select>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => {
                resetCounters();
                requestClose();
              }}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/80 transition-colors flex"
            >
              <FaArrowRotateRight className="h-6 w-6" />
              <span className="inline ml-2">{t("barReset")}</span>
            </button>
            <button
              onClick={() => {
                addRandomCounter();
                requestClose();
              }}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/80 transition-colors flex"
            >
              <FaPlusCircle className="h-6 w-6" />
              <span className="inline ml-2">{t("barAddCounter")}</span>
            </button>
          </div>
        </>
      )}
    />
  );
};

export { Bar };
