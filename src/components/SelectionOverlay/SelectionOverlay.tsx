
import React from 'react';
import type { SceneObject } from '../../types/model';

interface SelectionOverlayProps {
  selectedObject: SceneObject | null;
}

const SelectionOverlay = ({ selectedObject }: SelectionOverlayProps) => {
  if (!selectedObject) return null;

  return (
    <div className="absolute top-4 left-4 bg-black/80 text-white px-4 py-2 rounded-lg shadow-lg border border-blue-500/50">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
        <span className="font-medium">Selected:</span>
        <span className="text-blue-300">{selectedObject.name}</span>
      </div>
      <div className="text-xs text-gray-300 mt-1">
        Press ESC to deselect • F to focus
      </div>
    </div>
  );
};

export default SelectionOverlay;
