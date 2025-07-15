
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useSelectionContext } from '../../contexts/SelectionContext';
import ExpandableShadeSelector, { type ShadeType } from '../ExpandableShadeSelector/ExpandableShadeSelector';
import ExpandableZoomControls from '../ExpandableZoomControls/ExpandableZoomControls';
import ExpandableStandardViews from '../ExpandableStandardViews/ExpandableStandardViews';

interface BottomFloatingBarProps {
  objectCount?: number;
  gridEnabled?: boolean;
  gridSpacing?: string;
  units?: string;
  cursorPosition?: { x: number; y: number };
  zoomLevel?: number;
  shadeType: ShadeType;
  onShadeTypeChange: (type: ShadeType) => void;
  onZoomAll?: () => void;
  onZoomToSelected?: () => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onResetView?: () => void;
  onViewTop?: () => void;
  onViewFront?: () => void;
  onViewBack?: () => void;
  onViewBottom?: () => void;
  onViewRight?: () => void;
  onViewLeft?: () => void;
  onViewIsometric?: () => void;
}

const BottomFloatingBar = ({
  objectCount = 1,
  gridEnabled = true,
  gridSpacing = "1m",
  units = "m",
  cursorPosition = { x: 0, y: 0 },
  zoomLevel = 100,
  shadeType,
  onShadeTypeChange,
  onZoomAll = () => {},
  onZoomToSelected = () => {},
  onZoomIn = () => {},
  onZoomOut = () => {},
  onResetView = () => {},
  onViewTop = () => {},
  onViewFront = () => {},
  onViewBack = () => {},
  onViewBottom = () => {},
  onViewRight = () => {},
  onViewLeft = () => {},
  onViewIsometric = () => {}
}: BottomFloatingBarProps) => {
  const { selectedObject } = useSelectionContext();

  return (
    <TooltipProvider>
      <div className="fixed bottom-4 left-4 right-4 bg-card/95 backdrop-blur-sm border border-border rounded-lg px-4 py-2 z-30 shadow-lg">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          {/* Left section - Status and coordinate information */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <span>Objects:</span>
              <span className="text-foreground font-medium">{objectCount}</span>
            </div>
            
            <Separator orientation="vertical" className="h-4" />
            
            <div className="flex items-center gap-1">
              <span>Grid:</span>
              <span className="text-foreground font-medium">
                {gridEnabled ? `ON (${gridSpacing})` : 'OFF'}
              </span>
            </div>
            
            <Separator orientation="vertical" className="h-4" />
            
            <div className="flex items-center gap-1">
              <span>Units:</span>
              <span className="text-foreground font-medium">{units}</span>
            </div>

            <Separator orientation="vertical" className="h-4" />
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <span>X:</span>
                <span className="text-foreground font-medium">{cursorPosition.x.toFixed(2)}</span>
                <span className="ml-2">Y:</span>
                <span className="text-foreground font-medium">{cursorPosition.y.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          {/* Center section - Zoom and view controls */}
          <div className="flex items-center gap-2">
            <ExpandableZoomControls
              onZoomAll={onZoomAll}
              onZoomToSelected={onZoomToSelected}
              onZoomIn={onZoomIn}
              onZoomOut={onZoomOut}
              onResetView={onResetView}
              selectedObject={selectedObject}
              zoomLevel={zoomLevel}
            />
            
            <ExpandableStandardViews
              onViewTop={onViewTop}
              onViewFront={onViewFront}
              onViewBack={onViewBack}
              onViewBottom={onViewBottom}
              onViewRight={onViewRight}
              onViewLeft={onViewLeft}
              onViewIsometric={onViewIsometric}
            />
          </div>
          
          {/* Right section - Shade selector */}
          <div className="flex items-center gap-2">
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
