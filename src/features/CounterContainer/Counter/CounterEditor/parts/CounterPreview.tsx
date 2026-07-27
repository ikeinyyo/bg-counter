"use client";
import React from "react";

type Props = {
  label?: string;
  children: React.ReactNode;
};

const CounterPreview = ({ label = "Preview", children }: Props) => (
  <div className="w-full flex items-center justify-center flex-col">
    <label className="block text-sm font-medium  text-[var(--foreground)] mb-2">
      {label}
    </label>
    {children}
  </div>
);

export { CounterPreview };
