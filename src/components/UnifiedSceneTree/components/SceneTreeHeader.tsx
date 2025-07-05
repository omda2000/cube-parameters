
import { Box } from 'lucide-react';
import type { SceneObject } from '../../../types/model';

interface SceneTreeHeaderProps {
  selectedObjects: SceneObject[];
  onClearSelection: () => void;
}

const SceneTreeHeader = ({ selectedObjects, onClearSelection }: SceneTreeHeaderProps) => {
  return (
    <div className="flex items-center justify-between text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
      <div className="flex items-center gap-2">
        <Box className="h-4 w-4" />
        Scene Hierarchy
      </div>
      {selectedObjects.length > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-xs bg-blue-600/20 text-blue-300 px-2 py-1 rounded">
            {selectedObjects.length} selected
          </span>
          <button
            onClick={onClearSelection}
            className="text-xs text-slate-400 hover:text-slate-200"
            title="Clear selection"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
};

export default SceneTreeHeader;
