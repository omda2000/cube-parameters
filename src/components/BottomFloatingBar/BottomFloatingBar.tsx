
import React, { useMemo, useCallback } from 'react';
import { Separator } from '@/components/ui/separator';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useSelectionContext } from '../../contexts/SelectionContext';
import ExpandableShadeSelector, { type ShadeType } from '../ExpandableShadeSelector/ExpandableShadeSelector';
import ExpandableZoomControls from '../ExpandableZoomControls/ExpandableZoomControls';
import ExpandableSnapControls from '../ExpandableSnapControls/ExpandableSnapControls';
import { cn } from '@/lib/utils';

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
  snapToGrid?: boolean;
  onSnapToGridChange?: (enabled: boolean) => void;
  gridSize?: number;
  onGridSizeChange?: (size: number) => void;
  className?: string;
}

const BottomFloatingBar = React.memo(({
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
  snapToGrid = false,
  onSnapToGridChange = () => {},
  gridSize = 1,
  onGridSizeChange = () => {},
  className
}: BottomFloatingBarProps) => {
  const { selectedObject } = useSelectionContext();

  // Stable object count to prevent flickering
  const stableObjectCount = useMemo(() => {
    // Ensure we always return a stable number, minimum 1 for the base scene
    return Math.max(1, objectCount || 1);
  }, [objectCount]);

  // Memoized coordinate display to prevent excessive updates
  const coordinateDisplay = useMemo(() => {
    // Round coordinates to prevent micro-movement updates
    const roundedX = Math.round((cursorPosition?.x || 0) * 100) / 100;
    const roundedY = Math.round((cursorPosition?.y || 0) * 100) / 100;
    
    return {
      x: roundedX.toFixed(2),
      y: roundedY.toFixed(2)
    };
  }, [cursorPosition?.x, cursorPosition?.y]);

  // Memoized grid status to prevent unnecessary re-renders
  const gridStatus = useMemo(() => {
    return gridEnabled ? `ON (${gridSpacing})` : 'OFF';
  }, [gridEnabled, gridSpacing]);

  // Stable zoom level display
  const stableZoomLevel = useMemo(() => {
    return Math.round(zoomLevel || 100);
  }, [zoomLevel]);

  return (
    <TooltipProvider>
      <div className={cn("fixed bottom-4 left-4 right-4 bg-card/95 backdrop-blur-sm border border-border rounded-lg px-4 py-2 z-30 shadow-lg", className)}>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          {/* Left section - Status and coordinate information */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <span>Objects:</span>
              <span className="text-foreground font-medium">{stableObjectCount}</span>
            </div>
            
            <Separator orientation="vertical" className="h-4" />
            
            <div className="flex items-center gap-1">
              <span>Grid:</span>
              <span className="text-foreground font-medium">{gridStatus}</span>
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
                <span className="text-foreground font-medium">{coordinateDisplay.x}</span>
                <span className="ml-2">Y:</span>
                <span className="text-foreground font-medium">{coordinateDisplay.y}</span>
              </div>
            </div>
          </div>
          
          {/* Center section - Zoom controls */}
          <div className="flex items-center">
            <ExpandableZoomControls
              onZoomAll={onZoomAll}
              onZoomToSelected={onZoomToSelected}
              onZoomIn={onZoomIn}
              onZoomOut={onZoomOut}
              onResetView={onResetView}
              selectedObject={selectedObject}
              zoomLevel={stableZoomLevel}
            />
          </div>
          
          {/* Right section - Shade selector and snap controls */}
          <div className="flex items-center gap-2">
            <ExpandableShadeSelector
              currentShadeType={shadeType}
              onShadeTypeChange={onShadeTypeChange}
            />
            
            <Separator orientation="vertical" className="h-4" />
            
            <ExpandableSnapControls
              snapToGrid={snapToGrid}
              onSnapToGridChange={onSnapToGridChange}
              gridSize={gridSize}
              onGridSizeChange={onGridSizeChange}
            />
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
});

BottomFloatingBar.displayName = 'BottomFloatingBar';

export default BottomFloatingBar;
