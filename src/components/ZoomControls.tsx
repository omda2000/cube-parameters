
import { ZoomIn, ZoomOut, Maximize, Focus, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSelectionContext } from "../contexts/SelectionContext";

interface ZoomControlsProps {
  onZoomAll: () => void;
  onZoomToSelected: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
}

const ZoomControls = ({
  onZoomAll,
  onZoomToSelected,
  onZoomIn,
  onZoomOut,
  onResetView
}: ZoomControlsProps) => {
  const { selectedObject } = useSelectionContext();

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <Maximize className="h-5 w-5 text-blue-400" />
        Zoom Controls
      </h2>
      
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onZoomAll}
          className="flex items-center gap-2 bg-slate-700/50 border-slate-600 hover:bg-slate-600/50"
        >
          <Maximize className="h-4 w-4" />
          Zoom All
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onZoomToSelected}
          disabled={!selectedObject}
          className="flex items-center gap-2 bg-slate-700/50 border-slate-600 hover:bg-slate-600/50 disabled:opacity-50"
        >
          <Focus className="h-4 w-4" />
          Zoom Selected
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onZoomIn}
          className="flex items-center gap-2 bg-slate-700/50 border-slate-600 hover:bg-slate-600/50"
        >
          <ZoomIn className="h-4 w-4" />
          Zoom In
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onZoomOut}
          className="flex items-center gap-2 bg-slate-700/50 border-slate-600 hover:bg-slate-600/50"
        >
          <ZoomOut className="h-4 w-4" />
          Zoom Out
        </Button>
      </div>
      
      <Button
        variant="outline"
        size="sm"
        onClick={onResetView}
        className="w-full flex items-center gap-2 bg-slate-700/50 border-slate-600 hover:bg-slate-600/50"
      >
        <RotateCcw className="h-4 w-4" />
        Reset View
      </Button>
      
      <div className="text-xs text-gray-400 space-y-1">
        <p>• Press 'A' for Zoom All</p>
        <p>• Press 'F' for Zoom Selected</p>
        <p>• Press 'R' for Reset View</p>
      </div>
    </div>
  );
};

export default ZoomControls;
