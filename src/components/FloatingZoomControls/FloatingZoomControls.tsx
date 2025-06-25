
import React from 'react';
import { ZoomIn, ZoomOut, Maximize, Focus, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSelectionContext } from '../../contexts/SelectionContext';

interface FloatingZoomControlsProps {
  onZoomAll: () => void;
  onZoomToSelected: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
}

const FloatingZoomControls = ({
  onZoomAll,
  onZoomToSelected,
  onZoomIn,
  onZoomOut,
  onResetView
}: FloatingZoomControlsProps) => {
  const { selectedObject } = useSelectionContext();

  return (
    <div className="fixed left-4 top-1/2 -translate-y-1/2 bg-slate-800/90 backdrop-blur-sm border border-slate-700/50 rounded-lg p-2 z-40">
      <div className="flex flex-col gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={onZoomAll}
          className="h-8 w-8 p-0 text-slate-300 hover:text-white hover:bg-slate-700/50"
          title="Zoom All (A)"
        >
          <Maximize className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onZoomToSelected}
          disabled={!selectedObject}
          className="h-8 w-8 p-0 text-slate-300 hover:text-white hover:bg-slate-700/50 disabled:opacity-50"
          title="Focus Selected (F)"
        >
          <Focus className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onZoomIn}
          className="h-8 w-8 p-0 text-slate-300 hover:text-white hover:bg-slate-700/50"
          title="Zoom In"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onZoomOut}
          className="h-8 w-8 p-0 text-slate-300 hover:text-white hover:bg-slate-700/50"
          title="Zoom Out"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onResetView}
          className="h-8 w-8 p-0 text-slate-300 hover:text-white hover:bg-slate-700/50"
          title="Reset View (R)"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default FloatingZoomControls;
