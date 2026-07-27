import { FaPlusCircle } from "react-icons/fa";
import React, { useState } from "react";
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

  const handleTemplateChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const selectedId = event.target.value;
    setSelectedTemplate(selectedId);
    const selectedTemplate = layoutTemplates.find(
      (template) => template.id === selectedId,
    );
    if (selectedTemplate) {
      setCounters(selectedTemplate.counters);
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
      right={
        <>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium">{t("templateLabel")}</span>
            <select
              suppressHydrationWarning
              id="template"
              value={selectedTemplate}
              onChange={handleTemplateChange}
              className="text-sm px-4 py-2 max-w-72 rounded-md border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] shadow-sm transition-colors ease-in-out focus:outline-none focus:ring-2"
            >
              {layoutTemplates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            <button
              onClick={resetCounters}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/80 transition-colors flex"
            >
              <FaArrowRotateRight className="h-6 w-6" />
              <span className="inline ml-2">{t("barReset")}</span>
            </button>
            <button
              onClick={addRandomCounter}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/80 transition-colors flex"
            >
              <FaPlusCircle className="h-6 w-6" />
              <span className="inline ml-2">{t("barAddCounter")}</span>
            </button>
          </div>
        </>
      }
    />
  );
};

export { Bar };
