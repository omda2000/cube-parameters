
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
    <div className="fixed left-4 top-4 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg p-1 z-40 shadow-sm">
      <div className="flex flex-col gap-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={onZoomAll}
          className="h-7 w-7 p-0 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          title="Zoom All (A)"
        >
          <Maximize className="h-3.5 w-3.5" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onZoomToSelected}
          disabled={!selectedObject}
          className="h-7 w-7 p-0 text-gray-600 hover:text-gray-900 hover:bg-gray-100 disabled:opacity-50"
          title="Focus Selected (F)"
        >
          <Focus className="h-3.5 w-3.5" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onZoomIn}
          className="h-7 w-7 p-0 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          title="Zoom In"
        >
          <ZoomIn className="h-3.5 w-3.5" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onZoomOut}
          className="h-7 w-7 p-0 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          title="Zoom Out"
        >
          <ZoomOut className="h-3.5 w-3.5" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onResetView}
          className="h-7 w-7 p-0 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          title="Reset View (R)"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </Button>

        {/* Separator */}
        <div className="h-px bg-gray-200 my-0.5" />
        
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
