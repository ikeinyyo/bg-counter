"use client";
import React from "react";

type Props = {
  onCancel: () => void;
  onSave: () => void;
  isSaving?: boolean;
};

const ActionBar = ({ onCancel, onSave, isSaving }: Props) => (
  <div className="flex gap-3">
    <button
      onClick={onCancel}
      className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
    >
      Cancel
    </button>
    <button
      onClick={onSave}
      disabled={isSaving}
      className="flex-1 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/80 transition-colors disabled:opacity-60"
    >
      {isSaving ? "Saving..." : "Save"}
    </button>
  </div>
);

export { ActionBar };
