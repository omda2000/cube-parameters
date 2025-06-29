
import React from 'react';
import { ZoomIn, ZoomOut, Maximize, Focus, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSelectionContext } from '../../contexts/SelectionContext';
import ShadeTypeSelector, { type ShadeType } from '../ShadeTypeSelector/ShadeTypeSelector';

interface FloatingZoomControlsProps {
  onZoomAll: () => void;
  onZoomToSelected: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  shadeType: ShadeType;
  onShadeTypeChange: (type: ShadeType) => void;
}

const FloatingZoomControls = ({
  onZoomAll,
  onZoomToSelected,
  onZoomIn,
  onZoomOut,
  onResetView,
  shadeType,
  onShadeTypeChange
}: FloatingZoomControlsProps) => {
  const { selectedObject } = useSelectionContext();

  return (
    <div className="fixed left-4 top-4 bg-slate-800/90 backdrop-blur-sm border border-slate-700/50 rounded-md p-1.5 z-40">
      <div className="flex flex-col gap-0.5">
        <Button
          variant="ghost"
          size="sm"
          onClick={onZoomAll}
          className="h-6 w-6 p-0 text-slate-700 dark:text-slate-300 hover:text-white hover:bg-slate-700/50"
          title="Zoom All (A)"
        >
          <Maximize className="h-3 w-3" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onZoomToSelected}
          disabled={!selectedObject}
          className="h-6 w-6 p-0 text-slate-700 dark:text-slate-300 hover:text-white hover:bg-slate-700/50 disabled:opacity-50"
          title="Focus Selected (F)"
        >
          <Focus className="h-3 w-3" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onZoomIn}
          className="h-6 w-6 p-0 text-slate-700 dark:text-slate-300 hover:text-white hover:bg-slate-700/50"
          title="Zoom In"
        >
          <ZoomIn className="h-3 w-3" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onZoomOut}
          className="h-6 w-6 p-0 text-slate-700 dark:text-slate-300 hover:text-white hover:bg-slate-700/50"
          title="Zoom Out"
        >
          <ZoomOut className="h-3 w-3" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onResetView}
          className="h-6 w-6 p-0 text-slate-700 dark:text-slate-300 hover:text-white hover:bg-slate-700/50"
          title="Reset View (R)"
        >
          <RotateCcw className="h-3 w-3" />
        </Button>

        {/* Separator */}
        <div className="h-px bg-slate-600/50 my-0.5" />
        
        {/* Shade Type Controls */}
        <div className="flex justify-center">
          <ShadeTypeSelector
            currentShadeType={shadeType}
            onShadeTypeChange={onShadeTypeChange}
          />
        </div>
      </div>
    </div>
  );
};

export default FloatingZoomControls;
