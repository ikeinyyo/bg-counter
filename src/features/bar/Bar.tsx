import { FaPlusCircle } from "react-icons/fa";
import React, { useEffect, useMemo, useState } from "react";
import { COLORS, getColorByKey } from "../CounterContainer/config/colors";
import { layoutTemplates } from "../CounterContainer/config/templates";
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
  const [selectedTemplate, setSelectedTemplate] = useState<string>("empty");

  const STORAGE_KEY_TEMPLATE = "selected-template";

  const templatesById = useMemo(() => {
    const map = new Map(layoutTemplates.map((lt) => [lt.id, lt] as const));
    return map;
  }, []);

  const normalizeCounters = (arr: CounterConfig[]) =>
    arr
      .map((c) => ({
        id: c.id,
        name: c.name,
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
          a.name !== b.name ||
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

  // On mount: restore last selected template or infer from current counters
  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(STORAGE_KEY_TEMPLATE);
    if (stored && (stored === "custom" || templatesById.has(stored))) {
      setSelectedTemplate(stored);
      return;
    }
    // infer from counters when nothing stored
    const match = getMatchingTemplateId(_counters);
    setSelectedTemplate(match ?? "custom");
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

  const handleTemplateChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const selectedId = event.target.value;
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
      // Deep clone to avoid accidental shared references
      const cloned = lt.counters.map((c) => ({ ...c }));
      setCounters(cloned);
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
        id: faker.string.uuid(),
        value: counter.initialValue,
      })),
    );
  };

  const addRandomCounter = () => {
    const newCounter = generateRandomCounter();
    setCounters((prev) => [...prev, newCounter]);
  };

  return (
    <NavBar
      right={({ requestClose }) => (
        <>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium">{t("templateLabel")}</span>
            <select
              suppressHydrationWarning
              id="template"
              value={selectedTemplate}
              onChange={(e) => {
                handleTemplateChange(e);
                requestClose();
              }}
              className="text-sm px-4 py-2 max-w-72 rounded-md border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] shadow-sm transition-colors ease-in-out focus:outline-none focus:ring-2"
            >
              <option value="custom">{t("template_custom")}</option>
              {layoutTemplates.map((template) => (
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
