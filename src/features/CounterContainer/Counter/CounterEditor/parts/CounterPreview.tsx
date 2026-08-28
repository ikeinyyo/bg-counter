"use client";
import React from "react";

type Props = {
  label?: string;
  children: React.ReactNode;
};

const CounterPreview = ({ label = "Preview", children }: Props) => (
  <div className="counter-preview-frame flex w-full flex-col items-center justify-center">
    <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">
      {label}
    </label>
    {children}
  </div>
);

export { CounterPreview };
