"use client";
import React from "react";
import { FaX } from "react-icons/fa6";

type Props = {
  title: string;
  onClose: () => void;
};

const CounterEditorHeader = ({ title, onClose }: Props) => (
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
    <button
      onClick={onClose}
      className="text-gray-500 hover:text-gray-700 text-2xl"
      aria-label="Cerrar"
      title="Cerrar"
    >
      <FaX className="w-5 h-5" />
    </button>
  </div>
);

export { CounterEditorHeader };
