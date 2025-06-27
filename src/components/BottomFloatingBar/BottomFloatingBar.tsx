
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useSelectionContext } from '../../contexts/SelectionContext';
import ExpandableShadeSelector, { type ShadeType } from '../ExpandableShadeSelector/ExpandableShadeSelector';
import ExpandableViewControls from '../ExpandableViewControls/ExpandableViewControls';

interface BottomFloatingBarProps {
  objectCount?: number;
  gridEnabled?: boolean;
  gridSpacing?: string;
  units?: string;
  cursorPosition?: { x: number; y: number };
  zoomLevel?: number;
  onZoomAll: () => void;
  onZoomToSelected: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  shadeType: ShadeType;
  onShadeTypeChange: (type: ShadeType) => void;
}

const BottomFloatingBar = ({
  objectCount = 1,
  gridEnabled = true,
  gridSpacing = "1m",
  units = "m",
  cursorPosition = { x: 0, y: 0 },
  zoomLevel = 100,
  onZoomAll,
  onZoomToSelected,
  onZoomIn,
  onZoomOut,
  onResetView,
  shadeType,
  onShadeTypeChange
}: BottomFloatingBarProps) => {
  const { selectedObject } = useSelectionContext();

  return (
    <TooltipProvider>
      <div className="fixed bottom-4 left-4 right-4 bg-black/90 backdrop-blur-sm border border-gray-700/50 rounded-lg px-4 py-2.5 z-30 shadow-xl">
        <div className="flex items-center justify-between text-xs text-gray-300">
          {/* Left section - Status and coordinate information */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="text-gray-400 font-medium">Objects:</span>
              <span className="text-white font-semibold">{objectCount}</span>
            </div>
            
            <Separator orientation="vertical" className="h-4 bg-gray-600" />
            
            <div className="flex items-center gap-1.5">
              <span className="text-gray-400 font-medium">Grid:</span>
              <span className="text-white font-semibold">
                {gridEnabled ? `ON (${gridSpacing})` : 'OFF'}
              </span>
            </div>
            
            <Separator orientation="vertical" className="h-4 bg-gray-600" />
            
            <div className="flex items-center gap-1.5">
              <span className="text-gray-400 font-medium">Units:</span>
              <span className="text-white font-semibold">{units}</span>
            </div>

            <Separator orientation="vertical" className="h-4 bg-gray-600" />
            
            {/* Coordinates and zoom information */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="text-gray-400 font-medium">X:</span>
                <span className="text-white font-semibold">{cursorPosition.x.toFixed(2)}</span>
                <span className="text-gray-400 font-medium ml-3">Y:</span>
                <span className="text-white font-semibold">{cursorPosition.y.toFixed(2)}</span>
              </div>
              
              <div className="flex items-center gap-1.5">
                <span className="text-gray-400 font-medium">Zoom:</span>
                <span className="text-white font-semibold">{zoomLevel}%</span>
              </div>
            </div>
          </div>
          
          {/* Right section - Expandable controls with better spacing */}
          <div className="flex items-center gap-3">
            <ExpandableViewControls
              onZoomAll={onZoomAll}
              onZoomToSelected={onZoomToSelected}
              onZoomIn={onZoomIn}
              onZoomOut={onZoomOut}
              onResetView={onResetView}
              selectedObject={selectedObject}
            />
            
            <div className="h-5 w-px bg-gray-600" />
            
            <ExpandableShadeSelector
              currentShadeType={shadeType}
              onShadeTypeChange={onShadeTypeChange}
            />
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default BottomFloatingBar;
