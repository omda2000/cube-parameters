
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
    <div className="fixed left-4 top-4 bg-card/95 backdrop-blur-sm border border-border rounded-lg p-2 z-40 shadow-lg">
      <div className="flex flex-col gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={onZoomAll}
          className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-accent transition-all"
          title="Zoom All (A)"
        >
          <Maximize className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onZoomToSelected}
          disabled={!selectedObject}
          className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-accent disabled:opacity-50 transition-all"
          title="Focus Selected (F)"
        >
          <Focus className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onZoomIn}
          className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-accent transition-all"
          title="Zoom In"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onZoomOut}
          className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-accent transition-all"
          title="Zoom Out"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onResetView}
          className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-accent transition-all"
          title="Reset View (R)"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>

        {/* Separator */}
        <div className="h-px bg-border my-1" />
        
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
