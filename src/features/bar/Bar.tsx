import Link from "next/link";
import { FaPlusCircle } from "react-icons/fa";
import Image from "next/image";
import React, { useState } from "react";
import { COLORS, getColorByKey } from "../CounterContainer/config/colors";
import { layoutTemplates } from "../CounterContainer/config/templates";
import { faker } from "@faker-js/faker";
import { CounterConfig, getDefaultBySize } from "../CounterContainer/domain";
import { ICONS } from "../CounterContainer/config/icons";
import { FaArrowRotateRight } from "react-icons/fa6";

type Props = {
  counters: CounterConfig[];
  setCounters: (counters: CounterConfig[]) => void;
};

const Bar = ({ counters, setCounters }: Props) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("empty");

  const handleTemplateChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedId = event.target.value;
    setSelectedTemplate(selectedId);
    const selectedTemplate = layoutTemplates.find(
      (template) => template.id === selectedId
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
        COLORS[Math.floor(Math.random() * COLORS.length)].key
      ),
      icon: ICONS[Math.floor(Math.random() * ICONS.length)].key,
      ...getDefaultBySize("M"),
    };
  };

  const resetCounters = () => {
    setCounters([
      ...counters.map((counter) => ({ ...counter, id: faker.string.uuid() })),
    ]);
  };

  const addRandomCounter = () => {
    const newCounter = generateRandomCounter();
    setCounters([...counters, newCounter]);
  };

  return (
    <header className="flex items-center justify-between p-2 bg-dark text-white h-14">
      <Link
        className="text-2xl font-bold hover:text-primary transition-colors"
        onClick={() => {
          setCounters(layoutTemplates[0].counters);
          setSelectedTemplate("empty");
        }}
        href="/"
      >
        <div className="flex items-center gap-2">
          <Image
            src="/images/logo.png"
            width={100}
            height={50}
            alt="Logo de Juernes de Mesa"
            className="p-2 pl-4"
          />
          <span className="lg:inline md:inline hidden">Counter App</span>
          <span className="lg:inline md:inline hidden text-xs mt-3 text-gray-500">
            v1.2.1
          </span>
        </div>
      </Link>

      <div className="flex items-center gap-4">
        <div>
          <select
            suppressHydrationWarning
            id="template"
            value={selectedTemplate}
            onChange={handleTemplateChange}
            className="text-sm px-4 py-2 max-w-72 bg-dark border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 transition-colors ease-in-out"
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
            <span className="lg:inline hidden ml-2">Reset</span>
          </button>
          <button
            onClick={addRandomCounter}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/80 transition-colors flex"
          >
            <FaPlusCircle className="h-6 w-6" />
            <span className="lg:inline hidden ml-2">Add Counter</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export { Bar };
